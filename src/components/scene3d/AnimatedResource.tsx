import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import { resourceAnimationType } from "../../utils/scene3d";
import type { VisualResource } from "../../utils/scene3d";

interface AnimatedResourceProps {
  resource: VisualResource;
  animated?: boolean;
}

/**
 * Cylinder representing a single resource.
 * - solicitado (en ruta): vertical bounce animation
 * - desmovilizado: scaled down + low opacity (static)
 * - others: static cylinder
 */
export function AnimatedResource({ resource, animated = true }: AnimatedResourceProps) {
  const meshRef = useRef<Mesh>(null);
  const anim = resourceAnimationType(resource.status);
  const phase = (resource.id.charCodeAt(0) + resource.id.charCodeAt(resource.id.length - 1)) * 0.41;

  useFrame(({ clock }) => {
    if (!meshRef.current || anim !== "route" || !animated) return;
    const t = clock.getElapsedTime();
    meshRef.current.position.y = resource.position[1] + 0.09 * Math.abs(Math.sin(t * 2.8 + phase));
  });

  const scale: [number, number, number] = anim === "demob" ? [0.75, 0.75, 0.75] : [1, 1, 1];

  return (
    <mesh ref={meshRef} position={resource.position} scale={scale}>
      <cylinderGeometry args={[0.28, 0.35, 0.7, 8]} />
      <meshLambertMaterial color={resource.color} transparent opacity={resource.opacity} />
    </mesh>
  );
}
