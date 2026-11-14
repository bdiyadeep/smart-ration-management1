
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
  enabled: true,
  type: 'module',
},
      manifest: {
        name: 'Smart Ration Management System',
        short_name: 'Smart Ration',
        description: 'Offline Shopkeeper Ration Management System',
        theme_color: '#103b27',
        background_color: '#f3f6f8',
        display: 'standalone',
        start_url: '/',
      },
    }),
  ],
})
