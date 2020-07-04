export default (store) => {
  const state = JSON.parse(JSON.stringify(store.state))
  const { commit } = store
  const { dispatch } = store

  if (!state.backgrounds || state.backgrounds.length < 10) {
    // const bgs = require('@/assets/bg.json')
    const bgs = [
      {
        game: 'Bravada Rare',
        hls: [21, 33, 44],
        name: 'Old stump background',
        pos: [0, 7, 0],
        price: '1.57',
        url: '753/315930-Old%20stump%20background',
        steamUrl: 'https://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/315930/d11e368332f1aec6ae4bc1b1423978bd7496141a.jpg',
      },
      {
        game: 'Bravada Rare',
        hls: [21, 33, 44],
        name: 'Old stump background',
        pos: [0, 7, 0],
        price: '1.57',
        url: '753/315930-Old%20stump%20background',
        steamUrl: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/1263950/4d466f77edf3265a253fba79d47bc91a37e34920.webm',
      },
    ]
    commit('setBackgrounds', bgs)
  }

  dispatch('randomBackground')

  // Add resize listeners
  // curWindow.addListener('maximize', () => commit('setIsMaximized', true))
  // curWindow.addListener('unmaximize', () => commit('setIsMaximized', false))
  // curWindow.addListener('resize', debounce(() => {
  //   const [width, height] = curWindow.getSize()
  //   commit('setWindowSize', { width, height })
  // }, 100, false))

  try {
    // process.activateUvLoop()
    // greenworks.init()
    // store.commit('setGreenworks', greenworks)

    // const user: SteamUserInfo = greenworks.getSteamId()

    // store.commit('setUser', user)

    // greenworks.on('avatar-image-loaded', async (steamid: string, handler: number) => {
    //   if (handler < 1) return
    //   if (steamid !== store.state.user.steamId) return

    //   const avatarBuffer: string = await imageFromHandler(handler)

    //   const user = store.state.user
    //   user.avatar = avatarBuffer
    //   store.commit('setUser', user)
    // })

    // const handler = greenworks.getLargeFriendAvatar(user.steamId)

    // if (handler > 0) {
    //   imageFromHandler(handler).then((avatarBuffer) => {
    //     store.commit('setAvatar', avatarBuffer)
    //   })
    // }
  } catch (e) {
    console.log('Can\'t init greenworks', e)
    store.commit('setUser', 0)
  }
  dispatch('loadBackpack')
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
