import { useGLTF } from "@react-three/drei";
import { AnimationMixer } from "three";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useAvatarAnimations } from "@hooks/useAvatarAnimations";
import { useAvatarState } from "@hooks/useAvatarState";

export default function TwinRickAvatar() {
  const avatarRef = useRef();
  const mixerRef = useRef();
  const lastAction = useRef(null);

  const currentAnimation = useAvatarState((state) => state.currentAnimation);
  const { scene } = useGLTF("/assets/avatar/TwinRick.glb");
  const clips = useAvatarAnimations();

  useEffect(() => {
    if (!avatarRef.current || !scene) return;
    if (!mixerRef.current) {
      mixerRef.current = new AnimationMixer(avatarRef.current);
    }
  }, [scene]);

  useEffect(() => {
    const mixer = mixerRef.current;
    if (!mixer) return;

    // Fallback: missing clip -> Idle -> procedural idle
    const clip = clips[currentAnimation] || clips.Idle;
    if (!clip) {
      console.warn(`Missing clip: ${currentAnimation}`);
      return;
    }

    const action = mixer.clipAction(clip);
    if (!action) return;

    lastAction.current?.fadeOut(0.3);
    action.reset().fadeIn(0.3).play();
    lastAction.current = action;
  }, [currentAnimation, clips]);

  // Cleanup on unmount: prevent AnimationMixer memory leaks
  useEffect(() => {
    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current.uncacheRoot(avatarRef.current);
      }
    };
  }, []);

  useFrame(({ clock }, delta) => {
    mixerRef.current?.update(delta);
    if (!avatarRef.current) return;

    // Procedural idle fallback — always feels alive even if no clips load
    if (currentAnimation === "Idle") {
      const t = clock.elapsedTime;
      avatarRef.current.position.y = -2 + Math.sin(t * 1.2) * 0.025; // breathing
      avatarRef.current.rotation.y = Math.sin(t * 0.5) * 0.08;      // head wander
      avatarRef.current.rotation.z = Math.sin(t * 0.4) * 0.02;      // sway
    }
  });

  return (
    <group ref={avatarRef} position={[0, -2, 0]} scale={1.35}>
      <primitive object={scene} dispose={null} />
    </group>
  );
}
