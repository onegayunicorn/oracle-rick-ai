import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Sovereign Photonic Oracle',
        short_name: 'Oracle',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#22d3ee',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        runtimeCaching: [{
          urlPattern: /web-llm\/dist\/|\.bin$|\.ndjson$/,
          handler: 'CacheFirst',
          options: { cacheName: 'webllm-models-v1' }
        }]
      }
    })
  ],
  server: { port: 5173 }
});
