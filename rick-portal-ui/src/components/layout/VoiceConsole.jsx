import { useAvatarState } from "@hooks/useAvatarState";

// Drives avatar animation state from voice interaction.
export default function VoiceConsole() {
  const setAnimation = useAvatarState((state) => state.setAnimation);

  const handleTalk = () => {
    setAnimation("Talk");
    setTimeout(() => setAnimation("Idle"), 3000);
  };

  return (
    <div className="p-4">
      <button onClick={handleTalk} className="bg-portal-green text-black px-4 py-2 rounded-full font-bold">
        Speak to Rick
      </button>
    </div>
  );
}
