# Sovereign Convert — EXE → PWA → APK Universal Converter

Convert legacy Windows EXE (and other formats) into installable Progressive Web
Apps and signed Android APKs — fully sovereign, no cloud build service required.

## One-Click Setup

### Option 1 — Local (Termux / Linux / macOS)
```bash
chmod +x scripts/*.sh
./scripts/setup.sh        # installs emsdk, wasm-pack, pwabuilder, deps
make all                  # build web UI + PWA template + launch API
```

### Option 2 — Docker
```bash
docker compose up -d --build
# Web UI -> http://localhost:8090
```

## Pipeline
```
Input EXE -> (WASM/emulation wrap) -> PWA (index.html + manifest + sw.js)
        -> (Bubblewrap/PWABuilder) -> signed APK
```

## Layout
```
sovereign-convert/
├── scripts/      setup.sh, build-pwa.sh, build-apk.sh, convert.py, serve-local.sh
├── pwa-template/ index.html, manifest.json, sw.js, js/{dos-runner,converter-ui}.js, icons/
├── web-ui/       index.html (dropzone), app.js, styles.css, config.json, limits.json
├── docs/         EXE-TO-PWA.md, EXE-TO-APK.md, GENERAL-CONVERT.md
├── config/       signing-env.sh.example
├── tests/        test_convert.py
└── .github/workflows/build-apk.yml
```
