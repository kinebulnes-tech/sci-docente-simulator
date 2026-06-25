import { Canvas } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import type { SimulationState } from "../../types/sci";
import { SceneBuildings } from "./SceneBuildings";
import { SceneHotspots } from "./SceneHotspots";
import { SceneLabels } from "./SceneLabels";
import { SceneResources } from "./SceneResources";
import { SceneTerrain } from "./SceneTerrain";
import { SceneZones } from "./SceneZones";

interface Scene3DProps {
  state: SimulationState;
}

/** Isometric 3D scene — pure visual layer, SimulationState is the source of truth. */
export function Scene3D({ state }: Scene3DProps) {
  const { scenario, selectedDecisions, resources } = state;
  const hasCommand  = selectedDecisions.includes("asumir-mando");
  const hasPerimeter = selectedDecisions.includes("perimetro-evacuacion");

  return (
    <div className="scene3d-canvas">
      <Canvas>
        <OrthographicCamera makeDefault position={[12, 10, 12]} zoom={28} />
        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
          minZoom={14}
          maxZoom={80}
          target={[0, 0, 0]}
        />

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
        />
        <SceneResources resources={resources} />
        <SceneLabels hotspots={scenario.hotspots} />
      </Canvas>
    </div>
  );
}

export default Scene3D;
