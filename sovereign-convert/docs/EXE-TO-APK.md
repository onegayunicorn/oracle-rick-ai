# PWA → APK Blueprint

## Option A — PWABuilder (fast, 5 mins)
1. Serve the PWA (or push live).
2. pwabuilder.com -> enter URL -> Build Package.
3. Download signed APK / AAB.
4. `adb install OfflineAI.apk` or sideload.

## Option B — Bubblewrap CLI (sovereign local build)
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://your-domain/manifest.json
bubblewrap build   # produces signed APK using your keystore
```
Signing config: `config/signing-env.sh.example`.
