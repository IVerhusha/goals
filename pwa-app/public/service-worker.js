const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/src/main.tsx',
    '/src/App.tsx',
    '/src/index.css', // сюда можно добавить другие необходимые ресурсы
];

// Установка Service Worker и кэширование ресурсов
self.addEventListener('install', (event) => {
    event.waitUntil(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting(); // активация сразу после установки
});

// Активация и удаление старого кэша
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                        cacheNames.map((cacheName) => {
                            if (!cacheWhitelist.includes(cacheName)) {
                                return caches.delete(cacheName);
                            }
                        })
                );
            })
    );
});

// Перехват сетевых запросов и работа с кэшем
self.addEventListener('fetch', (event) => {
    event.respondWith(
            fetch(event.request)
            .then((response) => {
                // Успешный сетевой запрос: добавляем его в кэш
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            })
            .catch(() => {
                // Сеть недоступна: используем данные из кэша
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        // Если ресурс найден в кэше, возвращаем его
                        self.clients.matchAll().then((clients) => {
                            clients.forEach((client) => {
                                client.postMessage({ type: 'CACHED' });
                            });
                        });
                        return cachedResponse;
                    }
                    return caches.match('/index.html'); // fallback на главную страницу
                });
            })
    );
});
