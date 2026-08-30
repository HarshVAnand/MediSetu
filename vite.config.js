import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative base path ensures the website loads flawlessly across all GitHub Pages repositories,
  // custom domains, subpaths (/medisetu-landing-page/ or /MediSetu/), and local networks
  base: './',
  server: {
    port: 5173,
    host: true,
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