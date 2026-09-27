import React from 'react';
export default function HistoryPanel({ onClose }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 20, padding: 24 }}>
      <h2>Telemetry History</h2>
      <p>Rolling 256-sample sensor buffer streamed from the nexus engine.</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
