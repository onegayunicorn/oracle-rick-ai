# Rick C-137 Voice API

The canonical voice path is the Oracle backend:

    POST /v1/speech
    GET  /v1/voice/capabilities
    GET  /v1/voice/info

## Curl smoke test

    curl -X POST http://localhost:3000/v1/speech       -H 'Content-Type: application/json'       -d '{"input":"Morty, we gotta go — now!","model":"rick-c137","response_format":"wav"}'       --output rick.wav

Inspect provider metadata:

    curl -i http://localhost:3000/v1/speech       -H 'Content-Type: application/json'       -d '{"input":"Portal stable.","response_format":"wav"}'

A successful response includes:
- Content-Type: audio/wav
- X-Voice-Provider
- X-Voice-Latency-Ms
- X-Voice-Model

If no server-side provider is available, the endpoint returns HTTP 503 with
fallback=browser. The client then uses Web Speech API speechSynthesis.

## Browser fallback

Web Speech is a presentation-layer fallback, not a server provider:

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance("Portal stable.");
    utterance.lang = "en-US";
    utterance.rate = 1.08;
    utterance.pitch = 0.8;
    synth.cancel();
    synth.speak(utterance);

The browser implementation waits for the device voice list when necessary and
selects an English voice where available.

## Offline guarantee

For an air-gapped deployment the intended order is:

    Oracle /v1/speech
      -> Piper ONNX
      -> browser Web Speech (UI only)

The Rick UI may optionally use XAI TTS when ORACLE_VOICE_URL is absent or the
Oracle voice service fails. To make the UI Oracle-first, set:

    ORACLE_VOICE_URL=http://<oracle-host>:3000

No API key is required for the local Oracle/Piper path.

## Quantization evidence

Do not call Piper variants Q4_K_M or Q8_0 unless the exact model/runtime
proves those formats. The current implementation uses explicit ONNX variants:
fp32, fp16, and int8.

Quantized candidates are promoted only after ONNX validation, Piper synthesis,
audio-quality comparison, and real ARM64/x86_64 benchmark evidence.
