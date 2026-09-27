import io
import os
import wave
import subprocess
from fastapi import FastAPI, HTTPException, Response
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

app = FastAPI(title="Sovereign Piper TTS - Rick C-137 Engine")
MODEL_PATH = os.getenv("PIPER_MODEL", "/app/models/rick_c137.onnx")
CONFIG_PATH = os.getenv("PIPER_CONFIG", "/app/models/rick_c137.onnx.json")


class SynthesisRequest(BaseModel):
    text: str
    length_scale: float = 1.05  # Slight speed adjustment for Rick cadence
    noise_scale: float = 0.667   # Expressiveness / raspiness
    noise_w: float = 0.8


@app.get("/healthz")
def healthz():
    return {"status": "ok", "engine": "piper-onnx", "model": os.path.basename(MODEL_PATH)}


@app.post("/v1/audio/speech")
def synthesize_speech(req: SynthesisRequest):
    """Generates WAV audio buffer from input text using the offline Piper binary."""
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    cmd = [
        "piper",
        "--model", MODEL_PATH,
        "--config", CONFIG_PATH,
        "--output-raw",
        "--length_scale", str(req.length_scale),
        "--noise_scale", str(req.noise_scale),
        "--noise_w", str(req.noise_w),
    ]
    try:
        proc = subprocess.Popen(
            cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        raw_pcm, stderr = proc.communicate(input=req.text.encode("utf-8"))
        if proc.returncode != 0:
            raise HTTPException(status_code=500, detail=f"Piper error: {stderr.decode()}")
        wav_buffer = io.BytesIO()
        with wave.open(wav_buffer, "wb") as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)
            wav_file.setframerate(22050)
            wav_file.writeframes(raw_pcm)
        return Response(content=wav_buffer.getvalue(), media_type="audio/wav")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/v1/audio/stream")
def stream_speech(req: SynthesisRequest):
    """Chunked streaming response for low-latency playback."""
    cmd = ["piper", "--model", MODEL_PATH, "--config", CONFIG_PATH, "--output-raw"]
    proc = subprocess.Popen(
        cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )
    proc.stdin.write(req.text.encode("utf-8"))
    proc.stdin.close()

    def iter_pcm():
        while True:
            chunk = proc.stdout.read(4096)
            if not chunk:
                break
            yield chunk

    return StreamingResponse(iter_pcm(), media_type="audio/x-raw-pcm")
