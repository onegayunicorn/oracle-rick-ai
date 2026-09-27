"""
Procedural burp injection into low-energy gaps.
Preserves continuity with fade-in/out; soft-limits final peak.
"""

from __future__ import annotations

import numpy as np


def detect_gaps(
    audio: np.ndarray,
    sr: int,
    threshold_db: float = -30.0,
    min_gap: float = 0.15,
) -> list[tuple[int, int]]:
    frame_len = max(1, int(0.02 * sr))
    energy = np.convolve(audio**2, np.ones(frame_len) / frame_len, mode="same")
    threshold = 10 ** (threshold_db / 10.0)
    is_gap = energy < threshold

    gap_diff = np.diff(np.concatenate([[0], is_gap.astype(int), [0]]))
    starts = np.where(gap_diff == 1)[0]
    ends = np.where(gap_diff == -1)[0]
    min_gap_samp = int(min_gap * sr)
    return [(int(s), int(e)) for s, e in zip(starts, ends) if e - s > min_gap_samp]


def generate_burp(sr: int, duration: float = 0.18, seed: int | None = None) -> np.ndarray:
    rng = np.random.default_rng(seed)
    n = max(1, int(sr * duration))
    t = np.linspace(0.0, duration, n, endpoint=False)
    freq = 120.0 + 40.0 * np.sin(2 * np.pi * 6 * t)
    amp_env = np.exp(-t / 0.06)

    burp = amp_env * np.sin(2 * np.pi * freq * t)
    burp += 0.3 * amp_env * np.sin(4 * np.pi * freq * t)
    burp += 0.15 * amp_env * np.sin(6 * np.pi * freq * t)
    burp += 0.08 * amp_env * rng.normal(0, 1, n)
    burp = np.tanh(burp * 2.5) / 2.5
    return burp.astype(np.float32)


def inject_burps(
    audio: np.ndarray,
    sr: int,
    prob: float = 0.05,
    seed: int | None = None,
) -> np.ndarray:
    if prob <= 0:
        return np.asarray(audio, dtype=np.float32)

    rng = np.random.default_rng(seed)
    result = np.asarray(audio, dtype=np.float32).copy()
    gaps = detect_gaps(result, sr)

    for start, end in gaps:
        if rng.random() > prob:
            continue
        burp = generate_burp(sr, seed=int(rng.integers(0, 2**31 - 1)))
        burp_len = len(burp)
        gap_len = end - start
        if burp_len >= gap_len:
            continue
        pos = start + (gap_len - burp_len) // 2
        if pos < 0 or pos + burp_len > len(result):
            continue

        fade = min(burp_len // 4, max(1, int(0.02 * sr)))
        window = np.ones(burp_len, dtype=np.float32)
        window[:fade] = np.linspace(0, 1, fade, dtype=np.float32)
        window[-fade:] = np.linspace(1, 0, fade, dtype=np.float32)
        result[pos : pos + burp_len] += burp * window * 0.35

    peak = float(np.max(np.abs(result)) or 1.0)
    if peak > 0.95:
        result = np.tanh(result / peak * 3.0).astype(np.float32) / 3.0 * peak
    return result.astype(np.float32)
