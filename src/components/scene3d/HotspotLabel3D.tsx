import { useState } from "react";
import { Html } from "@react-three/drei";
import type { ScenarioHotspot } from "../../types/sci";
import { hasValidCoords, hotspotKindToColor, normalizeCoords } from "../../utils/scene3d";

interface HotspotLabel3DProps {
  hotspot: ScenarioHotspot;
}

const KIND_LABELS: Record<string, string> = {
  fuego:    "FUEGO",
  victima:  "VÍCTIMA",
  riesgo:   "RIESGO",
  recurso:  "RECURSO",
  perimetro:"PERÍMETRO",
  pc:       "PUESTO DE MANDO",
};

/** Interactive 3D label: hover a transparent hit-sphere to reveal hotspot details. */
export function HotspotLabel3D({ hotspot }: HotspotLabel3DProps) {
  const [hovered, setHovered] = useState(false);

  if (!hasValidCoords(hotspot)) return null;
  const [wx, , wz] = normalizeCoords(hotspot.x, hotspot.y);
  const color = hotspotKindToColor(hotspot.kind);

  return (
    <group position={[wx, 0, wz]}>
      {/* Transparent hit sphere for pointer events */}
      <mesh
        position={[0, 0.5, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.45, 6, 6]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {hovered && (
        <Html position={[0, 1.8, 0]} center>
          <div className="hotspot-label-3d" style={{ borderColor: color }}>
            <span className="hotspot-label-kind" style={{ color }}>
              {KIND_LABELS[hotspot.kind] ?? hotspot.kind.toUpperCase()}
            </span>
            <strong className="hotspot-label-name">{hotspot.label}</strong>
            {hotspot.description && (
              <p className="hotspot-label-desc">{hotspot.description}</p>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
