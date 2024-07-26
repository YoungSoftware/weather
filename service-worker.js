self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('weather-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/icon.png',
        // Add other assets you want to cache
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
