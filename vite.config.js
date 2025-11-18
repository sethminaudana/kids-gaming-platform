import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This proxies any request starting with /memorygame
      // to your backend server at http://localhost:8000
      '/memorygame': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    }
  }
})
