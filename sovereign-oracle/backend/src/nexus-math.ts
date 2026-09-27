// Detailed NexusState contract (EM-001..EM-007). Broadcast at 20Hz.
export interface NexusState {
  em001_decoherence: number;    // [0.0-1.0] Quantum Echo collapse rate
  em002_resonance: number;      // [0.0-1.0] 7.83 Hz Schumann pulse amplitude
  em003_fractalDim: number;     // Golden ratio baseline ~1.618 +/- temporal wave
  em004_entropy: number;        // Von Neumann entropy S ~0.6931
  em005_ricciCurvature: number; // Spacetime curvature R baseline ~0.042
  em006_consciousness: number;  // Integrated information Phi baseline ~0.87
  em007_bandgap: number;        // Photonic transmission factor (450-650nm)
  timestamp: number;
}

export interface SensorPacket {
  version: '1.0';
  source: 'samsung_a17' | 'simulator';
  timestamp: number;       // Unix epoch ms
  lux: number;             // 0.1 to 65535.0
  cct: number;             // 1000 to 12000 Kelvin
  burst_mode: boolean;     // true if delta > 2.0 lx
  battery_level: number;   // 0-100
  power_connected: boolean;
}

export interface LLMInquiryPayload {
  model: 'rick-c137';
  prompt: string;
  stream: boolean;
  options: {
    temperature: number;
    top_p: number;
    frequency_penalty: number;
    presence_penalty: number;
    stop: string[];
  };
}

export interface PiperSpeechRequest {
  text: string;
  length_scale?: number;
  noise_scale?: number;
  noise_w?: number;
}

export interface CartridgeDrop {
  cartridge_id: string;
  filename: string;
  byte_size: number;
  extracted_script: string;
  checksum_sha256: string;
  activation_pressure: number;
}
