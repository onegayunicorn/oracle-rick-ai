#!/usr/bin/env bash
# PWA -> APK via Bubblewrap (local sovereign build).
set -euo pipefail
PWADIR="${1:?usage: build-apk.sh <pwa-dir>}"
cd "$PWADIR"
# Serve the PWA locally so bubblewrap can read the manifest.
python3 -m http.server 8091 &
SERVER_PID=$!
trap "kill $SERVER_PID" EXIT
sleep 1
if command -v bubblewrap >/dev/null; then
  bubblewrap init --manifest "http://localhost:8091/manifest.json" --directory . || true
  bubblewrap build || echo "[build-apk] bubblewrap build skipped (signing not configured)"
else
  echo "[build-apk] bubblewrap not installed. Run scripts/setup.sh first."
  echo "[build-apk] Alternative: upload PWA to pwabuilder.com -> Build Package -> download APK."
fi
