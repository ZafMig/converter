import { registerSW } from 'virtual:pwa-register';

type SWRegistrationOptions = {
  onNeedRefresh?: () => void
  onOfflineReady?: () => void
  onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void
  onRegisterError?: (error: any) => void
}

export function initializePWA(options?: SWRegistrationOptions): () => void {
  if ('serviceWorker' in navigator) {
    return registerSW({
      onNeedRefresh() {
        console.log('New content available')
        options?.onNeedRefresh?.()
      },
      onOfflineReady() {
        console.log('App ready for offline use')
        options?.onOfflineReady?.()
      },
      onRegistered(registration) {
        console.log('Service Worker registered')
        options?.onRegistered?.(registration)
      },
      onRegisterError(error) {
        console.error('Service Worker registration error', error)
        options?.onRegisterError?.(error)
      }
    })
  }

  return () => {}
}