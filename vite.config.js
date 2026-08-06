import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración de Vite:
// - Plugin de React
// - Proxy hacia la API de OpenAQ para evitar problemas de CORS
//   y para inyectar la API Key desde el servidor de desarrollo
//   (así la key no queda expuesta directamente en las peticiones del navegador).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'https://api.openaq.org',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api/, '/v3'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('X-API-Key', env.VITE_OPENAQ_API_KEY || '')
            })
          }
        }
      }
    }
  }
})
