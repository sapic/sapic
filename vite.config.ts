// vite.config.js

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// COOP/COEP headers are required for SharedArrayBuffer (multithreaded ffmpeg.wasm core)
const crossOriginIsolationHeaders = {
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Keep the ffmpeg core files as separate hashed assets. ffmpeg-core.worker.js
    // is small enough that Vite would otherwise inline it as a data URI, which
    // bloats the main bundle and defeats long-term caching of the worker.
    assetsInlineLimit: (filePath) => (filePath.includes('ffmpeg-core') ? false : undefined),
  },
  server: {
    headers: crossOriginIsolationHeaders,
  },
  preview: {
    headers: crossOriginIsolationHeaders,
  },
})
