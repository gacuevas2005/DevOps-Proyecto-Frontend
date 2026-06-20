import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://ab4c3407667b94f96af654877f77605c-2136966934.us-east-1.elb.amazonaws.com', // La URL de tu balanceador
        changeOrigin: true,
        secure: false,
      }
    }
  }
})