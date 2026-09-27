import React from 'react';
const THEMES = ['Void Black', 'Cyan Haze', 'Plasma Purple', 'Amber Warning'];
export default function ThemePicker({ onClose }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 20, padding: 24 }}>
      <h2>Theme</h2>
      {THEMES.map((t) => <button key={t} style={{ display: 'block', margin: 8 }}>{t}</button>)}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
