import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import type { SimulationState } from "../../types/sci";
import type { QualityMode } from "../../utils/sceneQuality";
import { CameraController } from "./CameraController";
import { OperationalZonesLayer } from "./OperationalZonesLayer";
import { SceneBuildings } from "./SceneBuildings";
import { SceneGround } from "./SceneGround";
import { SceneHotspots } from "./SceneHotspots";
import { SceneLabels } from "./SceneLabels";
import { SceneLighting } from "./SceneLighting";
import { SceneResources } from "./SceneResources";

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

/** Isometric 3D scene — pure visual layer, SimulationState is the source of truth. */
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
  const { scenario, selectedDecisions, resources } = state;
  const hasCommand   = selectedDecisions.includes("asumir-mando");
  const hasPerimeter = selectedDecisions.includes("perimetro-evacuacion");

  return (
    <div className="scene3d-canvas">
      <Canvas>
        <OrthographicCamera makeDefault position={[12, 10, 12]} zoom={28} />
        <CameraController resetSignal={resetSignal} preset={cameraPreset} />

        <color attach="background" args={["#1e2d3d"]} />

        <SceneLighting quality={quality} />

        <SceneGround type={scenario.type} showGrid={showGrid} quality={quality} />
        <OperationalZonesLayer
          type={scenario.type}
          hotspots={scenario.hotspots}
          visible={showZones}
        />
        <SceneBuildings type={scenario.type} />
        <SceneHotspots
          hotspots={scenario.hotspots}
          hasCommand={hasCommand}
          hasPerimeter={hasPerimeter}
          animated={animated}
        />
        <SceneResources resources={resources} animated={animated} />
        {showLabels && <SceneLabels hotspots={scenario.hotspots} />}
      </Canvas>
    </div>
  );
}

export default Scene3D;
