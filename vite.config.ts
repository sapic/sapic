import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [solid()],
  css: {
    // Component styles live in *.module.css next to each component. Class names are kept
    // as written (the old Vue scoped class names are already unique, BEM-style), so the
    // markup, the tests and the browser extensions that read the DOM see the same classes.
    modules: { generateScopedName: '[local]' },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
