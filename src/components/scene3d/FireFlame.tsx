import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh, MeshBasicMaterial, MeshLambertMaterial, PointLight } from "three";

interface FireFlameProps {
  position: [number, number, number];
  /** 0.4 – 2.0: scales size, height, light intensity */
  intensity?: number;
  /** 0.4 – 2.0: scales smoke volume and opacity */
  smokeIntensity?: number;
  animated?: boolean;
  /** Phase offset to prevent sync between multiple fire hotspots */
  phase?: number;
}

/**
 * Multi-layer fire with dynamic point light.
 *
 * Visual layers (bottom → top):
 *  1. Ground glow disc — orange, pulsing opacity
 *  2. Three flame cones — red / orange / amber, each with independent sway/scale
 *  3. Tip ember blob — yellow, dancing at top
 *  4. Two smoke cylinders — rise, rotate, drift
 *  5. PointLight — warm, flickering, illuminates surrounding buildings
 */
export function FireFlame({
  position,
  intensity = 1,
  smokeIntensity = 1,
  animated = true,
  phase = 0,
}: FireFlameProps) {
  const tongue1Ref = useRef<Mesh>(null);
  const tongue2Ref = useRef<Mesh>(null);
  const tongue3Ref = useRef<Mesh>(null);
  const tipRef     = useRef<Mesh>(null);
  const glowRef    = useRef<Mesh>(null);
  const smoke1Ref  = useRef<Mesh>(null);
  const smoke2Ref  = useRef<Mesh>(null);
  const lightRef   = useRef<PointLight>(null);

  // Geometry constants derived from intensity
  const r        = 0.18 * Math.sqrt(intensity);   // base radius
  const h        = 0.65 * intensity;               // flame height
  const baseH    = h * 1.6 + 0.15;                // tip Y
  const smokeH   = 0.8 * smokeIntensity;
  const smokeBaseY = baseH + smokeH * 0.45;

  useFrame(({ clock }) => {
    if (!animated) return;
    const t = clock.getElapsedTime();

    // Flame tongue 1 — main body, vertical pulse
    if (tongue1Ref.current) {
      tongue1Ref.current.scale.x = 1 + 0.15 * Math.sin(t * 8.3 + phase);
      tongue1Ref.current.scale.z = 1 + 0.10 * Math.sin(t * 6.7 + phase + 0.5);
      tongue1Ref.current.scale.y = 1 + 0.22 * intensity * Math.sin(t * 5.2 + phase + 1.1);
    }

    // Flame tongue 2 — sways left
    if (tongue2Ref.current) {
      tongue2Ref.current.rotation.z = 0.18 * Math.sin(t * 4.5 + phase + 2.1);
      tongue2Ref.current.scale.y    = 1 + 0.16 * Math.sin(t * 7.1 + phase + 0.8);
    }

    // Flame tongue 3 — sways right
    if (tongue3Ref.current) {
      tongue3Ref.current.rotation.z = -0.14 * Math.sin(t * 3.8 + phase + 1.3);
      tongue3Ref.current.scale.y    = 1 + 0.13 * Math.sin(t * 9.2 + phase + 1.7);
    }

    // Tip ember blob
    if (tipRef.current) {
      tipRef.current.position.y = baseH + 0.09 * Math.sin(t * 11.5 + phase);
      tipRef.current.scale.setScalar(0.8 + 0.28 * Math.abs(Math.sin(t * 7.8 + phase)));
      (tipRef.current.material as MeshBasicMaterial).opacity =
        0.65 + 0.3 * Math.abs(Math.sin(t * 6.2 + phase));
    }

    // Ground glow
    if (glowRef.current) {
      (glowRef.current.material as MeshBasicMaterial).opacity =
        0.28 + 0.14 * Math.sin(t * 3.5 + phase);
      glowRef.current.scale.setScalar(1 + 0.06 * Math.sin(t * 4.2 + phase));
    }

    // Smoke 1 — lower, slow clockwise rotation
    if (smoke1Ref.current) {
      smoke1Ref.current.rotation.y += 0.004;
      (smoke1Ref.current.material as MeshLambertMaterial).opacity =
        Math.min(0.55, smokeIntensity * (0.18 + 0.07 * Math.sin(t * 2.1 + phase)));
    }

    // Smoke 2 — upper, counter-clockwise
    if (smoke2Ref.current) {
      smoke2Ref.current.rotation.y -= 0.003;
      (smoke2Ref.current.material as MeshLambertMaterial).opacity =
        Math.min(0.38, smokeIntensity * (0.13 + 0.06 * Math.sin(t * 1.7 + phase + 1.0)));
    }

    // PointLight — warm orange flicker drives building illumination
    if (lightRef.current) {
      const flicker =
        1 + 0.35 * Math.sin(t * 13.5 + phase) * Math.sin(t * 7.3 + phase * 0.7);
      lightRef.current.intensity = Math.max(0, 1.8 * intensity * flicker);
    }
  });

  return (
    <group position={position}>
      {/* ─── Ground glow disc ────────────────────────────────────────────── */}
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[r * 2.0, 16]} />
        <meshBasicMaterial color="#ff5500" transparent opacity={0.3} depthWrite={false} />
      </mesh>

      {/* ─── Flame tongue 1 — wide red base ─────────────────────────────── */}
      <mesh ref={tongue1Ref} position={[0, r * 0.45, 0]}>
        <coneGeometry args={[r, h, 6]} />
        <meshBasicMaterial color="#e63300" transparent opacity={0.92} depthWrite={false} />
      </mesh>

      {/* ─── Flame tongue 2 — orange, left-leaning ───────────────────────── */}
      <mesh ref={tongue2Ref} position={[-r * 0.22, r * 0.38, r * 0.12]}>
        <coneGeometry args={[r * 0.72, h * 1.25, 5]} />
        <meshBasicMaterial color="#ff6600" transparent opacity={0.87} depthWrite={false} />
      </mesh>

      {/* ─── Flame tongue 3 — amber, right-leaning ───────────────────────── */}
      <mesh ref={tongue3Ref} position={[r * 0.28, r * 0.3, -r * 0.1]}>
        <coneGeometry args={[r * 0.58, h * 0.95, 5]} />
        <meshBasicMaterial color="#ff8800" transparent opacity={0.82} depthWrite={false} />
      </mesh>

      {/* ─── Tip ember blob — yellow ─────────────────────────────────────── */}
      <mesh ref={tipRef} position={[0, baseH, 0]}>
        <sphereGeometry args={[r * 0.4, 5, 5]} />
        <meshBasicMaterial color="#ffcc00" transparent opacity={0.75} depthWrite={false} />
      </mesh>

      {/* ─── Smoke column 1 — lower ──────────────────────────────────────── */}
      <mesh ref={smoke1Ref} position={[0, smokeBaseY, 0]}>
        <cylinderGeometry args={[r * 0.85, r * 1.3, smokeH, 7]} />
        <meshLambertMaterial color="#374151" transparent opacity={0.22} depthWrite={false} />
      </mesh>

      {/* ─── Smoke column 2 — upper, wider ───────────────────────────────── */}
      <mesh ref={smoke2Ref} position={[r * 0.2, smokeBaseY + smokeH * 0.95, -r * 0.12]}>
        <cylinderGeometry args={[r * 1.45, r * 0.92, smokeH * 0.88, 7]} />
        <meshLambertMaterial color="#475569" transparent opacity={0.15} depthWrite={false} />
      </mesh>

      {/* ─── Dynamic warm point light ─────────────────────────────────────── */}
      <pointLight
        ref={lightRef}
        color="#ff6030"
        intensity={1.8 * intensity}
        distance={Math.max(5, 8 * intensity)}
        decay={2}
        position={[0, 1.5 * intensity, 0]}
      />
    </group>
  );
}
