const inventions = ["Portal Gun", "Meeseeks Box", "Interdimensional Cable", "Microverse Battery", "Space Cruiser"];
export default function InventionsPanel() {
  return (
    <div className="portal-card p-6">
      <h2 className="text-portal-green font-telemetry mb-4">INVENTIONS LIBRARY</h2>
      <ul className="space-y-2">
        {inventions.map((i) => (
          <li key={i} className="text-text-secondary text-sm border-b border-white/5 pb-2">{i}</li>
        ))}
      </ul>
    </div>
  );
}
