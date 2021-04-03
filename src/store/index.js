import Vue from 'vue'
import Vuex from 'vuex'
import init from './init'

Vue.use(Vuex)

const state = {
  background: null,
  // bgInfo: BackgroundInfo(),
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
}

const getters = {
  isVideo (state) {
    return state.format === 'webm' || state.format === 'mp4'
  },
}

const mutations = {
  setBackground (state, { background, info }) {
    state.background = background
    state.bgInfo = info
    state.format = background.split('.').slice(-1)[0]
  },
  setBackgroundURL (state, value) {
    state.background = value
    state.format = value.split('.').slice(-1)[0]
  },
  setBackgrounds (state, backgrounds) {
    state.backgrounds = backgrounds
    state.nextRandomBackgrounds.push(state.backgrounds[Math.floor(state.backgrounds.length * Math.random())])
    state.backgroundsUpdateTime = Date.now()
  },
  setCurrentWindow (state, window) {
    state.currWindow = window
  },
  setIsMaximized (state, max) {
    state.isMaximized = max
  },
  setWindowWidth (state, value) {
    state.windowWidth = value
  },
  setWindowHeight (state, value) {
    state.windowHeight = value
  },
  setWindowSize (state, size) {
    state.windowWidth = size.width
    state.windowHeight = size.height
  },
  randomBackground (state) {
    const newBg = state.nextRandomBackgrounds.shift()
    if (newBg) {
      if (newBg.steamUrl.indexOf('http://cdn.akamai.steamstatic.com') !== -1) {
        state.background = newBg.steamUrl.replace('http://cdn.akamai.steamstatic.com', 'https://steamcdn-a.akamaihd.net')
      } else {
        state.background = newBg.steamUrl
      }
      state.bgInfo = newBg
      state.format = newBg.steamUrl.split('.').slice(-1)[0]
      window.location.hash = '#' + state.background
    }

    if (state.nextRandomBackgrounds.length < 3) {
      for (let i = 0; i < 5; i++) {
        const randomBg = state.backgrounds[Math.floor(state.backgrounds.length * Math.random())]
        let found = false
        for (const bg of state.nextRandomBackgrounds) {
          if (bg.steamUrl === randomBg.steamUrl) {
            found = true
            break
          }
        }

        if (!found) {
          state.nextRandomBackgrounds.push(randomBg)
        }
      }
    }
  },
  setPreviewScale (state, value) {
    state.previewScale = parseInt(value)
  },
  setGreenworks (state, value) {
    state.greenworks = value
  },
  setUser (state, value) {
    state.user = value
  },
  setBgSize (state, value) {
    state.bgSize = value
  },
  setState (state, newState) {
    state = newState
  },
  setAvatar (state, avatar) {
    state.user = {
      ...state.user,
      avatar: avatar,
    }
  },
  setInventoryBackgrounds (state, items) {
    state.inventory = items
    state.inventoryUpdateTime = Date.now()
  },

  logout () {
    state.user = {
      id: 0,
    }
    state.inventory = []
  },

  setBgJsonUrl (state, v) {
    state.bgJsonUrl = v
  },
}

const actions = {
  downloadZip ({ state, getters }, { ctrl, alt }) {
    // sizes based on 1920x1108
    // https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/570/982491acceb6c9dde0d5e49dab1e7540c5faa1de.webm

    const bgSaveInfo = {
      url: state.background,
      images: [
        { name: 'Artwork_Middle.png', x: (state.bgSize.w / 2) - 466, y: 256, w: 506, h: 2000 },
        { name: 'Artwork_Right_Top.png', x: (state.bgSize.w / 2) + 49, y: 256, w: 100, h: 2000 },
        { name: 'Artwork_Featured.png', x: (state.bgSize.w / 2) - 466, y: 256, w: 630, h: 2000 },
        { name: 'Avatar.png', x: (state.bgSize.w / 2) - 463, y: 34, w: 164, h: 164 },
      ],
    }

    // const backUrl = ctrl && alt ? 'https://steam.design/converter/' : 'https://steam.design/raw/'
    const backUrl = getters.isVideo ? 'https://steam.design/converter/' : 'https://steam.design/raw/'
    // const backUrl = 'http://localhost:8899/raw/'
    const url = backUrl + btoa(JSON.stringify(bgSaveInfo))

    // if (state.background.indexOf('.webm') !== -1) {
    //   console.log('webm', url)
    //   return
    // }
    window.open(url)
  },

  randomBackground ({ commit }) {
    commit('randomBackground')
  },

  getCurrentBg ({ state }) {
    var _goUrl = state.bgInfo && state.bgInfo.url
      ? 'https://steamcommunity.com/market/listings/' + state.bgInfo.url
      : 'https://images.google.com/searchbyimage?image_url=' + state.background
    // shell.openExternal(_goUrl)
    window.open(_goUrl)
  },

  async loadBackpack ({ commit }) {
    const data = await fetch(`https://steam.design/backpack/${state.user.id}/items.json`).then(r => r.json())
    commit('setInventoryBackgrounds', data.backgrounds)
  },

  trackClick (ctx, [where, subject]) {
    if (window && window.gtag) {
      window.gtag('event', where, {
        event_category: 'userClick',
        event_label: subject || 'click',
      })
    }
  },
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,

  modules: {
  },

  plugins: [init],
})
