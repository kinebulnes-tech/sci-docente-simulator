import { describe, expect, it } from "vitest";
import { structuralFireScenario } from "../data/scenarios";
import {
  createInitialState,
  evaluateSimulation,
  getGlobalScore,
  simulationReducer
} from "./simulationEngine";

// ─── Helpers ───────────────────────────────────────────────────────────────

function applyDecision(state: ReturnType<typeof createInitialState>, decisionId: string) {
  return simulationReducer(state, { type: "APPLY_DECISION", decisionId });
}

function advanceTime(state: ReturnType<typeof createInitialState>, minutes: number) {
  return simulationReducer(state, { type: "ADVANCE_TIME", minutes });
}

// ─── Tests ─────────────────────────────────────────────────────────────────

describe("simulationEngine", () => {
  it("crea estado inicial con métrica correcta", () => {
    const state = createInitialState(structuralFireScenario);
    expect(state.minute).toBe(0);
    expect(state.selectedDecisions).toHaveLength(0);
    expect(state.scenario.id).toBe(structuralFireScenario.id);
    expect(state.metrics.risk).toBe(structuralFireScenario.initialMetrics.risk);
  });

  it("aplica una decisión válida y modifica métricas", () => {
    const initial = createInitialState(structuralFireScenario);
    const next = applyDecision(initial, "asumir-mando");

    expect(next.selectedDecisions).toContain("asumir-mando");
    expect(next.metrics.control).toBeGreaterThan(initial.metrics.control);
    expect(next.metrics.coordination).toBeGreaterThan(initial.metrics.coordination);
    expect(next.timeline).toHaveLength(2); // inicio + decisión
  });

  it("bloquea decisión con requisitos no cumplidos", () => {
    const initial = createInitialState(structuralFireScenario);
    // busqueda-primaria requiere oficial-seguridad
    const next = applyDecision(initial, "busqueda-primaria");

    expect(next.selectedDecisions).not.toContain("busqueda-primaria");
    const lastEntry = next.timeline[next.timeline.length - 1];
    expect(lastEntry.type).toBe("system");
    expect(lastEntry.title).toBe("Decisión bloqueada");
  });

  it("permite decisión cuando requisito está cumplido", () => {
    const initial = createInitialState(structuralFireScenario);
    const withSecurity = applyDecision(initial, "oficial-seguridad");
    const withSearch = applyDecision(withSecurity, "busqueda-primaria");

    expect(withSearch.selectedDecisions).toContain("busqueda-primaria");
  });

  it("penaliza decisión repetida cuando penalizedIfRepeated es true", () => {
    const initial = createInitialState(structuralFireScenario);
    const afterFirst = applyDecision(initial, "asumir-mando");
    const afterSecond = applyDecision(afterFirst, "asumir-mando");

    // La penalización baja coordinación
    expect(afterSecond.metrics.coordination).toBeLessThan(afterFirst.metrics.coordination);
    const lastEntry = afterSecond.timeline[afterSecond.timeline.length - 1];
    expect(lastEntry.title).toMatch(/Repetida/);
  });

  it("avanza el tiempo y actualiza el minuto", () => {
    const initial = createInitialState(structuralFireScenario);
    const next = advanceTime(initial, 10);
    expect(next.minute).toBe(10);
  });

  it("avanza el tiempo y dispara injects automáticos", () => {
    const initial = createInitialState(structuralFireScenario);
    // propagacion-techo se dispara en el minuto 8
    const next = advanceTime(initial, 10);
    expect(next.triggeredInjects).toContain("propagacion-techo");
    // vecinos-presionan (min 12) no debe dispararse
    expect(next.triggeredInjects).not.toContain("vecinos-presionan");
  });

  it("no dispara un inject ya activado al avanzar tiempo", () => {
    const initial = createInitialState(structuralFireScenario);
    const afterFirst = advanceTime(initial, 10);
    const afterSecond = advanceTime(afterFirst, 10); // avanza otros 10 min (total 20)
    const count = afterSecond.triggeredInjects.filter((id) => id === "propagacion-techo").length;
    expect(count).toBe(1);
  });

  it("completa objetivos cuando todas las decisiones requeridas están tomadas", () => {
    const initial = createInitialState(structuralFireScenario);
    // objetivo 'documentar' requiere pai-inicial y registro-recursos
    // pai-inicial requiere objetivos-iniciales y plan-comunicaciones
    // objetivos-iniciales requiere asumir-mando
    // plan-comunicaciones requiere asumir-mando
    let state = applyDecision(initial, "asumir-mando");
    state = applyDecision(state, "objetivos-iniciales");
    state = applyDecision(state, "plan-comunicaciones");
    state = applyDecision(state, "pai-inicial");
    state = applyDecision(state, "oficial-seguridad");
    state = applyDecision(state, "registro-recursos");

    expect(state.completedObjectives).toContain("documentar");
  });

  it("evalúa la rúbrica y retorna score mayor a 0 con decisiones tomadas", () => {
    let state = createInitialState(structuralFireScenario);
    state = applyDecision(state, "asumir-mando");
    state = applyDecision(state, "objetivos-iniciales");

    const results = evaluateSimulation(state);
    const score = getGlobalScore(results);

    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("score es 0 con estado inicial sin decisiones", () => {
    const state = createInitialState(structuralFireScenario);
    const results = evaluateSimulation(state);
    expect(getGlobalScore(results)).toBe(0);
  });

  it("reset restaura al estado inicial del escenario", () => {
    const initial = createInitialState(structuralFireScenario);
    let state = applyDecision(initial, "asumir-mando");
    state = advanceTime(state, 15);
    const reset = simulationReducer(state, { type: "RESET" });

    expect(reset.minute).toBe(0);
    expect(reset.selectedDecisions).toHaveLength(0);
    expect(reset.triggeredInjects).toHaveLength(0);
  });
});
