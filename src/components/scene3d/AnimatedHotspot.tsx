import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh, MeshLambertMaterial } from "three";
import { FireFlame } from "./FireFlame";

interface HotspotProps {
  id: string;
  kind: string;
  position: [number, number, number];
  animated?: boolean;
  /** 0.4 – 2.0: scales fire size, flicker speed, smoke height and opacity */
  intensity?: number;
  /** 0.4 – 2.0: smoke column volume */
  smokeIntensity?: number;
}

/**
 * Fire hotspot: delegates to FireFlame for multi-layer fire + dynamic light.
 * Phase is derived from id so multiple fires never sync.
 */
export function FireHotspot({
  id,
  position,
  animated = true,
  intensity = 1,
  smokeIntensity = 1,
}: HotspotProps) {
  const phase = (id.charCodeAt(0) + id.charCodeAt(id.length - 1)) * 0.37;
  return (
    <FireFlame
      position={position}
      intensity={intensity}
      smokeIntensity={smokeIntensity}
      animated={animated}
      phase={phase}
    />
  );
}

/**
 * Pulse hotspot: static pin + expanding ring on the terrain.
 * Used for riesgo and victima hotspots.
 */
export function PulseHotspot({ id, kind, position, animated = true }: HotspotProps) {
  const ringRef = useRef<Mesh>(null);
  // Use a fixed color per kind rather than importing hotspotKindToColor to
  // keep this module self-contained — the caller already owns color logic.
  const COLOR: Record<string, string> = {
    riesgo:  "#f97316",
    victima: "#a855f7",
  };
  const color = COLOR[kind] ?? "#94a3b8";
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
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 6]} />
        <meshLambertMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshLambertMaterial color={color} />
      </mesh>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[0.3, 0.44, 24]} />
        <meshLambertMaterial color={color} transparent opacity={1} />
      </mesh>
    </group>
  );
}
