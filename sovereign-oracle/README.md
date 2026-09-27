# Sovereign Photonic Oracle

End-to-end development, CI, containerization, and production deployment
blueprint for the Sovereign Photonic Oracle ecosystem. Three cooperating layers:

1. **Edge / Mobile Bridge** — Android companion service (Kotlin) capturing
   physical sensor telemetry (Lux, CCT, pressure thresholds, file events) and
   streaming via WebSocket.
2. **Core Nexus Engine** — Node.js/TypeScript backend running the 20Hz
   mathematical calculation loop for the 7 Emergent Patterns (EM-001..EM-007)
   with pub/sub state synchronization.
3. **Client Presentation** — React/TypeScript PWA rendering WebGL/GLSL shaders
   with Von Kries / Bradford chromatic adaptation and a live HUD telemetry.

## Quick Start (dev)

```bash
pnpm install
docker compose -f deploy/docker-compose.dev.yml up --build
# backend  -> http://localhost:3000/healthz
# frontend -> http://localhost:5173
```

## Layout

```
sovereign-oracle/
├── android-bridge/   Kotlin foreground service + cartridge watcher
├── backend/          Nexus state engine (Node/TS, 20Hz loop)
├── frontend/         React PWA + WebGL + WebLLM (offline)
├── shared/           Shared TS types + Zod validation schemas
├── deploy/           docker-compose (dev/prod), Caddy, Nginx, GH Actions
└── tests/            Reproducible test harnesses (cartridge, mirror, analogical)
```
