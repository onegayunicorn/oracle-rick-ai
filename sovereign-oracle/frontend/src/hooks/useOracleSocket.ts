import { useEffect, useState } from 'react';
import type { NexusState, WSMessage } from '@oracle/shared';

const WS_ENDPOINT = import.meta.env.VITE_WS_ENDPOINT || 'ws://localhost:3000';

export function useOracleSocket(): NexusState | null {
  const [state, setState] = useState<NexusState | null>(null);

  useEffect(() => {
    const url = WS_ENDPOINT.startsWith('ws')
      ? `${WS_ENDPOINT}/socket.io/`
      : `ws://${WS_ENDPOINT}/socket.io/`;
    const ws = new WebSocket(url);
    ws.onmessage = (e) => {
      const msg: WSMessage = JSON.parse(e.data);
      if (msg.type === 'state') setState(msg.state);
    };
    ws.onclose = () => setTimeout(() => window.location.reload(), 3000);
    return () => ws.close();
  }, []);

  return state;
}
