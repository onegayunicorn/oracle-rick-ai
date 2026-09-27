import { useEffect, useState } from 'react';
import { NexusState } from '../../../../shared/src/types';

const WS = import.meta.env.VITE_WS_ENDPOINT || 'ws://localhost:3000';

export function useNexusStream(): { state: NexusState | null; connected: boolean } {
  const [state, setState] = useState<NexusState | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(`${WS}/socket.io/`);
    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === 'state') setState(msg.state);
    };
    const t = setInterval(() => { if (ws.readyState > 1) window.location.reload(); }, 5000);
    return () => { clearInterval(t); ws.close(); };
  }, []);

  return { state, connected };
}
