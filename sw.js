// Service worker: a small helper the browser runs in the background.
// It saves a copy of the app's files the first time you open it, so the app
// still works with no internet (on a bus, or with Wi-Fi turned off).
//
// When you change any app file, increase VERSION so phones fetch the new files.

const VERSION = 'hint-ladder-v3';

const APP_FILES = [
  './',
  './index.html',
  './maths.js',
  './topics/number.js',
  './topics/algebra.js',
  './topics/ratio.js',
  './topics/geometry.js',
  './topics/stats.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

// First visit: save all the app files
self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(APP_FILES)).then(() => self.skipWaiting()));
});

// New version: delete the old saved copies
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Every request: answer from the saved copy straight away, and quietly fetch a
// fresh copy in the background for next time ("stale while revalidate").
// Fonts from Google are saved the same way once they've loaded.
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const ours = url.origin === self.location.origin;
  const fonts = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!ours && !fonts) return;

  event.respondWith(
    caches.open(VERSION).then(cache =>
      cache.match(request, { ignoreSearch: ours }).then(saved => {
        const fresh = fetch(request).then(response => {
          if (response.ok || response.type === 'opaque') cache.put(request, response.clone());
          return response;
        }).catch(() => saved || (request.mode === 'navigate' ? cache.match('./index.html') : undefined));
        return saved || fresh;
      })
    )
  );
});
