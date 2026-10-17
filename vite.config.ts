import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import path from 'path'

// https://vitejs.dev/config/
// Component styles are plain CSS files next to each component (Name.css), imported for their
// side effect. Class names are kept exactly as they were in the Vue components (BEM-style,
// already unique), so the markup and the tests see the same classes as before.
export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
