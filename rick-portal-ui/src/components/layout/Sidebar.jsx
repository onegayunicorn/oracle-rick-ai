import { LayoutDashboard, FlaskConical, Globe2, Brain, Smartphone, Settings } from "lucide-react";
import { useUIStore } from "@state/useUIStore";

const items = [
  { id: "dashboard", label: "DASHBOARD", icon: LayoutDashboard },
  { id: "inventions", label: "INVENTIONS", icon: FlaskConical },
  { id: "dimensions", label: "DIMENSIONS", icon: Globe2 },
  { id: "memory", label: "MEMORY", icon: Brain },
  { id: "devices", label: "DEVICES", icon: Smartphone },
  { id: "settings", label: "SETTINGS", icon: Settings },
];

export default function Sidebar() {
  const active = useUIStore((s) => s.activePanel || "dashboard");
  const open = useUIStore((s) => s.openPanel);

  return (
    <aside style={{ gridArea: "sidebar" }} className="portal-card flex flex-col p-2 gap-1 overflow-y-auto">
      <div className="portal-ring-12s w-10 h-10 mx-auto my-2 rounded-full border-2 border-portal-green/50 border-t-transparent" />
      {items.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => open(id)}
          className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs font-telemetry transition-colors ${
            active === id ? "bg-portal-green/15 text-portal-green" : "text-text-muted hover:text-portal-green hover:bg-white/5"
          }`}
        >
          <Icon size={16} />
          <span className="hidden xl:inline">{label}</span>
        </button>
      ))}
    </aside>
  );
}
