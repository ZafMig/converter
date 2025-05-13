// src/Components/InstallButton/InstallButton.tsx
import { useEffect, useRef, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

export const InstallButton = () => {
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleClick = async () => {
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt();
      const choiceResult = await deferredPrompt.current.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted install');
      } else {
        console.log('User dismissed install');
      }
      deferredPrompt.current = null;
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <button onClick={handleClick} style={{ display: 'block' }}>
      Установить приложение
    </button>
  );
};
