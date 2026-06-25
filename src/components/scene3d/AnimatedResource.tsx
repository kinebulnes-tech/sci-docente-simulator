import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { resourceAnimationType } from "../../utils/scene3d";
import type { VisualResource } from "../../utils/scene3d";
import { ResourceModel3D } from "./ResourceModel3D";

interface AnimatedResourceProps {
  resource: VisualResource;
  animated?: boolean;
}

/**
 * Animated wrapper for ResourceModel3D.
 * - solicitado (en ruta): vertical bounce
 * - desmovilizado: scaled down + low opacity (static)
 * - others: static at full scale
 */
export function AnimatedResource({ resource, animated = true }: AnimatedResourceProps) {
  const groupRef = useRef<Group>(null);
  const anim = resourceAnimationType(resource.status);
  const phase = (resource.id.charCodeAt(0) + resource.id.charCodeAt(resource.id.length - 1)) * 0.41;
  const scale: [number, number, number] = anim === "demob" ? [0.75, 0.75, 0.75] : [1, 1, 1];

  useFrame(({ clock }) => {
    if (!groupRef.current || anim !== "route" || !animated) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.y = resource.position[1] + 0.09 * Math.abs(Math.sin(t * 2.8 + phase));
  });

  return (
    <group ref={groupRef} position={resource.position}>
      <ResourceModel3D resource={resource} scale={scale} />
    </group>
  );
}
