/// <reference types="vite-svg-loader" />
/// <reference types="vite/client" />
export {}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FFmpeg: any

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: any
  }
}

declare module '@vue/runtime-core' {}
