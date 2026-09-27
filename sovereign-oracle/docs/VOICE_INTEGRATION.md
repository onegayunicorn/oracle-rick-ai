# Piper → Personality DSP → `/v1/speech`

## Format (Piper)

| Property | Value |
|----------|-------|
| Channels | mono |
| Sample rate | 22050 Hz |
| Bit depth | 16-bit PCM WAV |
| Artifacts | `rick_c137.onnx` **+** `rick_c137.onnx.json` |

**Not** Piper formats: `Q4_K_M`, `Q5_K_M`, `Q8_0` (GGUF/LLM quant labels).  
Verified voice quant path: **FP32 → ORT INT8 / FP16** only after load + audio checks.

## Request

```json
{
  "input": "Wubba lubba dub dub!",
  "emotion": "drunk",
  "burp_prob": 0.12,
  "seed": 42,
  "rawOnly": false
}
```

- `rawOnly: true` → unmodified Piper WAV (A/B branch)
- DSP failure → **fail-open**: clean Piper WAV, headers `X-Fallback: true`
- Piper down → **503** + browser fallback hint

## Response headers

| Header | Meaning |
|--------|---------|
| `X-Voice-Provider` | `piper` |
| `X-Personality-Applied` | emotion or `none` |
| `X-Fallback` | `true` if DSP skipped/failed |
| `X-Sample-Rate` | `22050` |
| `X-Channels` | `1` |

## Env

```
PIPER_URL=http://piper-tts:8000
PIPER_MODEL=/app/models/rick_c137.onnx
PIPER_CONFIG=/app/models/rick_c137.onnx.json
PROSODY_PYTHON=python3
PROSODY_PATH=/app/services/voice-prosody
PROSODY_MODULE=prosody.apply
```

## Curl

```bash
curl -X POST http://localhost:3000/v1/speech \
  -H 'Content-Type: application/json' \
  -d '{"input":"Wubba lubba dub dub!","emotion":"drunk","seed":42}' \
  -o drunk.wav

curl -X POST http://localhost:3000/v1/speech \
  -H 'Content-Type: application/json' \
  -d '{"input":"Wubba lubba dub dub!","rawOnly":true}' \
  -o raw.wav
```

## Gates

| Gate | Status |
|------|--------|
| Piper format documented | ✅ |
| No fake Q* labels | ✅ |
| DSP fail-open | ✅ |
| `rawOnly` A/B | ✅ |
| Fixture tests (no model) | ✅ |
| Trained `rick_c137.onnx` | ⏳ |
| E2E real model | ⏳ |
| INT8/FP16 after E2E | ⏳ |
