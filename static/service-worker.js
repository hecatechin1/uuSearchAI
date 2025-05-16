const CACHE_NAME = 'uugpt-pwa-v1.0.0';
self.addEventListener('install', () => {
    self.skipWaiting();
});
  
self.addEventListener('activate', (event) => {
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