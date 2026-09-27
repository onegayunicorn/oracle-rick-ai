# Fish Audio API Reference

Base: `https://api.fish.audio`

## POST /v1/tts
Headers: `Authorization: Bearer <KEY>`, `Content-Type: application/json`
Body:
```json
{
  "text": "Hello [laugh] world",
  "voice_id": "d2e75a3e3fd6419893057c02a375a113",
  "model": "s2.1-pro-free",
  "response_format": "mp3"
}
```
Response: audio bytes (mp3/wav/ogg).

## WebSocket Streaming (wss)
Endpoint: `wss://api.fish.audio/v1/tts/live`
Events:
- `tts.packet` -> audio chunk (base64)
- `tts.gap` -> silence marker
- `tts.end` -> stream complete
- `error` -> `{ message, code }`

## Models
| model | cost | notes |
|---|---|---|
| s2.1-pro-free | free | dev / low volume |
| s2.1-pro | $15 / 1M bytes | production, TTFA/DPA guarantee |

1M bytes ~= 180,000 words ~= 12 hours of speech.
