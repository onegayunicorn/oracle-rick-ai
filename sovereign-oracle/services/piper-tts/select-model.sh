#!/bin/sh
set -eu

MODEL_DIR="${MODEL_DIR:-/models}"
RUNTIME_DIR="${RUNTIME_DIR:-/runtime}"
REQUESTED="${RICK_MODEL_VARIANT:-auto}"

mkdir -p "$RUNTIME_DIR"
arch="$(uname -m 2>/dev/null || echo unknown)"
mem_mb="$(awk '/MemTotal:/ {printf "%d", $2/1024; exit}' /proc/meminfo 2>/dev/null || echo 0)"

case "$arch" in
  aarch64|arm64) AUTO_ORDER="int8 fp16 fp32" ;;
  x86_64|amd64) AUTO_ORDER="int8 fp16 fp32" ;;
  *) AUTO_ORDER="int8 fp16 fp32" ;;
esac

find_variant() {
  stem="$1"
  [ -f "$MODEL_DIR/rick_c137.$stem.onnx" ] && {
    printf '%s\n' "$MODEL_DIR/rick_c137.$stem.onnx"
    return 0
  }
  return 1
}

find_base() {
  for f in "$MODEL_DIR/rick_c137.onnx" "$MODEL_DIR/en_US-rick-c137-medium.onnx"; do
    [ -f "$f" ] && { printf '%s\n' "$f"; return 0; }
  done
  return 1
}

MODEL=""
case "$REQUESTED" in
  auto)
    for variant in $AUTO_ORDER; do
      MODEL="$(find_variant "$variant" || true)"
      [ -n "$MODEL" ] && break
    done
    [ -n "$MODEL" ] || MODEL="$(find_base || true)"
    ;;
  int8|fp16|fp32)
    MODEL="$(find_variant "$REQUESTED" || true)"
    if [ -z "$MODEL" ] && [ "$REQUESTED" = "fp32" ]; then
      MODEL="$(find_base || true)"
    fi
    ;;
  base)
    MODEL="$(find_base || true)"
    ;;
  Q4_K_M|Q5_K_M|Q8_0|Q4_0)
    echo "Unsupported legacy variant $REQUESTED: GGUF-style names are not valid Piper ONNX quantization evidence." >&2
    exit 2
    ;;
  *)
    echo "Unsupported RICK_MODEL_VARIANT=$REQUESTED" >&2
    exit 2
    ;;
esac

if [ -z "${MODEL:-}" ] || [ ! -f "$MODEL" ]; then
  echo "No compatible Rick C-137 Piper model found in $MODEL_DIR" >&2
  echo "Expected rick_c137.onnx or rick_c137.{int8,fp16,fp32}.onnx" >&2
  exit 1
fi

CONFIG="${MODEL%.onnx}.onnx.json"
if [ ! -f "$CONFIG" ]; then
  BASE_CONFIG="$MODEL_DIR/rick_c137.onnx.json"
  [ -f "$BASE_CONFIG" ] || {
    echo "Missing Piper config for $MODEL" >&2
    exit 1
  }
  CONFIG="$BASE_CONFIG"
fi

variant="$(basename "$MODEL" | sed 's/^rick_c137\.//; s/\.onnx$//')"
[ "$variant" = "rick_c137" ] && variant="base"

cat > "$RUNTIME_DIR/model.env" <<EOF
RICK_MODEL_PATH=$MODEL
RICK_CONFIG_PATH=$CONFIG
RICK_MODEL_VARIANT=$variant
RICK_HW_ARCH=$arch
RICK_HW_MEM_MB=$mem_mb
EOF

echo "Selected Rick model: $MODEL"
echo "Variant: $variant | arch: $arch | RAM: $mem_mb MB"
