import { Cpu, Globe, Activity, Smartphone, Eye } from "lucide-react";

function Panel({ title, icon: Icon, children }) {
  return (
    <div className="portal-card p-3">
      <div className="flex items-center gap-2 mb-2 text-portal-green text-xs font-telemetry">
        <Icon size={14} /> {title}
      </div>
      {children}
    </div>
  );
}

const telemetry = [["C-137", "95%"], ["C-420", "82%"], ["J19ζ", "64%"], ["Σ-9", "42%"]];
const portalCore = [["STABILITY", "87%"], ["WATER", "62%"], ["MATTER", "75%"], ["ENERGY", "91%"]];
const activity = ["Connected device: C-137 Portal Gun", "Neural link established", "Quantum harmonics stable", "Memory encoder synced", "Dimension D-742 scanned"];
const devices = [["Samsung A17", true], ["Neural Band", true], ["Local Oracle", true], ["C-137 Portal Gun", false]];

export default function RightColumn() {
  return (
    <div style={{ gridArea: "right" }} className="right-col flex flex-col gap-2 overflow-y-auto">
      <Panel title="MULTIVERSAL TELEMETRY" icon={Globe}>
        {telemetry.map(([k, v]) => (
          <div key={k} className="flex justify-between text-xs py-1 font-telemetry border-b border-white/5">
            <span className="text-text-muted">{k}</span><span className="text-portal-green">{v}</span>
          </div>
        ))}
      </Panel>

      <Panel title="PORTAL CORE" icon={Activity}>
        {portalCore.map(([k, v]) => (
          <div key={k} className="mb-2">
            <div className="flex justify-between text-[10px] font-telemetry text-text-muted"><span>{k}</span><span className="text-portal-blue">{v}</span></div>
            <div className="h-1 bg-white/10 rounded-full mt-1"><div className="h-full bg-portal-green rounded-full" style={{ width: v }} /></div>
          </div>
        ))}
      </Panel>

      <Panel title="RECENT ACTIVITY" icon={Cpu}>
        <ul className="space-y-1">
          {activity.map((a, i) => (
            <li key={i} className="text-[10px] text-text-secondary font-telemetry">› {a}</li>
          ))}
        </ul>
      </Panel>

      <Panel title="CONNECTED DEVICES" icon={Smartphone}>
        {devices.map(([d, on]) => (
          <div key={d} className="flex justify-between items-center py-1 text-xs">
            <span className="text-text-secondary">{d}</span>
            <span className={`w-2 h-2 rounded-full ${on ? "bg-portal-green" : "bg-gray-600"}`} />
          </div>
        ))}
      </Panel>

      <Panel title="DIMENSION PREVIEW" icon={Eye}>
        <div className="widget-frame h-20 flex items-center justify-center text-text-muted text-[10px] font-telemetry">
          D-742 · SCANNED
        </div>
      </Panel>
    </div>
  );
}
