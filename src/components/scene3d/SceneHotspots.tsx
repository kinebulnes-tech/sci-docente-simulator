import type { ScenarioHotspot } from "../../types/sci";
import { hasValidCoords, hotspotKindToColor, normalizeCoords } from "../../utils/scene3d";

interface SceneHotspotsProps {
  hotspots: ScenarioHotspot[];
  hasCommand: boolean;
  hasPerimeter: boolean;
}

/** Map-pin markers for scenario hotspots + optional perimeter ring and command post. */
export function SceneHotspots({ hotspots, hasCommand, hasPerimeter }: SceneHotspotsProps) {
  return (
    <>
      {/* Perimeter ring when player defined evacuation perimeter */}
      {hasPerimeter && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1, 0.02, -1]}>
          <ringGeometry args={[5.2, 5.8, 48]} />
          <meshLambertMaterial color="#84cc16" transparent opacity={0.45} />
        </mesh>
      )}

      {/* Hotspot map pins */}
      {hotspots.filter(hasValidCoords).map((h) => {
        const [wx, , wz] = normalizeCoords(h.x, h.y);
        const color = hotspotKindToColor(h.kind);
        return (
          <group key={h.id} position={[wx, 0, wz]}>
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
          </group>
        );
      })}

      {/* Command post marker (flag pole) */}
      {hasCommand && (
        <group position={[-3.5, 0, 3]}>
          <mesh position={[0, 0.75, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 1.5, 6]} />
            <meshLambertMaterial color="#06b6d4" />
          </mesh>
          <mesh position={[0.25, 1.35, 0]}>
            <boxGeometry args={[0.5, 0.3, 0.05]} />
            <meshLambertMaterial color="#06b6d4" />
          </mesh>
        </group>
      )}
    </>
  );
}
