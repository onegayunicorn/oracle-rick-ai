# Motion System

- Portal ring rotation: 12s infinite (outer), counter-rotating inner.
- HUD telemetry updates: 20Hz.
- Glow pulse: 1.2s.
- Camera transitions: 300ms.
- Sidebar slide: 250ms (framer-motion tween).
- Widget pulse: continuous.
- Avatar: breathing (1.2Hz), head wander (0.5Hz), sway (0.4Hz) procedural idle.
- Audio-reactive: camera + portal scale driven by WebAudio FFT (`u_AudioAmp`).
