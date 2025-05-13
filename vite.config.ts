import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA, type VitePWAOptions } from 'vite-plugin-pwa';

const pwaOptions: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'robots.txt'],
  manifest: {
    name: 'ConverterPWA',
    short_name: 'Converter',
    description: 'My ConverterPWA App',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone',
    start_url: '/',
    icons: [
      {
        src: 'Converter.png',
        sizes: '256x256',
        type: 'image/png'
      },
      {
        src: 'Converter.png',
        sizes: '256x256',
        type: 'image/png'
      },
      {
        src: 'Converter.png',
        sizes: '256x256',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ]
  },
  workbox: {
    globPatterns: ['index.html',
      'assets/**/*.{js,css,ts,tsx,scss}',
      'src/**/*.{js,css,scss,ts,tsx}',
      'public/**/*.{png,jpg,svg,ico,json}'
    ],
    globIgnores: [
      '**/node_modules/**/*',
      '**/sw.js',
      '**/workbox-*.js',
    ],
    navigateFallback: '/index.html',
    navigateFallbackDenylist: [/^\/apiHistory/],
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/apiHistory\.example\.com\/.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'apiHistory-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 // 24 часа
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|ico)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 30 * 24 * 60 * 60 // 30 дней
          }
        }
      }
    ]
  },
  devOptions: {
    enabled: true, // Включить SW в dev-режиме для тестирования
    type: 'module',
    navigateFallback: '/index.html'
  }
};

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA(pwaOptions)
  ],
  server: {
    host: '0.0.0.0',
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
});