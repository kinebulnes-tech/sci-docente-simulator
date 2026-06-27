import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import { Html } from "@react-three/drei";

interface SafetyMarkerProps {
  visible: boolean;
  hasFatigue?: boolean;
}

/** Safety officer marker — appears when oficial-seguridad is selected.
 *  Turns red and shows fatigue alert when bombero-fatiga inject fires. */
export function SafetyMarker({ visible, hasFatigue = false }: SafetyMarkerProps) {
  const ringRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const t = clock.getElapsedTime();
    const pulse = hasFatigue
      ? 1 + 0.15 * Math.abs(Math.sin(t * 4))
      : 1 + 0.04 * Math.sin(t * 2);
    ringRef.current.scale.setScalar(pulse);
  });

  if (!visible) return null;

  const color = hasFatigue ? "#ef4444" : "#22c55e";

  return (
    <group position={[-2.5, 0, 1.5]}>
      {/* Pulsing zone ring on ground */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[0.55, 0.8, 32]} />
        <meshLambertMaterial color={color} transparent opacity={0.7} />
      </mesh>

      {/* Vertical pole */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 1.3, 6]} />
        <meshLambertMaterial color={color} />
      </mesh>

      {/* Cross symbol on top (H + V bar) */}
      <mesh position={[0.1, 1.3, 0]}>
        <boxGeometry args={[0.38, 0.07, 0.07]} />
        <meshLambertMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.1, 1.3, 0]}>
        <boxGeometry args={[0.07, 0.38, 0.07]} />
        <meshLambertMaterial color="#ffffff" />
      </mesh>

      <Html position={[0, 1.75, 0]} center>
        <div className={`sector-label ${hasFatigue ? "sector-label-danger" : "sector-label-safety"}`}>
          {hasFatigue ? "⚠ FATIGA — SOLICITAR RELEVO" : "OF. SEGURIDAD"}
        </div>
      </Html>
    </group>
  );
}
