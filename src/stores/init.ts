// @ts-ignore
import BgsUrl from '@/assets/bg-asset.json?url'
import { createRoot, createEffect, on } from 'solid-js'
import { isSupportedSteamMediaUrl } from '@/utils/steamMediaUrl'
import { actions, emptyState, setStore, snapshot, store } from './index'

// Start-up and persistence (was the Pinia plugin in stores/init.ts on master).
// Called once from main.tsx before the app renders.

/** The background the address bar asks for (read live, so Back/Forward during start-up count) */
const requestedUrl = () => {
  const url = window.location.hash.slice(1)
  return isSupportedSteamMediaUrl(url) ? url : null
}

function parseQuery(queryString: string) {
  const query: Record<string, string> = {}
  const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&')
  for (const p of pairs) {
    const pair = p.split('=')
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
  }
  return query
}

export default async function initStore() {
  // Back / Forward (and a pasted #link) change only the hash: show that
  // background, so the page and "Get this Background" match the address bar.
  // Registered first: the catalogue below loads asynchronously.
  window.addEventListener('hashchange', () => {
    const url = requestedUrl()
    if (url && url !== store.background) {
      actions.setBackgroundURL(url)
    }
  })

  if (localStorage) {
    // init with last session data
    const saved = localStorage.getItem('store')
    if (saved) {
      try {
        const newStore = { ...emptyState, ...JSON.parse(saved), converters: [] }
        // Older versions could save background: "undefined" (from an #undefined hash);
        // it only ever produced a request to /undefined
        if (
          typeof newStore.background === 'string' &&
          !/^(https?:|blob:|data:)/i.test(newStore.background)
        ) {
          newStore.background = emptyState.background
          newStore.bgInfo = null
        }
        setStore(newStore)
      } catch {
        localStorage.removeItem('store')
      }
    }

    // Save on change. Only the small, user-facing fields drive the effect; the
    // catalogue (`backgrounds`) is written when its update time changes.
    createRoot(() => {
      createEffect(
        on(
          () => [
            store.background,
            store.bgInfo,
            store.previewScale,
            store.user,
            store.user.id,
            store.bgSize.w,
            store.bgSize.h,
            store.format,
            store.inventoryUpdateTime,
            store.backgroundsUpdateTime,
            store.nextRandomBackgrounds.length,
            store.bgJsonUrl,
          ],
          () => {
            const toSave: Partial<typeof store> = snapshot()
            delete toSave.converters
            localStorage.setItem('store', JSON.stringify(toSave))
          },
          { defer: true }
        )
      )
    })
  }

  if (window.location.search !== '') {
    const params = parseQuery(window.location.search)
    if (params['openid.identity']) {
      const arr = params['openid.identity'].split('/').slice(-1)
      if (arr && arr.length > 0) {
        actions.setUser({ id: arr[0] })
        history.replaceState('', document.title, window.location.pathname)
      }
    }
  }

  // If the stored catalogue is missing or from an older build, fetch it
  if (store.bgJsonUrl !== BgsUrl || !store.backgrounds || store.backgrounds.length < 10) {
    const bgs = await fetch(BgsUrl).then((r) => r.json())
    actions.setBackgrounds(bgs)
    actions.setBgJsonUrl(BgsUrl)
    // A link that names a background shows it; a random one would replace the hash
    if (!requestedUrl()) actions.randomBackground()
  }
  if (
    store.user.id &&
    (!store.inventory ||
      store.inventory.length < 1 ||
      (store.inventoryUpdateTime > 0 && Date.now() - store.inventoryUpdateTime > 604800000))
  ) {
    actions.loadBackpack().catch((e) => console.log('backpack error', e))
  }
  // Also when it is already shown: a hash change during the catalogue load
  // set the background before its catalogue entry (market page) was known
  const url = requestedUrl()
  if (url && (url !== store.background || !store.bgInfo)) {
    actions.setBackgroundURL(url)
  }
}
