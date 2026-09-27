export default function StatusPanel() {
  return (
    <div className="portal-card p-6">
      <h2 className="text-portal-green font-telemetry mb-4">SYSTEM STATUS</h2>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-text-muted">Portal Core</span><span className="status-badge status-online">ONLINE</span></div>
        <div className="flex justify-between"><span className="text-text-muted">Avatar Engine</span><span className="status-badge status-online">READY</span></div>
        <div className="flex justify-between"><span className="text-text-muted">Voice Pipeline</span><span className="status-badge status-thinking">LISTENING</span></div>
      </div>
    </div>
  );
}
