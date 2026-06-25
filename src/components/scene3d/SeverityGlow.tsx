import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh, MeshLambertMaterial } from "three";

interface SeverityGlowProps {
  position: [number, number, number];
  color: string;
  animated?: boolean;
  radius?: number;
}

/** Pulsing transparent sphere providing glow effect around critical hotspots. */
export function SeverityGlow({
  position,
  color,
  animated = true,
  radius = 0.55,
}: SeverityGlowProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current || !animated) return;
    const t = clock.getElapsedTime();
    const pulse = 1 + 0.12 * Math.sin(t * 3.5);
    meshRef.current.scale.setScalar(pulse);
    (meshRef.current.material as MeshLambertMaterial).opacity = 0.12 + 0.06 * Math.sin(t * 2.8);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, 10, 10]} />
      <meshLambertMaterial color={color} transparent opacity={0.14} side={2} />
    </mesh>
  );
}
