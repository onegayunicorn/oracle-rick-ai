import { useAvatarState } from "@hooks/useAvatarState";

const STATES = ["IDLE", "TALK", "LISTEN", "THINKING", "SERIOUS", "WALK"];

export default function AvatarStage() {
  const current = useAvatarState((s) => s.currentAnimation);
  const set = useAvatarState((s) => s.setAnimation);

  return (
    <div style={{ gridArea: "center" }} className="portal-card relative overflow-hidden flex flex-col">
      {/* Persona header */}
      <div className="p-3 border-b border-white/5">
        <div className="font-display text-portal-green text-lg">RICK C-137</div>
        <div className="text-xs text-text-muted font-telemetry">THE NICKEST DICK</div>
        <p className="text-xs text-text-secondary mt-1 font-body">
          "Existence is pain and I'm always right. But hey, at least my portal gun works."
        </p>
      </div>

      {/* Avatar + state pills */}
      <div className="flex-1 flex relative">
        <div className="flex flex-col gap-2 p-3 justify-center">
          {STATES.map((s) => (
            <button key={s} onClick={() => set(s)}
              className={`anim-pill ${current === s ? "active" : ""}`}>
              {s}
            </button>
          ))}
        </div>

        <div className="flex-1 relative flex items-center justify-center">
          {/* Green portal ring backdrop */}
          <div className="absolute w-64 h-64 rounded-full bg-portal-green/10 blur-3xl glow-pulse" />
          <div className="portal-ring-12s absolute w-72 h-72 rounded-full border-2 border-portal-green/40 border-t-portal-green" />
          {/* Avatar video loop (falls back to GLB via TwinRickAvatar if available) */}
          <video
            className="relative z-10 w-3/4 max-h-72 object-contain rounded-xl"
            src="/assets/videos/avatar-portal-loop.mp4"
            poster="/assets/videos/avatar-portal-loop-poster.jpg"
            autoPlay loop muted playsInline
          />
        </div>
      </div>

      {/* Subtitle */}
      <div className="p-3 text-center text-xs text-portal-green/80 font-telemetry border-t border-white/5">
        Portal stable. Quantum harmonics within coherence. What's the play, Morty?
      </div>
    </div>
  );
}
