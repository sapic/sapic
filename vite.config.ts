// vite.config.js

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// The multithreaded ffmpeg.wasm core needs SharedArrayBuffer, which is only
// exposed to cross-origin isolated documents (COOP: same-origin + COEP).
//
// This has to be site-wide, not just on /converter: the index page converts
// inline too (a video background adds a converter popup via addConvertItem),
// so it needs SharedArrayBuffer just as much.
//
// COEP is `credentialless` rather than `require-corp` because the Steam CDNs
// serve item images with neither CORP nor CORS headers, and require-corp blocks
// every one of them. credentialless still isolates, but allows no-cors
// cross-origin loads by sending them without credentials - which those images
// do not need.
//
// Caveat: Safari does not implement credentialless, so it does not isolate and
// SharedArrayBuffer stays undefined there - conversion fails on Safari. Fixing
// that needs a coi-serviceworker style shim that injects the headers client-side.
//
// `pnpm check:coi` asserts all of this against a running server.
const crossOriginIsolationHeaders = {
  'Cross-Origin-Embedder-Policy': 'credentialless',
  'Cross-Origin-Opener-Policy': 'same-origin',
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    headers: crossOriginIsolationHeaders,
  },
  preview: {
    headers: crossOriginIsolationHeaders,
  },
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
})
