import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'client/dist',
    publicDir: 'public',
    rollupOptions: {
      input: 'client/app.jsx',
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/v1': 'http://localhost:8080'
    },
  },
});