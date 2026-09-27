/**
 * Browser VoiceProvider — server-side marker + client contract
 * ============================================================
 * Real synthesis happens in the browser via window.speechSynthesis.
 * This provider is never selected for server-side speak(); it exists so
 * /v1/voice/capabilities can advertise the fallback and clients know
 * to switch to Web Speech when no local/cloud provider is available.
 */

import type {
  SpeechRequest,
  SpeechResponse,
  VoiceCapabilities,
  VoiceProvider,
} from '../contract.js';

export class BrowserProvider implements VoiceProvider {
  readonly name = 'browser' as const;

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async capabilities(): Promise<VoiceCapabilities> {
    return {
      name: 'browser',
      available: true,
      streaming: false,
      formats: ['wav'],
      emotions: ['idle', 'rant', 'sarcasm', 'serious', 'excited'],
      local: true,
      notes:
        'Client-only. Use window.speechSynthesis when server providers fail. ' +
        'Server speak() throws — do not route here for /v1/speech.',
    };
  }

  async speak(_req: SpeechRequest): Promise<SpeechResponse> {
    throw new Error(
      'BrowserProvider is client-side only. Use window.speechSynthesis in the UI.'
    );
  }
}

export const BROWSER_SPEAK_SNIPPET = `
export function speakBrowser(text: string, opts?: { rate?: number; pitch?: number }) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    throw new Error('Web Speech API unavailable');
  }
  const u = new SpeechSynthesisUtterance(text);
  u.rate = opts?.rate ?? 0.95;
  u.pitch = opts?.pitch ?? 0.85;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v =>
    /en.*male|daniel|alex|fred|david/i.test(v.name)
  ) || voices.find(v => v.lang.startsWith('en'));
  if (preferred) u.voice = preferred;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
  return u;
}
`.trim();

export default BrowserProvider;
