class FishVoiceError(Exception):
    """Base error for fish_voice."""


class APIKeyMissing(FishVoiceError):
    """Raised when no API key is provided."""


class SynthesisFailed(FishVoiceError):
    """Raised when the API returns a non-2xx status."""

    def __init__(self, status: int, body: str = ""):
        super().__init__(f"TTS failed (HTTP {status}): {body[:200]}")
        self.status = status
        self.body = body
