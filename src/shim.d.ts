/// <reference types="vite-svg-loader" />
/// <reference types="vite/client" />

import { Store } from 'vuex'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FFmpeg: any

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: any
  }
}

declare module '@vue/runtime-core' {
  // declare your own store states
  interface State {
    count: number
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $store: Store<State | any>
  }
}
