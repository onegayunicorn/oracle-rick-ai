"""fish_voice — Fish Audio TTS client (sync + streaming)."""
from .client import FishVoiceClient
from .exceptions import FishVoiceError, APIKeyMissing, SynthesisFailed

__version__ = "0.2.0"
__all__ = ["FishVoiceClient", "FishVoiceError", "APIKeyMissing", "SynthesisFailed"]

try:
    from .streaming import FishVoiceStream  # noqa: F401
    __all__.append("FishVoiceStream")
except ImportError:
    pass
