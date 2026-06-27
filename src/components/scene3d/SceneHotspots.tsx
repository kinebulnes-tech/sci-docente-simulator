import type { ScenarioHotspot } from "../../types/sci";
import { hasValidCoords, hotspotAnimationType, hotspotKindToColor, normalizeCoords } from "../../utils/scene3d";
import { FireHotspot, PulseHotspot } from "./AnimatedHotspot";
import { HotspotLabel3D } from "./HotspotLabel3D";
import { PriorityRing } from "./PriorityRing";
import { SeverityGlow } from "./SeverityGlow";

interface SceneHotspotsProps {
  hotspots: ScenarioHotspot[];
  hasCommand: boolean;
  hasPerimeter: boolean;
  animated?: boolean;
  showLabels?: boolean;
  fireIntensity?: number;
  smokeIntensity?: number;
  hasExposureLine?: boolean;
}

const CRITICAL_KINDS = new Set(["fuego", "victima"]);

/** Map-pin markers for scenario hotspots + optional perimeter ring and command post. */
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

export function SceneHotspots({ hotspots, hasCommand, hasPerimeter, animated = true, showLabels = false, fireIntensity = 1, smokeIntensity = 1, hasExposureLine = false }: SceneHotspotsProps) {
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
        const glowPos: [number, number, number] = [wx, 0.55, wz];
        const color = hotspotKindToColor(h.kind);
        const anim = hotspotAnimationType(h.kind);
        const isCritical = CRITICAL_KINDS.has(h.kind);

        // Exposure-side riesgo gets lower intensity when linea-exposicion is taken
        const isExposure = h.kind === "riesgo";
        const effectiveIntensity = isExposure && hasExposureLine
          ? Math.max(0.3, fireIntensity * 0.45)
          : fireIntensity;

        return (
          <group key={h.id}>
            {isCritical && (
              <SeverityGlow position={glowPos} color={color} animated={animated} />
            )}
            {isCritical && (
              <PriorityRing position={pos} color={color} animated={animated} />
            )}
            {anim === "fire"  && <FireHotspot  id={h.id} kind={h.kind} position={pos} animated={animated} intensity={effectiveIntensity} smokeIntensity={smokeIntensity} />}
            {anim === "pulse" && <PulseHotspot id={h.id} kind={h.kind} position={pos} animated={animated} />}
            {anim === "none"  && <StaticPin kind={h.kind} position={pos} />}
            {showLabels && <HotspotLabel3D hotspot={h} />}
          </group>
        );
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
