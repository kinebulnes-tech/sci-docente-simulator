import { describe, expect, it } from "vitest";
import type { ScenarioHotspot, ScenarioResource } from "../types/sci";
import {
  getMatpelZones,
  hasValidCoords,
  hotspotKindToColor,
  isMatpelScenario,
  normalizeCoords,
  positionResources,
  resourceStatusToVisual,
  terrainColorForType
} from "./scene3d";

const HEX_RE = /^#[0-9a-f]{6}$/i;

describe("scene3d utilities", () => {
  // ─── normalizeCoords ────────────────────────────────────────────────────────

  describe("normalizeCoords", () => {
    it("center (50,50) → (0,0,0)", () => {
      expect(normalizeCoords(50, 50)).toEqual([0, 0, 0]);
    });

    it("top-left (0,0) → negative x, positive z", () => {
      const [x, , z] = normalizeCoords(0, 0);
      expect(x).toBeLessThan(0);
      expect(z).toBeGreaterThan(0);
    });

    it("bottom-right (100,100) → positive x, negative z", () => {
      const [x, , z] = normalizeCoords(100, 100);
      expect(x).toBeGreaterThan(0);
      expect(z).toBeLessThan(0);
    });

    it("y component is always 0 (flat terrain plane)", () => {
      expect(normalizeCoords(0, 0)[1]).toBe(0);
      expect(normalizeCoords(50, 50)[1]).toBe(0);
      expect(normalizeCoords(100, 100)[1]).toBe(0);
    });

    it("output stays within ±9 scene bounds", () => {
      const corners: [number, number][] = [[0, 0], [100, 0], [0, 100], [100, 100]];
      for (const [x, y] of corners) {
        const [wx, , wz] = normalizeCoords(x, y);
        expect(Math.abs(wx)).toBeLessThanOrEqual(9);
        expect(Math.abs(wz)).toBeLessThanOrEqual(9);
      }
    });
  });

  // ─── resourceStatusToVisual ─────────────────────────────────────────────────

  describe("resourceStatusToVisual", () => {
    it("disponible → full opacity", () => {
      expect(resourceStatusToVisual("disponible").opacity).toBe(1.0);
    });

    it("desmovilizado → opacity below 0.5", () => {
      expect(resourceStatusToVisual("desmovilizado").opacity).toBeLessThan(0.5);
    });

    it("fuera_servicio → opacity below 1.0", () => {
      expect(resourceStatusToVisual("fuera_servicio").opacity).toBeLessThan(1.0);
    });

    it("solicitado → partial opacity between 0.5 and 1.0", () => {
      const { opacity } = resourceStatusToVisual("solicitado");
      expect(opacity).toBeGreaterThan(0.5);
      expect(opacity).toBeLessThan(1.0);
    });

    it("all 5 statuses return distinct colors", () => {
      const statuses = ["disponible", "asignado", "solicitado", "fuera_servicio", "desmovilizado"];
      const colors = statuses.map((s) => resourceStatusToVisual(s).color);
      expect(new Set(colors).size).toBe(5);
    });

    it("unknown status returns valid fallback hex color", () => {
      const { color } = resourceStatusToVisual("unknown_type");
      expect(color).toMatch(HEX_RE);
    });
  });

  // ─── hasValidCoords ─────────────────────────────────────────────────────────

  describe("hasValidCoords", () => {
    it("accepts coords on [0,100] boundary", () => {
      expect(hasValidCoords({ x: 0, y: 0 })).toBe(true);
      expect(hasValidCoords({ x: 100, y: 100 })).toBe(true);
      expect(hasValidCoords({ x: 50, y: 50 })).toBe(true);
    });

    it("rejects negative x or y", () => {
      expect(hasValidCoords({ x: -1, y: 50 })).toBe(false);
      expect(hasValidCoords({ x: 50, y: -1 })).toBe(false);
    });

    it("rejects x or y above 100", () => {
      expect(hasValidCoords({ x: 101, y: 50 })).toBe(false);
      expect(hasValidCoords({ x: 50, y: 101 })).toBe(false);
    });
  });

  // ─── isMatpelScenario ───────────────────────────────────────────────────────

  describe("isMatpelScenario", () => {
    it("returns true for matpel", () => {
      expect(isMatpelScenario("matpel")).toBe(true);
    });

    it("returns false for all other scenario types", () => {
      const others = ["incendio_estructural", "rescate_vehicular", "forestal", "evacuacion", "sar", "evento_masivo", "multiagencia"];
      for (const t of others) {
        expect(isMatpelScenario(t)).toBe(false);
      }
    });
  });

  // ─── getMatpelZones ─────────────────────────────────────────────────────────

  describe("getMatpelZones", () => {
    const hotspots: ScenarioHotspot[] = [
      { id: "h1", label: "Riesgo MATPEL", x: 60, y: 50, kind: "riesgo", description: "fuga activa" }
    ];

    it("returns exactly 3 zones (caliente, tibia, fría)", () => {
      expect(getMatpelZones(hotspots)).toHaveLength(3);
    });

    it("returns [] when hotspot array is empty (fallback)", () => {
      expect(getMatpelZones([])).toHaveLength(0);
    });

    it("zones have strictly increasing radii", () => {
      const [a, b, c] = getMatpelZones(hotspots);
      expect(a.radius).toBeLessThan(b.radius);
      expect(b.radius).toBeLessThan(c.radius);
    });

    it("zones are centered at the normalized hotspot position", () => {
      const [expectedX, , expectedZ] = normalizeCoords(60, 50);
      const zones = getMatpelZones(hotspots);
      expect(zones[0].center[0]).toBeCloseTo(expectedX);
      expect(zones[0].center[1]).toBeCloseTo(expectedZ);
    });

    it("all 3 zones have distinct colors", () => {
      const colors = getMatpelZones(hotspots).map((z) => z.color);
      expect(new Set(colors).size).toBe(3);
    });
  });

  // ─── hotspotKindToColor ─────────────────────────────────────────────────────

  describe("hotspotKindToColor", () => {
    it("returns a valid hex color for each known kind", () => {
      const kinds = ["fuego", "victima", "riesgo", "pc", "perimetro", "recurso"];
      for (const k of kinds) {
        expect(hotspotKindToColor(k)).toMatch(HEX_RE);
      }
    });

    it("each known kind gets a distinct color", () => {
      const kinds = ["fuego", "victima", "riesgo", "pc", "perimetro", "recurso"];
      const colors = kinds.map(hotspotKindToColor);
      expect(new Set(colors).size).toBe(kinds.length);
    });

    it("unknown kind returns a valid fallback hex color", () => {
      expect(hotspotKindToColor("desconocido")).toMatch(HEX_RE);
    });
  });

  // ─── positionResources ──────────────────────────────────────────────────────

  describe("positionResources", () => {
    const resources: ScenarioResource[] = [
      { id: "b1", name: "B-1", type: "unidad",     status: "disponible",    capabilities: [] },
      { id: "r1", name: "R-1", type: "unidad",     status: "asignado",      capabilities: [] },
      { id: "z2", name: "Z-2", type: "unidad",     status: "solicitado",    capabilities: [] },
      { id: "ca", name: "CA",  type: "institucion", status: "fuera_servicio", capabilities: [] }
    ];

    it("returns the same count as input", () => {
      expect(positionResources(resources)).toHaveLength(4);
    });

    it("each resource gets a unique position", () => {
      const positions = positionResources(resources).map((r) => r.position.join(","));
      expect(new Set(positions).size).toBe(4);
    });

    it("preserves status and maps to visual color", () => {
      const placed = positionResources(resources);
      expect(placed[0].status).toBe("disponible");
      expect(placed[0].color).toBe(resourceStatusToVisual("disponible").color);
    });

    it("returns [] for empty input", () => {
      expect(positionResources([])).toHaveLength(0);
    });
  });

  // ─── terrainColorForType ─────────────────────────────────────────────────────

  describe("terrainColorForType", () => {
    it("forestal returns green-range hex color", () => {
      const c = terrainColorForType("forestal");
      expect(c).toMatch(HEX_RE);
    });

    it("distinct types return distinct colors", () => {
      const forest = terrainColorForType("forestal");
      const urban  = terrainColorForType("incendio_estructural");
      const hazmat = terrainColorForType("matpel");
      expect(forest).not.toBe(urban);
      expect(forest).not.toBe(hazmat);
      expect(urban).not.toBe(hazmat);
    });
  });
});
