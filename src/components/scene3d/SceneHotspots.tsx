import type { ScenarioHotspot } from "../../types/sci";
import { hasValidCoords, hotspotAnimationType, hotspotKindToColor, normalizeCoords } from "../../utils/scene3d";
import { FireHotspot, PulseHotspot } from "./AnimatedHotspot";

interface SceneHotspotsProps {
  hotspots: ScenarioHotspot[];
  hasCommand: boolean;
  hasPerimeter: boolean;
  animated?: boolean;
}

/** Static map pin — used for hotspot kinds that have no animation. */
function StaticPin({ kind, position }: { kind: string; position: [number, number, number] }) {
  const color = hotspotKindToColor(kind);
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 6]} />
        <meshLambertMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshLambertMaterial color={color} />
      </mesh>
    </group>
  );
}

/** Map-pin markers for scenario hotspots + optional perimeter ring and command post. */
export function SceneHotspots({ hotspots, hasCommand, hasPerimeter, animated = true }: SceneHotspotsProps) {
  return (
    <>
      {hasPerimeter && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1, 0.02, -1]}>
          <ringGeometry args={[5.2, 5.8, 48]} />
          <meshLambertMaterial color="#84cc16" transparent opacity={0.45} />
        </mesh>
      )}

      {hotspots.filter(hasValidCoords).map((h) => {
        const [wx, , wz] = normalizeCoords(h.x, h.y);
        const pos: [number, number, number] = [wx, 0, wz];
        const anim = hotspotAnimationType(h.kind);
        if (anim === "fire")  return <FireHotspot  key={h.id} id={h.id} kind={h.kind} position={pos} animated={animated} />;
        if (anim === "pulse") return <PulseHotspot key={h.id} id={h.id} kind={h.kind} position={pos} animated={animated} />;
        return <StaticPin key={h.id} kind={h.kind} position={pos} />;
      })}

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
