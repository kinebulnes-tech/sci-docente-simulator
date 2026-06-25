import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import type { SimulationState } from "../../types/sci";
import { CameraController } from "./CameraController";
import { SceneBuildings } from "./SceneBuildings";
import { SceneHotspots } from "./SceneHotspots";
import { SceneLabels } from "./SceneLabels";
import { SceneResources } from "./SceneResources";
import { SceneTerrain } from "./SceneTerrain";
import { SceneZones } from "./SceneZones";

interface Scene3DProps {
  state: SimulationState;
  resetSignal?: number;
  animated?: boolean;
}

/** Isometric 3D scene — pure visual layer, SimulationState is the source of truth. */
export function Scene3D({ state, resetSignal = 0, animated = true }: Scene3DProps) {
  const { scenario, selectedDecisions, resources } = state;
  const hasCommand   = selectedDecisions.includes("asumir-mando");
  const hasPerimeter = selectedDecisions.includes("perimetro-evacuacion");

  return (
    <div className="scene3d-canvas">
      <Canvas>
        <OrthographicCamera makeDefault position={[12, 10, 12]} zoom={28} />
        <CameraController resetSignal={resetSignal} />

        <color attach="background" args={["#1e2d3d"]} />

        <ambientLight intensity={0.75} />
        <directionalLight position={[10, 14, 8]} intensity={1.1} />

        <SceneTerrain type={scenario.type} />
        <SceneZones type={scenario.type} hotspots={scenario.hotspots} />
        <SceneBuildings type={scenario.type} />
        <SceneHotspots
          hotspots={scenario.hotspots}
          hasCommand={hasCommand}
          hasPerimeter={hasPerimeter}
          animated={animated}
        />
        <SceneResources resources={resources} animated={animated} />
        <SceneLabels hotspots={scenario.hotspots} />
      </Canvas>
    </div>
  );
}

export default Scene3D;
