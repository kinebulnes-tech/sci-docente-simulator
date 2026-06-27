import { Html } from "@react-three/drei";

interface SectorZonesProps {
  visible: boolean;
}

/** Colored ground planes + HTML labels for ICS operational sectors.
 *  Appears when the student selects "sectorizar-operaciones". */
export function SectorZones({ visible }: SectorZonesProps) {
  if (!visible) return null;

  return (
    <>
      {/* Interior sector — fire building area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.5, 0.025, -0.5]}>
        <planeGeometry args={[5.5, 4.5]} />
        <meshLambertMaterial color="#ef4444" transparent opacity={0.09} />
      </mesh>
      <Html position={[1.5, 0.1, -3.0]} center>
        <div className="sector-label sector-label-interior">SECTOR INTERIOR</div>
      </Html>

      {/* Exposure sector — lateral building */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5.8, 0.03, -0.5]}>
        <planeGeometry args={[3.2, 4]} />
        <meshLambertMaterial color="#f97316" transparent opacity={0.09} />
      </mesh>
      <Html position={[5.8, 0.1, -3.0]} center>
        <div className="sector-label sector-label-exposure">EXPOSICIÓN</div>
      </Html>

      {/* Safety / Perimeter sector */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.5, 0.02, 2.5]}>
        <planeGeometry args={[4, 4.5]} />
        <meshLambertMaterial color="#22c55e" transparent opacity={0.07} />
      </mesh>
      <Html position={[-3.5, 0.1, 4.5]} center>
        <div className="sector-label sector-label-safety">SECTOR SEGURIDAD</div>
      </Html>
    </>
  );
}
