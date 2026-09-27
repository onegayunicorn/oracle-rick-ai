import asyncio
import json
import base64
from typing import AsyncIterator, Optional

try:
    import websockets
except ImportError as e:  # pragma: no cover
    raise ImportError("pip install websockets for streaming support") from e

from .client import FishVoiceClient


class FishVoiceStream:
    """WebSocket live TTS stream. Yields audio chunks (bytes) as they arrive."""

    def __init__(self, client: FishVoiceClient):
        self.client = client

    async def stream(
        self,
        text: str,
        voice_id: Optional[str] = None,
        model: Optional[str] = None,
    ) -> AsyncIterator[bytes]:
        url = self.client.api_base.replace("https://", "wss://").replace("http://", "ws://")
        url = f"{url}/v1/tts/live?authorization={self.client.api_key}"
        async with websockets.connect(url) as ws:
            await ws.send(json.dumps({
                "text": text,
                "voice_id": voice_id or self.client.default_voice_id,
                "model": model or self.client.default_model,
            }))
            async for raw in ws:
                msg = json.loads(raw)
                if msg.get("type") == "tts.packet":
                    yield base64.b64decode(msg["data"])
                elif msg.get("type") == "tts.end":
                    break
                elif msg.get("type") == "error":
                    raise RuntimeError(msg.get("message", "stream error"))
