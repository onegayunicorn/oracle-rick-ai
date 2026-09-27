import { Zap, Scan, RefreshCw, Activity, Upload, Archive, Mic, Pause, Undo2, Send } from "lucide-react";
import { useAvatarState } from "@hooks/useAvatarState";

const quickActions = [
  { icon: Zap, label: "PORTAL" }, { icon: Scan, label: "SCAN" },
  { icon: RefreshCw, label: "SYNC" }, { icon: Activity, label: "PULSE" },
  { icon: Upload, label: "UPLOAD" }, { icon: Archive, label: "ARCHIVE" },
];
const inventions = ["Portal Gun", "Crowsnest Serum", "Memory Encoder"];

export default function BottomRow() {
  const set = useAvatarState((s) => s.setAnimation);

  const send = () => {
    set("LISTEN");
    setTimeout(() => set("THINKING"), 800);
    setTimeout(() => set("TALK"), 2000);
    setTimeout(() => set("IDLE"), 5000);
  };

  return (
    <div style={{ gridArea: "bottom" }} className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <div className="portal-card p-3">
        <div className="text-xs font-telemetry text-portal-green mb-2">QUICK ACTIONS</div>
        <div className="grid grid-cols-3 gap-2">
          {quickActions.map(({ icon: Icon, label }) => (
            <button key={label} className="btn btn-ghost flex flex-col items-center gap-1 py-2">
              <Icon size={16} /><span className="text-[9px]">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="portal-card p-3">
        <div className="text-xs font-telemetry text-portal-green mb-2">LATEST INVENTIONS</div>
        <ul className="space-y-1">
          {inventions.map((i) => (
            <li key={i} className="text-xs text-text-secondary font-body flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-portal-magenta" /> {i}
            </li>
          ))}
        </ul>
      </div>

      <div className="portal-card p-3 flex flex-col justify-center">
        <div className="text-xs font-telemetry text-portal-green mb-2">VOICE CONSOLE</div>
        <div className="flex gap-2 items-center">
          <button className="btn btn-secondary p-2"><Mic size={16} /></button>
          <input className="flex-1 bg-black/60 border border-white/10 rounded-full px-4 py-2 text-xs text-text-primary outline-none focus:border-portal-green/50"
            placeholder="Talk to Rick... (or type a message)" />
          <button className="btn btn-ghost p-2"><Pause size={14} /></button>
          <button className="btn btn-ghost p-2"><Undo2 size={14} /></button>
          <button onClick={send} className="btn btn-primary p-2"><Send size={14} /></button>
        </div>
      </div>
    </div>
  );
}
