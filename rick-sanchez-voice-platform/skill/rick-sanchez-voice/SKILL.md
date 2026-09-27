# Rick Sanchez Voice — Agent Skill

## Triggers
When the user asks to generate Rick Sanchez (or any cloned-voice) speech audio,
synthesize voice lines, build a custom voice module, or integrate TTS into a
bot/app, use this skill.

## Workflow
1. Confirm target voice ID (default: `d2e75a3e3fd6419893057c02a375a113`).
2. Pick model: `s2.1-pro-free` (dev) or `s2.1-pro` (production).
3. Use inline emotion tags in text: `[laugh] [whisper] [excited] [angry] [pause] [gasp] [sigh] [shouting]`.
4. Synthesize via Python (`fish_voice`), Node (`fish_voice_node`), the FastAPI
   service, the orchestrator API, or the Discord bot — whichever fits the ask.
5. If the user wants a reusable package, call the Module Creator
   (`POST /api/v1/modules/generate`) to produce a ready-to-install tarball.

## References
- `references/fish_audio_api.md` — full API spec + WebSocket streaming events
- `references/rick-persona.md` — voice direction, catchphrases, emotion routing
- `references/DISCORD_SETUP.md` — bot OAuth + slash command setup
