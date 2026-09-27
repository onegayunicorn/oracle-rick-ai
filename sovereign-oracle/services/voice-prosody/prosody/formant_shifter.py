"""
Formant shifter — stretch/compress spectral envelope independently of F0.
Gives Rick a deeper, throatier character without pitch artifacts.
"""

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
    """
    Warp the magnitude spectrogram along the frequency axis.

    formant_scale < 1 → deeper / throatier (Rick default ≈ 0.92)
    formant_scale > 1 → brighter / thinner
    formant_scale == 1 → no change
    """
    if abs(formant_scale - 1.0) < 1e-3:
        return audio.astype(np.float32)

    if librosa is not None:
        return _shift_librosa(audio, sr, formant_scale, n_fft)
    return _shift_numpy(audio, formant_scale, n_fft)


def _shift_librosa(
    audio: np.ndarray,
    sr: int,
    formant_scale: float,
    n_fft: int,
) -> np.ndarray:
    stft = librosa.stft(audio.astype(np.float32), n_fft=n_fft)
    mag, phase = librosa.magphase(stft)

    n_bins = mag.shape[0]
    orig = np.linspace(0.0, 1.0, n_bins)
    warped = np.clip(orig / formant_scale, 0.0, 1.0)

    mag_warped = np.zeros_like(mag)
    for t in range(mag.shape[1]):
        mag_warped[:, t] = np.interp(orig, warped, mag[:, t])

    return librosa.istft(mag_warped * phase, length=len(audio)).astype(np.float32)


def _shift_numpy(
    audio: np.ndarray,
    formant_scale: float,
    n_fft: int,
) -> np.ndarray:
    """Fallback without librosa — same spectral envelope warp."""
    hop = n_fft // 4
    window = np.hanning(n_fft).astype(np.float64)
    n_frames = max(1, (len(audio) - n_fft) // hop + 1)

    out = np.zeros(len(audio) + n_fft, dtype=np.float64)
    win_sum = np.zeros_like(out)

    n_bins = n_fft // 2 + 1
    orig = np.linspace(0.0, 1.0, n_bins)
    warped = np.clip(orig / formant_scale, 0.0, 1.0)

    for i, start in enumerate(range(0, len(audio) - n_fft + 1, hop)):
        frame = window * audio[start : start + n_fft]
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
