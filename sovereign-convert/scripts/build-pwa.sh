#!/usr/bin/env bash
# EXE -> PWA: wrap a binary in the PWA template with a DOS/WASM runner.
set -euo pipefail
INPUT="${1:?usage: build-pwa.sh <input.exe> <output-dir>}"
OUTDIR="${2:?output dir required}"
mkdir -p "$OUTDIR"
cp -r pwa-template/* "$OUTDIR/"
cp "$INPUT" "$OUTDIR/assets/app.bin"
cat > "$OUTDIR/manifest.json" <<EOF
{
  "name": "$(basename "$INPUT" .exe)",
  "short_name": "$(basename "$INPUT" .exe)",
  "start_url": "./index.html",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#22d3ee",
  "icons": [
    {"src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png"},
    {"src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png"}
  ]
}
EOF
echo "[build-pwa] PWA written to $OUTDIR"
