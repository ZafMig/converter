/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope

console.log('Service Worker loaded')

self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('Service Worker installing')
  event.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/app.tsx'
      ])
    })
  )
})

self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('Service Worker activating')
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== 'v1') {
            return caches.delete(key)
          }
        })
      )
    })
  )
})

self.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
    })
  )
})