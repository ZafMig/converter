import { useEffect, useRef, useState } from 'react';
import styles from './InstallButton.module.scss';

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
      console.log(`User ${choiceResult.outcome} install`);
      deferredPrompt.current = null;
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <button className={styles.Button} onClick={handleClick}>
      Install App
    </button>
  );
};
