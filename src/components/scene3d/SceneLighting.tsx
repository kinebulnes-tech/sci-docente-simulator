import type { QualityMode } from "../../utils/sceneQuality";

interface SceneLightingProps {
  quality?: QualityMode;
}

/** Scene lights: ambient + directional (main) + optional hemisphere (sky/ground). */
export function SceneLighting({ quality = "balanced" }: SceneLightingProps) {
  const castShadow = quality === "high";
  return (
    <>
      <ambientLight intensity={quality === "low" ? 0.85 : 0.55} />
      <directionalLight
        position={[10, 14, 8]}
        intensity={1.15}
        castShadow={castShadow}
        shadow-mapSize-width={castShadow ? 1024 : undefined}
        shadow-mapSize-height={castShadow ? 1024 : undefined}
      />
      {quality !== "low" && (
        <hemisphereLight args={["#b8d4f0", "#3d5c3a", 0.3]} />
      )}
    </>
  );
}
