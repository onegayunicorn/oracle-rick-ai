/**
 * Piper VoiceProvider — local ONNX TTS
 * Talks to the piper-tts service (default http://piper-tts:8000)
 * which already exposes OpenAI-compatible /v1/audio/speech.
 */

import type {
  SpeechRequest,
  SpeechResponse,
  VoiceCapabilities,
  VoiceProvider,
} from '../contract.js';

const PIPER_URL = process.env.PIPER_URL || 'http://piper-tts:8000';
const DEFAULT_FORMAT = 'wav' as const;

export class PiperProvider implements VoiceProvider {
  readonly name = 'piper' as const;
  private baseUrl: string;

  constructor(baseUrl: string = PIPER_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async isAvailable(): Promise<boolean> {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 2000);
      const res = await fetch(`${this.baseUrl}/healthz`, { signal: ctrl.signal });
      clearTimeout(t);
      return res.ok;
    } catch {
      try {
        const res = await fetch(`${this.baseUrl}/v1/audio/speech`, { method: 'OPTIONS' });
        return res.status < 500;
      } catch {
        return false;
      }
    }
  }

  async capabilities(): Promise<VoiceCapabilities> {
    const available = await this.isAvailable();
    return {
      name: 'piper',
      available,
      streaming: true,
      formats: ['wav', 'pcm', 'mp3'],
      emotions: ['idle', 'rant', 'sarcasm', 'serious', 'drunk', 'excited'],
      local: true,
      notes: 'ONNX local; variant selected by hardware selector (Q4_K_M / Q8_0 / base)',
    };
  }

  async speak(req: SpeechRequest): Promise<SpeechResponse> {
    const t0 = Date.now();
    const text = (req.input || '').replace(/[*_#`]/g, '').trim();
    if (!text) {
      throw new Error('SpeechRequest.input is empty');
    }

    const speed = clamp(req.speed ?? 1.0, 0.5, 2.0);
    const lengthScale = clamp(1.0 / speed, 0.5, 2.0);
    const emotionBias = emotionToPiperBias(req.emotion);

    const body: Record<string, unknown> = {
      text,
      input: text,
      length_scale: lengthScale * emotionBias.length,
      noise_scale: emotionBias.noise,
      noise_w: emotionBias.noise_w,
    };
    if (req.model) body.model = req.model;
    if (req.variant) body.variant = req.variant;

    const format = req.response_format || DEFAULT_FORMAT;

    const res = await fetch(`${this.baseUrl}/v1/audio/speech`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'audio/*' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      throw new Error(`Piper TTS ${res.status}: ${errText}`);
    }

    const arrayBuf = await res.arrayBuffer();
    const audio = Buffer.from(arrayBuf);

    return {
      audio,
      format,
      provider: 'piper',
      latency_ms: Date.now() - t0,
      sample_rate: 22050,
      model: req.model || 'rick-c137',
    };
  }

  async *stream(req: SpeechRequest): AsyncIterable<Uint8Array> {
    const sentences = splitSentences(req.input);
    for (const s of sentences) {
      if (!s.trim()) continue;
      const part = await this.speak({ ...req, input: s });
      yield new Uint8Array(part.audio);
    }
  }
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function emotionToPiperBias(emotion?: string) {
  switch (emotion) {
    case 'rant':
    case 'excited':
      return { length: 0.92, noise: 0.75, noise_w: 0.9 };
    case 'sarcasm':
      return { length: 1.08, noise: 0.6, noise_w: 0.7 };
    case 'serious':
      return { length: 1.12, noise: 0.5, noise_w: 0.6 };
    case 'drunk':
      return { length: 1.2, noise: 0.85, noise_w: 1.0 };
    default:
      return { length: 1.0, noise: 0.667, noise_w: 0.8 };
  }
}

function splitSentences(text: string): string[] {
  return text.split(/(?<=[.!?\n])\s+/).filter(Boolean);
}

export default PiperProvider;
