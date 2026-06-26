import { describe, expect, it } from "vitest";
import type { DebriefingData } from "./debriefing";
import type { DecisionLog } from "../types/decisionLog";
import type { TimelineEntry } from "../types/sci";
import {
  buildAar,
  buildAarMarkdown,
  buildInstructorSummary,
  buildStudentFeedback,
} from "./debriefingEnhancer";

const mockData: DebriefingData = {
  scenarioTitle: "Incendio estructural test",
  scenarioId: "inc-01",
  durationMinutes: 45,
  passed: true,
  score: 80,
  maxScore: 100,
  percentage: 80,
  criticalFailures: [],
  strengths: ["Mando oportuno", "Seguridad establecida"],
  improvementAreas: ["Comunicaciones"],
  decisionsCount: 6,
  injectsCount: 2,
};

const failData: DebriefingData = {
  ...mockData,
  passed: false,
  percentage: 40,
  criticalFailures: ["No se estableció mando"],
  strengths: [],
  improvementAreas: ["Mando", "Recursos"],
};

const logs: DecisionLog[] = [
  {
    id: "l1", timestamp: 0, minute: 5, scenarioId: "inc-01",
    actionType: "apply_decision", label: "Asumir mando",
    source: "student", severity: "info",
  },
  {
    id: "l2", timestamp: 0, minute: 10, scenarioId: "inc-01",
    actionType: "apply_decision", label: "Establecer perímetro",
    source: "student", severity: "info",
  },
];

const timeline: TimelineEntry[] = [
  { minute: 0, type: "system", title: "Inicio", detail: "Simulación iniciada" },
  { minute: 5, type: "inject", title: "Explosión secundaria", detail: "Evento crítico" },
  { minute: 15, type: "inject", title: "Evacuación solicitada", detail: "Evento medio" },
];

describe("buildAar", () => {
  it("retorna 6 secciones", () => {
    const aar = buildAar(mockData, logs, timeline);
    expect(Object.keys(aar)).toHaveLength(6);
  });

  it("happened incluye título del escenario", () => {
    const aar = buildAar(mockData, logs, timeline);
    expect(aar.happened.points.some((p) => p.includes("Incendio estructural test"))).toBe(true);
  });

  it("happened incluye eventos inject de la timeline", () => {
    const aar = buildAar(mockData, logs, timeline);
    expect(aar.happened.points.some((p) => p.includes("Explosión secundaria"))).toBe(true);
  });

  it("decided lista las decisiones del log", () => {
    const aar = buildAar(mockData, logs, timeline);
    expect(aar.decided.points.some((p) => p.includes("Asumir mando"))).toBe(true);
  });

  it("decided muestra mensaje vacío cuando no hay logs", () => {
    const aar = buildAar(mockData, [], []);
    expect(aar.decided.points[0]).toContain("Sin decisiones");
  });

  it("decided excluye acciones del instructor (source:instructor)", () => {
    const mixedLogs: DecisionLog[] = [
      ...logs,
      {
        id: "l-inst", timestamp: 0, minute: 8, scenarioId: "inc-01",
        actionType: "apply_decision", label: "Transferencia de mando: CI → Cap. García",
        source: "instructor", severity: "info",
      },
    ];
    const aar = buildAar(mockData, mixedLogs, timeline);
    const decidedText = aar.decided.points.join("\n");
    expect(decidedText).toContain("Asumir mando");
    expect(decidedText).not.toContain("Transferencia de mando");
  });

  it("decided excluye eventos de sistema (source:system)", () => {
    const withSystem: DecisionLog[] = [
      ...logs,
      {
        id: "l-sys", timestamp: 0, minute: 0, scenarioId: "inc-01",
        actionType: "apply_decision", label: "Inicio de simulación",
        source: "system", severity: "info",
      },
    ];
    const aar = buildAar(mockData, withSystem, timeline);
    const decidedText = aar.decided.points.join("\n");
    expect(decidedText).not.toContain("Inicio de simulación");
  });

  it("decided muestra vacío cuando todos los logs son del instructor", () => {
    const instructorOnly: DecisionLog[] = [
      {
        id: "l-i1", timestamp: 0, minute: 5, scenarioId: "inc-01",
        actionType: "apply_decision", label: "Mando unificado activado",
        source: "instructor", severity: "info",
      },
    ];
    const aar = buildAar(mockData, instructorOnly, timeline);
    expect(aar.decided.points[0]).toContain("Sin decisiones");
  });

  it("wentWell refleja las fortalezas", () => {
    const aar = buildAar(mockData, [], []);
    expect(aar.wentWell.points).toContain("Mando oportuno");
  });

  it("wentWell mensaje vacío cuando sin fortalezas", () => {
    const aar = buildAar(failData, [], []);
    expect(aar.wentWell.points[0]).toContain("Sin fortalezas");
  });

  it("couldImprove refleja áreas de mejora", () => {
    const aar = buildAar(mockData, [], []);
    expect(aar.couldImprove.points).toContain("Comunicaciones");
  });

  it("criticalErrors refleja errores del failData", () => {
    const aar = buildAar(failData, [], []);
    expect(aar.criticalErrors.points).toContain("No se estableció mando");
  });

  it("criticalErrors mensaje sin errores cuando passed", () => {
    const aar = buildAar(mockData, [], []);
    expect(aar.criticalErrors.points[0]).toContain("Sin errores críticos");
  });

  it("teachingRecommendations incluye recomendación para puntaje alto", () => {
    const aar = buildAar(mockData, [], []);
    expect(aar.teachingRecommendations.points.some((p) => p.includes("avanzado") || p.includes("complejidad"))).toBe(true);
  });

  it("teachingRecommendations incluye recomendación para puntaje bajo", () => {
    const aar = buildAar(failData, [], []);
    expect(aar.teachingRecommendations.points.some((p) => p.includes("básicos") || p.includes("Revisar"))).toBe(true);
  });
});

describe("buildAarMarkdown", () => {
  it("incluye los 6 títulos de sección", () => {
    const aar = buildAar(mockData, logs, timeline);
    const md = buildAarMarkdown(aar);
    expect(md).toContain("1. Qué ocurrió");
    expect(md).toContain("2. Qué se decidió");
    expect(md).toContain("3. Qué salió bien");
    expect(md).toContain("4. Qué pudo mejorar");
    expect(md).toContain("5. Errores críticos");
    expect(md).toContain("6. Recomendaciones docentes");
  });

  it("es Markdown válido (comienza con ##)", () => {
    const aar = buildAar(mockData, [], []);
    expect(buildAarMarkdown(aar)).toMatch(/^## Análisis/);
  });
});

describe("buildInstructorSummary", () => {
  it("incluye resultado del caso", () => {
    const aar = buildAar(mockData, [], []);
    const s = buildInstructorSummary(aar, mockData);
    expect(s).toContain("APROBADO");
    expect(s).toContain("80%");
  });

  it("incluye fortalezas", () => {
    const aar = buildAar(mockData, [], []);
    expect(buildInstructorSummary(aar, mockData)).toContain("Mando oportuno");
  });
});

describe("buildStudentFeedback", () => {
  it("incluye resultado visible para alumno", () => {
    const aar = buildAar(mockData, [], []);
    expect(buildStudentFeedback(aar, mockData)).toContain("APROBADO");
  });

  it("incluye errores críticos cuando existen", () => {
    const aar = buildAar(failData, [], []);
    expect(buildStudentFeedback(aar, failData)).toContain("No se estableció mando");
  });

  it("no incluye sección de errores críticos cuando no existen", () => {
    const aar = buildAar(mockData, [], []);
    expect(buildStudentFeedback(aar, mockData)).not.toContain("Errores críticos");
  });
});
