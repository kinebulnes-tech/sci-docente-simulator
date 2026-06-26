import type { ScenarioResource } from "../../types/sci";
import { positionResources } from "../../utils/scene3d";
import { AnimatedResource } from "./AnimatedResource";
import { ResourceStatusBadge3D } from "./ResourceStatusBadge3D";

interface SceneResourcesProps {
  resources: ScenarioResource[];
  animated?: boolean;
  showBadges?: boolean;
}

/** Colored cylinders representing resources — status drives color, opacity and animation. */
export function SceneResources({ resources, animated = true, showBadges = false }: SceneResourcesProps) {
  const placed = positionResources(resources);
  return (
    <>
      {placed.map((r) => (
        <group key={r.id}>
          <AnimatedResource resource={r} animated={animated} />
          {showBadges && <ResourceStatusBadge3D resource={r} />}
        </group>
      ))}
    </>
  );
}
