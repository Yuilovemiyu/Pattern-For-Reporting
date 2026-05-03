const CACHE_NAME = "report-v1"; // change this when you want to force refresh

const ASSETS = [
  "/",
  "/index.html",
  "/manifest.json"
];

// INSTALL → cache files + skip waiting
self.addEventListener("install", event => {
  self.skipWaiting(); // 🔥 activate immediately

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// ACTIVATE → delete old caches + take control
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim(); // 🔥 take control immediately
});

// FETCH → network first, fallback to cache
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(res => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, res.clone()); // update cache
          return res;
        });
      })
      .catch(() => caches.match(event.request))
  );
});
