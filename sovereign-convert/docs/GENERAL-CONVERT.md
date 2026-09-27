# General Conversion Formats

The engine is format-agnostic: anything that can be served as a static web app
(HTML/JS/WASM) can become a PWA and then an APK. Supported inputs: .exe, .msi,
.bat, .cmd, .sh, .html, .zip. For non-web binaries, the emulation bridge
(js-dos / WASM) provides runtime execution inside the PWA.
