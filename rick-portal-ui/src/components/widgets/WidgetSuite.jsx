import { Mic, Zap, Brain, FlaskConical, Globe, Settings, Home, MessageSquare } from "lucide-react";

export function QuickLauncher1x1() {
  return (
    <div className="widget-frame widget-1x1 flex flex-col items-center justify-center gap-1 p-2">
      <div className="w-12 h-12 rounded-full bg-portal-green/20 border border-portal-green flex items-center justify-center">
        <Zap size={20} className="text-portal-green" />
      </div>
      <div className="text-[9px] font-telemetry text-portal-green">RICK</div>
      <div className="text-[8px] text-text-muted">1×1 LAUNCHER</div>
    </div>
  );
}

export function StatusWidget2x2() {
  const stats = [["SYSTEMS", "94%"], ["MEMORY", "87%"], ["PORTAL CORE", "82%"], ["DEVICE SYNC", "100%"]];
  return (
    <div className="widget-frame widget-2x2 p-3 flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-10 h-10 rounded-full bg-portal-green/20 border border-portal-green" />
        <div><div className="text-xs font-display text-portal-green">RICK</div>
          <span className="status-badge status-online text-[8px]">ONLINE</span></div>
      </div>
      {stats.map(([k, v]) => (
        <div key={k} className="mb-1">
          <div className="flex justify-between text-[9px] font-telemetry text-text-muted"><span>{k}</span><span className="text-portal-green">{v}</span></div>
          <div className="h-1 bg-white/10 rounded-full mt-0.5"><div className="h-full bg-portal-green rounded-full" style={{ width: v }} /></div>
        </div>
      ))}
    </div>
  );
}

export function ConversationWidget4x2() {
  return (
    <div className="widget-frame widget-4x2 p-3 flex gap-3">
      <div className="w-14 h-14 rounded-full bg-portal-green/20 border border-portal-green shrink-0" />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-display text-portal-green">RICK C-137</span>
          <span className="status-badge status-online text-[8px]">ONLINE</span>
        </div>
        <p className="text-[10px] text-text-secondary font-body">
          Another beautiful day in an infinite multiverse. What chaos do you want to cause today?
        </p>
        <div className="flex gap-2 mt-2">
          <button className="btn btn-secondary text-[9px] px-2 py-1"><Mic size={10} /> VOICE</button>
          <button className="btn btn-ghost text-[9px] px-2 py-1"><MessageSquare size={10} /> CHAT</button>
          <button className="btn btn-ghost text-[9px] px-2 py-1"><FlaskConical size={10} /> BUILD</button>
        </div>
      </div>
    </div>
  );
}

export default function WidgetSuite() {
  return (
    <div className="p-6 overflow-y-auto h-full">
      <h2 className="font-display text-portal-green mb-4">MOBILE WIDGET SYSTEM</h2>
      <div className="flex flex-wrap gap-6 items-start">
        <div><div className="text-xs text-text-muted mb-2 font-telemetry">1×1 QUICK LAUNCHER</div><QuickLauncher1x1 /></div>
        <div><div className="text-xs text-text-muted mb-2 font-telemetry">2×2 STATUS WIDGET</div><StatusWidget2x2 /></div>
        <div><div className="text-xs text-text-muted mb-2 font-telemetry">4×2 CONVERSATION WIDGET</div><ConversationWidget4x2 /></div>
      </div>
      <div className="mt-8 portal-card p-4">
        <div className="text-xs font-telemetry text-portal-green mb-2">ANDROID HOME SCREEN INTEGRATION</div>
        <p className="text-xs text-text-secondary font-body">
          Glance widgets (Jetpack Glance) — resizable 1×1 / 2×2 / 4×2, dark-mode optimized,
          low-battery polling, tap-to-launch voice console. Bottom nav: Home · Chat · Inventions · Portal · Settings.
        </p>
      </div>
    </div>
  );
}
