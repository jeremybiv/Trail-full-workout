import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // lottie-react's "browser" field points at a UMD build whose default
      // export is the whole module namespace object, not the component —
      // force resolution to the real ESM build instead.
      'lottie-react': 'lottie-react/build/index.es.js',
    },
  },
})
