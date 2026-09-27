#!/usr/bin/env bash
# Install all toolchains: emsdk, wasm-pack, bubblewrap, node deps.
set -euo pipefail
echo "[setup] installing system deps..."
if command -v apt-get >/dev/null; then
  sudo apt-get update && sudo apt-get install -y git curl python3 python3-pip openjdk-17-jdk-headless || true
fi
echo "[setup] installing bubblewrap (PWA->APK)..."
npm install -g @bubblewrap/cli || true
echo "[setup] installing emsdk (WASM)..."
if [ ! -d "$HOME/emsdk" ]; then
  git clone --depth 1 https://github.com/emscripten-core/emsdk.git "$HOME/emsdk" || true
fi
"$HOME/emsdk/emsdk" install latest || true
"$HOME/emsdk/emsdk" activate latest || true
echo "[setup] done. Source $HOME/emsdk/emsdk_env.sh before building."
