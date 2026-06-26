import { describe, expect, it } from "vitest";
import type { SimulationState } from "../types/sci";
import type { EvaluationSummary } from "../types/evaluation";
import { buildDebriefing, buildDebriefingMarkdown } from "./debriefing";

const mockState = {
  scenario: { id: "sc1", title: "Incendio Estructural Test", type: "incendio_estructural" },
  minute: 30,
  selectedDecisions: ["d1", "d2"],
  triggeredInjects: ["i1"]
} as unknown as SimulationState;

const mockEval: EvaluationSummary = {
  score: 70, maxScore: 100, percentage: 70, passed: true,
  criticalFailures: [],
  strengths: ["Mando", "Seguridad"],
  improvementAreas: ["Recursos"],
  criterionResults: []
};

const failedEval: EvaluationSummary = {
  ...mockEval, passed: false, percentage: 40,
  criticalFailures: ["Mando crítico omitido"]
};

describe("debriefing utilities", () => {
  describe("buildDebriefing", () => {
    it("sets duration from state.minute", () => {
      expect(buildDebriefing(mockState, mockEval).durationMinutes).toBe(30);
    });

    it("reflects passed = true", () => {
      expect(buildDebriefing(mockState, mockEval).passed).toBe(true);
    });

    it("reflects passed = false", () => {
      expect(buildDebriefing(mockState, failedEval).passed).toBe(false);
    });

    it("counts decisions correctly", () => {
      expect(buildDebriefing(mockState, mockEval).decisionsCount).toBe(2);
    });

    it("counts injects correctly", () => {
      expect(buildDebriefing(mockState, mockEval).injectsCount).toBe(1);
    });

    it("includes strengths and improvement areas", () => {
      const data = buildDebriefing(mockState, mockEval);
      expect(data.strengths).toContain("Mando");
      expect(data.improvementAreas).toContain("Recursos");
    });
  });

  describe("buildDebriefingMarkdown", () => {
    it("includes scenario title", () => {
      const data = buildDebriefing(mockState, mockEval);
      expect(buildDebriefingMarkdown(data, "", [])).toContain("Incendio Estructural Test");
    });

    it("shows APROBADO when passed", () => {
      const data = buildDebriefing(mockState, mockEval);
      expect(buildDebriefingMarkdown(data, "", [])).toContain("APROBADO");
    });

    it("shows NO APROBADO when not passed", () => {
      const data = buildDebriefing(mockState, failedEval);
      expect(buildDebriefingMarkdown(data, "", [])).toContain("NO APROBADO");
    });

    it("includes instructor notes when provided", () => {
      const data = buildDebriefing(mockState, mockEval);
      expect(buildDebriefingMarkdown(data, "Excelente manejo.", [])).toContain("Excelente manejo.");
    });

    it("omits notes section when notes are empty", () => {
      const data = buildDebriefing(mockState, mockEval);
      expect(buildDebriefingMarkdown(data, "", [])).not.toContain("Notas del instructor");
    });

    it("includes critical failures section when present", () => {
      const data = buildDebriefing(mockState, failedEval);
      expect(buildDebriefingMarkdown(data, "", [])).toContain("Errores críticos");
    });
  });
});
