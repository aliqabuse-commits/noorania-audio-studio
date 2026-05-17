// ================================
// service-worker.js
// غرفة العمليات الصوتية — التخزين المؤقت للتطبيق
// ================================


// تغيير الاسم مهم حتى يجبر المتصفح على تحميل النسخة الجديدة
const CACHE_NAME = "noorania-audio-studio-v3-genome-lab";


// الملفات الأساسية التي يعمل بها تطبيق غرفة العمليات الصوتية
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/style.css",

  "/recording-manifest.js",
  "/storage.js",
  "/audio-lab.js",
  "/app.js",

  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];


// =====================================
// 1️⃣ تثبيت الكاش
// =====================================

self.addEventListener("install", function (event) {

  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();

});


// =====================================
// 2️⃣ تفعيل النسخة الجديدة
// =====================================

self.addEventListener("activate", function (event) {

  event.waitUntil(
    caches.keys().then(function (keys) {

      return Promise.all(
        keys.map(function (key) {

          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }

        })
      );

    })
  );

  self.clients.claim();

});


// =====================================
// 3️⃣ جلب الملفات من الكاش أو الشبكة
// =====================================

self.addEventListener("fetch", function (event) {

  event.respondWith(
    caches.match(event.request).then(function (response) {

      return response || fetch(event.request);

    })
  );

});
