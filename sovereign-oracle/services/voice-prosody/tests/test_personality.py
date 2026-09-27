"""Automated validation gates for the personality DSP layer."""

from __future__ import annotations

import numpy as np
import pytest

from prosody.personality_pipeline import apply_personality
from prosody.rick_profile import RICK_PROFILE


@pytest.fixture
def tone() -> np.ndarray:
    t = np.arange(22050) / 22050.0
    return (0.2 * np.sin(2 * np.pi * 150 * t)).astype(np.float32)


def test_no_nan(tone: np.ndarray) -> None:
    out = apply_personality(tone, emotion="rant", seed=1)
    assert np.all(np.isfinite(out))


def test_peak_bounded(tone: np.ndarray) -> None:
    loud = tone * 3.0
    out = apply_personality(loud, emotion="excited", seed=2)
    assert float(np.max(np.abs(out))) <= 0.98


def test_determinism(tone: np.ndarray) -> None:
    a = apply_personality(tone, emotion="drunk", seed=42)
    b = apply_personality(tone, emotion="drunk", seed=42)
    assert np.allclose(a, b, atol=1e-6)


def test_emotion_changes_output(tone: np.ndarray) -> None:
    idle = apply_personality(tone, emotion="idle", seed=0)
    rant = apply_personality(tone, emotion="rant", seed=0)
    if idle.shape != rant.shape:
        return
    assert not np.allclose(idle, rant, atol=1e-4)


def test_all_emotions_run(tone: np.ndarray) -> None:
    for emotion in RICK_PROFILE:
        out = apply_personality(tone, emotion=emotion, seed=7)
        assert out.dtype == np.float32
        assert np.all(np.isfinite(out))
        assert float(np.max(np.abs(out))) <= 0.98


def test_length_reasonable(tone: np.ndarray) -> None:
    out = apply_personality(tone, emotion="serious", seed=3)
    ratio = len(out) / len(tone)
    assert 0.5 < ratio < 1.6
