"""
Rick C-137 emotional prosody profiles.
Maps emotion tags from /v1/speech → DSP parameters.
"""

from __future__ import annotations

from typing import Dict, Literal, TypedDict

EmotionMode = Literal[
    "idle", "rant", "sarcasm", "serious", "drunk", "excited", "tech"
]


class Profile(TypedDict, total=False):
    pitch_shift: float
    time_stretch: float
    formant_scale: float
    volume_gain: float
    pause_factor: float
    pitch_wobble: float


RICK_PROFILE: Dict[EmotionMode, Profile] = {
    "idle": {
        "pitch_shift": -0.5,
        "time_stretch": 0.92,
        "formant_scale": 0.92,
        "volume_gain": 0.0,
        "pause_factor": 1.0,
    },
    "rant": {
        "pitch_shift": 0.4,
        "time_stretch": 1.08,
        "formant_scale": 0.94,
        "volume_gain": 2.0,
        "pause_factor": 0.7,
    },
    "sarcasm": {
        "pitch_shift": -0.6,
        "time_stretch": 0.85,
        "formant_scale": 0.90,
        "volume_gain": -1.5,
        "pause_factor": 1.5,
    },
    "serious": {
        "pitch_shift": -0.8,
        "time_stretch": 0.88,
        "formant_scale": 0.91,
        "volume_gain": 1.0,
        "pause_factor": 1.4,
    },
    "drunk": {
        "pitch_shift": 0.15,
        "time_stretch": 0.78,
        "formant_scale": 0.93,
        "volume_gain": -2.0,
        "pause_factor": 2.0,
        "pitch_wobble": 0.12,
    },
    "excited": {
        "pitch_shift": 0.6,
        "time_stretch": 1.12,
        "formant_scale": 0.95,
        "volume_gain": 2.5,
        "pause_factor": 0.6,
    },
    "tech": {
        "pitch_shift": -0.3,
        "time_stretch": 0.95,
        "formant_scale": 0.93,
        "volume_gain": 0.5,
        "pause_factor": 1.1,
    },
}


def resolve_profile(mode: str | None) -> Profile:
    if not mode:
        return RICK_PROFILE["idle"]
    key = mode.lower().strip()
    if key in RICK_PROFILE:
        return RICK_PROFILE[key]  # type: ignore[index]
    return RICK_PROFILE["idle"]
