import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // Apunta a tu Load Balancer real
        target: 'http://ab4c3407667b94f96af654877f77605c-2136966934.us-east-1.elb.amazonaws.com',
        changeOrigin: true,
        secure: false,
        // ESTA LÍNEA ES CLAVE: No elimines el /api si tu backend espera la ruta completa
        rewrite: (path) => path 
      },
      // NUEVO: Tu proxy para Ventas
      '/api/v1/ventas': {
        target: 'http://ab4c3407667b94f96af654877f77605c-2136966934.us-east-1.elb.amazonaws.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
   