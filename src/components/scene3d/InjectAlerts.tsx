import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh, MeshLambertMaterial } from "three";
import { Html } from "@react-three/drei";

interface AlertProps {
  position: [number, number, number];
  color: string;
  label: string;
}

/** Blinking octahedral alert marker for inject-triggered events. */
function InjectAlert({ position, color, label }: AlertProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    (meshRef.current.material as MeshLambertMaterial).opacity =
      0.55 + 0.45 * Math.abs(Math.sin(t * 2.8));
    const s = 1 + 0.08 * Math.sin(t * 5.5);
    meshRef.current.scale.setScalar(s);
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.38, 0]} />
        <meshLambertMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>
      <Html position={[0, 0.85, 0]} center>
        <div className="sector-label sector-label-danger">{label}</div>
      </Html>
    </group>
  );
}

interface InjectAlertsProps {
  roofPropagation: boolean;
  civilianRisk: boolean;
  cylinderRisk: boolean;
  firefighterFatigue: boolean;
}

/** Renders inject-triggered visual alerts in the 3D scene. */
export function InjectAlerts({ roofPropagation, civilianRisk, cylinderRisk }: InjectAlertsProps) {
  return (
    <>
      {roofPropagation && (
        <InjectAlert
          position={[1.0, 3.4, -1.0]}
          color="#ef4444"
          label="⚠ PROPAGACIÓN TECHO"
        />
      )}
      {civilianRisk && (
        <InjectAlert
          position={[-1.2, 0.3, 2.8]}
          color="#a855f7"
          label="⚠ CIVILES EN ZONA"
        />
      )}
      {cylinderRisk && (
        <InjectAlert
          position={[2.2, 0.3, 1.2]}
          color="#f59e0b"
          label="⚠ CILINDROS"
        />
      )}
    </>
  );
}
