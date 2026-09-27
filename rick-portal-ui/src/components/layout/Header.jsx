import { useEffect, useState } from "react";
import { Menu, Wifi, Mic, Activity } from "lucide-react";
import { useUIStore } from "@state/useUIStore";

export default function Header() {
  const toggle = useUIStore((s) => s.toggleMobileMenu);
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  return (
    <header style={{ gridArea: "header" }} className="portal-card flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <button className="lg:hidden text-white" onClick={toggle}><Menu size={20} /></button>
        <div className="font-display text-portal-green text-sm font-bold">RICK C-137</div>
        <div className="hidden md:block text-text-muted text-xs font-telemetry">SAME SHIT, DIFFERENT DIMENSION</div>
      </div>
      <div className="flex items-center gap-2">
        <span className="status-badge status-online"><Wifi size={12} /> ONLINE</span>
        <span className="status-badge status-voice hidden sm:inline-flex"><Mic size={12} /> VOICE</span>
        <span className="status-badge status-stable hidden sm:inline-flex"><Activity size={12} /> STABLE</span>
        <div className="font-telemetry text-portal-green text-sm ml-2">
          {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </header>
  );
}
