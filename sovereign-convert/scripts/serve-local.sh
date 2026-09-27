#!/usr/bin/env bash
# Local dev server with HTTPS-ready config (mkcert recommended for PWA install).
set -euo pipefail
PORT="${PORT:-8090}"
echo "[serve] Web UI -> http://localhost:$PORT"
cd web-ui && python3 -m http.server "$PORT"
