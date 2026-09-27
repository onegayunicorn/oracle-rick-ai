/**
 * Piper VoiceProvider — local ONNX TTS + optional personality DSP
 * ================================================================
 * 1. Call piper-tts HTTP service → raw mono 16-bit 22050 Hz WAV
 * 2. Optionally run Python prosody CLI (fail-open)
 * 3. Never 500 on DSP failure — return clean Piper WAV
 *
 * Format: mono · 16-bit PCM · 22050 Hz · paired .onnx + .onnx.json
 * Q4_K_M / Q8_0 are NOT Piper voice formats.
 */

import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type {
  SpeechRequest,
  SpeechResponse,
  VoiceCapabilities,
  VoiceProvider,
} from '../contract.js';

const PIPER_URL = process.env.PIPER_URL || 'http://piper-tts:8000';
const PROSODY_PYTHON = process.env.PROSODY_PYTHON || 'python3';
const PROSODY_MODULE = process.env.PROSODY_MODULE || 'prosody.apply';
const PROSODY_PATH =
  process.env.PROSODY_PATH ||
  join(process.cwd(), 'services/voice-prosody');

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
      emotions: ['idle', 'rant', 'sarcasm', 'serious', 'drunk', 'excited', 'tech'],
      local: true,
      notes:
        'ONNX local mono 16-bit 22050 Hz. Personality DSP optional (fail-open). ' +
        'Variants: FP32 reference; INT8/FP16 only after verified quantization.',
    };
  }

  async speak(req: SpeechRequest): Promise<SpeechResponse> {
    const t0 = Date.now();
    const text = (req.input || '').replace(/[*_#`]/g, '').trim();
    if (!text) throw new Error('SpeechRequest.input is empty');

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

    const res = await fetch(`${this.baseUrl}/v1/audio/speech`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'audio/*' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      throw new Error(`Piper TTS ${res.status}: ${errText}`);
    }

    const rawWav = Buffer.from(await res.arrayBuffer());
    const format = req.response_format || DEFAULT_FORMAT;

    const rawOnly = req.rawOnly === true;
    const wantDsp =
      !rawOnly &&
      (req.emotion !== undefined ||
        (req.burp_prob !== undefined && req.burp_prob > 0));

    let audio = rawWav;
    let appliedPersonality: string | null = null;
    let fallback = false;

    if (wantDsp) {
      try {
        audio = await runProsodyCli(rawWav, {
          emotion: req.emotion || 'idle',
          burpProb: req.burp_prob,
          seed: req.seed,
        });
        appliedPersonality = req.emotion || 'idle';
      } catch (dspErr) {
        console.warn('[piper] personality DSP failed — returning raw Piper:', dspErr);
        audio = rawWav;
        fallback = true;
        appliedPersonality = null;
      }
    }

    return {
      audio,
      format,
      provider: 'piper',
      latency_ms: Date.now() - t0,
      sample_rate: 22050,
      model: req.model || 'rick-c137',
      appliedPersonality,
      fallback,
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

async function runProsodyCli(
  wavBytes: Buffer,
  opts: { emotion: string; burpProb?: number; seed?: number }
): Promise<Buffer> {
  const dir = await mkdtemp(join(tmpdir(), 'rick-prosody-'));
  const inPath = join(dir, 'raw.wav');
  const outPath = join(dir, 'out.wav');
  try {
    await writeFile(inPath, wavBytes);

    const args = [
      '-m',
      PROSODY_MODULE,
      '-i',
      inPath,
      '-o',
      outPath,
      '--emotion',
      opts.emotion,
    ];
    if (opts.burpProb !== undefined) {
      args.push('--burp-prob', String(opts.burpProb));
    }
    if (opts.seed !== undefined) {
      args.push('--seed', String(opts.seed));
    }

    await new Promise<void>((resolve, reject) => {
      const child = spawn(PROSODY_PYTHON, args, {
        env: { ...process.env, PYTHONPATH: PROSODY_PATH },
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      let stderr = '';
      child.stderr?.on('data', (c) => {
        stderr += c.toString();
      });
      child.on('error', reject);
      child.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`prosody exit ${code}: ${stderr.slice(0, 400)}`));
      });
    });

    return await readFile(outPath);
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => undefined);
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
      return { length: 1.15, noise: 0.85, noise_w: 1.0 };
    default:
      return { length: 1.0, noise: 0.667, noise_w: 0.8 };
  }
}

function splitSentences(text: string): string[] {
  return text.split(/(?<=[.!?\n])\s+/).filter(Boolean);
}

export default PiperProvider;
