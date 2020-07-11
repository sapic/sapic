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

  const state = JSON.parse(JSON.stringify(store.state))
  const { commit } = store
  const { dispatch } = store

  if (window.location.search !== '') {
    const params = parseQuery(window.location.search)
    if (params['openid.identity']) {
      const arr = params['openid.identity'].split('/').slice(-1)
      if (arr && arr.length > 0) {
        commit('setUser', { id: arr[0] })
      }
    }
  }
  // console.log('url', parseQuery())

  // If state has no bgs, fetch some from api
  if (
    (!state.backgrounds || state.backgrounds.length < 10) || // if no bgs
    (state.backgroundsUpdateTime > 0 && new Date() - state.backgroundsUpdateTime > 604800000) // or if last bg update > week ago
  ) {
    const bgs = await fetch('/bg.json').then(r => r.json())
    console.log('got bgs', bgs)
    // const bgs = require('@/assets/bg.json')
    // const bgs = [
    //   {
    //     game: 'Bravada Rare',
    //     hls: [21, 33, 44],
    //     name: 'Old stump background',
    //     pos: [0, 7, 0],
    //     price: '1.57',
    //     url: '753/315930-Old%20stump%20background',
    //     steamUrl: 'http://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/315930/d11e368332f1aec6ae4bc1b1423978bd7496141a.jpg',
    //   },
    //   {
    //     game: 'Bravada Rare',
    //     hls: [21, 33, 44],
    //     name: 'Old stump background',
    //     pos: [0, 7, 0],
    //     price: '1.57',
    //     url: '753/315930-Old%20stump%20background',
    //     steamUrl: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/1263950/4d466f77edf3265a253fba79d47bc91a37e34920.webm',
    //   },
    // ]
    commit('setBackgrounds', bgs)
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
