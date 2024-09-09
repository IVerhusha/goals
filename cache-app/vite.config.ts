import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/service-worker.js', // Указываем путь к нашему Service Worker
          dest: '.', // Копируем его в корень билда
        },
      ],
    }),
  ],
});
