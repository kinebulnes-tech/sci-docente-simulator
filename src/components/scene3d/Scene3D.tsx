import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrthographicCamera } from "@react-three/drei";
import type { Mesh } from "three";
import type { SimulationState } from "../../types/sci";
import type { QualityMode } from "../../utils/sceneQuality";
import { deriveSceneDecisionState } from "../../utils/sceneDecisionState";
import { CameraController } from "./CameraController";
import { InjectAlerts } from "./InjectAlerts";
import { OperationalZonesLayer } from "./OperationalZonesLayer";
import { SafetyMarker } from "./SafetyMarker";
import { SceneBuildings } from "./SceneBuildings";
import { SceneGround } from "./SceneGround";
import { SceneHotspots } from "./SceneHotspots";
import { SceneLabels } from "./SceneLabels";
import { SceneLighting } from "./SceneLighting";
import { SceneResources } from "./SceneResources";
import { SearchTeam } from "./SearchTeam";
import { SectorZones } from "./SectorZones";

/** World-space camera target per critical inject ID. */
const INJECT_FOCUS: Record<string, [number, number, number]> = {
  "propagacion-techo": [1.0, 1.0, -0.8],
  "vecinos-presionan": [-1.0, 0,    2.5],
  "cilindros-patio":   [2.0,  0,    1.2],
  "bombero-fatiga":    [-2.5, 0,    1.5],
};

/** Detects newly triggered injects and returns a world-space focus point
 *  for the camera for FOCUS_DURATION_MS, then clears it. */
function useInjectFocus(triggeredInjects: string[]): [number, number, number] | null {
  const [focusPoint, setFocusPoint] = useState<[number, number, number] | null>(null);
  const prevRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const prev = prevRef.current;
    let newTarget: [number, number, number] | null = null;

    for (const id of triggeredInjects) {
      if (!prev.has(id) && INJECT_FOCUS[id]) {
        newTarget = INJECT_FOCUS[id];
        break;
      }
    }
    prevRef.current = new Set(triggeredInjects);

    if (!newTarget) return;
    setFocusPoint(newTarget);
    const t = setTimeout(() => setFocusPoint(null), 6000);
    return () => clearTimeout(t);
  }, [triggeredInjects]);

  return focusPoint;
}

/** Pulsing vehicle marker at scene edge — visible when solicitar-apoyo is taken. */
function EnRouteMarker() {
  const bodyRef = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (!bodyRef.current) return;
    const t = clock.getElapsedTime();
    bodyRef.current.position.y = 0.22 + 0.05 * Math.abs(Math.sin(t * 2.4));
  });
  return (
    <group position={[-4.5, 0, 4.5]}>
      {/* Vehicle body */}
      <mesh ref={bodyRef} position={[0, 0.22, 0]}>
        <boxGeometry args={[0.55, 0.3, 0.8]} />
        <meshLambertMaterial color="#f59e0b" />
      </mesh>
      {/* Cab */}
      <mesh position={[0, 0.44, -0.22]}>
        <boxGeometry args={[0.46, 0.22, 0.38]} />
        <meshLambertMaterial color="#fcd34d" />
      </mesh>
      {/* Direction arrow toward scene center */}
      <mesh position={[0, 0.06, -0.65]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.14, 0.32, 4]} />
        <meshLambertMaterial color="#f59e0b" transparent opacity={0.75} />
      </mesh>
      <Html position={[0, 1.1, 0]} center>
        <div className="sector-label sector-label-search">APOYO EN RUTA</div>
      </Html>
    </group>
  );
}

interface Scene3DProps {
  state: SimulationState;
  resetSignal?: number;
  animated?: boolean;
  showGrid?: boolean;
  showLabels?: boolean;
  showZones?: boolean;
  quality?: QualityMode;
  cameraPreset?: string;
}

/** Isometric 3D scene — SimulationState is the single source of truth.
 *  Decisions and injects drive visual state via deriveSceneDecisionState().
 *  Critical injects trigger a smooth camera focus animation. */
export function Scene3D({
  state,
  resetSignal = 0,
  animated = true,
  showGrid = true,
  showLabels = true,
  showZones = true,
  quality = "balanced",
  cameraPreset = "general",
}: Scene3DProps) {
  const { scenario, resources } = state;
  const ds = deriveSceneDecisionState(state);
  const focusPoint = useInjectFocus(state.triggeredInjects);

  return (
    <Canvas>
      <OrthographicCamera makeDefault position={[12, 10, 12]} zoom={28} />
        <CameraController
          resetSignal={resetSignal}
          preset={cameraPreset}
          focusPoint={focusPoint}
        />

        <color attach="background" args={["#1e2d3d"]} />

        <SceneLighting quality={quality} />

        <SceneGround type={scenario.type} showGrid={showGrid} quality={quality} />

        <OperationalZonesLayer
          type={scenario.type}
          hotspots={scenario.hotspots}
          visible={showZones}
        />

        <SectorZones visible={ds.hasSectors} />

        <SceneBuildings
          type={scenario.type}
          roofPropagation={ds.roofPropagation}
        />

        <SceneHotspots
          hotspots={scenario.hotspots}
          hasCommand={ds.hasCommand}
          hasPerimeter={ds.hasPerimeter}
          hasExposureLine={ds.hasExposureLine}
          fireIntensity={ds.fireIntensity}
          smokeIntensity={ds.smokeIntensity}
          animated={animated}
          showLabels={showLabels}
        />

        <SafetyMarker
          visible={ds.hasSafetyOfficer}
          hasFatigue={ds.firefighterFatigue}
        />

        <SearchTeam visible={ds.hasSearchTeam} />

        {ds.hasResourceEnRoute && <EnRouteMarker />}

        <InjectAlerts
          roofPropagation={ds.roofPropagation}
          civilianRisk={ds.civilianRisk}
          cylinderRisk={ds.cylinderRisk}
          firefighterFatigue={ds.firefighterFatigue}
        />

        <SceneResources resources={resources} animated={animated} showBadges={showLabels} />

        {showLabels && <SceneLabels hotspots={scenario.hotspots} />}
      </Canvas>
  );
}

export default Scene3D;
