
// 修正：快取 './' 而不是 '/'，並更新圖示網址
const CACHE_NAME = 'tokyo-trip-v3';
const ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'https://img.icons8.com/color/192/tokyo-tower.png',
  'https://img.icons8.com/color/512/tokyo-tower.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // 使用 cache.addAll 抓取資源，此時 icon 會從 CDN 正常載入
      return cache.addAll(ASSETS);
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

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});
