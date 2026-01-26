import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'lucide': ['lucide-react'],
          'admin': ['./src/pages/Admin'],
          'quiz': ['./src/pages/Quiz'],
          'results': ['./src/pages/Results'],
        }
      }
    },
    minify: 'terser',
    cssMinify: true,
    sourcemap: false,
    reportCompressedSize: true,
  }
})
