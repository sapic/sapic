import BgsUrl from '@/assets/bg-asset.json?url'

const StoreImageRegex = /steamcdn-a\.akamaihd\.net\/steamcommunity\/public\/images\/items\/.+(jpg|webm|mp4)$/i
const AnimatedStoreImageRegex = /cdn\.akamai\.steamstatic\.com\/steamcommunity\/public\/images\/items\/(\d+)\/.+.(jpg|webm|mp4)$/i

export default async (store) => {
  if (localStorage) {
  // listen to updates to save store
    store.subscribe((_, state) => {
      localStorage.setItem('store', JSON.stringify(state))
    })

    // init with last session data
    if (localStorage.getItem('store')) {
      const savedStore = JSON.parse(localStorage.getItem('store'))
      const newStore = {
        ...store.state,
        ...savedStore,
        user: {
          ...store.state.user,
          ...savedStore.user,
        },
      }

      store.replaceState(Object.assign(store.state, newStore))
    }
  }

  const { commit } = store
  const { dispatch } = store

  if (window.location.search !== '') {
    const params = parseQuery(window.location.search)
    if (params['openid.identity']) {
      const arr = params['openid.identity'].split('/').slice(-1)
      if (arr && arr.length > 0) {
        commit('setUser', { id: arr[0] })
        history.replaceState('', document.title, window.location.pathname)
      }
    }
  }

  const state = JSON.parse(JSON.stringify(store.state))
  // If state has no bgs, fetch some from api
  if (
    state.bgJsonUrl !== BgsUrl || // if we have new bgs json
    (!state.backgrounds || state.backgrounds.length < 10) // if no bgs
    // (state.backgroundsUpdateTime > 0 && new Date() - state.backgroundsUpdateTime > 604800000) // or if last bg update > week ago
  ) {
    const bgs = await fetch(BgsUrl).then(r => r.json())

    commit('setBackgrounds', bgs)
    commit('setBgJsonUrl', BgsUrl)
    dispatch('randomBackground')
  }

  if (state.user.id &&
    (
      (!state.inventory || state.inventory.length < 1) || // no inventory
      (state.inventoryUpdateTime > 0 && new Date() - state.inventoryUpdateTime > 604800000) // or if last inventory update > week ago)
    )
  ) {
    dispatch('loadBackpack')
  }

  if (window.location.hash !== '') {
    const url = window.location.hash.slice(1)
    if (StoreImageRegex.test(url) || AnimatedStoreImageRegex.test(url)) {
      commit('setBackgroundURL', url)
    }
  }
}

function parseQuery (queryString) {
  var query = {}
  var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&')
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=')
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
  }
  return query
}

// function debounce (func: any, wait: number, immediate: boolean) {
//   var timeout: number
//   return function () {
//     var context: any = this
//     var args = arguments
//     var later = function () {
//       timeout = null
//       if (!immediate) func.apply(context, args)
//     }
//     var callNow = immediate && !timeout
//     window.clearTimeout(timeout)
//     timeout = window.setTimeout(later, wait)
//     if (callNow) func.apply(context, args)
//   }
// }
