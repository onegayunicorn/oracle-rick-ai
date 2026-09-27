# Sovereign Offline AI Dashboard — PWA / Live Dashboard / APK

A fully offline AI dashboard PWA: WebLLM (Llama-3 via WebGPU) with model-cache,
multi-tab live dashboard, IndexedDB storage, conversation history, and APK
packaging via Bubblewrap/PWABuilder. Zero cloud calls after first model download.

## Quick Start
```bash
npm install && npm run dev      # http://localhost:5173
npm run build                   # -> dist/ (static, deploy anywhere)
# APK: npx @bubblewrap/cli init --manifest https://your-host/manifest.json && bubblewrap build
```

## Layout
```
sovereign-offline-dashboard/
├── src/ main.ts, db.ts, store.ts, proxy.ts, render.ts, marker.ts, tabs.ts,
│       layout.css, webllm/{config,engine,context}.ts,
│       dashboard/, ui/, storage/, preview/, model-cache/
├── functions/proxy.js   (Cloudflare proxy, optional)
├── public/ manifest.json, service-worker.js, icons/
└── .github/workflows/ build-apk.yml
```
