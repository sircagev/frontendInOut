import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '10.193.128.50', // O la IP específica que desees usar
    port: 4003, // O el puerto que desees usar
  },
})
