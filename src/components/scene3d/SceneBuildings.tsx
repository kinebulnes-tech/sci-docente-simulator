import type { IncidentType } from "../../types/sci";
import { buildingsForScenario } from "../../utils/scene3d";

interface SceneBuildingsProps {
  type: IncidentType;
}

/** Procedural building boxes positioned per incident type. */
export function SceneBuildings({ type }: SceneBuildingsProps) {
  const buildings = buildingsForScenario(type);
  return (
    <>
      {buildings.map((b, i) => (
        <mesh key={i} position={b.position} castShadow receiveShadow>
          <boxGeometry args={b.size} />
          <meshLambertMaterial color={b.color} />
        </mesh>
      ))}
    </>
  );
}
