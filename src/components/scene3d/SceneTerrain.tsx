import type { IncidentType } from "../../types/sci";
import { terrainColorForType } from "../../utils/scene3d";

interface SceneTerrainProps {
  type: IncidentType;
}

/** Flat ground plane colored by incident type. */
export function SceneTerrain({ type }: SceneTerrainProps) {
  const color = terrainColorForType(type);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[22, 22]} />
      <meshLambertMaterial color={color} />
    </mesh>
  );
}
