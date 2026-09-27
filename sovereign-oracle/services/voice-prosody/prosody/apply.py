#!/usr/bin/env python3
"""CLI entry: apply Rick personality to a WAV file."""

from __future__ import annotations

import argparse
import wave
from pathlib import Path

import numpy as np

from .personality_pipeline import apply_personality
from .rick_profile import RICK_PROFILE


def load_wav(path: Path) -> tuple[np.ndarray, int]:
    with wave.open(str(path), "rb") as wf:
        nch, sw, sr, nframes, *_ = wf.getparams()
        raw = wf.readframes(nframes)
    if sw != 2:
        raise SystemExit(f"Only 16-bit PCM supported (got {sw * 8}-bit)")
    samples = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
    if nch > 1:
        samples = samples.reshape(-1, nch).mean(axis=1)
    return samples, sr


def save_wav(path: Path, samples: np.ndarray, sr: int) -> None:
    clipped = np.clip(samples, -1.0, 1.0)
    pcm = (clipped * 32767.0).astype(np.int16)
    with wave.open(str(path), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(pcm.tobytes())


def main() -> None:
    p = argparse.ArgumentParser(description="Rick C-137 personality post-processor")
    p.add_argument("-i", "--input", required=True, type=Path)
    p.add_argument("-o", "--output", required=True, type=Path)
    p.add_argument("--emotion", default="idle", choices=list(RICK_PROFILE.keys()))
    p.add_argument("--burp-prob", type=float, default=None)
    p.add_argument("--seed", type=int, default=None)
    args = p.parse_args()

    audio, sr = load_wav(args.input)
    print(f"Loaded {args.input}  sr={sr}  samples={len(audio)}")

    try:
        out = apply_personality(
            audio, sr=sr, emotion=args.emotion, burp_prob=args.burp_prob, seed=args.seed
        )
    except Exception as e:
        print(f"[error] DSP failed ({e}) — writing clean input as fallback")
        out = audio

    save_wav(args.output, out, sr)
    print(f"Wrote {args.output}  emotion={args.emotion}")


if __name__ == "__main__":
    main()
