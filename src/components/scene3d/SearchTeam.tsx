import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { Html } from "@react-three/drei";

interface SearchTeamProps {
  visible: boolean;
}

function Figure({ offset }: { offset: [number, number, number] }) {
  return (
    <group position={offset}>
      {/* Body */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.44, 6]} />
        <meshLambertMaterial color="#f97316" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.66, 0]}>
        <sphereGeometry args={[0.12, 6, 6]} />
        <meshLambertMaterial color="#fbbf24" />
      </mesh>
      {/* Helmet */}
      <mesh position={[0, 0.76, 0]}>
        <sphereGeometry args={[0.13, 6, 4]} />
        <meshLambertMaterial color="#f97316" />
      </mesh>
    </group>
  );
}

/** Two animated figures representing the primary search team.
 *  Appear when busqueda-primaria is selected. */
export function SearchTeam({ visible }: SearchTeamProps) {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.y = 0.05 * Math.abs(Math.sin(t * 2.5));
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={[-0.3, 0, 0.8]}>
      <Figure offset={[0, 0, 0]} />
      <Figure offset={[0.38, 0, 0.22]} />

      {/* Direction arrow: line pointing toward fire (positive x, negative z) */}
      <mesh position={[0.6, 0.06, -0.4]} rotation={[0, -Math.PI / 4, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 1.1, 4]} />
        <meshLambertMaterial color="#fbbf24" transparent opacity={0.65} />
      </mesh>

      <Html position={[0.2, 1.1, 0]} center>
        <div className="sector-label sector-label-search">BÚSQUEDA PRIMARIA</div>
      </Html>
    </group>
  );
}
