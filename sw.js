/* Dompet Rantau — Service Worker v3.15.0 */
const CACHE = 'dr-static-v3.15.0';
const ASSETS = ['./index.html', './manifest.json', './icon.svg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.pathname.endsWith('version.json')) { e.respondWith(fetch(e.request, { cache: 'no-store' }).catch(() => Response.error())); return; }
  if (e.request.mode === 'navigate') { e.respondWith((async () => { try { const res = await fetch(e.request); if (res.ok) { const c = await caches.open(CACHE); c.put('./index.html', res.clone()); } return res; } catch (err) { return (await caches.match('./index.html')) || Response.error(); } })()); return; }
  if (url.origin === location.origin || /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) { e.respondWith((async () => { const cache = await caches.open(CACHE); const hit = await cache.match(e.request); const refresh = fetch(e.request).then(res => { if (res.ok) cache.put(e.request, res.clone()); return res; }).catch(() => null); return hit || (await refresh) || Response.error(); })()); }
});