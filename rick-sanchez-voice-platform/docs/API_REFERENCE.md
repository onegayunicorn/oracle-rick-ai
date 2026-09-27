# API Reference

## Orchestrator (port 8002)
- GET  /api/v1/health
- POST /api/v1/synthesize  {text, voice_id?, model?, response_format?} -> SynthesisJob
- GET  /api/v1/jobs/{job_id} -> SynthesisJob (pending|running|completed|failed)
- GET  /api/v1/jobs/{job_id}/download -> audio/mpeg
- POST /api/v1/modules/generate {name, voice_id, persona_name, language: python|node, ...} -> application/gzip

## FastAPI TTS (port 8000)
- GET  /health
- POST /v1/tts {text, ...} -> audio/mpeg
- POST /v1/audio/speech {model, input, voice, response_format} -> OpenAI-compatible

## Emotion tags (inline in text)
[whisper] [laugh] [excited] [angry] [pause] [gasp] [sigh] [shouting] [burp]
