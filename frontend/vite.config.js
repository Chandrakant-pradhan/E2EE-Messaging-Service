import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: { chunkSizeWarningLimit: 1600, },
  server: {
    proxy: {
      '/api': {
        target: 'https://e2ee-messaging-service.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
