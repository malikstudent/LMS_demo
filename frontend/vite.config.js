import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      overlay: false
    },
    watch: {
      usePolling: true,
    }
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    // disable sourcemaps for built assets so source code isn't exposed in production builds
    sourcemap: false,
  }
})
