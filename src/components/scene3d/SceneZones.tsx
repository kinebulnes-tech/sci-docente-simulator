import type { ScenarioHotspot, IncidentType } from "../../types/sci";
import { getMatpelZones, isMatpelScenario } from "../../utils/scene3d";

interface SceneZonesProps {
  type: IncidentType;
  hotspots: ScenarioHotspot[];
}

/** Concentric MATPEL hazard zones (hot / warm / cold). Renders nothing for non-MATPEL scenarios. */
export function SceneZones({ type, hotspots }: SceneZonesProps) {
  if (!isMatpelScenario(type)) return null;

  const zones = getMatpelZones(hotspots);
  return (
    <>
      {zones.map((zone, i) => {
        const innerR = i === 0 ? 0 : zones[i - 1].radius;
        const [cx, cz] = zone.center;
        return (
          <mesh
            key={zone.label}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[cx, 0.01 + i * 0.005, cz]}
          >
            {innerR === 0 ? (
              <circleGeometry args={[zone.radius, 40]} />
            ) : (
              <ringGeometry args={[innerR, zone.radius, 40]} />
            )}
            <meshLambertMaterial color={zone.color} transparent opacity={0.28} side={2} />
          </mesh>
        );
      })}
    </>
  );
}
