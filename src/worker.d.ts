import { Store } from '@/store';// path to store file

declare global {

  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FFmpeg: any
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: any
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store;
  }
}
