import type { IncidentType } from "../../types/sci";
import { terrainColorForType } from "../../utils/scene3d";

interface SceneGroundProps {
  type: IncidentType;
  showGrid?: boolean;
  quality?: "high" | "balanced" | "low";
}

/** Ground plane + optional spatial orientation grid. */
export function SceneGround({ type, showGrid = true, quality = "balanced" }: SceneGroundProps) {
  const color = terrainColorForType(type);
  const divisions = quality === "high" ? 22 : 11;
  const gridColor = "#475569";
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[22, 22]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {showGrid && (
        <gridHelper
          args={[22, divisions, gridColor, gridColor]}
          position={[0, 0.005, 0]}
        />
      )}
    </group>
  );
}
