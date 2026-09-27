#!/usr/bin/env bash
# Fish Audio TTS via curl. Set FISH_API_KEY first.
set -euo pipefail

: "${FISH_API_KEY:?export FISH_API_KEY=sk-...}"

# 1. Basic synthesis
curl -sS -X POST https://api.fish.audio/v1/tts \
  -H "Authorization: Bearer ${FISH_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"text":"Wubba lubba dub dub! [laugh]","voice_id":"d2e75a3e3fd6419893057c02a375a113","model":"s2.1-pro-free","response_format":"mp3"}' \
  -o rick.mp3
echo "[OK] wrote rick.mp3"

# 2. List voices
curl -sS https://api.fish.audio/v1/voices -H "Authorization: Bearer ${FISH_API_KEY}" | head -c 500
echo
