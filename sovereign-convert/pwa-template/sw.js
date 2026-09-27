const CACHE = 'converted-app-v1';
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll([
    './', './index.html', './manifest.json',
    './js/dos-runner.js', './js/converter-ui.js'
  ])));
});
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
