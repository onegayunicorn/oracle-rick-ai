import { Menu } from "lucide-react";
import { useUIStore } from "@state/useUIStore";

export default function Header() {
  const toggle = useUIStore((state) => state.toggleMobileMenu);

  return (
    <header className="h-12 border-b border-cyan-500/20 bg-black/80 backdrop-blur flex items-center justify-between px-4">
      <button className="lg:hidden text-white" onClick={toggle} aria-label="Menu">
        <Menu size={24} />
      </button>

      <h1 className="text-portal-green font-bold tracking-wider font-telemetry">
        PORTAL INTERFACE
      </h1>

      <div className="flex items-center gap-3 text-xs">
        <span className="status-badge status-online">ONLINE</span>
        <span className="hidden sm:inline text-portal-green/70">v1.0</span>
      </div>
    </header>
  );
}
