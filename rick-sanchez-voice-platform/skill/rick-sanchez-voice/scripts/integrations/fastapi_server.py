"""Standalone FastAPI TTS service + OpenAI-compatible endpoint."""
import os
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List

try:
    from fish_voice import FishVoiceClient
except ImportError:
    FishVoiceClient = None

app = FastAPI(title="Rick TTS Service", version="1.0.0")

_client = None


def client():
    global _client
    if FishVoiceClient is None:
        raise HTTPException(503, "fish_voice not installed")
    if _client is None:
        _client = FishVoiceClient()
    return _client


class TTSRequest(BaseModel):
    text: str
    voice_id: Optional[str] = None
    model: Optional[str] = None
    response_format: str = "mp3"


class OpenAIMessage(BaseModel):
    role: str
    content: str


class OpenAIRequest(BaseModel):
    model: str = "tts-1"
    input: str
    voice: str = "rick"
    response_format: str = "mp3"


@app.get("/health")
async def health():
    return {"status": "ok", "model": os.getenv("FISH_MODEL", "s2.1-pro-free")}


@app.post("/v1/tts")
async def tts(req: TTSRequest):
    audio = client().synthesize(
        req.text, voice_id=req.voice_id, model=req.model,
        response_format=req.response_format,
    )
    return StreamingResponse(iter([audio]), media_type="audio/mpeg")


# OpenAI-compatible endpoint (drop-in for openai python SDK / elevenlabs-style clients)
@app.post("/v1/audio/speech")
async def openai_speech(req: OpenAIRequest):
    voice_map = {"rick": "d2e75a3e3fd6419893057c02a375a113"}
    vid = voice_map.get(req.voice, req.voice)
    audio = client().synthesize(req.input, voice_id=vid, response_format=req.response_format)
    return StreamingResponse(iter([audio]), media_type="audio/mpeg")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=os.getenv("HOST", "0.0.0.0"), port=int(os.getenv("PORT", "8000")))
