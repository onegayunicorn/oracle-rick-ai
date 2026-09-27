import { useEffect, useState } from 'react';
import { WEBLLM_CONFIG } from './config';

// Lazy-loads WebLLM; model weights are cached by the service worker so the
// second launch is fully offline.
export function useWebLLM() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [engine, setEngine] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setStatus('loading');
        const { CreateMLCEngine } = await import('@mlc-ai/web-llm');
        const eng = await CreateMLCEngine(WEBLLM_CONFIG.model, {
          initProgressCallback: (p: any) => { if (!cancelled) setProgress(p.progress); },
        });
        if (!cancelled) { setEngine(eng); setStatus('ready'); }
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function generate(prompt: string): Promise<string> {
    if (!engine) throw new Error('LLM not ready');
    const reply = await engine.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      temperature: WEBLLM_CONFIG.temperature,
    });
    return reply.choices[0].message.content ?? '';
  }

  return { status, progress, generate };
}
