import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // Все запросы, начинающиеся с /api, проходят через прокси
      '/api/auth': { target: 'http://localhost:8080', changeOrigin: true },
      '/api/user': { target: 'http://localhost:8080', changeOrigin: true },
      '/api/menu': { target: 'http://localhost:8082', changeOrigin: true },
      '/api/orders': { target: 'http://localhost:8083', changeOrigin: true },
      '/api/admin/orders': { target: 'http://localhost:8083', changeOrigin: true },
      
      // Особый случай для WebSocket (если используешь)
      '/ws': {
        target: 'http://localhost:8083',
        ws: true
      }
    }
  }
})