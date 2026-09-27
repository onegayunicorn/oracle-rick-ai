# Rick C-137 Audio Personality Engine (verified)

Post-Piper DSP with corrected time-varying wobble (no invalid `n_steps` array API).

## Chain

```
Piper WAV
  → cadence (time_stretch)
  → F0 / per-frame wobble
  → formant
  → gain
  → procedural burps (gap-based)
  → soft-limit
  → /v1/speech
```

## Validation gates

- no NaN/Inf
- peak ≤ 0.98
- deterministic with seed
- emotions produce different output
- length within sane band after stretch

```bash
cd sovereign-oracle/services/voice-prosody
pip install -e ".[test]"
pytest -q
python -m prosody.apply -i raw.wav -o rick.wav --emotion drunk --seed 42
```

On DSP failure the CLI falls back to clean input so `/v1/speech` does not break.
