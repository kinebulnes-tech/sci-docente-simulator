import { Html } from "@react-three/drei";
import type { ScenarioHotspot } from "../../types/sci";
import { hasValidCoords, normalizeCoords } from "../../utils/scene3d";

interface SceneLabelsProps {
  hotspots: ScenarioHotspot[];
}

/** HTML labels pinned above each hotspot using drei's Html portal. */
export function SceneLabels({ hotspots }: SceneLabelsProps) {
  return (
    <>
      {hotspots.filter(hasValidCoords).map((h) => {
        const [wx, , wz] = normalizeCoords(h.x, h.y);
        return (
          <Html key={h.id} position={[wx, 1.1, wz]} center distanceFactor={9}>
            <div className="scene-label">{h.label}</div>
          </Html>
        );
      })}
    </>
  );
}
