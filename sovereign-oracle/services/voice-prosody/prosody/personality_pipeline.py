"""
Complete Rick personality transform — verified chain.

  Piper raw → cadence → pitch/wobble → formant → gain → burps → soft-limit

On any DSP failure, callers should fall back to clean Piper audio
(this module raises rather than returning NaN).
"""

from __future__ import annotations

import numpy as np

from .burp_injector import inject_burps
from .formant_shifter import shift_formants
from .rick_profile import resolve_profile
from .wobble import apply_time_varying_pitch, generate_wobble_curve

try:
    import librosa
except ImportError:
    librosa = None  # type: ignore

from .phase_vocoder import time_stretch as pv_time_stretch


def apply_personality(
    audio: np.ndarray,
    sr: int = 22050,
    emotion: str = "idle",
    burp_prob: float | None = None,
    seed: int | None = None,
) -> np.ndarray:
    p = resolve_profile(emotion)
    y = np.asarray(audio, dtype=np.float32).copy()
    if y.ndim > 1:
        y = y.mean(axis=-1)

    rate = float(p.get("time_stretch", 1.0))
    if abs(rate - 1.0) > 1e-3:
        if librosa is not None:
            y = librosa.effects.time_stretch(y, rate=rate)
        else:
            y = pv_time_stretch(y, rate=rate)

    base_shift = float(p.get("pitch_shift", 0.0))
    wobble_amp = float(p.get("pitch_wobble", 0.0))
    fft_size, hop_size = 2048, 512
    n_frames = 1 + max(0, (len(y) - fft_size) // hop_size)

    if wobble_amp > 1e-4 and n_frames > 1:
        curve = generate_wobble_curve(
            n_frames,
            sr,
            hop_size,
            base_shift_semitones=base_shift,
            wobble_amplitude_semitones=wobble_amp,
            seed=seed,
        )
        y = apply_time_varying_pitch(y, sr, curve, fft_size=fft_size, hop_size=hop_size)
    elif abs(base_shift) > 1e-3:
        if librosa is not None:
            y = librosa.effects.pitch_shift(y, sr=sr, n_steps=base_shift)
        else:
            curve = np.full(max(1, n_frames), base_shift, dtype=np.float64)
            y = apply_time_varying_pitch(y, sr, curve, fft_size=fft_size, hop_size=hop_size)

    formant = float(p.get("formant_scale", 1.0))
    if abs(formant - 1.0) > 1e-3:
        y = shift_formants(y, sr=sr, formant_scale=formant)

    gain_db = float(p.get("volume_gain", 0.0))
    if abs(gain_db) > 1e-3:
        y = y * (10.0 ** (gain_db / 20.0))

    bp = float(p.get("burp_prob", 0.0)) if burp_prob is None else float(burp_prob)
    if bp > 0:
        y = inject_burps(y, sr, prob=bp, seed=seed)

    if np.any(~np.isfinite(y)):
        raise ValueError("NaN/Inf in personality output — DSP failure")
    peak = float(np.max(np.abs(y)) or 1.0)
    if peak > 0.98:
        y = y / peak * 0.95

    return y.astype(np.float32)


def apply_rick_personality(
    audio: np.ndarray,
    sr: int = 22050,
    mode: str = "idle",
) -> np.ndarray:
    return apply_personality(audio, sr=sr, emotion=mode)
