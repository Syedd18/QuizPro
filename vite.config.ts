import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    cssMinify: true,
    reportCompressedSize: true,
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
    }
  },
  preview: {
    port: 4173,
    strictPort: false
  }
})
