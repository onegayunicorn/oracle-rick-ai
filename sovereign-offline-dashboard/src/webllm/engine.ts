import { WEBLLM_CONFIG } from './config';

let engine: any = null;

export async function initEngine() {
  try {
    const { CreateMLCEngine } = await import('@mlc-ai/web-llm');
    engine = await CreateMLCEngine(WEBLLM_CONFIG.model, {
      initProgressCallback: (p: any) => {
        document.getElementById('model-badge')!.textContent = `loading ${Math.round(p.progress * 100)}%`;
      },
    });
    document.getElementById('model-badge')!.textContent = 'ready (offline)';
  } catch (e) {
    document.getElementById('model-badge')!.textContent = 'error: WebGPU unavailable';
  }
}

export async function generate(prompt: string): Promise<string> {
  if (!engine) throw new Error('engine not ready');
  const r = await engine.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    temperature: WEBLLM_CONFIG.temperature,
  });
  return r.choices[0].message.content ?? '';
}
