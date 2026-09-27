"""Phase vocoder time-stretch (pitch-preserving) — numpy fallback."""

from __future__ import annotations

import numpy as np


def phase_vocoder(
    signal: np.ndarray,
    hop_a: int,
    hop_s: int,
    fft_size: int = 2048,
) -> np.ndarray:
    if hop_a <= 0 or hop_s <= 0:
        raise ValueError("hop sizes must be positive")

    window = np.hanning(fft_size).astype(np.float64)
    n_frames = max(1, (len(signal) - fft_size) // hop_a + 1)

    frames = []
    for i in range(0, len(signal) - fft_size + 1, hop_a):
        frames.append(np.fft.rfft(window * signal[i : i + fft_size]))
    if not frames:
        return signal.copy().astype(np.float32)
    frames = np.array(frames)

    mag = np.abs(frames)
    phs = np.angle(frames)
    syn_phase = phs[0].copy()
    out = np.zeros_like(frames, dtype=np.complex128)
    out[0] = mag[0] * np.exp(1j * syn_phase)
    bin_freqs = 2 * np.pi * np.arange(frames.shape[1]) / fft_size

    for m in range(1, len(frames)):
        delta_phi = phs[m] - phs[m - 1]
        expected = bin_freqs * hop_a
        wrapped = ((delta_phi - expected) + np.pi) % (2 * np.pi) - np.pi
        inst_freq = bin_freqs + wrapped / hop_a
        syn_phase = syn_phase + hop_s * inst_freq
        out[m] = mag[m] * np.exp(1j * syn_phase)

    res_len = int((n_frames - 1) * hop_s + fft_size)
    result = np.zeros(res_len, dtype=np.float64)
    win_sum = np.zeros(res_len, dtype=np.float64)
    for m, frame in enumerate(out):
        start = m * hop_s
        chunk = window * np.fft.irfft(frame, n=fft_size)
        end = min(start + fft_size, res_len)
        result[start:end] += chunk[: end - start]
        win_sum[start:end] += window[: end - start] ** 2

    mask = win_sum > 1e-8
    result[mask] /= win_sum[mask]
    return result.astype(np.float32)


def time_stretch(signal: np.ndarray, rate: float, fft_size: int = 2048) -> np.ndarray:
    if abs(rate - 1.0) < 1e-3:
        return signal.astype(np.float32)
    hop_a = fft_size // 4
    hop_s = max(1, int(round(hop_a * rate)))
    return phase_vocoder(signal, hop_a=hop_a, hop_s=hop_s, fft_size=fft_size)
