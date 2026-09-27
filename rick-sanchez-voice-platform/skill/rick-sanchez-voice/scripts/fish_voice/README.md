# fish_voice — Python TTS client

Zero hard dependencies (stdlib only; `websockets` optional for live streaming).

```bash
pip install -e .
export FISH_API_KEY=sk-...
rick-tts "Wubba lubba dub dub!" -o rick.mp3
```

```python
from fish_voice import FishVoiceClient
c = FishVoiceClient()
audio = c.synthesize("Hello [laugh] world")
open("out.mp3", "wb").write(audio)
```
