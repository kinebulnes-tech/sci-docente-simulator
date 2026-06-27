import { describe, expect, it } from "vitest";
import type { SimulationState } from "../types/sci";
import { deriveSceneDecisionState } from "./sceneDecisionState";

const BASE_METRICS = {
  risk: 56, control: 34, coordination: 28,
  lifeSafety: 42, propertyConservation: 32, complexity: 45,
};

function makeState(overrides: Partial<SimulationState> = {}): SimulationState {
  return {
    scenario: {
      id: "test", title: "Test", type: "incendio_estructural",
      difficulty: "basico", summary: "", briefing: "",
      learningObjectives: [], doctrinalForms: [], criticalErrors: [],
      initialMetrics: BASE_METRICS,
      objectives: [], resources: [], injects: [], decisions: [], hotspots: [], rubric: [],
    },
    minute: 0,
    status: "dinamico",
    metrics: { ...BASE_METRICS },
    activeRoles: [],
    selectedDecisions: [],
    triggeredInjects: [],
    completedObjectives: [],
    timeline: [],
    resources: [],
    commandHistory: [],
    currentCommandHolder: "CI",
    unifiedCommand: null,
    operationalPeriods: [],
    currentPeriod: 1,
    spanOfControlWarning: false,
    ...overrides,
  };
}

describe("deriveSceneDecisionState", () => {
  it("returns all false with empty state", () => {
    const ds = deriveSceneDecisionState(makeState());
    expect(ds.hasCommand).toBe(false);
    expect(ds.hasPerimeter).toBe(false);
    expect(ds.hasExposureLine).toBe(false);
    expect(ds.hasSectors).toBe(false);
    expect(ds.hasSafetyOfficer).toBe(false);
    expect(ds.hasSearchTeam).toBe(false);
    expect(ds.hasResourceEnRoute).toBe(false);
    expect(ds.roofPropagation).toBe(false);
    expect(ds.civilianRisk).toBe(false);
    expect(ds.firefighterFatigue).toBe(false);
    expect(ds.cylinderRisk).toBe(false);
  });

  it("detects asumir-mando → hasCommand", () => {
    const ds = deriveSceneDecisionState(makeState({ selectedDecisions: ["asumir-mando"] }));
    expect(ds.hasCommand).toBe(true);
  });

  it("detects perimetro-evacuacion → hasPerimeter", () => {
    const ds = deriveSceneDecisionState(makeState({ selectedDecisions: ["perimetro-evacuacion"] }));
    expect(ds.hasPerimeter).toBe(true);
  });

  it("detects linea-exposicion → hasExposureLine", () => {
    const ds = deriveSceneDecisionState(makeState({ selectedDecisions: ["linea-exposicion"] }));
    expect(ds.hasExposureLine).toBe(true);
  });

  it("detects sectorizar-operaciones → hasSectors", () => {
    const ds = deriveSceneDecisionState(makeState({ selectedDecisions: ["sectorizar-operaciones"] }));
    expect(ds.hasSectors).toBe(true);
  });

  it("detects oficial-seguridad → hasSafetyOfficer", () => {
    const ds = deriveSceneDecisionState(makeState({ selectedDecisions: ["oficial-seguridad"] }));
    expect(ds.hasSafetyOfficer).toBe(true);
  });

  it("detects busqueda-primaria → hasSearchTeam", () => {
    const ds = deriveSceneDecisionState(makeState({ selectedDecisions: ["busqueda-primaria"] }));
    expect(ds.hasSearchTeam).toBe(true);
  });

  it("detects solicitar-apoyo → hasResourceEnRoute", () => {
    const ds = deriveSceneDecisionState(makeState({ selectedDecisions: ["solicitar-apoyo"] }));
    expect(ds.hasResourceEnRoute).toBe(true);
  });

  // ─── Inject flags ──────────────────────────────────────────────────────────

  it("detects propagacion-techo inject → roofPropagation", () => {
    const ds = deriveSceneDecisionState(makeState({ triggeredInjects: ["propagacion-techo"] }));
    expect(ds.roofPropagation).toBe(true);
  });

  it("detects bombero-fatiga inject → firefighterFatigue", () => {
    const ds = deriveSceneDecisionState(makeState({ triggeredInjects: ["bombero-fatiga"] }));
    expect(ds.firefighterFatigue).toBe(true);
  });

  it("detects cilindros-patio inject → cylinderRisk", () => {
    const ds = deriveSceneDecisionState(makeState({ triggeredInjects: ["cilindros-patio"] }));
    expect(ds.cylinderRisk).toBe(true);
  });

  it("vecinos-presionan inject without perimetro → civilianRisk true", () => {
    const ds = deriveSceneDecisionState(makeState({ triggeredInjects: ["vecinos-presionan"] }));
    expect(ds.civilianRisk).toBe(true);
  });

  it("vecinos-presionan inject WITH perimetro → civilianRisk false", () => {
    const ds = deriveSceneDecisionState(makeState({
      triggeredInjects: ["vecinos-presionan"],
      selectedDecisions: ["perimetro-evacuacion"],
    }));
    expect(ds.civilianRisk).toBe(false);
  });

  // ─── Fire intensity ────────────────────────────────────────────────────────

  it("fireIntensity is clamped to [0.4, 2.0]", () => {
    const ds = deriveSceneDecisionState(makeState());
    expect(ds.fireIntensity).toBeGreaterThanOrEqual(0.4);
    expect(ds.fireIntensity).toBeLessThanOrEqual(2.0);
  });

  it("fireIntensity drops when linea-exposicion is taken", () => {
    const base = deriveSceneDecisionState(makeState());
    const withLine = deriveSceneDecisionState(makeState({ selectedDecisions: ["linea-exposicion"] }));
    expect(withLine.fireIntensity).toBeLessThan(base.fireIntensity);
  });

  it("fireIntensity grows when risk metric increases", () => {
    const low  = deriveSceneDecisionState(makeState({ metrics: { ...BASE_METRICS, risk: 30 } }));
    const high = deriveSceneDecisionState(makeState({ metrics: { ...BASE_METRICS, risk: 90 } }));
    expect(high.fireIntensity).toBeGreaterThan(low.fireIntensity);
  });

  it("fireIntensity grows with elapsed minutes", () => {
    const early = deriveSceneDecisionState(makeState({ minute: 0 }));
    const late  = deriveSceneDecisionState(makeState({ minute: 60 }));
    expect(late.fireIntensity).toBeGreaterThan(early.fireIntensity);
  });

  it("smokeIntensity is boosted by propagacion-techo inject", () => {
    const base  = deriveSceneDecisionState(makeState());
    const boost = deriveSceneDecisionState(makeState({ triggeredInjects: ["propagacion-techo"] }));
    expect(boost.smokeIntensity).toBeGreaterThan(base.smokeIntensity);
  });

  it("smokeIntensity is clamped to 2.0", () => {
    const ds = deriveSceneDecisionState(makeState({
      minute: 120,
      metrics: { ...BASE_METRICS, risk: 100 },
      triggeredInjects: ["propagacion-techo"],
    }));
    expect(ds.smokeIntensity).toBeLessThanOrEqual(2.0);
  });
});
