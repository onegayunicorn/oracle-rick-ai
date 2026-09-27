const APP_CACHE = 'offline-dashboard-v1';
const MODEL_CACHE = 'webllm-models-v1';
self.addEventListener('install', (e) => e.waitUntil(caches.open(APP_CACHE).then(c => c.addAll(['/', '/index.html', '/manifest.json']))));
self.addEventListener('fetch', (e) => {
  const u = e.request.url;
  if (u.includes('web-llm/dist/') || u.endsWith('.bin') || u.endsWith('.ndjson')) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { caches.open(MODEL_CACHE).then(c => c.put(e.request, res.clone())); return res; })));
    return;
  }
  if (e.request.mode === 'navigate') e.respondWith(caches.match('/index.html').then(r => r || fetch(e.request)));
});
