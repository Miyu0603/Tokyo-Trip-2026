// 版本號變更會觸發更新
const CACHE_NAME = 'tokyo-trip-reset-v2';

self.addEventListener('install', (event) => {
  // 跳過等待，立即接管
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // 清除瀏覽器內所有舊的快取空間
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map(key => {
          console.log('Clearing old cache:', key);
          return caches.delete(key);
        })
      );
    }).then(() => {
      // 立即取得頁面控制權
      return self.clients.claim();
    })
  );
});

// 不攔截請求，確保所有檔案都從網路獲取最新版本
self.addEventListener('fetch', (event) => {
  return;
});
