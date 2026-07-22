/// <reference lib="webworker" />
import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'

declare const self: ServiceWorkerGlobalScope
declare const __SW_BUILD__: string

clientsClaim()
cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('install', () => {
  console.log('[SW] build', __SW_BUILD__)
  self.skipWaiting()
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.addEventListener('push', (event) => {
  let data: { title: string; body: string } = {
    title: '🏔️ Renfo Trail',
    body: "C'est l'heure de s'entraîner !",
  }
  try {
    data = event.data?.json() ?? data
  } catch {
    // keep default
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: 'workout-reminder',
      data: { url: '/' },
    } as NotificationOptions)
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((c) => 'focus' in c)
      return existing ? existing.focus() : self.clients.openWindow('/')
    })
  )
})
