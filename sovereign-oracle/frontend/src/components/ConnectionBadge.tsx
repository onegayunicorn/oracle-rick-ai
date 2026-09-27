import React from 'react';

export default function ConnectionBadge({ connected, source }: { connected: boolean; source?: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 999, fontSize: 12,
      background: connected ? '#052e16' : '#450a0a',
      color: connected ? '#86efac' : '#fca5a5',
      border: `1px solid ${connected ? '#22c55e' : '#ef4444'}`,
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%',
        background: connected ? '#22c55e' : '#ef4444',
      }} />
      {connected ? `AIR-GAP OK${source ? ` · ${source}` : ''}` : 'RECONNECTING…'}
    </span>
  );
}
