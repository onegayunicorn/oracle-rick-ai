# RICK C-137 Sovereign Oracle — Operations Manual & Technical Overview

**Version:** 3.0.0
**Scope:** Complete bundle — 7 projects, 360+ files
**Security posture:** 100% air-gap capable, zero cloud APIs, zero API keys, zero subscriptions
**Source blueprints:** Device Integration & Deployment Blueprint, Offline Oracle Stack, Universal Format Converter, PortableSuite Builder, Offline AI Dashboard, Voice Pipeline Production Blueprint, Portal Interface UI Package

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [Project 1 — Rick Sanchez Voice Platform (Fish Audio TTS)](#3-project-1--rick-sanchez-voice-platform)
4. [Project 2 — Sovereign Photonic Oracle (Offline AI Device)](#4-project-2--sovereign-photonic-oracle)
5. [Project 3 — Sovereign Convert (EXE → PWA → APK)](#5-project-3--sovereign-convert)
6. [Project 4 — PAF Builder](#6-project-4--paf-builder)
7. [Project 5 — PortableSuite Builder](#7-project-5--portablesuite-builder)
8. [Project 6 — Sovereign Offline AI Dashboard](#8-project-6--sovereign-offline-ai-dashboard)
9. [Project 7 — Rick Portal UI](#9-project-7--rick-portal-ui)
10. [Cross-Cutting Data Contracts](#10-cross-cutting-data-contracts)
11. [Production Safeguards, Watchdogs & Circuit Breakers](#11-production-safeguards-watchdogs--circuit-breakers)
12. [Deployment Gates & Runbook](#12-deployment-gates--runbook)
13. [Design & Motion System](#13-design--motion-system)
14. [Testing & Validation](#14-testing--validation)
15. [Troubleshooting FAQ](#15-troubleshooting-faq)

---

## 1. Executive Summary

The bundle materializes a sovereign, offline-first "Rick Sanchez of Dimension C-137" AI persona stack. It spans **voice synthesis**, an **edge AI device** (Samsung Galaxy A17 sensor node + local container mesh), a **universal format converter** (legacy binaries → PWA → APK), **portable-app packaging** (PAF + suites), an **offline AI dashboard PWA**, and a **Three.js portal command-center UI**.

Every component is designed to run without internet after first setup: local LLM (Ollama/Llama-3.2), local neural TTS (Piper ONNX), local WebLLM (WebGPU), local sensor telemetry. No `api.fish.audio`, OpenAI, or Discord gateway calls are required in the air-gapped topology.

| # | Project | Stack | Primary ability |
|---|---|---|---|
| 1 | rick-sanchez-voice-platform | Vue3 PWA + FastAPI + Python/JS clients + Discord bot | Self-hosted Fish Audio TTS with one-click module generation |
| 2 | sovereign-oracle | Kotlin + Node/TS + React/TS WebGL + Docker + Caddy | Offline AI device: sensor→Nexus(EM-001..007)→LLM→TTS→PWA |
| 3 | sovereign-convert | Python/FastAPI + PWA template + Bubblewrap + Docker | EXE/MSI/zip → PWA → signed APK |
| 4 | paf-builder | Python (Click + Pillow) | Single-app PortableApps.com Format packaging |
| 5 | portable-suite-builder | Python (cryptography) | Multi-app PAF suites with RSA/HMAC signing + binary patching |
| 6 | sovereign-offline-dashboard | Vite + TS + WebLLM + IndexedDB + Cloudflare Functions | Standalone offline AI chat dashboard PWA/APK |
| 7 | rick-portal-ui | Vite + React19 + Three.js/R3F + Zustand + Framer Motion | AMOLED portal command center with GLB avatar animation |

---

## 2. System Architecture Overview

### 2.1 Air-gapped topology (sovereign-oracle)

```
SAMSUNG GALAXY A17 (edge sensor node)
  AmbientPhotonicService.kt (foreground, adaptive hysteresis 1Hz→20Hz)
  CascadeFileObserver.kt (PNG cartridge drop → QuickJS)
  OracleWebSocketClient.kt → WSS over LAN/USB-ADB
        │
        ▼  ws://host:3000  (sensor_update @ 1-20Hz, cartridge_drop)
LOCAL HOST (Linux container mesh)
  ┌─ Caddy v2 (TLS, HTTP/3, WSS multiplex, static PWA) :80/:443
  ├─ Nexus Engine (Node/TS, 20Hz loop, EM-001..EM-007, pub/sub) :3000
  │    ├─ RickTranslatorService (telemetry→prompt context, autonomous triggers)
  │    ├─ SentenceChunkerPipeline (token stream → sentence → Piper PCM)
  │    ├─ SensorWatchdog (2.5s stall → Brownian fallback)
  │    └─ ws-server (Socket.io + JWT) + /healthz /readyz
  ├─ Ollama (Llama-3.2-3B-Q4_K_M, Modelfile.rick persona) :11434
  ├─ Piper TTS (ONNX, rick_c137 voice) :8000  → /v1/audio/speech, /v1/audio/stream
  └─ Sovereign PWA Client (React, WebGL shader, WebAudio ring buffer, WebLLM)
```

### 2.2 Data flow

Optical shift / user query → Ollama token stream → sentence chunker (split on `[.!?\n]`, strip `*_#`) → Piper synthesis (22050Hz 16-bit mono PCM) → WebAudio gapless playback → FFT intensity → shader uniform `u_AudioAmp` → photonic lattice bloom.

### 2.3 Port matrix

| Service | Port | Network |
|---|---|---|
| Caddy | 80, 443 (+443/udp HTTP/3) | edge |
| Nexus Engine | 3000 | internal mesh |
| Piper TTS | 8000 | internal mesh |
| Ollama | 11434 | internal mesh |
| Voice orchestrator | 8000 (configurable) | edge |
| TTS service (OpenAI-compatible) | 8001 | edge |
| Converter API | 8090 | edge |
| Portal UI dev | 5173 | local |
| Offline dashboard dev | 5173 | local |

---

## 3. Project 1 — Rick Sanchez Voice Platform

**Path:** `rick-sanchez-voice-platform/`

### 3.1 Modules

| Module | Tech | Role |
|---|---|---|
| `dashboard/` (Vue 3 PWA) | Vue3 + Vite | Operator dashboard: jobs, voices, audio preview, settings |
| `orchestrator/` (FastAPI) | Python FastAPI + asyncio queue | Job queue, module generator, task lifecycle |
| `orchestrator/module_creator.py` | Python | One-click generation of `fish_voice` Python + `fish_voice_node` JS client modules |
| `fish_voice/` | Python package | Reusable TTS client (sync + async, streaming) |
| `fish_voice_node/` | Zero-dependency JS | Browser/Node client (fetch + WebSocket streaming) |
| `tts-service/` (FastAPI) | Python FastAPI | OpenAI-compatible `/v1/audio/speech` endpoint |
| `discord-bot/` | discord.py | Slash commands + OAuth invite flow, `/speak`, `/voice` |
| `examples/` | py/js/go/curl | Quickstart snippets |
| `docs/` | markdown | Ops, API reference, scaling |

### 3.2 Key endpoints (orchestrator)

- `POST /jobs` — enqueue synthesis job (text, voice_id, format)
- `GET /jobs/{id}` — job status + audio URL
- `POST /modules/generate` — generate client module for a language
- `GET /voices` — list available voice models

### 3.3 Key endpoints (tts-service, OpenAI-compatible)

- `POST /v1/audio/speech` — `{model, input, voice, response_format}` → audio/mpeg or wav
- `GET /health` — liveness

### 3.4 Operations

```bash
docker compose up -d --build        # full stack
# or per-component:
cd orchestrator && uvicorn app:app --port 8000
cd tts-service && uvicorn app:app --port 8001
```
Env: `FISH_API_KEY` (only if using hosted Fish; omit for air-gapped Piper path), `DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`.

---

## 4. Project 2 — Sovereign Photonic Oracle

**Path:** `sovereign-oracle/` (pnpm + turbo monorepo)

### 4.1 android-bridge (Kotlin)

| File | Role |
|---|---|
| `AmbientPhotonicService.kt` | Foreground service; adaptive hysteresis (1Hz idle → 20Hz burst on Δlux>2.0); partial wake lock; <15% battery → 0.2Hz ultra-low |
| `OracleWebSocketClient.kt` | WSS client with exponential backoff, JWT auth |
| `CascadeFileObserver.kt` | Watches storage dir; on PNG drop → parse tEXt chunk → QuickJS cartridge manifest → `cartridge_drop` event |
| `BootReceiver.kt` | Auto-start service on boot |
| `GlanceWidgetReceiver.kt` | Home-screen status widget (Quick Portal / Status Pulse) |
| `AndroidManifest.xml`, `build.gradle.kts` | Foreground service type, permissions, Glance |

### 4.2 backend (Node/TS)

| File | Role |
|---|---|
| `nexus-engine.ts` | 20Hz loop; computes EM-001..EM-007; pub/sub broadcast |
| `nexus-math.ts` | Contracts: `NexusState`, `SensorPacket`, `LLMInquiryPayload`, `PiperSpeechRequest`, `CartridgeDrop` |
| `rick-translator.ts` | `RickTranslatorService`: `buildSystemContext()` injects [TELEMETRY SNAPSHOT]; `evaluateAutonomousTrigger()` (15s cooldown, Δlux>50 or EM-005>0.051); `executeOracleInquiry()` LLM→TTS pipeline |
| `voice-pipeline.ts` | `SentenceChunkerPipeline`: async generator; token stream → sentence boundary → Piper PCM → ordered `AudioStreamEvent` |
| `watchdog.ts` | `SensorWatchdog`: feed/checkHealth; >2500ms stall → synthetic Brownian fallback |
| `ws-server.ts` | Socket.io + JWT middleware |
| `routes/health.ts` | `/healthz`, `/readyz` probes |
| `index.ts` | Express app, wiring |

### 4.3 The Seven Emergent Patterns (EM-001..EM-007)

| ID | Name | Baseline | Meaning |
|---|---|---|---|
| EM-001 | Quantum Decoherence Γ | ~0.05 | Optical collapse rate; >0.055 → *burp* vocal modifier |
| EM-002 | Schumann Resonance | 7.83Hz | Pulse amplitude; drives shader `u_EM002_Reson` |
| EM-003 | Fractal Dimension D_H | ~1.618 | Golden-ratio baseline ± temporal wave |
| EM-004 | Von Neumann Entropy S | ~0.6931 | Information-theoretic state |
| EM-005 | Ricci Curvature R | ~0.042 | >0.046 "TEMPORAL FLUX HIGH"; >0.051 autonomous trigger |
| EM-006 | Consciousness Φ | ~0.87 | Integrated information proxy |
| EM-007 | Photonic Bandgap | 450-650nm | <0.3 → "SUPPRESSED" absorption |

### 4.4 services (offline inference)

- `services/piper-tts/` — FastAPI `server.py` (`/v1/audio/speech` WAV, `/v1/audio/stream` raw PCM, `/healthz`), multi-arch Dockerfile (amd64/arm64), expects `models/rick_c137.onnx` + `.onnx.json`.
- `services/llm/` — `Modelfile.rick` (Llama-3.2-3B-Q4_K_M, temp 0.85, top_p 0.92, freq_penalty 0.4, pres_penalty 0.6, C-137 persona system prompt). Build: `ollama create rick-c137 -f Modelfile.rick`.

### 4.5 frontend (React/TS PWA)

- `App.tsx`, `main.tsx`, `vite.config.ts`
- `shaders/photonic.glsl` — vertex/fragment: Bradford/Von Kries chromatic adaptation, audio-reactive distortion (`u_AudioAmp`), warmth from CCT
- `audio/AudioPlayer.ts` — `SovereignAudioPlayer`: gapless ring-buffer scheduling, `DynamicsCompressorNode` clamp, FFT `getAudioIntensity()` 0-1, `interrupt()` preemption
- `hooks/useNexusStream.ts` — WebSocket → NexusState + connected flag
- `components/ConnectionBadge.tsx` — AIR-GAP OK / RECONNECTING badge
- WebLLM integration (Llama-3 via WebGPU, service-worker-cached weights)

### 4.6 shared & deploy

- `shared/src/types.ts` + Zod schemas — contract between Android/Node/PWA
- `deploy/` — `docker-compose.dev.yml`, `docker-compose.prod.yml`, `docker-compose.offline.yml` (Caddy+Nexus+Piper+Ollama), `caddy/Caddyfile` (auto-HTTPS, WSS reverse proxy), `nginx/`, `monitoring/prometheus.yml` + Grafana dashboard, `.github/workflows/` (CI, backend/frontend deploy, Android APK)
- `tests/` — `test_cartridge_injector.py`, `test_mirror_latency.py`, `test_analogical.py` (all passing)

---

## 5. Project 3 — Sovereign Convert

**Path:** `sovereign-convert/`

### 5.1 Pipeline

`Input (.exe/.msi/.bat/.sh/.html/.zip)` → `scripts/convert.py` (FastAPI serve mode) → PWA (`pwa-template/` with emulation bridge `js/dos-runner.js`) → optional APK via Bubblewrap (`scripts/build-apk.sh`) or PWABuilder.

### 5.2 Modules

| Path | Role |
|---|---|
| `scripts/convert.py` | Conversion engine: `exe_to_pwa()`, `pwa_to_apk()`, sha256, FastAPI `/api/convert`, `/api/builds` |
| `scripts/setup.sh` | Installs emsdk, bubblewrap, JDK, deps |
| `scripts/build-pwa.sh` / `build-apk.sh` / `serve-local.sh` | Stage scripts |
| `pwa-template/` | `index.html`, `manifest.json`, `sw.js` (offline cache), `js/dos-runner.js` (emulation bridge), `js/converter-ui.js` (fullscreen + install prompt), `icons/`, `assets/app.bin` |
| `web-ui/` | Dropzone UI (`app.js`, `styles.css`, `config.json`, `limits.json`) |
| `config/signing-env.sh.example` | Bubblewrap keystore config |
| `skill/universal-format-converter/` | Agent skill: `SKILL.md` + references + `convert.sh` entrypoint |
| `Dockerfile`, `docker-compose.yml`, `.github/workflows/build-apk.yml` | Container + CI |
| `docs/` | EXE-TO-PWA, EXE-TO-APK, GENERAL-CONVERT |

Limits: max 200 MB upload; allowed types `.exe .msi .bat .cmd .sh .html .zip`.

---

## 6. Project 4 — PAF Builder

**Path:** `paf-builder/`

Single-app PortableApps.com Format packager. Core (`src/paf_builder/core/`):

| Module | Role |
|---|---|
| `build_engine.py` | `build_skeleton()` → App/, Data/, AppInfo/appinfo.ini; `copy_app_payload()` |
| `validator.py` | PAF spec compliance (required paths + ini sections) |
| `manifest_writer.py` | SHA256 per file → Merkle root → `build_manifest.json` |
| `launcher_generator.py` | `[Name].bat` (Windows) + `[Name].sh` (POSIX, chmod +x) |
| `pwa_manifest_parser.py` | PWA manifest.json → PAF metadata |
| `icon_generator.py` | Pillow: .ico (16-256) + .png |
| `builder_ui.py` | Optional Tkinter GUI |
| `__main__.py` | CLI: `--input --name --version --out` → build + validate + manifest + zip |

Tests (`tests/test_builder.py`) pass.

---

## 7. Project 5 — PortableSuite Builder

**Path:** `portable-suite-builder/`

Multi-app PAF *suite* builder (superset of paf-builder). Distinctive modules:

| Module | Role |
|---|---|
| `core/signer.py` | RSA (PKCS1v15/SHA256) + HMAC-SHA256 signing; `generate_keypair()` |
| `patcher/binary_patcher.py` | Offset-based binary patches `(offset, expected, replacement)` with mismatch guard |
| `webapp/url_wrapper.py` | URL → PAF wrapper (`.url` + `.bat` launchers) |
| `core/build_engine.py` | Suite skeleton: App/, Data/, AppInfo/, Other/Source/, `.nomedia` (Android gallery exclusion), `Suite=true` in appinfo.ini |
| `Platform/Builder/pipeline.json` | Stages: build→validate→sign→manifest→package |
| `signing/`, `keys/`, `settings/`, `logs/`, `shared/`, `assets/`, `help/`, `Docs/` | Ops directories |
| `tests/` | `conftest.py` (build_dir fixture) + `test_suite.py` (passing) + `fixtures/sample_manifest.json` |
| `PAF_SPEC.md`, `APPS2_ANALYSIS.md` | Spec + source-attribution policy |

---

## 8. Project 6 — Sovereign Offline AI Dashboard

**Path:** `sovereign-offline-dashboard/`

Standalone offline AI chat dashboard PWA/APK (no backend needed).

| Module | Role |
|---|---|
| `src/webllm/engine.ts` | `initEngine()` → `CreateMLCEngine` (Llama-3.2-3B via WebGPU), progress badge; `generate(prompt)` |
| `src/webllm/config.ts` | Model id, context window, temp/top_p |
| `src/db.ts` | IndexedDB (idb): conversations, settings, model-cache stores |
| `src/store.ts` / `store-context.ts` | AppState + reactive context |
| `src/proxy.ts` | Optional same-origin model-weight proxy (`functions/proxy.js` Cloudflare) |
| `src/render.ts`, `tabs.ts`, `marker.ts` | Dashboard render, 4 tabs (chat/models/history/settings), conversation bookmarks |
| `src/storage/conversations.ts`, `src/preview/markdown.ts`, `src/model-cache/` | Persistence + rendering + cache |
| `public/service-worker.js` | App cache + `webllm-models-v1` cache (weights cached for offline) |
| `public/manifest.json` | PWA manifest (standalone, theme #22d3ee) |
| `.github/workflows/build-apk.yml` | Bubblewrap APK CI |

---

## 9. Project 7 — Rick Portal UI

**Path:** `rick-portal-ui/` (Vite + React 19 + Three.js/R3F + Zustand + Framer Motion + Tailwind)

### 9.1 Layout (responsive grid)

```
<Header (h-12, menu toggle on mobile)>
<MobileDrawer (AnimatePresence, 250ms slide, backdrop)>
<flex: DesktopSidebar (lg:w-72, 5 nav items) | AvatarViewport (Canvas) | TelemetryOverlay (md+, EM-001..007)>
<PromptBar (voice input; drives avatar state machine)>
<MobileNav (bottom, lg:hidden)>
```

Breakpoints: mobile <768 (drawer + bottom nav), tablet 768-1023 (80px icon rail), desktop ≥1024 (280px sidebar + 320px HUD).

### 9.2 Avatar animation system (production-safe)

- `hooks/useAvatarAnimations.js` — loads 6 separate GLB clips (`animations/{idle,walk,talk,thinking,listening,serious}.glb`) + `useGLTF.preload` for all 7 assets (no hitching).
- `viewport/TwinRickAvatar.jsx` — `AnimationMixer` on group ref; clip resolution with fallback chain: `clips[current] || clips.Idle` → if none, **procedural idle** (breathing `sin(t*1.2)*0.025`, head wander `sin(t*0.5)*0.08`, sway `sin(t*0.4)*0.02`). Cross-fade 0.3s. Cleanup: `stopAllAction()` + `uncacheRoot()` on unmount. `<primitive dispose={null}>` prevents geometry-dispose warnings.
- `hooks/useAvatarState.js` (Zustand) — `currentAnimation`, `setAnimation()`.
- `state/animationMap.js` — logical→clip mapping (idle→Idle, listening→Listening, processing→Thinking, speaking→Talk, walking→Walk, serious→Serious).
- `layout/PromptBar.jsx` — on send: Listening (0s) → Thinking (0.8s) → Talk (2s) → Idle (5s).

Flow: Voice Input → Thinking.glb → LLM responds → Talk.glb → Idle.glb; navigation → Walk.glb; error → Serious.glb; missing clip → Idle.glb → procedural idle.

### 9.3 Three.js viewport

- `AvatarViewport.jsx` — Canvas camera `[0,1.5,5]` fov50; ambient + directional `#00ffaa` light; `Environment preset="city"`.
- `PortalBackground.jsx` — dual torus rings: outer (r=3, `#00ffaa`, emissiveIntensity 3) rotates +; inner (r=2.25, `#ff45e0`, intensity 2) counter-rotates and scale-pulses `1+sin(t)*0.03`.
- `TelemetryOverlay.jsx` — glass card top-right, EM-001..007 live values.

### 9.4 Design tokens (`styles/globals.css`)

AMOLED black `#000000`; portal green `#00FFAA` (primary), blue `#44AAFF`, orange `#FF7A45`, magenta `#FF45E0`; `.portal-card` glass (blur 12px, 16px radius); `.portal-glow`; status badges online/thinking/error; JetBrains Mono telemetry font.

### 9.5 Widgets & docs

`docs/WIDGETS.md` — 1×1 Quick Portal, 2×2 Status Pulse, 4×2 Memory Timeline, 4×1 Invention Preview. `docs/MOTION_SYSTEM.md` — portal 12s, HUD 20Hz, glow 1.2s, camera 300ms, sidebar 250ms. `docs/DESIGN_SYSTEM.md`, `docs/VISUAL_ASSETS.md`. `docs/references/` — 6 reference mockup/concept images.

---

## 10. Cross-Cutting Data Contracts

All inter-service communication is governed by TypeScript interfaces + Zod schemas (`sovereign-oracle/shared/`, `backend/src/nexus-math.ts`).

| Contract | Channel | Fields |
|---|---|---|
| `SensorPacket` | WSS `sensor_update` | version, source (samsung_a17/simulator), timestamp, lux 0.1-65535, cct 1000-12000K, burst_mode, battery_level, power_connected |
| `NexusState` | WSS `nexus_tick` @20Hz | em001_decoherence, em002_resonance, em003_fractalDim, em004_entropy, em005_ricciCurvature, em006_consciousness, em007_bandgap, timestamp |
| `LLMInquiryPayload` | HTTP Ollama `/api/generate` | model=rick-c137, prompt (with [TELEMETRY SNAPSHOT]), stream, options (temp 0.85, top_p 0.92, freq_penalty 0.4, pres_penalty 0.6, stop ["Human:","User:","[TELEMETRY]"]) |
| `PiperSpeechRequest` | HTTP `/v1/audio/speech` | text (≤200 chars/chunk), length_scale 1.05, noise_scale 0.667, noise_w 0.8 |
| `CartridgeDrop` | WSS `cartridge_drop` | cartridge_id (UUIDv4), filename, byte_size, extracted_script (QuickJS), checksum_sha256, activation_pressure |
| `AudioStreamEvent` | internal | chunkIndex, textChunk, pcmBuffer (4096-byte 22050Hz mono), isFinal |

---

## 11. Production Safeguards, Watchdogs & Circuit Breakers

1. **Sensor stall watchdog** (`watchdog.ts`) — >2.5s no packet → synthetic Brownian light engine; PWA never freezes.
2. **Audio queue circuit breaker** — max 2 pending spoken sentences; optical shock Δlux>100 → flush queue + `audioPlayer.interrupt()` + high-priority reaction.
3. **Audio clamping** — `DynamicsCompressorNode` in WebAudio prevents headphone clipping.
4. **Samsung A17 low-power safeguard** — battery ≤15% → 0.2Hz polling, release wake lock.
5. **Prompt injection guardrails** — queries capped 300 chars; wrapped in `[USER_QUERY]...[/USER_QUERY]`; system prompt instructs model to ignore override attempts inside that block.
6. **AnimationMixer memory safety** (`TwinRickAvatar.jsx`) — `stopAllAction()` + `uncacheRoot()` on unmount; `dispose={null}`; clip fallback prevents `undefined.play()` crashes.
7. **Merkle-root integrity** (paf-builder, portable-suite-builder) — every build emits `build_manifest.json` with per-file SHA256 + Merkle root; suites optionally RSA/HMAC signed.
8. **JWT auth** (`ws-server.ts`) — all socket connections verified with `AUTH_TOKEN`.
9. **Health probes** — `/healthz` (liveness), `/readyz` (readiness, checks Ollama+Piper).

---

## 12. Deployment Gates & Runbook

**Gate 1 (Day 1) Sensor & Network:** Android service connects over LAN; hysteresis confirmed (1Hz stationary → 20Hz burst); zero dropped sockets over 60 min.
**Gate 2 (Day 2) Air-Gapped Cognitive Core:** disconnect WAN; Ollama first token <400ms; Piper 15-word sentence <100ms.
**Gate 3 (Day 3) Audio & Shader:** WebAudio gapless playback; `u_AudioAmp` modulates shader uniformly.
**Gate 4 (Day 4) Thermal/Battery:** 8-hour A17 run; drain <3%/hour nominal.

**Full offline stack:** `docker compose -f deploy/docker-compose.offline.yml up -d` (Caddy + Nexus + Piper + Ollama + frontend).

**Env vars:** `BACKEND_AUTH_SECRET`, `OLLAMA_URL` (default http://llm:11434), `PIPER_URL` (default http://piper-tts:8000), `PIPER_MODEL`, `TICK_RATE_MS=50`, `VITE_API_URL`, `VITE_WS_URL`, `VITE_PORTAL_MODE=oracle`.

---

## 13. Design & Motion System

- **Visual:** AMOLED-first, glassmorphism panels, cyan-green portal glow, sci-fi lab/portal-core aesthetic, sovereign dashboard feel.
- **Typography:** Orbitron (titles), JetBrains Mono (telemetry/HUD).
- **Motion:** portal ring 12s rotation; HUD 20Hz; glow pulse 1.2s; camera transitions 300ms; sidebar slide 250ms; widget pulse continuous; audio-reactive portal scaling.
- **Hierarchy:** primary = avatar + voice + portal status; secondary = telemetry + memory + inventions; tertiary = downloads + logs + settings.

---

## 14. Testing & Validation

| Test | Project | Status |
|---|---|---|
| `test_analogical.py` | sovereign-oracle | PASS (analogical policy derived without pre-programming) |
| `test_cartridge_injector.py` | sovereign-oracle | PASS |
| `test_mirror_latency.py` | sovereign-oracle | PASS |
| `test_convert.py` | sovereign-convert | PASS (exe→pwa structure + manifest) |
| `test_builder.py` | paf-builder | PASS (build + validate + merkle) |
| `test_suite.py` | portable-suite-builder | PASS (full pipeline + .nomedia) |

All Python compiles; all shell scripts pass `bash -n`; zip integrity verified.

---

## 15. Troubleshooting FAQ

**Q: Avatar doesn't animate / `Cannot read properties of undefined (reading 'play')`?**
A: A GLB clip is missing. The fallback chain handles it gracefully (Idle → procedural breathing). Ensure `public/assets/avatar/animations/*.glb` exist; export from Blender with Animation + NLA + Skinning + Armature.

**Q: `R3F: Hooks can only be used inside Canvas`?**
A: `TwinRickAvatar`/`PortalBackground` must be rendered inside `<Canvas>` (they are, in `AvatarViewport.jsx`). Don't call `useFrame` at App level.

**Q: Piper returns 500?**
A: `models/rick_c137.onnx` + `.onnx.json` missing; check `PIPER_MODEL`/`PIPER_CONFIG` env; `/healthz` reports loaded model.

**Q: APK build fails?**
A: Bubblewrap needs a reachable `manifest.json` over HTTPS (or localhost via `serve-local.sh`). Configure `config/signing-env.sh` keystore, or use PWABuilder as fallback.

**Q: Android service gets killed by One UI?**
A: Foreground service type + 24hr wake lock + BootReceiver; disable battery optimization for the app; ≤15% battery intentionally drops to 0.2Hz.

**Q: WebLLM won't load?**
A: Requires WebGPU (Chrome/Edge 113+). Service worker caches weights on first download; check `model-badge` state (loading % / ready / error).

---

*End of operations manual. See per-project README.md and MANIFEST.txt for file-level detail.*
