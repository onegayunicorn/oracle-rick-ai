# Rick C-137 Audio Personality Engine

Post-Piper DSP layer that turns neutral TTS into Rick-specific delivery.

## Pipeline

```
Piper ONNX (22050 Hz mono)
        │
        ▼
 time_stretch  (cadence)
        │
        ▼
 pitch_shift   (F0)
        │
        ▼
 formant_shift (vocal tract — independent of pitch)
        │
        ▼
 volume + optional pitch wobble
        │
        ▼
 burp_injector (optional)
        │
        ▼
 /v1/speech response
```

## Emotion → parameters

| Emotion   | Cadence | Pitch (st) | Formant | Notes              |
|-----------|---------|------------|---------|--------------------|
| idle      | 0.92×   | −0.5       | 0.92    | Default Rick       |
| rant      | 1.08×   | +0.4       | 0.94    | Urgent, louder     |
| sarcasm   | 0.85×   | −0.6       | 0.90    | Dragged, gravelly  |
| serious   | 0.88×   | −0.8       | 0.91    | Slow, deep         |
| drunk     | 0.78×   | +0.15      | 0.93    | Wobble + gaps      |
| excited   | 1.12×   | +0.6       | 0.95    | Fast, bright       |
| tech      | 0.95×   | −0.3       | 0.93    | Explanatory        |

## CLI

```bash
cd sovereign-oracle/services/voice-prosody
PYTHONPATH=. python -m prosody.apply \
  -i /tmp/piper_raw.wav \
  -o /tmp/rick.wav \
  --emotion rant \
  --burp-prob 0.08
```

## Library

```python
from prosody import apply_rick_personality
import soundfile as sf

audio, sr = sf.read("piper_raw.wav")
rick = apply_rick_personality(audio, sr=sr, mode="serious")
sf.write("rick.wav", rick, sr)
```

## Dependencies

```
numpy
librosa          # recommended
soundfile        # optional
```

Pure-numpy phase vocoder + formant warp included if librosa is missing.

## Location

```
sovereign-oracle/services/voice-prosody/prosody/
├── __init__.py
├── phase_vocoder.py
├── formant_shifter.py
├── rick_profile.py
├── personality_pipeline.py
└── apply.py
```
