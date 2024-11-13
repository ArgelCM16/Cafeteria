// js/service-worker.js

const CACHE_NAME = 'app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/menu.html',
  '/service.html',
  '/contact.html',
  '/login.html',
  '/css/styles.css', // agrega tu archivo CSS aquí
  '/js/main.js',     // agrega tu archivo JS principal
  '/img/logo.png',   // imágenes o íconos que quieras cachear
];

// Instalar el Service Worker y cachear los recursos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos cacheados');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar las peticiones y responder con los recursos cacheados
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('push', function(event) {
  const data = event.data.json();
  const options = {
      body: data.body,
      icon: '/path-to-icon/icon.png',
  };
  event.waitUntil(
      self.registration.showNotification(data.title, options)
  );
});


