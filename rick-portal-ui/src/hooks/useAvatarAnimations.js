import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";

// Preload all clips at startup to remove animation hitching.
useGLTF.preload("/assets/avatar/TwinRick.glb");
useGLTF.preload("/assets/avatar/animations/idle.glb");
useGLTF.preload("/assets/avatar/animations/walk.glb");
useGLTF.preload("/assets/avatar/animations/talk.glb");
useGLTF.preload("/assets/avatar/animations/thinking.glb");
useGLTF.preload("/assets/avatar/animations/listening.glb");
useGLTF.preload("/assets/avatar/animations/serious.glb");

export function useAvatarAnimations() {
  const idle = useGLTF("/assets/avatar/animations/idle.glb");
  const walk = useGLTF("/assets/avatar/animations/walk.glb");
  const talk = useGLTF("/assets/avatar/animations/talk.glb");
  const thinking = useGLTF("/assets/avatar/animations/thinking.glb");
  const listening = useGLTF("/assets/avatar/animations/listening.glb");
  const serious = useGLTF("/assets/avatar/animations/serious.glb");

  return useMemo(
    () => ({
      Idle: idle.animations?.[0],
      Walk: walk.animations?.[0],
      Talk: talk.animations?.[0],
      Thinking: thinking.animations?.[0],
      Listening: listening.animations?.[0],
      Serious: serious.animations?.[0],
    }),
    [idle, walk, talk, thinking, listening, serious]
  );
}
