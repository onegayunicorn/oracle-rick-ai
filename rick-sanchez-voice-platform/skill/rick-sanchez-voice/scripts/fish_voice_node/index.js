// Zero-dependency Fish Audio TTS client (Node >= 18: built-in fetch + WebSocket).
const DEFAULT_API_BASE = 'https://api.fish.audio';
const DEFAULT_VOICE_ID = 'd2e75a3e3fd6419893057c02a375a113';
const DEFAULT_MODEL = 's2.1-pro-free';

class FishVoiceNodeClient {
  constructor({ apiKey, apiBase, voiceId, model } = {}) {
    this.apiKey = apiKey || process.env.FISH_API_KEY;
    if (!this.apiKey) throw new Error('FISH_API_KEY is required');
    this.apiBase = (apiBase || process.env.FISH_API_BASE || DEFAULT_API_BASE).replace(/\/$/, '');
    this.voiceId = voiceId || process.env.FISH_VOICE_ID || DEFAULT_VOICE_ID;
    this.model = model || process.env.FISH_MODEL || DEFAULT_MODEL;
  }

  async synthesize(text, opts = {}) {
    const res = await fetch(`${this.apiBase}/v1/tts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice_id: opts.voice_id || this.voiceId,
        model: opts.model || this.model,
        response_format: opts.response_format || 'mp3',
        ...opts,
      }),
    });
    if (!res.ok) throw new Error(`TTS failed (HTTP ${res.status}): ${await res.text()}`);
    return Buffer.from(await res.arrayBuffer());
  }

  async listVoices() {
    const res = await fetch(`${this.apiBase}/v1/voices`, {
      headers: { 'Authorization': `Bearer ${this.apiKey}` },
    });
    return res.json();
  }
}

module.exports = { FishVoiceNodeClient, DEFAULT_VOICE_ID, DEFAULT_MODEL };
