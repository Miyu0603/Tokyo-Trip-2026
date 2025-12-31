// 清空資源列表，避免快取不存在的檔案導致 404
const CACHE_NAME = 'tokyo-trip-reset';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // 清除舊的所有快取
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map(key => caches.delete(key))
      );
    })
  );
});

// 不攔截任何請求，直接讓瀏覽器去網路抓取最新的檔案
self.addEventListener('fetch', (event) => {
  return;
});