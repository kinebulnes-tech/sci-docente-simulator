import type { ScenarioResource } from "../../types/sci";
import { positionResources } from "../../utils/scene3d";
import { AnimatedResource } from "./AnimatedResource";

interface SceneResourcesProps {
  resources: ScenarioResource[];
}

/** Colored cylinders representing resources — status drives color, opacity and animation. */
export function SceneResources({ resources }: SceneResourcesProps) {
  const placed = positionResources(resources);
  return (
    <>
      {placed.map((r) => (
        <AnimatedResource key={r.id} resource={r} />
      ))}
    </>
  );
}
