# Rick Sanchez Voice Platform

A self-hosted, sovereign voice synthesis platform built around Fish Audio TTS —
featuring a PWA dashboard, central orchestrator, reusable code modules, Discord
integration, and one-click voice package generation.

## Quick Start

```bash
cp .env.example .env       # set FISH_API_KEY (and Discord vars if using the bot)
docker compose up -d --build
# PWA Dashboard  -> http://localhost:8080
# Orchestrator   -> http://localhost:8002/api/v1/health
# FastAPI TTS    -> http://localhost:8000/health
# Discord invite -> http://localhost:8001/invite
```

## Components

| Component | Port | Tech | Purpose |
|---|---|---|---|
| PWA Dashboard | 8080 | Vue 3 + Vite + Nginx | UI — synthesize, create modules, status |
| Orchestrator | 8002 | FastAPI / Python 3.12 | Central API — jobs, module generation, routing |
| FastAPI TTS Service | 8000 | FastAPI | Direct TTS endpoint + OpenAI/ElevenLabs compat layer |
| Discord Bot + Auth | 8001 | discord.py + FastAPI | OAuth invite flow + `/rick` slash commands |
| Fish Voice (Python) | — | stdlib only | Reusable client — sync/async, streaming, retry |
| Fish Voice (Node) | — | Node >= 18 | Zero-dependency JS client |

## Layout

```
rick-sanchez-voice-platform/
├── README.md, LICENSE, .env.example, docker-compose.yml
├── docs/                 TECHNICAL_MANUAL, API_REFERENCE, DEPLOYMENT_GUIDE, ...
├── orchestrator/         FastAPI control plane + module creator
├── pwa-dashboard/        Vue 3 PWA (offline-capable)
├── skill/rick-sanchez-voice/   Agent skill + Python/Node client libraries + integrations
└── examples/             quickstart.py / .js / .go + curl.sh
```

Default model: `s2.1-pro-free` (free tier). Use `s2.1-pro` for production.
Default voice ID: `d2e75a3e3fd6419893057c02a375a113`.
