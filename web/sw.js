// Minimaler Service-Worker: macht die Seite installierbar (echte App-Verknüpfung / WebAPK)
// Strategie: network-first für gleiche Herkunft -> immer aktuelle Version,
// Cache nur als Offline-Fallback. Fremde CDNs (Three.js/Manifold) laufen normal durch.

const CACHE = 'wcd-v3';
const CORE = ['/', '/index.html', '/css/style.css', '/site.webmanifest', '/wc-mark.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(CORE)).catch(() => {}).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // CDNs normal laden lassen

  e.respondWith(
    fetch(req)
      .then((res) => {
        // aktuelle Antwort für Offline zwischenspeichern
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() =>
        caches.match(req).then((m) => m || caches.match('/index.html'))
      )
  );
});
