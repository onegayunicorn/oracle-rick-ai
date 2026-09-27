#!/usr/bin/env python3
"""
CLI: apply Rick personality (+ optional burps) to a WAV file.

  python -m prosody.apply -i piper_raw.wav -o rick.wav --emotion rant --burp-prob 0.08
"""

from __future__ import annotations

import argparse
import sys
import wave
from pathlib import Path

import numpy as np

from .personality_pipeline import apply_rick_personality
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


def try_burp(audio: np.ndarray, sr: int, prob: float) -> np.ndarray:
    if prob <= 0:
        return audio
    try:
        from burp_injector import inject_burps, load_burp_library  # type: ignore
        burps = load_burp_library(Path("voice/burp_samples"))
        return inject_burps(audio, burps, sr=sr, burp_prob=prob)
    except Exception as e:
        print(f"[warn] burp injection skipped: {e}", file=sys.stderr)
        return audio


def main() -> None:
    p = argparse.ArgumentParser(description="Rick C-137 personality post-processor")
    p.add_argument("-i", "--input", required=True, type=Path)
    p.add_argument("-o", "--output", required=True, type=Path)
    p.add_argument(
        "--emotion",
        default="idle",
        choices=list(RICK_PROFILE.keys()),
        help="Emotion / delivery mode",
    )
    p.add_argument("--burp-prob", type=float, default=0.0)
    args = p.parse_args()

    audio, sr = load_wav(args.input)
    print(f"Loaded {args.input}  sr={sr}  samples={len(audio)}")

    out = apply_rick_personality(audio, sr=sr, mode=args.emotion)
    out = try_burp(out, sr, args.burp_prob)

    save_wav(args.output, out, sr)
    print(f"Wrote {args.output}  emotion={args.emotion}")


if __name__ == "__main__":
    main()
