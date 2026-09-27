import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import PortalBackground from "./PortalBackground";
import TwinRickAvatar from "./TwinRickAvatar";

export default function AvatarViewport() {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 1.5, 5], fov: 50 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[4, 4, 4]} intensity={2} color="#00ffaa" />
        <PortalBackground />
        <TwinRickAvatar />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
