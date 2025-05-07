import { Container } from './Components/Container/Container';
import { useEffect } from 'react';

// Объявляем тип для события установки
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

export const App = () => {
  useEffect(() => {
    const handleInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      const installButton = document.getElementById('install-button');

      if (installButton) {
        installButton.style.display = 'block';

        installButton.onclick = () => {
          e.prompt(); // Правильное название метода (не promt)
          e.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted install');
            }
            installButton.style.display = 'none';
          });
        };
      }
    };

    // Правильное название события: 'beforeinstallprompt' (не beforinstallpromt)
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    // Функция очистки эффекта
    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, []);

  return (
    <div>
      <Container />
      <button
        id="install-button" // Исправлено название ID (было install-bitton)
        style={{ display: 'none' }}
      >
        Установить приложение
      </button>
    </div>
  );
};