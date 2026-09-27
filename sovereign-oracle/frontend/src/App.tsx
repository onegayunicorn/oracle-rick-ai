import { useEffect, useRef, useState } from 'react';
import { useOracleSocket } from './hooks/useOracleSocket';
import { PhotonicCanvas } from './components/PhotonicCanvas';
import HistoryPanel from './components/HistoryPanel';
import InventionsPanel from './components/InventionsPanel';
import ThemePicker from './components/ThemePicker';
import { useWebLLM } from './webllm/engine';

export default function App() {
  const state = useOracleSocket();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const llm = useWebLLM();
  const [panel, setPanel] = useState<'none' | 'history' | 'inventions' | 'theme'>('none');

  useEffect(() => {
    if (canvasRef.current && state) {
      // Pass nexus state to the WebGL renderer.
    }
  }, [state]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <PhotonicCanvas ref={canvasRef} state={state} />
      <div className="hud">
        <div>Tick: <span className="value">{state?.tick ?? '—'}</span></div>
        <div>Lux: <span className="value">{state?.sensor?.lux ?? '—'}</span></div>
        <div>CCT: <span className="value">{state?.sensor?.cct ?? '—'}K</span></div>
        <div>Pressure: <span className="value">{state?.sensor?.pressure ?? '—'} hPa</span></div>
        <div>LLM: <span className="value">{llm.status}</span></div>
        <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
          <button onClick={() => setPanel('history')}>History</button>
          <button onClick={() => setPanel('inventions')}>Inventions</button>
          <button onClick={() => setPanel('theme')}>Theme</button>
        </div>
      </div>
      {panel === 'history' && <HistoryPanel onClose={() => setPanel('none')} />}
      {panel === 'inventions' && <InventionsPanel onClose={() => setPanel('none')} />}
      {panel === 'theme' && <ThemePicker onClose={() => setPanel('none')} />}
    </div>
  );
}
