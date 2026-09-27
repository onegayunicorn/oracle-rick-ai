const palette = [
  ["#00FFAA", "PORTAL GREEN"], ["#44AAFF", "PORTAL BLUE"], ["#A855F7", "PURPLE"],
  ["#FF45E0", "MAGENTA"], ["#FF7A45", "ORANGE"], ["#FF4444", "RED"],
  ["#FFCC00", "YELLOW"], ["#22C55E", "SUCCESS"], ["#E5E5E5", "GRAY-100"],
  ["#888888", "GRAY-500"], ["#3a3a3a", "GRAY-700"], ["#0A0A0A", "GRAY-900"],
];
const portalStates = [["OPEN", "portal-open"], ["STABLE", "portal-stable"], ["INSTABLE", "portal-instable"], ["COLLAPSING", "portal-collapsing"], ["DESTROYED", "portal-destroyed"]];

export default function DesignSystemShowcase() {
  return (
    <div className="p-6 overflow-y-auto h-full">
      <h2 className="font-display text-portal-green mb-1">PORTAL INTERFACE DESIGN SYSTEM v1.0</h2>
      <p className="text-xs text-text-muted font-telemetry mb-6">A UNIVERSE OF POSSIBILITIES · SAME DRUNK GENIUS</p>

      <div className="portal-card p-4 mb-4">
        <div className="text-xs font-telemetry text-portal-green mb-3">COLOR PALETTE</div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {palette.map(([c, n]) => (
            <div key={c} className="rounded-lg overflow-hidden border border-white/10">
              <div style={{ background: c, height: 40 }} />
              <div className="text-[9px] font-telemetry p-1 text-text-muted">{n}<br />{c}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="portal-card p-4 mb-4">
        <div className="text-xs font-telemetry text-portal-green mb-3">TYPOGRAPHY</div>
        <div className="space-y-1 text-sm">
          <div className="font-display text-portal-green">Orbitron — Display / Titles</div>
          <div className="font-body text-text-primary">Rajdhani — Body / UI</div>
          <div className="font-telemetry text-portal-blue">JetBrains Mono — Telemetry / HUD</div>
          <div className="text-text-secondary">Inter — Fallback</div>
        </div>
      </div>

      <div className="portal-card p-4 mb-4">
        <div className="text-xs font-telemetry text-portal-green mb-3">PORTAL STATES</div>
        <div className="flex flex-wrap gap-2">
          {portalStates.map(([s, c]) => (
            <span key={s} className={`status-badge ${c} border border-current`}>{s}</span>
          ))}
        </div>
      </div>

      <div className="portal-card p-4 mb-4">
        <div className="text-xs font-telemetry text-portal-green mb-3">BUTTONS</div>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-primary">OPEN PORTAL</button>
          <button className="btn btn-secondary">CLOSE PORTAL</button>
          <button className="btn btn-danger">TERMINATE</button>
          <button className="btn btn-ghost">DISMISS</button>
        </div>
      </div>

      <div className="portal-card p-4">
        <div className="text-xs font-telemetry text-portal-green mb-3">STATUS BADGES</div>
        <div className="flex flex-wrap gap-2">
          <span className="status-badge status-online">ONLINE</span>
          <span className="status-badge status-voice">VOICE</span>
          <span className="status-badge status-stable">STABLE</span>
          <span className="status-badge status-thinking">THINKING</span>
          <span className="status-badge status-error">ERROR</span>
        </div>
      </div>
    </div>
  );
}
