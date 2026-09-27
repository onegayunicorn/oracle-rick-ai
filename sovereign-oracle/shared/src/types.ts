// Shared contract types across Android bridge / backend / frontend PWA.

export interface SensorPayload {
  ts: number;            // epoch ms
  lux: number;           // ambient light
  cct: number;           // correlated color temperature (K)
  pressure: number;      // hPa
  pressureThreshold: number;
  deviceId: string;
  battery: number;       // 0-100
}

export interface NexusState {
  tick: number;
  patterns: Record<string, number>;  // EM-001..EM-007 -> value
  sensor: SensorPayload | null;
  cartridgeManifest: CartridgeManifest | null;
  lastUpdate: number;
}

export interface CartridgeManifest {
  version: string;
  pipeline: string;
  pressureThreshold: number;
  script: string;       // embedded QuickJS payload
  [k: string]: unknown;
}

export type WSMessage =
  | { type: 'state'; state: NexusState }
  | { type: 'sensor'; payload: SensorPayload }
  | { type: 'cartridge'; manifest: CartridgeManifest }
  | { type: 'error'; message: string };
