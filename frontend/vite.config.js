import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: '/',
  define: {
    __API_BASE_URL__: JSON.stringify(
      process.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    )
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  }
}))
