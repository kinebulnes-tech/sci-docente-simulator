import type { IncidentType, ScenarioHotspot, ScenarioResource } from "../types/sci";

const SCENE_HALF = 9; // world-space half-width of the isometric scene

export interface VisualResource {
  id: string;
  name: string;
  status: string;
  color: string;
  opacity: number;
  position: [number, number, number];
}

export interface BuildingDef {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  label?: string;
}

export interface MatpelZone {
  center: [number, number]; // [worldX, worldZ]
  radius: number;
  color: string;
  label: string;
}

/**
 * Convert hotspot percentage coords (0–100) to 3D world space.
 * Returns [worldX, 0, worldZ] on the flat XZ plane.
 */
export function normalizeCoords(x: number, y: number): [number, number, number] {
  const wx = ((x - 50) / 50) * SCENE_HALF;
  const wz = -((y - 50) / 50) * SCENE_HALF;
  return [wx || 0, 0, wz || 0]; // wx||0 / wz||0 normalises IEEE-754 -0 to +0
}

/** Returns true when hotspot x/y are within the valid [0, 100] range. */
export function hasValidCoords(h: { x: number; y: number }): boolean {
  return h.x >= 0 && h.x <= 100 && h.y >= 0 && h.y <= 100;
}

/** Map resource.status to a hex color + opacity for 3D rendering. */
export function resourceStatusToVisual(status: string): { color: string; opacity: number } {
  switch (status) {
    case "disponible":     return { color: "#22c55e", opacity: 1.0 };
    case "asignado":       return { color: "#3b82f6", opacity: 1.0 };
    case "solicitado":     return { color: "#f59e0b", opacity: 0.7 };
    case "fuera_servicio": return { color: "#94a3b8", opacity: 0.5 };
    case "desmovilizado":  return { color: "#6b7280", opacity: 0.3 };
    default:               return { color: "#e5e7eb", opacity: 1.0 };
  }
}

/** Map hotspot.kind to a hex marker color. */
export function hotspotKindToColor(kind: string): string {
  switch (kind) {
    case "fuego":     return "#ef4444";
    case "victima":   return "#a855f7";
    case "riesgo":    return "#f97316";
    case "pc":        return "#06b6d4";
    case "perimetro": return "#84cc16";
    case "recurso":   return "#22c55e";
    default:          return "#94a3b8";
  }
}

/** Terrain base color derived from incident type. */
export function terrainColorForType(type: IncidentType): string {
  if (type === "forestal") return "#4a7c59";
  if (type === "matpel")   return "#94a3b8";
  if (type === "sar")      return "#92723a";
  return "#64748b";
}

/** True only for MATPEL (hazmat) scenarios. */
export function isMatpelScenario(type: string): boolean {
  return type === "matpel";
}

/**
 * Build three concentric MATPEL zones (hot / warm / cold) centered on
 * the first hazmat hotspot. Returns [] when no hotspots are provided.
 */
export function getMatpelZones(hotspots: ScenarioHotspot[]): MatpelZone[] {
  const anchor = hotspots.find((h) => h.kind === "riesgo") ?? hotspots[0];
  if (!anchor) return [];
  const [cx, , cz] = normalizeCoords(anchor.x, anchor.y);
  return [
    { center: [cx, cz], radius: 1.5, color: "#ef4444", label: "Zona caliente" },
    { center: [cx, cz], radius: 3.0, color: "#f97316", label: "Zona tibia" },
    { center: [cx, cz], radius: 5.0, color: "#eab308", label: "Zona fría" }
  ];
}

/** Place resources in a fixed grid at the far edge of the scene. */
export function positionResources(resources: ScenarioResource[]): VisualResource[] {
  return resources.map((r, i) => {
    const col = i % 5;
    const row = Math.floor(i / 5);
    return {
      id: r.id,
      name: r.name,
      status: r.status,
      ...resourceStatusToVisual(r.status),
      position: [-5 + col * 2.5, 0, 8 + row * 2.5] as [number, number, number]
    };
  });
}

/** Procedural building definitions per incident type. */
export function buildingsForScenario(type: IncidentType): BuildingDef[] {
  switch (type) {
    case "incendio_estructural":
      return [
        { position: [1, 1.5, -1],   size: [4, 3, 3.5], color: "#c4a35a", label: "Edificio principal" },
        { position: [4.5, 1.0, -0.5], size: [2.5, 2, 3], color: "#b8996b", label: "Exposición" }
      ];
    case "matpel":
      return [
        { position: [1, 2.0, -1],    size: [5, 4, 4],   color: "#78909c", label: "Instalación industrial" },
        { position: [-3.5, 1.5, 1],  size: [2, 3, 2],   color: "#90a4ae", label: "Depósito" }
      ];
    case "rescate_vehicular":
      return [
        { position: [-1.5, 0.35, 0], size: [2.2, 0.7, 1.1], color: "#b71c1c", label: "Vehículo A" },
        { position: [1.2, 0.3, 0.6], size: [1.8, 0.6, 1.0], color: "#212121", label: "Vehículo B" }
      ];
    case "forestal":
      return [];
    case "evacuacion":
      return [{ position: [0, 2.0, -1], size: [7, 4, 4.5], color: "#9e9e9e", label: "Edificio" }];
    case "sar":
      return [{ position: [0, 0.8, 0], size: [5, 1.6, 4], color: "#8d6e63", label: "Estructura colapsada" }];
    case "evento_masivo":
      return [{ position: [0, 1.5, 0], size: [9, 3, 6], color: "#6d4c41", label: "Venue" }];
    case "multiagencia":
      return [
        { position: [1, 2.0, -1],  size: [5, 4, 4], color: "#607d8b", label: "Estructura principal" },
        { position: [-4, 1.5, 1],  size: [3, 3, 3], color: "#546e7a", label: "Estructura adyacente" }
      ];
    default:
      return [{ position: [1, 1.5, 0], size: [3, 3, 3], color: "#9e9e9e" }];
  }
}
