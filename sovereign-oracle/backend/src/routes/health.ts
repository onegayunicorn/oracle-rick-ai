import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/healthz', (_req, res) => {
  res.json({ status: 'ok', ts: Date.now() });
});

healthRouter.get('/readyz', (_req, res) => {
  const ready = !!process.env.AUTH_TOKEN;
  res.status(ready ? 200 : 503).json({ ready, deps: { ollama: true, piper: true } });
});
