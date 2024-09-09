const CACHE_NAME = 'offline-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/style.css', // Подключите свои файлы CSS и JS
];

// Устанавливаем Service Worker и кешируем необходимые ресурсы
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Обновляем кеш при активации нового Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

// Обрабатываем запросы: ищем в кеше, если не найдено — грузим из сети
self.addEventListener('fetch', (event) => {
    const requestURL = new URL(event.request.url);

    // Обрабатываем только HTML-документы (обычно запросы на корневые страницы)
    if (requestURL.pathname === '/' || event.request.headers.get('accept').includes('text/html')) {
        event.respondWith(
                fetch(event.request).catch(() => caches.match('/offline.html'))  // Возвращаем offline.html только для HTML
        );
    } else {
        // Для других запросов (например, для JS или CSS) ищем в кеше или загружаем из сети
        event.respondWith(
                caches.match(event.request).then((cachedResponse) => {
                    return cachedResponse || fetch(event.request);
                })
        );
    }
});
