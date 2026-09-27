import { History, FlaskConical, MessageSquare, Settings } from "lucide-react";

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden flex justify-around bg-black/80 backdrop-blur border-t border-cyan-500/10 py-2 z-30">
      <button className="text-text-muted hover:text-portal-green p-2"><History size={20} /></button>
      <button className="text-text-muted hover:text-portal-green p-2"><FlaskConical size={20} /></button>
      <button className="text-portal-green p-2"><MessageSquare size={20} /></button>
      <button className="text-text-muted hover:text-portal-green p-2"><Settings size={20} /></button>
    </nav>
  );
}
