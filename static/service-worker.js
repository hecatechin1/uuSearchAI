const CACHE_NAME = 'uugpt-pwa-v1.0.2';

const urlsToCache = [
  '/chat',
  '/uugpt_favion-16.png',
  '/uugpt_favion-18.png',
  '/uugpt_favion-32.png',
  '/uugpt_favion-64.png',
  '/uugpt_favion-128.png',
  '/uugpt_favion-192.png',
  '/uugpt_favion-512.png',
  '/favicon.ico'
];
// 安装Service Worker并缓存核心文件
self.addEventListener('install', event => {
  event.waitUntil(
      caches.open(CACHE_NAME)
          .then(cache => {
              console.log('打开缓存');
              return cache.addAll(urlsToCache).catch(err => {
                  console.error('缓存失败:', err);
              });
          })
  );
  self.skipWaiting();
});

// 拦截网络请求，优先使用缓存
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // 排除 api.uugpt.com 的请求
  if (requestUrl.hostname === 'api.uugpt.com') {
      event.respondWith(fetch(event.request));
      return;
  }

  if (requestUrl.pathname.startsWith('/chat') || urlsToCache.includes(requestUrl.pathname)) {
      event.respondWith(
          caches.match(event.request)
              .then(response => {
                  if (response) {
                      return response;
                  }
                  return fetch(event.request)
                      .then(networkResponse => {
                          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                              return networkResponse;
                          }
                          return caches.open(CACHE_NAME).then(cache => {
                              cache.put(event.request, networkResponse.clone());
                              return networkResponse;
                          });
                      })
                      .catch(error => {
                          console.error('Fetch 失败:', error);
                          return caches.match('/chat/index.html');
                      });
              })
      );
  } else {
      event.respondWith(fetch(event.request));
  }
});

// 更新Service Worker并清理旧缓存
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
      caches.keys().then(cacheNames => {
          return Promise.all(
              cacheNames.map(cacheName => {
                  if (!cacheWhitelist.includes(cacheName)) {
                      return caches.delete(cacheName);
                  }
              })
          );
      })
  );
  self.clients.claim(); // 立即控制页面
});

// self.addEventListener('install', (event) => {
//   console.log('------sw install-------');
//   self.skipWaiting();
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       return cache.addAll([
//         '/',
//         '/uugpt_favtion-16.png', // 确保路径包含新图标
//         '/uugpt_favtion-18.png',
//         '/uugpt_favtion-32.png',
//         '/uugpt_favtion-64.png',
//         '/uugpt_favtion-128.png',
//         '/uugpt_favtion-192.png',
//         '/uugpt_favtion-512.png',
//         '/manifest.json'
//       ]);
//     })
//   );
// });

// self.addEventListener('activate', (event) => {
//   console.log('------sw activate-------');
//   self.clients.claim();
//   event.waitUntil(
//     caches.keys().then(cacheNames => {
//       return Promise.all(
//         cacheNames.map(cache => {
//           // 删除非当前版本的缓存
//           if (cache !== CACHE_NAME) {
//             return caches.delete(cache);
//           }
//         })
//       );
//     })
//   );
// });