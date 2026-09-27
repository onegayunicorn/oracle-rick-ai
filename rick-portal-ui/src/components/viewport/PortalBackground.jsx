import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function PortalBackground() {
  const outerRing = useRef();
  const innerRing = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (outerRing.current) outerRing.current.rotation.z += 0.001;
    if (innerRing.current) {
      innerRing.current.rotation.z -= 0.0015;
      innerRing.current.scale.setScalar(1 + Math.sin(t) * 0.03);
    }
  });

  return (
    <group position={[0, 0, -2]}>
      <mesh ref={outerRing}>
        <torusGeometry args={[3, 0.08, 32, 128]} />
        <meshStandardMaterial color="#00ffaa" emissive="#00ffaa" emissiveIntensity={3} />
      </mesh>
      <mesh ref={innerRing}>
        <torusGeometry args={[2.25, 0.05, 32, 128]} />
        <meshStandardMaterial color="#ff45e0" emissive="#ff45e0" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}
