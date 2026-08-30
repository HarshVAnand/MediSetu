import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/medisetu-landing-page/',
  server: {
    port: 5173,
    host: true, // Enables local network IP access for testing on phones/tablets
  },
  preview: {
    port: 4173,
    host: true,
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          leaflet: ['leaflet'],
          motion: ['gsap', 'lenis'],
          icons: ['lucide-react']
        }
      }
    }
  }
});