const CACHE_NAME = 'my-site-cache-v01';
const urlsToCache = [
  './favicon.ico',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', () => {
  console.log('Service Worker installed (no caching)');
});

self.addEventListener('fetch', event => {
  // 不攔截任何請求，讓瀏覽器直接處理
});
