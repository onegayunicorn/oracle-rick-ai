import { Mic, Paperclip, Send } from "lucide-react";
import { useAvatarState } from "@hooks/useAvatarState";

export default function PromptBar() {
  const setAnimation = useAvatarState((s) => s.setAnimation);

  const handleSend = () => {
    setAnimation("Listening");
    setTimeout(() => setAnimation("Thinking"), 800);
    setTimeout(() => setAnimation("Talk"), 2000);
    setTimeout(() => setAnimation("Idle"), 5000);
  };

  return (
    <footer className="border-t border-white/10 bg-zinc-950 p-4 pb-20 lg:pb-4">
      <div className="mb-3 text-portal-green/80 text-sm font-telemetry">
        Portal stable. Quantum harmonics within tolerance...
      </div>
      <div className="flex gap-3">
        <input
          className="flex-1 rounded-full bg-zinc-900 px-5 py-3 text-text-primary outline-none border border-white/10 focus:border-portal-green/50"
          placeholder="Type message to Rick..."
        />
        <button className="text-text-muted hover:text-portal-green p-2" aria-label="Voice"><Mic size={20} /></button>
        <button className="text-text-muted hover:text-portal-green p-2" aria-label="Attach"><Paperclip size={20} /></button>
        <button
          onClick={handleSend}
          className="bg-portal-green text-black px-5 rounded-full font-bold hover:brightness-110"
          aria-label="Send"
        >
          <Send size={18} />
        </button>
      </div>
    </footer>
  );
}
