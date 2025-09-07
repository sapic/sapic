import { defineStore } from 'pinia'
import { Background, ConverterProp } from '@/types/store'
import { getBackendUrl } from '@/utils/getBackendUrl'

// interface RootState {}
export const emptyState: RootState = {
  background: '',
  // bgInfo: BackgroundInfo(),
  bgInfo: null,
  backgrounds: [],
  backgroundsUpdateTime: 0,
  nextRandomBackgrounds: [],
  previewScale: window.screen.width < 560 ? 25 : 75,
  user: {
    id: 0,
  },
  bgSize: {
    w: 0,
    h: 0,
  },
  format: 'jpg',
  inventory: [],
  inventoryUpdateTime: 0,
  v: 1,
  bgJsonUrl: null, // url of file with backgrounds
  converters: [],
}

interface InventoryItem {
  icon_url_large: string
}

interface RootState {
  background: string
  bgInfo: Background | null
  backgrounds: Background[]
  backgroundsUpdateTime: number
  nextRandomBackgrounds: Background[]
  previewScale: number
  user: {
    id: number
  }
  bgSize: {
    w: number
    h: number
  }
  format: 'jpg' | 'mp4' | 'webm'
  inventory: InventoryItem[]
  inventoryUpdateTime: number
  v: number
  bgJsonUrl: string | null // url of file with backgrounds
  converters: ConverterProp[]
}

export const useMainStore = defineStore('main', {
  state: (): RootState => {
    return { ...emptyState }
  },

  getters: {
    isVideo(): boolean {
      return this.format === 'webm' || this.format === 'mp4'
    },
  },

  actions: {
    setBackground({ background, info }) {
      this.background = background
      this.bgInfo = info
      this.format = background.split('.').slice(-1)[0]
    },
    setBackgroundURL(value) {
      this.background = value
      this.format = value.split('.').slice(-1)[0]
      this.bgInfo = null
    },
    setBackgrounds(backgrounds) {
      this.backgrounds = backgrounds
      this.nextRandomBackgrounds.push(
        this.backgrounds[Math.floor(this.backgrounds.length * Math.random())]
      )
      this.backgroundsUpdateTime = Date.now()
    },

    randomBackground() {
      const newBg = this.nextRandomBackgrounds.shift()
      if (newBg) {
        if (newBg.steamUrl.indexOf('http://cdn.akamai.steamstatic.com') !== -1) {
          this.background = newBg.steamUrl.replace(
            'http://cdn.akamai.steamstatic.com',
            'https://steamcdn-a.akamaihd.net'
          )
        } else {
          this.background = newBg.steamUrl
        }
        this.bgInfo = newBg

        const format = newBg.steamUrl.split('.').slice(-1)[0]
        if (format === 'jpg' || format === 'mp4' || format === 'webm') {
          this.format = format
        } else {
          console.log('Unknown format', format)
        }
        window.location.hash = '#' + this.background
      }

      if (this.nextRandomBackgrounds.length < 3) {
        for (let i = 0; i < 5; i++) {
          const randomBg = this.backgrounds[Math.floor(this.backgrounds.length * Math.random())]
          let found = false
          for (const bg of this.nextRandomBackgrounds) {
            if (bg.steamUrl === randomBg.steamUrl) {
              found = true
              break
            }
          }

          if (!found) {
            this.nextRandomBackgrounds.push(randomBg)
          }
        }
      }
    },
    setPreviewScale(value) {
      this.previewScale = parseInt(value)
    },
    setUser(value) {
      this.user = value
    },
    setBgSize(value) {
      this.bgSize = value
    },

    setInventoryBackgrounds(items) {
      this.inventory = items
      this.inventoryUpdateTime = Date.now()
    },

    logout() {
      this.user = {
        id: 0,
      }
      this.inventory = []
    },

    setBgJsonUrl(v) {
      this.bgJsonUrl = v
    },

    addConvertItem(v) {
      this.converters = this.converters ? [...this.converters, v] : [1]
    },
    removeConvertItem(v) {
      this.converters = (this.converters || []).filter((el) => el.id !== v)
    },

    // actions

    downloadZip({ ctrl, alt }) {
      // sizes based on 1920x1108
      // https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/570/982491acceb6c9dde0d5e49dab1e7540c5faa1de.webm
      const halfWidth = Math.floor(this.bgSize.w / 2)
      const repeating = this.bgSize.h === this.bgSize.w && this.bgSize.h === 512
      const bgSaveInfo = {
        url: this.background,
        repeating,
        images: [
          {
            name: 'Artwork_Middle.png',
            x: halfWidth - 466,
            y: 256,
            w: 506,
            h: repeating ? 950 : 2000,
          },
          {
            name: 'Artwork_Right_Top.png',
            x: halfWidth + 49,
            y: 256,
            w: 100,
            h: repeating ? 950 : 2000,
          },
          {
            name: 'Artwork_Featured.png',
            x: halfWidth - 466,
            y: 256,
            w: 630,
            h: repeating ? 950 : 2000,
          },
          { name: 'Avatar.png', x: halfWidth - 463, y: 34, w: 164, h: 164 },
        ],
      }

      // const backUrl = ctrl && alt ? 'https://steam.design/converter/' : 'https://steam.design/raw/'
      const backUrl = this.isVideo ? 'https://steam.design/converter/' : `${getBackendUrl()}raw/`
      const url = backUrl + btoa(JSON.stringify(bgSaveInfo))

      // if (state.background.indexOf('.webm') !== -1) {
      //   console.log('webm', url)
      //   return
      // }

      if (this.isVideo && !ctrl && !alt) {
        this.addConvertItem({
          id: Math.random().toString(),
          info: bgSaveInfo,
        })
      } else {
        window.open(url)
      }
    },

    getCurrentBg() {
      const _goUrl =
        this.bgInfo && this.bgInfo.url
          ? 'https://steamcommunity.com/market/listings/' + this.bgInfo.url
          : 'https://lens.google.com/uploadbyurl?url=' + this.background
      // shell.openExternal(_goUrl)
      window.open(_goUrl)
    },

    async loadBackpack() {
      const data = await fetch(`https://steam.design/backpack/${this.user.id}/items.json`).then(
        (r) => r.json()
      )
      this.setInventoryBackgrounds(data.backgrounds)
    },

    trackClick(args) {
      if (window && window.gtag) {
        const [where, subject] = args
        window.gtag('event', where, {
          event_category: 'userClick',
          event_label: subject || 'click',
        })
      }
    },
  },
})

const getters = {}

const mutations = {}

const actions = {}

// export default createStore({
//   state() {
//     return { ...state }
//   },

//   mutations,
//   actions,
//   getters,

//   modules: {},

//   plugins: [init],
// })
