import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

import react from '@vitejs/plugin-react'



// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()], 
  server: {
    port: 3000,
    host: true,
    // Proxy API requests to backend — makes cookies work without HTTPS/SameSite issues
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
    },
  }
})
