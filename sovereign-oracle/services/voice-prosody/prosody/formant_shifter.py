"""Formant shifter — spectral envelope independent of F0."""

from __future__ import annotations

import numpy as np

try:
    import librosa
except ImportError:
    librosa = None  # type: ignore


def shift_formants(
    audio: np.ndarray,
    sr: int = 22050,
    formant_scale: float = 0.92,
    n_fft: int = 2048,
) -> np.ndarray:
    if abs(formant_scale - 1.0) < 1e-3:
        return np.asarray(audio, dtype=np.float32)

    if librosa is not None:
        stft = librosa.stft(np.asarray(audio, dtype=np.float32), n_fft=n_fft)
        mag, phase = librosa.magphase(stft)
        n_bins = mag.shape[0]
        orig = np.linspace(0.0, 1.0, n_bins)
        warped = np.clip(orig / formant_scale, 0.0, 1.0)
        mag_w = np.zeros_like(mag)
        for t in range(mag.shape[1]):
            mag_w[:, t] = np.interp(orig, warped, mag[:, t])
        out = librosa.istft(mag_w * phase, length=len(audio))
        return out.astype(np.float32)

    hop = n_fft // 4
    window = np.hanning(n_fft)
    out = np.zeros(len(audio) + n_fft, dtype=np.float64)
    win_sum = np.zeros_like(out)
    n_bins = n_fft // 2 + 1
    orig = np.linspace(0.0, 1.0, n_bins)
    warped = np.clip(orig / formant_scale, 0.0, 1.0)

    for start in range(0, max(1, len(audio) - n_fft + 1), hop):
        frame = window * audio[start : start + n_fft]
        if len(frame) < n_fft:
            frame = np.pad(frame, (0, n_fft - len(frame)))
        spec = np.fft.rfft(frame)
        mag = np.abs(spec)
        phase = np.angle(spec)
        mag_w = np.interp(orig, warped, mag)
        recon = window * np.fft.irfft(mag_w * np.exp(1j * phase), n=n_fft)
        out[start : start + n_fft] += recon
        win_sum[start : start + n_fft] += window**2

    mask = win_sum > 1e-8
    out[mask] /= win_sum[mask]
    return out[: len(audio)].astype(np.float32)
