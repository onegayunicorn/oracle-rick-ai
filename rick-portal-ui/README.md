# Rick C-137 Portal Interface — Vite + React + Three.js

AMOLED-first portal command center: Three.js avatar viewport with GLB animation
clips, animated portal rings, quantum telemetry HUD, voice console, fully
responsive (mobile drawer + bottom nav), Zustand state, Framer Motion.

## Install & Run
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # -> dist/ (PWA-ready static)
```

## Layout
```
src/
├── main.jsx, App.jsx
├── styles/globals.css            # design tokens + glass cards + glow + badges
├── state/useUIStore.js           # mobile menu (zustand)
├── hooks/                        # useResponsive, useAvatarState, useAvatarAnimations
├── components/layout/            # Header, DesktopSidebar, MobileDrawer, MobileNav, PromptBar, VoiceConsole
├── components/viewport/          # AvatarViewport, PortalBackground, TwinRickAvatar, TelemetryOverlay
└── components/panels/            # History, Inventions, Downloads, Status, Settings
public/assets/avatar/             # TwinRick.glb + animations/ (idle/walk/talk/thinking/listening/serious)
docs/                             # DESIGN_SYSTEM, WIDGETS, MOTION_SYSTEM, VISUAL_ASSETS + reference images
```

## Avatar Animation Flow
Voice Input -> Thinking.glb -> LLM responds -> Talk.glb -> Idle.glb;
navigation -> Walk.glb; error -> Serious.glb; missing clip -> fallback to Idle
-> procedural idle breathing (always alive).
