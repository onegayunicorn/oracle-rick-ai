# Rick Sanchez Voice Platform — Technical Manual
Version 1.0.0 | Stack: Python 3.12, FastAPI, Vue 3, Docker, Node 22

## 1. System Overview
Self-hosted sovereign voice synthesis around Fish Audio TTS: PWA dashboard,
central orchestrator, reusable modules, Discord bot, one-click module generation.

## 2. Architecture
PWA Dashboard (:8080) -> Orchestrator (:8002 /api/v1/*) -> Fish Audio API
                                    |-> FastAPI TTS (:8000)
                                    |-> Discord Bot + Auth (:8001)

## 3. Deployment
`cp .env.example .env && docker compose up -d --build`

## 4. Config
See `.env.example`. Key vars: FISH_API_KEY (required), FISH_MODEL, FISH_VOICE_ID,
VITE_ORCHESTRATOR_URL, DISCORD_* (optional).

## 5. API
POST /api/v1/synthesize -> job; GET /api/v1/jobs/{id} -> poll;
GET /api/v1/jobs/{id}/download -> audio; POST /api/v1/modules/generate -> tar.gz.

## 6. Operations
`docker compose logs -f orchestrator`. Backup .env + voice IDs. Persist job data
by swapping in Redis. See TROUBLESHOOTING.md for 402/403/timeout fixes.
