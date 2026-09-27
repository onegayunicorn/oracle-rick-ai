const metrics = [
  ["EM-001", "95%"],
  ["EM-002", "82%"],
  ["EM-003", "1.618"],
  ["EM-004", "0.693"],
  ["EM-005", "0.042"],
  ["EM-006", "0.868"],
  ["EM-007", "87%"],
];

export default function TelemetryOverlay() {
  return (
    <div className="absolute right-4 top-4 w-72 hidden md:block">
      <div className="portal-card p-4">
        <h3 className="text-portal-green font-telemetry mb-3 text-sm">QUANTUM TELEMETRY</h3>
        {metrics.map(([label, value]) => (
          <div key={label} className="flex justify-between py-2 border-b border-white/5 text-sm">
            <span className="text-text-muted font-telemetry">{label}</span>
            <span className="text-text-primary font-telemetry">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
