import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh, MeshLambertMaterial } from "three";
import type { IncidentType } from "../../types/sci";
import { buildingsForScenario } from "../../utils/scene3d";

interface SceneBuildingsProps {
  type: IncidentType;
  roofPropagation?: boolean;
}

interface RoofSmokeProps {
  position: [number, number, number];
  phase?: number;
}

/**
 * Three animated, counter-rotating smoke layers at roof level.
 * Layers drift in XZ to simulate wind dispersal.
 */
function RoofSmoke({ position, phase = 0 }: RoofSmokeProps) {
  const mesh1 = useRef<Mesh>(null);
  const mesh2 = useRef<Mesh>(null);
  const mesh3 = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (mesh1.current) {
      mesh1.current.rotation.y += 0.005;
      mesh1.current.position.y = position[1] + 0.35 * Math.abs(Math.sin(t * 1.4 + phase));
      (mesh1.current.material as MeshLambertMaterial).opacity =
        0.32 + 0.12 * Math.sin(t * 2.0 + phase);
    }

    if (mesh2.current) {
      mesh2.current.rotation.y -= 0.003;
      mesh2.current.position.x = position[0] + 0.18 * Math.sin(t * 0.8 + phase);
      mesh2.current.position.y = position[1] + 0.8 + 0.4 * Math.abs(Math.sin(t * 1.1 + phase + 1.5));
      (mesh2.current.material as MeshLambertMaterial).opacity =
        0.22 + 0.1 * Math.sin(t * 1.7 + phase + 0.7);
    }

    if (mesh3.current) {
      mesh3.current.rotation.y += 0.002;
      mesh3.current.position.x = position[0] - 0.12 * Math.sin(t * 0.6 + phase + 1);
      mesh3.current.position.z = position[2] + 0.15 * Math.sin(t * 0.9 + phase + 2);
      mesh3.current.position.y = position[1] + 1.6 + 0.55 * Math.abs(Math.sin(t * 0.9 + phase + 3));
      (mesh3.current.material as MeshLambertMaterial).opacity =
        0.15 + 0.08 * Math.sin(t * 1.3 + phase + 1.2);
    }
  });

  return (
    <>
      {/* Layer 1 — lower, dense, dark */}
      <mesh ref={mesh1} position={position}>
        <cylinderGeometry args={[0.3, 0.55, 0.9, 8]} />
        <meshLambertMaterial color="#374151" transparent opacity={0.35} depthWrite={false} />
      </mesh>

      {/* Layer 2 — mid, drifting */}
      <mesh ref={mesh2} position={[position[0], position[1] + 0.8, position[2]]}>
        <cylinderGeometry args={[0.52, 0.33, 1.0, 7]} />
        <meshLambertMaterial color="#475569" transparent opacity={0.25} depthWrite={false} />
      </mesh>

      {/* Layer 3 — upper, wide, light */}
      <mesh ref={mesh3} position={[position[0], position[1] + 1.6, position[2]]}>
        <cylinderGeometry args={[0.72, 0.5, 1.1, 7]} />
        <meshLambertMaterial color="#64748b" transparent opacity={0.18} depthWrite={false} />
      </mesh>
    </>
  );
}

/** Procedural building boxes positioned per incident type.
 *  Adds multi-layer roof smoke columns when roofPropagation inject is active. */
export function SceneBuildings({ type, roofPropagation = false }: SceneBuildingsProps) {
  const buildings = buildingsForScenario(type);
  return (
    <>
      {buildings.map((b, i) => (
        <mesh key={i} position={b.position} castShadow receiveShadow>
          <boxGeometry args={b.size} />
          <meshLambertMaterial color={b.color} />
        </mesh>
      ))}

      {roofPropagation && buildings[0] && (
        <RoofSmoke
          position={[
            buildings[0].position[0],
            buildings[0].position[1] + buildings[0].size[1] / 2 + 0.35,
            buildings[0].position[2],
          ]}
          phase={0}
        />
      )}
      {roofPropagation && buildings[1] && (
        <RoofSmoke
          position={[
            buildings[1].position[0],
            buildings[1].position[1] + buildings[1].size[1] / 2 + 0.3,
            buildings[1].position[2],
          ]}
          phase={1.7}
        />
      )}
    </>
  );
}
