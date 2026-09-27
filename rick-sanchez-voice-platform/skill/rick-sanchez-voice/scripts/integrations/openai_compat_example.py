"""Drop-in example: use the FastAPI service as if it were OpenAI's /v1/audio/speech."""
import os
import urllib.request
import json

BASE = os.getenv("TTS_BASE", "http://localhost:8000")

payload = {
    "model": "tts-1",
    "input": "The universe is basically an animal — [laugh] it grazes on the ordinary.",
    "voice": "rick",
    "response_format": "mp3",
}

req = urllib.request.Request(
    f"{BASE}/v1/audio/speech",
    data=json.dumps(payload).encode(),
    headers={"Content-Type": "application/json"},
    method="POST",
)
with urllib.request.urlopen(req) as r, open("openai_style.mp3", "wb") as f:
    f.write(r.read())
print("[OK] wrote openai_style.mp3")
