import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'icons.svg', 'icons/*.png'],
      manifest: {
        name: 'Renfo Trail',
        short_name: 'Trail',
        description: 'Séances de renforcement musculaire pour traileurs',
        theme_color: '#1c2620',
        background_color: '#1c2620',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        lang: 'fr',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,ico,webmanifest}'],
      },
    }),
  ],
  resolve: {
    alias: {
      // lottie-react's "browser" field points at a UMD build whose default
      // export is the whole module namespace object, not the component —
      // force resolution to the real ESM build instead.
      'lottie-react': 'lottie-react/build/index.es.js',
    },
  },
})
