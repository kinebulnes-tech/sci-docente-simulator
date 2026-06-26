import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh, MeshLambertMaterial } from "three";

interface PriorityRingProps {
  position: [number, number, number];
  color: string;
  animated?: boolean;
  radius?: number;
}

/** Expanding ring on the terrain surface indicating priority/alert. */
export function PriorityRing({
  position,
  color,
  animated = true,
  radius = 0.38,
}: PriorityRingProps) {
  const ringRef = useRef<Mesh>(null);
  const CYCLE = 2.0;

  useFrame(({ clock }) => {
    if (!ringRef.current || !animated) return;
    const t = clock.getElapsedTime() % CYCLE;
    ringRef.current.scale.setScalar(1 + t * 0.5);
    (ringRef.current.material as MeshLambertMaterial).opacity = Math.max(0, 0.7 * (1 - t / CYCLE));
  });

  return (
    <mesh
      ref={ringRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[position[0], position[1] + 0.03, position[2]]}
    >
      <ringGeometry args={[radius * 0.7, radius, 24]} />
      <meshLambertMaterial color={color} transparent opacity={0.7} />
    </mesh>
  );
}
