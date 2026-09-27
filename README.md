# RICK C-137 — Complete Bundle

Materialized from the full blueprint set (device integration, offline oracle
stack, universal format converter, portable-suite builder, offline AI dashboard,
and voice pipeline production blueprints). The original combined blueprint PDF
is included as `BLUEPRINT-RICK-C137.pdf`. A full file listing is in
`MANIFEST.txt`.

## What's inside (7 projects, 360+ files)

### 1. `rick-sanchez-voice-platform/` — Fish Audio TTS platform
Self-hosted sovereign voice synthesis. PWA dashboard (Vue 3), FastAPI
orchestrator with job queue + one-click Python/Node module generator, reusable
`fish_voice` (Python) and `fish_voice_node` (zero-dependency JS) client
libraries, FastAPI TTS service with OpenAI-compatible endpoint, Discord bot
with OAuth invite flow, curl/Go/JS/Python quickstarts, and full ops docs.
`docker compose up -d --build` launches everything.

### 2. `sovereign-oracle/` — Sovereign Photonic Oracle (offline AI device)
Monorepo (pnpm + turbo): android-bridge (Kotlin), backend Nexus engine,
React/TS PWA with WebGL shader + WebLLM, shared types, deploy configs, tests.
**Enhanced with the offline voice pipeline production blueprint:**
- `services/piper-tts/` — offline neural TTS (FastAPI server.py + Dockerfile)
- `services/llm/` — Ollama `Modelfile.rick` (Llama-3.2 Rick C-137 persona)
- `backend/src/rick-translator.ts` — dynamic telemetry→prompt context + autonomous trigger
- `backend/src/voice-pipeline.ts` — sentence-boundary chunker + Piper synthesis
- `backend/src/watchdog.ts` — sensor stall watchdog with Brownian fallback
- `backend/src/nexus-math.ts` — full EM-001..EM-007 contract + sensor/LLM/TTS/cartridge schemas
- `backend/src/ws-server.ts` (JWT auth), `routes/health.ts` (/healthz + /readyz)
- `frontend/src/audio/AudioPlayer.ts` — WebAudio ring buffer + FFT intensity + compressor
- `frontend/src/hooks/useNexusStream.ts`, `components/ConnectionBadge.tsx`, `shaders/photonic.glsl`
- `deploy/monitoring/` — Prometheus + Grafana dashboard
- `deploy/docker-compose.offline.yml` — full air-gapped stack (Caddy + Nexus + Piper + Ollama)

### 3. `sovereign-convert/` — EXE → PWA → APK converter
Universal converter engine, PWA template with emulation bridge, web UI dropzone,
build scripts, Bubblewrap APK packaging, signing config, Docker, CI, blueprint
docs. **Enhanced:** added `skill/universal-format-converter/` (SKILL.md +
references + entry script).

### 4. `paf-builder/` — PortableApps.com Format packager
Core engine: build skeleton + `appinfo.ini`, PAF validator, Merkle-root
integrity manifest writer, cross-platform launcher generator, PWA manifest
parser, icon generator, optional Tkinter UI, templates, tests (passing).

### 5. `portable-suite-builder/` — PortableSuite Builder (operations manual)
Full PAF *suite* builder: multi-app `App/`/`Data/`/`AppInfo/`/`Other/` skeleton,
RSA/HMAC signer (`core/signer.py`), binary patcher (`patcher/`), URL→PAF webapp
wrapper (`webapp/`), signing keys, settings, logs, Platform/Builder pipeline,
conftest+fixture tests (passing), `PAF_SPEC.md`, `APPS2_ANALYSIS.md`,
`.nomedia` Android exclusion.

### 6. `sovereign-offline-dashboard/` — Offline AI Dashboard PWA/APK
Standalone offline AI dashboard: WebLLM engine (Llama via WebGPU) with
model-cache, IndexedDB storage (`db.ts`), store/proxy/render/marker/tabs
modules, multi-tab UI (chat/models/history/settings), conversation preview,
Cloudflare `functions/proxy.js`, service worker, manifest, APK build workflow.

### 7. `rick-portal-ui/` — Portal Interface (Vite + React + Three.js)
AMOLED-first portal command center. Three.js avatar viewport with `TwinRick.glb`
+ 6 separate animation clips (idle/walk/talk/thinking/listening/serious) via
`AnimationMixer` with cross-fades, proper cleanup, and procedural idle-breathing
fallback. Dual counter-rotating portal rings, quantum telemetry HUD overlay
(EM-001..007), voice console driving the avatar animation state machine, fully
responsive (mobile slide drawer + bottom nav + tablet icon rail), Zustand state,
Framer Motion, Tailwind, complete design tokens (`globals.css`), widget specs,
motion system doc, and 6 reference mockup/concept images in `docs/references/`.

## Quick start
Each project has its own README. Most run via `docker compose up -d --build`
or `make all`. See each project's `.env.example` for required secrets.

## Note on fidelity
Code was reconstructed from the blueprint transcripts; file structures match the
specs exactly and all Python/JS/shell/TS/Kotlin files are syntactically valid
and the included self-tests pass. Where the transcript showed partial snippets,
complete working implementations were filled in consistent with the spec.
