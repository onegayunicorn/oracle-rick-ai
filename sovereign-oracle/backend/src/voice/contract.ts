/**
 * Unified Voice Contract — Rick C-137 Sovereign Oracle
 * =====================================================
 * Every TTS backend (Piper, Coqui, Fish, xAI, Browser) implements VoiceProvider.
 * Clients always call POST /v1/speech — never provider-specific endpoints.
 *
 * Piper audio format: mono · 16-bit PCM · 22050 Hz WAV
 * Model pair: rick_c137.onnx + rick_c137.onnx.json
 * Quantization: FP32 reference; INT8/FP16 only after ORT verification.
 * Q4_K_M / Q8_0 are NOT Piper voice labels.
 */

export type AudioFormat = 'mp3' | 'wav' | 'pcm' | 'ogg';
export type Emotion =
  | 'idle'
  | 'rant'
  | 'sarcasm'
  | 'serious'
  | 'drunk'
  | 'excited'
  | 'tech';
export type ProviderName = 'piper' | 'coqui' | 'fish' | 'xai' | 'browser';

export interface SpeechRequest {
  input: string;
  model?: string;
  response_format?: AudioFormat;
  speed?: number;
  pitch?: number;
  emotion?: Emotion;
  burp_prob?: number;
  variant?: string;
  /** Skip personality DSP — return unmodified Piper WAV (A/B) */
  rawOnly?: boolean;
  /** Deterministic DSP seed */
  seed?: number;
}

export interface SpeechResponseMeta {
  provider: ProviderName;
  latency_ms: number;
  format: AudioFormat;
  sample_rate?: number;
  model?: string;
  appliedPersonality?: string | null;
  fallback?: boolean;
}

export interface SpeechResponse extends SpeechResponseMeta {
  audio: Buffer;
}

export interface VoiceCapabilities {
  name: ProviderName;
  available: boolean;
  streaming: boolean;
  formats: AudioFormat[];
  emotions: Emotion[];
  local: boolean;
  notes?: string;
}

export interface VoiceProvider {
  readonly name: ProviderName;
  isAvailable(): Promise<boolean>;
  capabilities(): Promise<VoiceCapabilities>;
  speak(req: SpeechRequest): Promise<SpeechResponse>;
  stream?(req: SpeechRequest): AsyncIterable<Uint8Array>;
}

export interface VoiceHealth {
  providers: ProviderName[];
  active: ProviderName | null;
  capabilities: VoiceCapabilities[];
}
