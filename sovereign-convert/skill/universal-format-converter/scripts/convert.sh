#!/usr/bin/env bash
# Skill entrypoint: convert <input> <format>
set -euo pipefail
INPUT="${1:?input file required}"
FORMAT="${2:-pwa}"
python3 "$(dirname "$0")/../../scripts/convert.py" --input "$INPUT" --format "$FORMAT"
