"""Quickstart: synthesize with the Python client."""
import os
os.environ.setdefault("FISH_API_KEY", "sk-your-key-here")

import sys
sys.path.insert(0, "../skill/rick-sanchez-voice/scripts/fish_voice")

from fish_voice import FishVoiceClient

client = FishVoiceClient()
audio = client.synthesize("And that\'s the wayyyyyy the news goes! [laugh]")
with open("quickstart.mp3", "wb") as f:
    f.write(audio)
print("[OK] wrote quickstart.mp3")
