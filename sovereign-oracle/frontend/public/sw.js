// Service worker: cache WebLLM model weights + app shell for full offline use.
const MODEL_CACHE = 'webllm-models-v1';
const APP_CACHE = 'oracle-app-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(APP_CACHE).then((c) => c.addAll(['/', '/index.html', '/manifest.json'])));
});

self.addEventListener('fetch', (e) => {
  const url = e.request.url;
  if (url.includes('web-llm/dist/') || url.endsWith('.bin') || url.endsWith('.ndjson')) {
    e.respondWith(
      caches.match(e.request).then((r) => r || fetch(e.request).then((res) => {
        caches.open(MODEL_CACHE).then((c) => c.put(e.request, res.clone()));
        return res;
      }))
    );
    return;
  }
  if (e.request.mode === 'navigate') {
    e.respondWith(caches.match('/index.html').then((r) => r || fetch(e.request)));
  }
});
