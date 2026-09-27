"""
Rick C-137 Audio Personality Engine (verified)
==============================================
Post-Piper DSP: cadence, F0, formants, time-varying wobble, burps.

  python -m prosody.apply -i raw.wav -o rick.wav --emotion rant --seed 42
"""

from .rick_profile import RICK_PROFILE, EmotionMode, resolve_profile
from .personality_pipeline import apply_personality

__all__ = [
    "RICK_PROFILE",
    "EmotionMode",
    "resolve_profile",
    "apply_personality",
]
