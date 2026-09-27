#!/usr/bin/env bash
# Quickstart: synthesize via curl against the local FastAPI service.
set -euo pipefail
curl -sS -X POST http://localhost:8000/v1/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"GRASSSSS... tastes bad!","response_format":"mp3"}' \
  -o quickstart.mp3
echo "[OK] wrote quickstart.mp3"
