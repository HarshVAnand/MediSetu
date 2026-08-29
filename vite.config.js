import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/MediSetu/',
  server: {
    port: 5173,
    host: true,
    allowedHosts: true,
    cors: true,
  },
  preview: {
    port: 5173,
    host: true,
    allowedHosts: true,
    cors: true,
  },
});
