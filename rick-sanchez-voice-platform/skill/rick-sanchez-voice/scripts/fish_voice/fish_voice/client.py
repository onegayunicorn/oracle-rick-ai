import os
import json
import urllib.request
import urllib.error
from typing import Optional, Dict, Any, Iterator, BinaryIO

from .exceptions import APIKeyMissing, SynthesisFailed

DEFAULT_API_BASE = "https://api.fish.audio"
DEFAULT_VOICE_ID = "d2e75a3e3fd6419893057c02a375a113"
DEFAULT_MODEL = "s2.1-pro-free"


class FishVoiceClient:
    """Synchronous, stdlib-only Fish Audio TTS client."""

    def __init__(
        self,
        api_key: Optional[str] = None,
        api_base: Optional[str] = None,
        default_voice_id: Optional[str] = None,
        default_model: Optional[str] = None,
        timeout: float = 60.0,
    ):
        self.api_key = api_key or os.getenv("FISH_API_KEY", "")
        if not self.api_key:
            raise APIKeyMissing("Set FISH_API_KEY or pass api_key=")
        self.api_base = (api_base or os.getenv("FISH_API_BASE") or DEFAULT_API_BASE).rstrip("/")
        self.default_voice_id = default_voice_id or os.getenv("FISH_VOICE_ID") or DEFAULT_VOICE_ID
        self.default_model = default_model or os.getenv("FISH_MODEL") or DEFAULT_MODEL
        self.timeout = timeout

    def _post(self, path: str, payload: Dict[str, Any]) -> bytes:
        req = urllib.request.Request(
            f"{self.api_base}{path}",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                return resp.read()
        except urllib.error.HTTPError as e:
            raise SynthesisFailed(e.code, e.read().decode("utf-8", "replace")) from e

    def synthesize(
        self,
        text: str,
        voice_id: Optional[str] = None,
        model: Optional[str] = None,
        response_format: str = "mp3",
        **kwargs,
    ) -> bytes:
        """Synthesize text -> audio bytes."""
        payload = {
            "text": text,
            "voice_id": voice_id or self.default_voice_id,
            "model": model or self.default_model,
            "response_format": response_format,
        }
        payload.update(kwargs)
        return self._post("/v1/tts", payload)

    def synthesize_to_file(self, text: str, path: str, **kwargs) -> None:
        data = self.synthesize(text, **kwargs)
        with open(path, "wb") as f:
            f.write(data)

    def list_voices(self) -> Dict[str, Any]:
        req = urllib.request.Request(
            f"{self.api_base}/v1/voices",
            headers={"Authorization": f"Bearer {self.api_key}"},
        )
        with urllib.request.urlopen(req, timeout=self.timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))
