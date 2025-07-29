import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4400,
    proxy: {
      "/api": "http://localhost:4500/api/",
    },
    host: true,
    allowedHosts: ['localhost']
  },
  preview: {
    port: 4173,
    host: true,
    allowedHosts: ['localhost']  // 👈 this is the key change
  }
})