/// <reference types="vite/client" />
export {}

declare global {
  interface Window {
    gtag: any
  }
}

declare module '*.svg' {
  const src: string
  export default src
}
declare module '*.png' {
  const src: string
  export default src
}
declare module '*.jpg' {
  const src: string
  export default src
}
declare module '*.webm' {
  const src: string
  export default src
}
declare module '*.mp4' {
  const src: string
  export default src
}
