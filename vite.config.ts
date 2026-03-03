import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: './', // Necesario para GitHub Pages
  plugins: [vue()],
  server: {
    watch: {
      usePolling: true,
      interval: 100
    },
    host: true,
    strictPort: true,
    hmr: {
      overlay: true
    }
  }
})
