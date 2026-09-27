import type { NexusState, SensorPayload, CartridgeManifest } from '@oracle/shared';

// The 7 Emergent Patterns computed on the 20Hz loop.
export const PATTERN_IDS = ['EM-001', 'EM-002', 'EM-003', 'EM-004', 'EM-005', 'EM-006', 'EM-007'] as const;

export class NexusEngine {
  state: NexusState;
  onTick: (s: NexusState) => void = () => {};
  private timer: NodeJS.Timeout | null = null;
  private history: SensorPayload[] = [];

  constructor(private tickMs: number) {
    this.state = {
      tick: 0,
      patterns: Object.fromEntries(PATTERN_IDS.map((id) => [id, 0])),
      sensor: null,
      cartridgeManifest: null,
      lastUpdate: Date.now(),
    };
  }

  ingest(s: SensorPayload) {
    this.state.sensor = s;
    this.history.push(s);
    if (this.history.length > 256) this.history.shift();
  }

  setCartridge(m: CartridgeManifest) {
    this.state.cartridgeManifest = m;
  }

  start() {
    this.timer = setInterval(() => this.step(), this.tickMs);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
  }

  private step() {
    const s = this.state;
    s.tick += 1;
    const t = s.tick;
    const sensor = s.sensor;
    const lux = sensor?.lux ?? 0;
    const cct = sensor?.cct ?? 6500;
    const pressure = sensor?.pressure ?? 1013;

    // EM-001: photonic flux (normalized lux)
    s.patterns['EM-001'] = Math.min(1, lux / 1000);
    // EM-002: chromatic drift (CCT deviation from D65)
    s.patterns['EM-002'] = Math.tanh((cct - 6500) / 3000);
    // EM-003: barometric delta
    s.patterns['EM-003'] = (pressure - 1013) / 40;
    // EM-004..EM-007: derived oscillator phases
    s.patterns['EM-004'] = Math.sin(t * 0.01) * 0.5 + 0.5;
    s.patterns['EM-005'] = Math.cos(t * 0.017) * 0.5 + 0.5;
    s.patterns['EM-006'] = (s.patterns['EM-001'] + s.patterns['EM-004']) / 2;
    s.patterns['EM-007'] = Math.abs(s.patterns['EM-002'] - s.patterns['EM-005']);

    // Cartridge script hook (QuickJS-style; here evaluated via Function sandbox-free stub)
    const manifest = s.cartridgeManifest;
    if (manifest && typeof manifest.script === 'string' && manifest.script.length < 4096) {
      try {
        // eslint-disable-next-line no-new-func
        const fn = new Function('pressure', 'state', manifest.script);
        fn(pressure, s);
      } catch {
        /* cartridge script error — ignore */
      }
    }

    s.lastUpdate = Date.now();
    this.onTick({ ...s, patterns: { ...s.patterns } });
  }
}
