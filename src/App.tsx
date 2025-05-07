import { Container } from './Components/Container/Container';
import { useEffect, useRef } from 'react';

// Расширяем глобальный интерфейс Window
declare global {
  interface Window {
    onbeforeinstallprompt?: (e: BeforeInstallPromptEvent) => void;
  }
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

export const App = () => {
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleInstallPrompt = (e: Event) => {
      e.preventDefault();
      // Сохраняем событие для использования позже
      deferredPrompt.current = e as BeforeInstallPromptEvent;

      const installButton = document.getElementById('install-button');
      if (installButton) {
        installButton.style.display = 'block';
      }
    };

    const installButton = document.getElementById('install-button');
    const clickHandler = () => {
      if (deferredPrompt.current) {
        deferredPrompt.current.prompt();
        deferredPrompt.current.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted install');
          }
          deferredPrompt.current = null;
        });
      }
      const button = document.getElementById('install-button');
      if (button) {
        button.style.display = 'none';
      }
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    installButton?.addEventListener('click', clickHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      installButton?.removeEventListener('click', clickHandler);
    };
  }, []);

  return (
    <div>
      <Container />
      <button
        id="install-button"
        style={{ display: 'none' }}
      >
        Установить приложение
      </button>
    </div>
  );
};