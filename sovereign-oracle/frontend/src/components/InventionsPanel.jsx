import React from 'react';
export default function InventionsPanel({ onClose }) {
  const inventions = ['Portal Gun', 'Meeseeks Box', 'Interdimensional Cable', 'Microverse Battery'];
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 20, padding: 24 }}>
      <h2>Inventions Database</h2>
      <ul>{inventions.map((i) => <li key={i}>{i}</li>)}</ul>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
