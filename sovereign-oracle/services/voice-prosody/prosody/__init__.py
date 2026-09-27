"""
Rick C-137 Audio Personality Engine
====================================
Post-Piper signal processing: time/pitch decoupling, formant control,
emotion profiles, optional burp injection.

Usage (CLI):
  python -m prosody.apply --input raw.wav --output rick.wav --emotion rant --burp-prob 0.08

Usage (library):
  from prosody.personality_pipeline import apply_rick_personality
  audio_out = apply_rick_personality(audio, sr=22050, mode="serious")
"""

from .rick_profile import RICK_PROFILE, EmotionMode
from .personality_pipeline import apply_rick_personality

__all__ = ["RICK_PROFILE", "EmotionMode", "apply_rick_personality"]
