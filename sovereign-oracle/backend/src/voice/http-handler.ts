/**
 * Minimal HTTP handlers for /v1/speech and voice health.
 * Wired into the existing plain-http server (no Express required).
 */

import type { IncomingMessage, ServerResponse } from 'node:http';
import { speak, voiceHealth, listCapabilities } from './index.js';
import type { SpeechRequest, AudioFormat } from './contract.js';

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function json(res: ServerResponse, status: number, body: unknown) {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(data);
}

function cors(res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

/**
 * Returns true if the request was handled.
 */
export async function handleVoiceRoutes(
  req: IncomingMessage,
  res: ServerResponse
): Promise<boolean> {
  const url = new URL(req.url || '/', 'http://localhost');
  const path = url.pathname;

  if (req.method === 'OPTIONS' && path.startsWith('/v1/')) {
    cors(res);
    res.writeHead(204);
    res.end();
    return true;
  }

  if (req.method === 'GET' && path === '/v1/voice/capabilities') {
    cors(res);
    try {
      const caps = await listCapabilities();
      json(res, 200, { capabilities: caps });
    } catch (e) {
      json(res, 500, { error: String(e) });
    }
    return true;
  }

  if (req.method === 'GET' && (path === '/v1/voice/info' || path === '/v1/voice/health')) {
    cors(res);
    try {
      const health = await voiceHealth();
      json(res, 200, health);
    } catch (e) {
      json(res, 500, { error: String(e) });
    }
    return true;
  }

  if (
    req.method === 'POST' &&
    (path === '/v1/speech' || path === '/v1/audio/speech')
  ) {
    cors(res);
    try {
      const raw = await readBody(req);
      const body = JSON.parse(raw || '{}') as Record<string, unknown>;

      const input = String(body.input ?? body.text ?? '').trim();
      if (!input) {
        json(res, 400, { error: 'input (or text) is required' });
        return true;
      }

      const speechReq: SpeechRequest = {
        input,
        model: body.model as string | undefined,
        response_format: (body.response_format as AudioFormat) || 'wav',
        speed: typeof body.speed === 'number' ? body.speed : undefined,
        pitch: typeof body.pitch === 'number' ? body.pitch : undefined,
        emotion: body.emotion as SpeechRequest['emotion'],
        burp_prob: typeof body.burp_prob === 'number' ? body.burp_prob : undefined,
        variant: body.variant as string | undefined,
      };

      const preferred = body.provider as import('./contract.js').ProviderName | undefined;
      const result = await speak(speechReq, preferred);

      const mime =
        result.format === 'mp3'
          ? 'audio/mpeg'
          : result.format === 'ogg'
          ? 'audio/ogg'
          : result.format === 'pcm'
          ? 'audio/L16'
          : 'audio/wav';

      res.writeHead(200, {
        'Content-Type': mime,
        'Content-Length': result.audio.length,
        'X-Voice-Provider': result.provider,
        'X-Voice-Latency-Ms': String(result.latency_ms),
        'X-Voice-Model': result.model || '',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(result.audio);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      json(res, 503, {
        error: msg,
        fallback: 'browser',
        hint: 'Use window.speechSynthesis or retry when Piper is up',
      });
    }
    return true;
  }

  return false;
}
