# Rick C-137 Voice Prosody

Verified post-Piper personality DSP.

```
Piper WAV → cadence → F0/wobble → formant → gain → burps → soft-limit
```

## Install

```bash
cd sovereign-oracle/services/voice-prosody
pip install -e ".[test]"
```

## CLI

```bash
python -m prosody.apply -i raw.wav -o rick.wav --emotion rant --seed 42
```

On DSP failure the CLI writes the clean input (fail-open for `/v1/speech`).

## Tests

```bash
pytest -q
```

Gates: no NaN/Inf, peak ≤ 0.98, deterministic seed, emotion differentiation, all modes run, length band.

## Notes

- Time-varying wobble uses per-frame frequency-domain warp (`wobble.py`), **not** `librosa.effects.pitch_shift(n_steps=array)`.
- Burps are procedural and only inserted into detected low-energy gaps.
- Raw Piper output should always remain available for A/B comparison at the API layer.
