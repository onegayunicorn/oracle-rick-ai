# APK Analysis Notes (Source Material Attribution)

When reverse-engineering an APK to repackage as PWA/PAF:
1. `apktool d app.apk` -> smali + resources + AndroidManifest.
2. Extract `assets/` + `res/raw/` for web payloads (Cordova/Capacitor apps).
3. Identify entry activity -> map to PWA start_url.
4. Re-sign with your own keystore before redistribution.
All repackaged material must respect the original license.
