// Service worker for Habit Tracker

const CACHE_NAME = 'habit-tracker-v1'

const APP_SHELL = [
  '/',
  '/login',
  '/signup',
  '/dashboard',
  '/manifest.json',
]


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL).catch((err) => {
        console.warn('[SW] Failed to cache some shell resources:', err)
      })
    })
  )
  self.skipWaiting()
})


self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})


self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        fetch(event.request)
          .then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone()
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
            }
            return response
          })
          .catch(() => cached)

        return cached
      }

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === 'opaque') {
            return response
          }
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
          return response
        })
        .catch(() => {
          if (event.request.destination === 'document') {
            return caches.match('/')
          }
        })
    })
  )
})
