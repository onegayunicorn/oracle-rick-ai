"""Live WebSocket TTS streaming example (requires `pip install websockets`)."""
import asyncio
import sys
sys.path.insert(0, "..")
from fish_voice import FishVoiceClient
from fish_voice.streaming import FishVoiceStream


async def main(text: str):
    client = FishVoiceClient()
    stream = FishVoiceStream(client)
    async for chunk in stream.stream(text):
        # In a real app: pipe chunk to audio output / forward to browser.
        print(f"received {len(chunk)} bytes of audio")


if __name__ == "__main__":
    asyncio.run(main(sys.argv[1] if len(sys.argv) > 1 else "Hello from the stream!"))
