const CACHE_NAME = 'uugpt-pwa-v1.0.2';
self.addEventListener('install', (event) => {
  console.log('------sw install-------');
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/uugpt_favtion-16.png', // 确保路径包含新图标
        '/uugpt_favtion-18.png',
        '/uugpt_favtion-32.png',
        '/uugpt_favtion-64.png',
        '/uugpt_favtion-128.png',
        '/uugpt_favtion-192.png',
        '/uugpt_favtion-512.png',
        '/manifest.json'
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('------sw activate-------');
  self.clients.claim();
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          // 删除非当前版本的缓存
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});