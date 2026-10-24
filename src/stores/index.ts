import { createStore, produce, unwrap } from 'solid-js/store'
import { createMemo } from 'solid-js'
import { Background, ConverterProp } from '@/types/store'
import { getBackendUrl } from '@/utils/getBackendUrl'
import { marketIcon, mediaFile, mediaFormat } from '@/utils/steamMediaUrl'
import type { CropRequest } from '@/utils/cropImage'

/** Crop the background in the browser and save the zip (steam.design_xxxxxx.zip) */
async function saveImageZip(req: CropRequest) {
  try {
    const [{ cropFiles, requestId }, { saveZip }] = await Promise.all([
      import('@/utils/cropImage'),
      import('@/utils/saveZip'),
    ])
    const files = await cropFiles(req)
    await saveZip(files, `steam.design_${await requestId(req)}.zip`)
  } catch (e) {
    console.error('zip error', e)
    alert('Could not make the zip: ' + (e instanceof Error ? e.message : String(e)))
  }
}

// Solid port of the former Pinia store (src/stores/index.ts on master).
// Same state shape and the same action names, so components read `store.x`
// and call `actions.y(...)`. Persistence and start-up live in ./init.ts.

export interface InventoryItem {
  icon_url_large: string
  actions?: { link: string }[]
}

export interface RootState {
  background: string
  bgInfo: Background | InventoryItem | null
  backgrounds: Background[]
  backgroundsUpdateTime: number
  nextRandomBackgrounds: Background[]
  previewScale: number
  user: { id: number | string }
  bgSize: { w: number; h: number }
  format: 'jpg' | 'mp4' | 'webm'
  inventory: InventoryItem[]
  inventoryUpdateTime: number
  v: number
  bgJsonUrl: string | null // url of file with backgrounds
  converters: ConverterProp[]
}

export const emptyState: RootState = {
  background: '',
  bgInfo: null,
  backgrounds: [],
  backgroundsUpdateTime: 0,
  nextRandomBackgrounds: [],
  previewScale: window.screen.width < 560 ? 25 : 75,
  user: { id: 0 },
  bgSize: { w: 0, h: 0 },
  format: 'jpg',
  inventory: [],
  inventoryUpdateTime: 0,
  v: 1,
  bgJsonUrl: null,
  converters: [],
}

const [store, setStore] = createStore<RootState>(structuredClone(emptyState))

export { store, setStore }

/** Plain (non-proxy) copy of the state, e.g. for localStorage */
export const snapshot = (): RootState => structuredClone(unwrap(store))

const isVideoMemo = createMemo(() => store.format === 'webm' || store.format === 'mp4')
export const isVideo = () => isVideoMemo()

/** Catalogue entry for a background url (any CDN host), or null */
export function findBackground(value: string): Background | null {
  // Market images (/economy/image/<iconUrl>) are known by their icon id,
  // everything else by its <appid>/<file>
  const icon = marketIcon(value)
  const file = icon ? null : mediaFile(value)
  if (!icon && !file) return null
  const same = (bg: Background) =>
    !!bg && (icon ? bg.iconUrl === icon : mediaFile(bg.steamUrl) === file)
  return store.backgrounds.find(same) || store.nextRandomBackgrounds.find(same) || null
}

export const actions = {
  setBackground({
    background,
    info,
  }: {
    background: string
    info: Background | InventoryItem | null
  }) {
    setStore({ background, bgInfo: info, format: mediaFormat(background) })
  },

  setBackgroundURL(value: string) {
    // A known background keeps its market page for "Get this Background"
    setStore({ background: value, format: mediaFormat(value), bgInfo: findBackground(value) })
  },

  findBackground,

  setBackgrounds(backgrounds: Background[]) {
    setStore(
      produce((s) => {
        s.backgrounds = backgrounds
        s.nextRandomBackgrounds.push(backgrounds[Math.floor(backgrounds.length * Math.random())])
        s.backgroundsUpdateTime = Date.now()
      })
    )
  },

  randomBackground() {
    setStore(
      produce((s) => {
        const newBg = s.nextRandomBackgrounds.shift()
        if (newBg) {
          s.background =
            newBg.steamUrl.indexOf('http://cdn.akamai.steamstatic.com') !== -1
              ? newBg.steamUrl.replace(
                  'http://cdn.akamai.steamstatic.com',
                  'https://steamcdn-a.akamaihd.net'
                )
              : newBg.steamUrl
          s.bgInfo = newBg
          s.format = mediaFormat(newBg.steamUrl)
        }

        if (s.nextRandomBackgrounds.length < 3) {
          for (let i = 0; i < 5; i++) {
            const randomBg = s.backgrounds[Math.floor(s.backgrounds.length * Math.random())]
            if (
              randomBg &&
              !s.nextRandomBackgrounds.some((bg) => bg.steamUrl === randomBg.steamUrl)
            ) {
              s.nextRandomBackgrounds.push(randomBg)
            }
          }
        }
      })
    )
    // never write "#undefined": it comes back as a background and requests /undefined
    if (store.background) {
      window.location.hash = '#' + store.background
    }
  },

  setPreviewScale(value: number | string) {
    setStore('previewScale', parseInt(String(value)))
  },

  setUser(value: RootState['user']) {
    setStore('user', value)
  },

  setBgSize(value: RootState['bgSize']) {
    setStore('bgSize', value)
  },

  setInventoryBackgrounds(items: InventoryItem[]) {
    setStore({ inventory: items, inventoryUpdateTime: Date.now() })
  },

  logout() {
    setStore({ user: { id: 0 }, inventory: [] })
  },

  setBgJsonUrl(v: string | null) {
    setStore('bgJsonUrl', v)
  },

  addConvertItem(v: ConverterProp) {
    setStore('converters', (list) => [...(list || []), v])
  },

  removeConvertItem(id: string) {
    setStore('converters', (list) => (list || []).filter((el) => el.id !== id))
  },

  downloadZip({ ctrl, alt }: { ctrl: boolean; alt: boolean }) {
    // Positions measured on steamcommunity.com (Oct 2026, 1280-2560 wide windows, several
    // themes): for a 1920px background the showcase artwork starts at x=495 and x=1010,
    // the avatar at x=498, y=36. Must match the overlay in preview/Overlay.tsx.
    const halfWidth = Math.floor(store.bgSize.w / 2)
    const repeating = store.bgSize.h === store.bgSize.w && store.bgSize.h === 512
    const bgSaveInfo = {
      url: store.background,
      repeating,
      images: [
        {
          name: 'Artwork_Middle.png',
          x: halfWidth - 465,
          y: 256,
          w: 506,
          h: repeating ? 950 : 2000,
        },
        {
          name: 'Artwork_Right_Top.png',
          x: halfWidth + 50,
          y: 256,
          w: 100,
          h: repeating ? 950 : 2000,
        },
        {
          name: 'Artwork_Featured.png',
          x: halfWidth - 465,
          y: 256,
          w: 630,
          h: repeating ? 950 : 2000,
        },
        { name: 'Avatar.png', x: halfWidth - 462, y: 36, w: 164, h: 164 },
      ],
    }

    if (!isVideo()) {
      // Images are cropped and zipped in the browser; the backend only serves the
      // image with CORS headers (see utils/cropImage.ts)
      void saveImageZip(bgSaveInfo)
      return
    }

    if (!ctrl && !alt) {
      // The popup fills in name/enabled/data per image as it converts
      const info: ConverterProp['info'] = {
        url: bgSaveInfo.url,
        images: bgSaveInfo.images.map((i) => ({ ...i, enabled: true, data: new Uint8Array() })),
      }
      actions.addConvertItem({ id: Math.random().toString(), info })
    } else {
      window.open('https://steam.design/converter/' + btoa(JSON.stringify(bgSaveInfo)))
    }
  },

  getCurrentBg() {
    const goUrl =
      store.bgInfo && 'url' in store.bgInfo && store.bgInfo.url
        ? 'https://steamcommunity.com/market/listings/' + store.bgInfo.url
        : 'https://lens.google.com/uploadbyurl?url=' + store.background
    window.open(goUrl)
  },

  async loadBackpack() {
    const res = await fetch(`${getBackendUrl()}backpack/${store.user.id}/items.json`)
    // A private inventory or a Steam rate limit is an error, not an empty inventory
    if (!res.ok) throw new Error(`backpack ${res.status}`)
    const data = await res.json()
    actions.setInventoryBackgrounds(data.backgrounds || [])
  },

  trackClick(args: [string, unknown?]) {
    if (window.gtag) {
      const [where, subject] = args
      window.gtag('event', where, {
        event_category: 'userClick',
        event_label: subject || 'click',
      })
    }
  },
}

/** Same name the components used with Pinia: `const { store, actions } = useMainStore()` */
export const useMainStore = () => ({ store, actions, isVideo })
