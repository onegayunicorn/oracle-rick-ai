# Unified Voice Contract — `/v1/speech`

All TTS backends implement the same `VoiceProvider` interface. Clients never call provider-specific URLs.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/v1/speech` | Synthesise speech → audio bytes |
| `POST` | `/v1/audio/speech` | OpenAI-compatible alias |
| `GET`  | `/v1/voice/capabilities` | List providers + availability |
| `GET`  | `/v1/voice/info` | Active provider + health |

## Request

```json
{
  "input": "Morty, we gotta go — now!",
  "model": "rick-c137",
  "response_format": "wav",
  "speed": 1.0,
  "emotion": "rant",
  "burp_prob": 0.08,
  "variant": "Q4_K_M"
}
```

Also accepts legacy `{ "text": "..." }` for Piper compatibility.

## Response

- **200** — raw audio body (`audio/wav`, `audio/mpeg`, …)
  - Headers: `X-Voice-Provider`, `X-Voice-Latency-Ms`, `X-Voice-Model`
- **503** — no server provider available  
  ```json
  { "error": "...", "fallback": "browser", "hint": "Use window.speechSynthesis" }
  ```

## Provider selection (server)

1. Explicit `provider` field (if available and not `browser`)
2. Piper local ONNX (if `/healthz` on piper-tts is up)
3. Future: Coqui → Fish → xAI
4. Browser is **never** selected server-side — clients fall back on 503

## Client graceful degradation

```
POST /v1/speech
  ├─ 200 → play audio bytes
  └─ 503 → speakBrowser(text)   // Web Speech API
```

## Files

```
sovereign-oracle/backend/src/voice/
├── contract.ts           # SpeechRequest, VoiceProvider, …
├── index.ts              # registry + speak() + voiceHealth()
├── http-handler.ts       # route handlers for plain http server
└── providers/
    ├── piper.ts          # local ONNX adapter
    └── browser.ts        # client-side marker + snippet
```

## Env

```
PIPER_URL=http://piper-tts:8000   # default
```
