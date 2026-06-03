// ================================
// service-worker.js
// غرفة العمليات الصوتية — نسخة تطوير
// تمنع الكاش من تعطيل التحديثات
// ================================

const CACHE_NAME = "noorania-dev-cache-20260603-2";

self.addEventListener("install", function (event) {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          return caches.delete(key);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request);
    })
  );
});
