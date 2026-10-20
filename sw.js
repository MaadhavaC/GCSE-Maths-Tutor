// Service worker for the Maths Hint Ladder.
// It saves the app's files the first time it loads, so the app still works with no internet.
//
// How it fetches:
//   app files (same site)   use the saved copy straight away, and fetch a fresh one in the
//                           background for next time
//   pages (navigation)      try the network first, and fall back to the saved page offline
//   Google Fonts            saved the first time they load, then used from the save
//
// When you change any app file, change VERSION so everyone gets the new files.

const VERSION = 'v31';
const CACHE = 'hint-ladder-' + VERSION;

const APP_FILES = [
  './',
  'index.html',
  'maths.js',
  'topics/number.js',
  'topics/algebra.js',
  'topics/ratio.js',
  'topics/geometry.js',
  'topics/stats.js',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  // Save each file on its own, so one missing file doesn't stop the rest being saved
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => Promise.all(APP_FILES.map(f => cache.add(f).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  // Delete saves from older versions
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('hint-ladder-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isFont(url) {
  return url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
}

// Save a response if it's a good one. Fonts from another site come back "opaque", which is fine to save.
function keep(request, response) {
  if (response && (response.ok || response.type === 'opaque')) {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(request, copy));
  }
  return response;
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => keep(request, response))
        .catch(() => caches.match(request, { ignoreSearch: true })
          .then(hit => hit || caches.match('index.html'))
          .then(hit => hit || caches.match('./')))
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request, { ignoreSearch: true }).then(hit => {
        const fresh = fetch(request).then(response => keep(request, response));
        if (hit) { fresh.catch(() => {}); return hit; }
        return fresh;
      })
    );
    return;
  }

  if (isFont(url)) {
    event.respondWith(
      caches.match(request).then(hit => hit || fetch(request).then(response => keep(request, response)))
    );
  }
});
