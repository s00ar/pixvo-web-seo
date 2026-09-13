import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { open: false },
  build: {
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-helmet-async'],
          'vendor-router': ['react-router-dom']
        }
      }
    },
    cssCodeSplit: true,
    target: 'esnext'
  }
});
