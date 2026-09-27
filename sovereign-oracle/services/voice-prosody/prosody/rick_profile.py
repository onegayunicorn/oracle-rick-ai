"""
Verified Rick C-137 emotional prosody profiles.
Natural F0 range ~100–175 Hz (low-mid baritone).
formant_scale < 1.0 → deeper / throatier vocal tract.
"""

from __future__ import annotations

from typing import Dict, Literal, TypedDict

EmotionMode = Literal[
    "idle", "rant", "sarcasm", "serious", "drunk", "excited", "tech"
]


class Profile(TypedDict, total=False):
    time_stretch: float
    pitch_shift: float
    formant_scale: float
    volume_gain: float
    pause_factor: float
    pitch_wobble: float
    burp_prob: float


RICK_PROFILE: Dict[EmotionMode, Profile] = {
    "idle": {
        "time_stretch": 0.92,
        "pitch_shift": -1.0,
        "formant_scale": 0.92,
        "volume_gain": 0.0,
        "pause_factor": 1.0,
        "pitch_wobble": 0.0,
        "burp_prob": 0.02,
    },
    "rant": {
        "time_stretch": 1.08,
        "pitch_shift": 0.4,
        "formant_scale": 0.94,
        "volume_gain": 2.0,
        "pause_factor": 0.7,
        "pitch_wobble": 0.05,
        "burp_prob": 0.08,
    },
    "sarcasm": {
        "time_stretch": 0.85,
        "pitch_shift": -1.5,
        "formant_scale": 0.90,
        "volume_gain": -2.0,
        "pause_factor": 1.5,
        "pitch_wobble": 0.03,
        "burp_prob": 0.03,
    },
    "serious": {
        "time_stretch": 0.88,
        "pitch_shift": -1.2,
        "formant_scale": 0.91,
        "volume_gain": 1.0,
        "pause_factor": 1.4,
        "pitch_wobble": 0.02,
        "burp_prob": 0.01,
    },
    "drunk": {
        "time_stretch": 0.80,
        "pitch_shift": -0.8,
        "formant_scale": 0.93,
        "volume_gain": -2.5,
        "pause_factor": 2.0,
        "pitch_wobble": 0.15,
        "burp_prob": 0.12,
    },
    "excited": {
        "time_stretch": 1.12,
        "pitch_shift": 0.6,
        "formant_scale": 0.95,
        "volume_gain": 2.5,
        "pause_factor": 0.8,
        "pitch_wobble": 0.08,
        "burp_prob": 0.06,
    },
    "tech": {
        "time_stretch": 0.95,
        "pitch_shift": -0.5,
        "formant_scale": 0.93,
        "volume_gain": 0.5,
        "pause_factor": 1.2,
        "pitch_wobble": 0.01,
        "burp_prob": 0.0,
    },
}


def resolve_profile(mode: str | None) -> Profile:
    if not mode:
        return RICK_PROFILE["idle"]
    key = mode.lower().strip()
    if key in RICK_PROFILE:
        return RICK_PROFILE[key]  # type: ignore[index]
    return RICK_PROFILE["idle"]
