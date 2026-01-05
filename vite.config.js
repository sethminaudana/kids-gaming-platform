import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  plugins: [react()],
  server: {
    proxy: {
      // CHANGE: Proxy anything starting with /api to the backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
    }
  }
})
