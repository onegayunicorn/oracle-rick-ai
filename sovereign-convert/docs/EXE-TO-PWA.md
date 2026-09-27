# EXE → PWA Blueprint

1. Place the EXE at `examples/sample-app.exe`.
2. `./scripts/build-pwa.sh examples/sample-app.exe builds/myapp`.
3. The PWA template wraps it: `index.html` + `manifest.json` + `sw.js` +
   `js/dos-runner.js` (emulation bridge) + `assets/app.bin`.
4. Serve over HTTPS (or localhost) -> "Add to Home Screen" installs it.

For native performance, recompile C/C++ sources with Emscripten to WASM instead
of emulating the EXE.
