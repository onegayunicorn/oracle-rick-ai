"""
Fixture-based DSP validation — no trained rick_c137.onnx required.
Uses synthetic mono 16-bit 22050 Hz audio (Piper format).
"""

from __future__ import annotations

import numpy as np
import pytest

from prosody.personality_pipeline import apply_personality
from prosody.rick_profile import RICK_PROFILE

SAMPLE_RATE = 22050


def make_fixture(duration_s: float = 2.0, freq: float = 150.0) -> np.ndarray:
    t = np.arange(int(duration_s * SAMPLE_RATE)) / SAMPLE_RATE
    return (0.15 * np.sin(2 * np.pi * freq * t)).astype(np.float32)


def test_piper_format_shape() -> None:
    audio = make_fixture()
    assert audio.ndim == 1
    assert audio.dtype == np.float32
    assert float(np.max(np.abs(audio))) <= 1.0


def test_dsp_preserves_mono_finite() -> None:
    audio = make_fixture()
    out = apply_personality(audio, SAMPLE_RATE, emotion="idle", seed=1)
    assert out.ndim == 1
    assert np.all(np.isfinite(out))
    assert float(np.max(np.abs(out))) <= 0.98


def test_drunk_differs_from_idle() -> None:
    audio = make_fixture(duration_s=3.0)
    idle = apply_personality(audio, SAMPLE_RATE, emotion="idle", seed=42)
    drunk = apply_personality(audio, SAMPLE_RATE, emotion="drunk", seed=42)
    if idle.shape != drunk.shape:
        return
    corr = float(np.corrcoef(idle, drunk)[0, 1])
    assert corr < 0.99, f"drunk wobble inactive — corr={corr:.3f}"


def test_all_emotions_distinct_enough() -> None:
    audio = make_fixture()
    results = {
        e: apply_personality(audio, SAMPLE_RATE, emotion=e, seed=123)
        for e in RICK_PROFILE
    }
    keys = list(results)
    for i, a in enumerate(keys):
        for b in keys[i + 1 :]:
            xa, xb = results[a], results[b]
            n = min(len(xa), len(xb))
            rms = float(np.sqrt(np.mean((xa[:n] - xb[:n]) ** 2)))
            assert rms > 1e-4 or len(xa) != len(xb), f"{a} vs {b} identical"


def test_determinism() -> None:
    audio = make_fixture()
    a = apply_personality(audio, SAMPLE_RATE, emotion="drunk", seed=999)
    b = apply_personality(audio, SAMPLE_RATE, emotion="drunk", seed=999)
    assert a.shape == b.shape
    assert np.allclose(a, b, atol=1e-6)


def test_no_dc_offset() -> None:
    audio = make_fixture()
    out = apply_personality(audio, SAMPLE_RATE, emotion="rant", seed=5)
    assert abs(float(np.mean(out))) < 0.05
