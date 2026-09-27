/**
 * Voice registry + graceful degradation router
 * ============================================
 * Selection order (server-side):
 *   1. Explicit provider? use it if available
 *   2. Piper (local ONNX) if healthy
 *   3. (Future) Coqui / Fish / xAI
 *   4. Never auto-select Browser for server speak()
 */

import type {
  ProviderName,
  SpeechRequest,
  SpeechResponse,
  VoiceCapabilities,
  VoiceHealth,
  VoiceProvider,
} from './contract.js';
import { PiperProvider } from './providers/piper.js';
import { BrowserProvider } from './providers/browser.js';

const piper = new PiperProvider();
const browser = new BrowserProvider();

const registry: VoiceProvider[] = [piper, browser];

export function getProvider(name: ProviderName): VoiceProvider | undefined {
  return registry.find((p) => p.name === name);
}

export async function listCapabilities(): Promise<VoiceCapabilities[]> {
  return Promise.all(registry.map((p) => p.capabilities()));
}

export async function resolveActive(
  preferred?: ProviderName
): Promise<VoiceProvider | null> {
  if (preferred) {
    const p = getProvider(preferred);
    if (p && (await p.isAvailable()) && preferred !== 'browser') return p;
  }
  if (await piper.isAvailable()) return piper;
  return null;
}

export async function speak(
  req: SpeechRequest,
  preferred?: ProviderName
): Promise<SpeechResponse> {
  const provider = await resolveActive(preferred);
  if (!provider) {
    throw new Error(
      'No server-side voice provider available. Client should fall back to Browser TTS.'
    );
  }
  return provider.speak(req);
}

export async function voiceHealth(): Promise<VoiceHealth> {
  const capabilities = await listCapabilities();
  const active = await resolveActive();
  return {
    providers: registry.map((p) => p.name),
    active: active?.name ?? null,
    capabilities,
  };
}

export { PiperProvider, BrowserProvider };
export type {
  SpeechRequest,
  SpeechResponse,
  VoiceProvider,
  VoiceCapabilities,
  VoiceHealth,
  ProviderName,
} from './contract.js';
