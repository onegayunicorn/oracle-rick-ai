import http from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';
import { NexusEngine } from './engine/nexus.js';
import { SensorPayloadSchema } from '@oracle/shared';

const PORT = Number(process.env.PORT || 3000);
const TICK_MS = Number(process.env.TICK_RATE_MS || 50);
const AUTH_TOKEN = process.env.AUTH_TOKEN || '';

const engine = new NexusEngine(TICK_MS);
const clients = new Set<WebSocket>();

const server = http.createServer((req, res) => {
  if (req.url === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', tick: engine.state.tick }));
    return;
  }
  if (req.url === '/api/state') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(engine.state));
    return;
  }
  res.writeHead(404);
  res.end();
});

const wss = new WebSocketServer({ server, path: '/socket.io/' });

wss.on('connection', (ws, req) => {
  const token = new URL(req.url || '', 'http://x').searchParams.get('token');
  if (AUTH_TOKEN && token !== AUTH_TOKEN) {
    ws.close(4001, 'unauthorized');
    return;
  }
  clients.add(ws);
  ws.send(JSON.stringify({ type: 'state', state: engine.state }));

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      if (msg.type === 'sensor') {
        const parsed = SensorPayloadSchema.parse(msg.payload);
        engine.ingest(parsed);
      } else if (msg.type === 'cartridge') {
        engine.setCartridge(msg.manifest);
      }
    } catch (e) {
      ws.send(JSON.stringify({ type: 'error', message: String(e) }));
    }
  });
  ws.on('close', () => clients.delete(ws));
});

engine.onTick = (state) => {
  const payload = JSON.stringify({ type: 'state', state });
  for (const c of clients) {
    if (c.readyState === WebSocket.OPEN) c.send(payload);
  }
};

engine.start();
server.listen(PORT, () => {
  console.log(`[oracle] nexus engine listening on :${PORT} (tick ${TICK_MS}ms = ${1000 / TICK_MS}Hz)`);
});
