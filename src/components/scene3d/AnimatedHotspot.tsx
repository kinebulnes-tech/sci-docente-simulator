import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh, MeshLambertMaterial } from "three";
import { hotspotKindToColor } from "../../utils/scene3d";

interface HotspotProps {
  id: string;
  kind: string;
  position: [number, number, number];
  animated?: boolean;
}

/**
 * Fire hotspot: flickering sphere + animated smoke column.
 * Phase offset from id prevents all fires from syncing.
 */
export function FireHotspot({ id, kind, position, animated = true }: HotspotProps) {
  const headRef = useRef<Mesh>(null);
  const smokeRef = useRef<Mesh>(null);
  const color = hotspotKindToColor(kind);
  const phase = (id.charCodeAt(0) + id.charCodeAt(id.length - 1)) * 0.37;

  useFrame(({ clock }) => {
    if (!animated) return;
    const t = clock.getElapsedTime();
    if (headRef.current) {
      const s = 1 + 0.14 * Math.sin(t * 9 + phase);
      headRef.current.scale.setScalar(s);
      headRef.current.position.y = 0.55 + 0.06 * Math.sin(t * 5.5 + phase * 0.7);
    }
    if (smokeRef.current) {
      smokeRef.current.scale.y = 1 + 0.2 * Math.sin(t * 2 + phase);
      smokeRef.current.position.y = 1.05 + 0.05 * Math.sin(t * 1.8 + phase * 0.5);
      (smokeRef.current.material as MeshLambertMaterial).opacity =
        0.22 + 0.08 * Math.sin(t * 3 + phase * 1.2);
    }
  });

  return (
    <group position={position}>
      {/* Stem */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 6]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Flickering head */}
      <mesh ref={headRef} position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshLambertMaterial color={color} emissive={color} emissiveIntensity={0.4} />
      </mesh>
      {/* Smoke column */}
      <mesh ref={smokeRef} position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.07, 0.13, 0.55, 6]} />
        <meshLambertMaterial color="#94a3b8" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

/**
 * Pulse hotspot: static pin + expanding ring on the terrain.
 * Used for riesgo and victima hotspots.
 */
export function PulseHotspot({ id, kind, position, animated = true }: HotspotProps) {
  const ringRef = useRef<Mesh>(null);
  const color = hotspotKindToColor(kind);
  const phase = (id.charCodeAt(0) + id.charCodeAt(id.length - 1)) * 0.31;
  const CYCLE = 2.4;

  useFrame(({ clock }) => {
    if (!ringRef.current || !animated) return;
    const t = (clock.getElapsedTime() + phase) % CYCLE;
    ringRef.current.scale.setScalar(1 + t * 0.38);
    (ringRef.current.material as MeshLambertMaterial).opacity = Math.max(0, 1 - t / CYCLE);
  });

  return (
    <group position={position}>
      {/* Stem */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 6]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Pulse ring on terrain */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[0.3, 0.44, 24]} />
        <meshLambertMaterial color={color} transparent opacity={1} />
      </mesh>
    </group>
  );
}
