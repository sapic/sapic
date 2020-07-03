import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  background: null,
  // bgInfo: BackgroundInfo(),
  backgrounds: [],
  nextRandomBackgrounds: [],
  // currWindow: null,
  isMaximized: false,
  windowWidth: 1280,
  windowHeight: 720,
  previewScale: 75,
  // greenworks: null,
  user: {},
  bgSize: {
    w: 0,
    h: 0,
  },
  inventory: [],
}

export default new Vuex.Store({
  state,

  modules: {
  },
})
