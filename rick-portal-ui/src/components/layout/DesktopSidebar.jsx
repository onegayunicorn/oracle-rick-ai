import { History, FlaskConical, Activity, Download, Settings } from "lucide-react";
import { useUIStore } from "@state/useUIStore";

const items = [
  { id: "history", label: "History", icon: History },
  { id: "inventions", label: "Inventions", icon: FlaskConical },
  { id: "status", label: "Status", icon: Activity },
  { id: "downloads", label: "Downloads", icon: Download },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function DesktopSidebar() {
  const openPanel = useUIStore((s) => s.openPanel);

  return (
    <aside className="hidden lg:flex w-72 flex-col bg-zinc-950 border-r border-cyan-500/10">
      {items.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => openPanel(id)}
          className="flex items-center gap-3 p-4 text-left text-text-secondary hover:bg-cyan-500/10 hover:text-portal-green transition-colors"
        >
          <Icon size={18} />
          {label}
        </button>
      ))}
    </aside>
  );
}
