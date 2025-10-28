import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ethereum-vendor': ['ethers'],
          'animation-vendor': ['framer-motion'],
          'markdown-vendor': ['react-markdown', 'remark-gfm']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
});
