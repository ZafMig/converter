import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'normalize.css';
import 'sanitize.css';
import { App } from './App';
import { initializePWA } from '@/pwa.ts';
import { registerSW } from 'virtual:pwa-register';

initializePWA({
  onNeedRefresh: () => {
    // Показать UI для обновления приложения
  },
  onOfflineReady: () => {
    // Уведомить пользователя, что приложение готово к работе оффлайн
  }
})

if ('serviceWorker' in navigator) {
  registerSW({
    immediate: true,
    onOfflineReady() {
      console.log("App ready for ofline use")
    }
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
