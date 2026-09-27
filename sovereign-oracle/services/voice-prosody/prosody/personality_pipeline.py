"""
End-to-end Rick personality transform.
Piper raw WAV → cadence / pitch / formants / volume / optional wobble → Rick audio.
"""

from __future__ import annotations

import numpy as np

from .formant_shifter import shift_formants
from .phase_vocoder import time_stretch
from .rick_profile import resolve_profile

try:
    import librosa
except ImportError:
    librosa = None  # type: ignore


def apply_rick_personality(
    audio: np.ndarray,
    sr: int = 22050,
    mode: str = "idle",
) -> np.ndarray:
    """
    Full personality transform.

    Order:
      1. Time stretch (cadence)
      2. Pitch shift (F0)
      3. Formant shift (vocal tract)
      4. Volume gain
      5. Optional pitch wobble (drunk / unsteady)
    """
    p = resolve_profile(mode)
    y = np.asarray(audio, dtype=np.float32).copy()
    if y.ndim > 1:
        y = y.mean(axis=-1)

    rate = float(p.get("time_stretch", 1.0))
    if abs(rate - 1.0) > 1e-3:
        if librosa is not None:
            y = librosa.effects.time_stretch(y, rate=rate)
        else:
            y = time_stretch(y, rate=rate)

    n_steps = float(p.get("pitch_shift", 0.0))
    if abs(n_steps) > 1e-3 and librosa is not None:
        y = librosa.effects.pitch_shift(y, sr=sr, n_steps=n_steps)

    formant = float(p.get("formant_scale", 1.0))
    if abs(formant - 1.0) > 1e-3:
        y = shift_formants(y, sr=sr, formant_scale=formant)

    gain_db = float(p.get("volume_gain", 0.0))
    if abs(gain_db) > 1e-3:
        y = y * (10.0 ** (gain_db / 20.0))

    wobble = float(p.get("pitch_wobble", 0.0))
    if wobble > 1e-3 and librosa is not None:
        detuned = librosa.effects.pitch_shift(y, sr=sr, n_steps=wobble)
        t = np.linspace(0, 2 * np.pi * 3, len(y), endpoint=False)
        mix = 0.5 + 0.5 * np.sin(t)
        y = y * (1.0 - 0.35 * mix) + detuned * (0.35 * mix)

    peak = float(np.max(np.abs(y)) or 1.0)
    if peak > 0.98:
        y = y / peak * 0.98

    return y.astype(np.float32)
