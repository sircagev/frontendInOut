import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost', // O la IP específica que desees usar
    port: 4003, // O el puerto que desees usar
  },
})
