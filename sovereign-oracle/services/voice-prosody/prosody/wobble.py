"""
Time-varying pitch modulation (true per-frame shifts).
Does NOT abuse librosa.effects.pitch_shift with a non-scalar n_steps.
"""

from __future__ import annotations

import numpy as np


def generate_wobble_curve(
    n_frames: int,
    sr: int,
    hop_length: int,
    base_shift_semitones: float = 0.0,
    wobble_amplitude_semitones: float = 0.15,
    wobble_freq_hz: float = 3.0,
    seed: int | None = None,
) -> np.ndarray:
    rng = np.random.default_rng(seed)
    times = np.arange(n_frames, dtype=np.float64) * hop_length / sr

    phase = 2.0 * np.pi * wobble_freq_hz * times
    noise = rng.normal(0.0, 0.03, n_frames)
    noise = np.cumsum(noise)
    std = float(np.std(noise)) or 1.0
    noise = 0.05 * noise / std

    return base_shift_semitones + wobble_amplitude_semitones * np.sin(phase) + noise


def apply_time_varying_pitch(
    audio: np.ndarray,
    sr: int,
    semitone_curve: np.ndarray,
    fft_size: int = 2048,
    hop_size: int = 512,
) -> np.ndarray:
    y = np.asarray(audio, dtype=np.float64)
    n_samples = len(y)
    n_frames = 1 + max(0, (n_samples - fft_size) // hop_size)

    if n_frames < 1:
        return y.astype(np.float32)

    if len(semitone_curve) != n_frames:
        semitone_curve = np.interp(
            np.linspace(0, 1, n_frames),
            np.linspace(0, 1, len(semitone_curve)),
            semitone_curve,
        )

    window = np.hanning(fft_size)
    result = np.zeros(n_samples + fft_size, dtype=np.float64)
    win_acc = np.zeros_like(result)

    for i in range(n_frames):
        start = i * hop_size
        frame = y[start : start + fft_size]
        if len(frame) < fft_size:
            frame = np.pad(frame, (0, fft_size - len(frame)))
        frame = frame * window

        shift = float(semitone_curve[i])
        factor = 2.0 ** (shift / 12.0)

        spec = np.fft.rfft(frame)
        mag = np.abs(spec)
        phase = np.angle(spec)

        n_bins = len(mag)
        new_len = max(2, int(n_bins / factor))
        src = mag[:new_len] if new_len <= n_bins else np.pad(mag, (0, new_len - n_bins))
        mag_warped = np.interp(
            np.linspace(0, 1, n_bins),
            np.linspace(0, 1, len(src)),
            src,
        )

        shifted = np.fft.irfft(mag_warped * np.exp(1j * phase), n=fft_size)
        result[start : start + fft_size] += shifted * window
        win_acc[start : start + fft_size] += window**2

    mask = win_acc > 1e-8
    result[mask] /= win_acc[mask]
    result = result[:n_samples]

    peak = float(np.max(np.abs(result)) or 1.0)
    if peak > 0.95:
        result = result / peak * 0.95
    return result.astype(np.float32)
