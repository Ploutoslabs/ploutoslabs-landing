import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    // Live crypto rates come from the Express server (npm run server).
    // Proxying keeps the frontend calling a same-origin /api path in dev and prod.
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET || 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
})
