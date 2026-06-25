import type { ScenarioResource } from "../../types/sci";
import { positionResources } from "../../utils/scene3d";

interface SceneResourcesProps {
  resources: ScenarioResource[];
}

/** Colored cylinders representing resources — status drives color and opacity. */
export function SceneResources({ resources }: SceneResourcesProps) {
  const placed = positionResources(resources);
  return (
    <>
      {placed.map((r) => (
        <mesh key={r.id} position={r.position}>
          <cylinderGeometry args={[0.28, 0.35, 0.7, 8]} />
          <meshLambertMaterial color={r.color} transparent opacity={r.opacity} />
        </mesh>
      ))}
    </>
  );
}
