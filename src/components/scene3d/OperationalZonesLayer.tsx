import type { ScenarioHotspot, IncidentType } from "../../types/sci";
import { getMatpelZones, isMatpelScenario, normalizeCoords } from "../../utils/scene3d";
import { OperationalZone } from "./OperationalZone";

interface OperationalZonesLayerProps {
  type: IncidentType;
  hotspots: ScenarioHotspot[];
  visible?: boolean;
}

/** Hot/warm/cold operational zones.
 * MATPEL: concentric zones from hazmat hotspot.
 * Others: derived from fire/riesgo hotspot positions. */
export function OperationalZonesLayer({
  type,
  hotspots,
  visible = true,
}: OperationalZonesLayerProps) {
  if (!visible) return null;

  if (isMatpelScenario(type)) {
    const zones = getMatpelZones(hotspots);
    return (
      <>
        {zones.map((zone, i) => {
          const innerR = i === 0 ? 0 : zones[i - 1].radius;
          return (
            <OperationalZone
              key={zone.label}
              center={zone.center}
              innerRadius={innerR}
              outerRadius={zone.radius}
              color={zone.color}
              opacity={0.22}
              yOffset={i * 0.005}
            />
          );
        })}
      </>
    );
  }

  const anchor =
    hotspots.find((h) => h.kind === "fuego") ??
    hotspots.find((h) => h.kind === "riesgo") ??
    hotspots[0];

  if (!anchor) return null;

  const [cx, , cz] = normalizeCoords(anchor.x, anchor.y);
  const center: [number, number] = [cx, cz];

  return (
    <>
      <OperationalZone center={center} innerRadius={0}   outerRadius={1.8} color="#ef4444" opacity={0.18} yOffset={0} />
      <OperationalZone center={center} innerRadius={1.8} outerRadius={3.5} color="#f97316" opacity={0.14} yOffset={0.005} />
      <OperationalZone center={center} innerRadius={3.5} outerRadius={5.5} color="#eab308" opacity={0.10} yOffset={0.01} />
    </>
  );
}
