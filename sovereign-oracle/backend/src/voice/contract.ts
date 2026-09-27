/**
 * Unified Voice Contract — Rick C-137 Sovereign Oracle
 * =====================================================
 * Every TTS backend (Piper, Coqui, Fish, xAI, Browser) implements VoiceProvider.
 * Clients always call POST /v1/speech — never provider-specific endpoints.
 */

export type AudioFormat = 'mp3' | 'wav' | 'pcm' | 'ogg';
export type Emotion = 'idle' | 'rant' | 'sarcasm' | 'serious' | 'drunk' | 'excited';
export type ProviderName = 'piper' | 'coqui' | 'fish' | 'xai' | 'browser';

export interface SpeechRequest {
  /** Text to synthesise */
  input: string;
  /** Model id (e.g. "rick-c137", "default") */
  model?: string;
  response_format?: AudioFormat;
  /** Playback speed 0.5–2.0 (maps to Piper length_scale inverse) */
  speed?: number;
  /** Pitch shift in semitones −12…+12 (best-effort; not all providers support) */
  pitch?: number;
  emotion?: Emotion;
  /** Post-process burp injection probability 0.0–0.3 */
  burp_prob?: number;
  /** Optional voice variant override (Q4_K_M, Q8_0, base, …) */
  variant?: string;
}

export interface SpeechResponseMeta {
  provider: ProviderName;
  latency_ms: number;
  format: AudioFormat;
  sample_rate?: number;
  model?: string;
}

export interface SpeechResponse extends SpeechResponseMeta {
  /** Raw audio bytes */
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

/**
 * Every provider implements exactly this surface.
 */
export interface VoiceProvider {
  readonly name: ProviderName;
  isAvailable(): Promise<boolean>;
  capabilities(): Promise<VoiceCapabilities>;
  speak(req: SpeechRequest): Promise<SpeechResponse>;
  /** Optional chunked streaming (sentence-level or PCM frames) */
  stream?(req: SpeechRequest): AsyncIterable<Uint8Array>;
}

/** Health payload for /v1/voice/capabilities and /healthz enrichment */
export interface VoiceHealth {
  providers: ProviderName[];
  active: ProviderName | null;
  capabilities: VoiceCapabilities[];
}
