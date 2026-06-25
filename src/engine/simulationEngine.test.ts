import { describe, expect, it } from "vitest";
import { structuralFireScenario, scenarios, scenarioMap } from "../data/scenarios";
import { buildIcs214 } from "../utils/icsForms";
import {
  createInitialState,
  evaluateSimulation,
  evaluateSpanOfControl,
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

describe("banco de escenarios", () => {
  it("scenarioMap contiene exactamente 20 escenarios", () => {
    expect(Object.keys(scenarioMap)).toHaveLength(20);
  });

  it("cada escenario tiene ≥10 decisiones", () => {
    scenarios.forEach((s) => {
      expect(s.decisions.length, `${s.id}: decisiones insuficientes`).toBeGreaterThanOrEqual(10);
    });
  });

  it("cada escenario tiene ≥3 injects", () => {
    scenarios.forEach((s) => {
      expect(s.injects.length, `${s.id}: injects insuficientes`).toBeGreaterThanOrEqual(3);
    });
  });

  it("cada escenario tiene ≥3 objetivos", () => {
    scenarios.forEach((s) => {
      expect(s.objectives.length, `${s.id}: objetivos insuficientes`).toBeGreaterThanOrEqual(3);
    });
  });

  it("cada escenario tiene ≥1 error crítico", () => {
    scenarios.forEach((s) => {
      expect(s.criticalErrors.length, `${s.id}: sin criticalErrors`).toBeGreaterThanOrEqual(1);
    });
  });

  it("todos los IDs en requires/unlocks existen en el mismo escenario", () => {
    scenarios.forEach((s) => {
      const ids = new Set(s.decisions.map((d) => d.id));
      s.decisions.forEach((d) => {
        d.requires?.forEach((r) => {
          expect(ids.has(r), `${s.id}: requires '${r}' no existe`).toBe(true);
        });
        d.unlocks?.forEach((u) => {
          expect(ids.has(u), `${s.id}: unlocks '${u}' no existe`).toBe(true);
        });
      });
    });
  });

  it("todos los criticalErrors referencian decisiones válidas", () => {
    scenarios.forEach((s) => {
      const ids = new Set(s.decisions.map((d) => d.id));
      s.criticalErrors.forEach((ce) => {
        expect(ids.has(ce), `${s.id}: criticalError '${ce}' no existe`).toBe(true);
      });
    });
  });

  it("todos los escenarios pueden inicializarse sin error", () => {
    scenarios.forEach((s) => {
      expect(() => createInitialState(s), `${s.id}: falla al inicializar`).not.toThrow();
    });
  });

  it("la rúbrica de cada escenario suma 100 puntos", () => {
    scenarios.forEach((s) => {
      const total = s.rubric.reduce((sum, item) => sum + item.maxPoints, 0);
      expect(total, `${s.id}: rubric suma ${total}, no 100`).toBe(100);
    });
  });
});

describe("motor doctrinal Fase 3", () => {
  it("TRANSFER_COMMAND genera entrada en timeline y actualiza titular", () => {
    const state = createInitialState(structuralFireScenario);
    const next = simulationReducer(state, { type: "TRANSFER_COMMAND", toName: "Cap. García" });

    expect(next.currentCommandHolder).toBe("Cap. García");
    expect(next.commandHistory).toHaveLength(1);
    expect(next.commandHistory[0].toName).toBe("Cap. García");
    expect(next.commandHistory[0].briefingConfirmed).toBe(false);
    const entry = next.timeline.find((e) => e.title.includes("Transferencia de mando"));
    expect(entry).toBeDefined();
  });

  it("TRANSFER_COMMAND con briefing previo marca briefingConfirmed = true", () => {
    let state = createInitialState(structuralFireScenario);
    state = simulationReducer(state, { type: "APPLY_DECISION", decisionId: "asumir-mando" });
    const next = simulationReducer(state, { type: "TRANSFER_COMMAND", toName: "Sub. López" });

    expect(next.commandHistory[0].briefingConfirmed).toBe(true);
    expect(next.metrics.coordination).toBeGreaterThan(state.metrics.coordination);
  });

  it("ACTIVATE_UNIFIED_COMMAND activa CU y mejora coordinación", () => {
    const state = createInitialState(structuralFireScenario);
    const next = simulationReducer(state, {
      type: "ACTIVATE_UNIFIED_COMMAND",
      agencies: ["Bomberos", "Carabineros", "SAMU"]
    });

    expect(next.unifiedCommand?.active).toBe(true);
    expect(next.unifiedCommand?.agencies).toContain("SAMU");
    expect(next.metrics.coordination).toBeGreaterThan(state.metrics.coordination);
  });

  it("ACTIVATE_UNIFIED_COMMAND no se activa dos veces", () => {
    let state = createInitialState(structuralFireScenario);
    state = simulationReducer(state, { type: "ACTIVATE_UNIFIED_COMMAND", agencies: ["A", "B"] });
    const second = simulationReducer(state, { type: "ACTIVATE_UNIFIED_COMMAND", agencies: ["C", "D"] });

    expect(second.unifiedCommand?.agencies).toEqual(["A", "B"]);
  });

  it("START_OPERATIONAL_PERIOD crea nuevo período y cierra el anterior", () => {
    const state = createInitialState(structuralFireScenario);
    const p1 = simulationReducer(state, { type: "START_OPERATIONAL_PERIOD" });
    expect(p1.operationalPeriods).toHaveLength(1);
    expect(p1.currentPeriod).toBe(1);

    const p2 = simulationReducer(p1, { type: "START_OPERATIONAL_PERIOD" });
    expect(p2.operationalPeriods).toHaveLength(2);
    expect(p2.currentPeriod).toBe(2);
    expect(p2.operationalPeriods[0].endMinute).toBeDefined();
  });

  it("DEMOBILIZE_RESOURCE cambia estado del recurso a desmovilizado", () => {
    const state = createInitialState(structuralFireScenario);
    const next = simulationReducer(state, { type: "DEMOBILIZE_RESOURCE", resourceId: "z2" });

    const resource = next.resources.find((r) => r.id === "z2");
    expect(resource?.status).toBe("desmovilizado");
    const entry = next.timeline.find((e) => e.title.includes("Desmovilización"));
    expect(entry).toBeDefined();
  });

  it("DEMOBILIZE_RESOURCE penaliza si recurso estaba asignado", () => {
    let state = createInitialState(structuralFireScenario);
    state = { ...state, resources: state.resources.map((r) => r.id === "b1" ? { ...r, status: "asignado" as const } : r) };
    const next = simulationReducer(state, { type: "DEMOBILIZE_RESOURCE", resourceId: "b1" });

    expect(next.metrics.control).toBeLessThan(state.metrics.control);
  });

  it("ADVANCE_TIME reduce ETA de recursos en ruta", () => {
    const state = createInitialState(structuralFireScenario);
    const z2Before = state.resources.find((r) => r.id === "z2");
    expect(z2Before?.etaMinutes).toBe(7);

    const next = simulationReducer(state, { type: "ADVANCE_TIME", minutes: 4 });
    const z2After = next.resources.find((r) => r.id === "z2");
    expect(z2After?.etaMinutes).toBe(3);
  });

  it("ADVANCE_TIME cambia recurso a disponible cuando ETA llega a 0", () => {
    const state = createInitialState(structuralFireScenario);
    const next = simulationReducer(state, { type: "ADVANCE_TIME", minutes: 10 });

    const z2 = next.resources.find((r) => r.id === "z2");
    expect(z2?.status).toBe("disponible");
    const arrivalEntry = next.timeline.find((e) => e.title.includes("Recurso disponible") && e.title.includes("Z-2"));
    expect(arrivalEntry).toBeDefined();
  });

  it("evaluateSpanOfControl detecta exceso al alcanzar umbral de 7 subordinados", () => {
    const fewRoles = ["ci", "seguridad", "enlace"];
    const safe = evaluateSpanOfControl(fewRoles);
    expect(safe.exceeded).toBe(false);
    expect(safe.count).toBe(2);

    const allRoles = ["ci", "seguridad", "enlace", "info-publica", "jefe-operaciones", "jefe-planificacion", "jefe-logistica", "jefe-admin"];
    const full = evaluateSpanOfControl(allRoles);
    expect(full.exceeded).toBe(true);
    expect(full.count).toBe(7);
    expect(full.threshold).toBe(7);
  });

  it("TOGGLE_ROLE activa spanOfControlWarning al alcanzar umbral de 7", () => {
    let state = createInitialState(structuralFireScenario);
    expect(state.spanOfControlWarning).toBe(false);

    const rolesToActivate = ["seguridad", "enlace", "info-publica", "jefe-operaciones", "jefe-planificacion", "jefe-logistica", "jefe-admin"];
    for (const roleId of rolesToActivate) {
      state = simulationReducer(state, { type: "TOGGLE_ROLE", roleId });
    }
    expect(state.activeRoles.filter((id) => id !== "ci")).toHaveLength(7);
    expect(state.spanOfControlWarning).toBe(true);

    // Desactivar uno reduce la advertencia
    state = simulationReducer(state, { type: "TOGGLE_ROLE", roleId: "jefe-admin" });
    expect(state.spanOfControlWarning).toBe(false);
  });

  it("buildIcs214 genera entradas desde el timeline", () => {
    let state = createInitialState(structuralFireScenario);
    state = simulationReducer(state, { type: "APPLY_DECISION", decisionId: "asumir-mando" });
    state = simulationReducer(state, { type: "ADVANCE_TIME", minutes: 10 });

    const ics214 = buildIcs214(state);
    expect(ics214.entries.length).toBeGreaterThan(1);
    expect(ics214.entries[0].minute).toBe(0);
    expect(ics214.operatorName).toBe("CI");
  });
});
