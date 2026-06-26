import { describe, expect, it } from "vitest";
import type { EvaluationCriterion } from "../types/evaluation";
import type { DecisionLog } from "../types/decisionLog";
import { calculateEvaluation, detectCriticalFailures, getImprovementAreas, getStrengths } from "./evaluation";

const criteria: EvaluationCriterion[] = [
  { id: "c1", label: "Mando",    description: "Establece mando", category: "mando",           maxPoints: 20, required: true,  critical: true,  expectedActionTypes: ["apply_decision"] },
  { id: "c2", label: "Recursos", description: "Solicita recursos", category: "solicitud_recursos", maxPoints: 10, required: false, critical: false, expectedActionTypes: ["apply_decision"] },
  { id: "c3", label: "Seguridad", description: "Evalúa escena",  category: "seguridad_escena", maxPoints: 10, required: true,  critical: true,  expectedActionTypes: ["demobilize_resource"] }
];

const applyLog: DecisionLog = {
  id: "l1", timestamp: 0, minute: 2, scenarioId: "s1",
  actionType: "apply_decision", label: "Mando asumido", source: "student", severity: "info"
};

const demobLog: DecisionLog = {
  id: "l2", timestamp: 1, minute: 3, scenarioId: "s1",
  actionType: "demobilize_resource", label: "Unidad desmovilizada", source: "student", severity: "info"
};

describe("evaluation utilities", () => {
  describe("calculateEvaluation", () => {
    it("marks criterion as met when matching log exists", () => {
      const result = calculateEvaluation(criteria, [applyLog]);
      expect(result.criterionResults.find((r) => r.criterionId === "c1")?.met).toBe(true);
    });

    it("marks criterion as unmet when no matching log", () => {
      const result = calculateEvaluation(criteria, [applyLog]);
      expect(result.criterionResults.find((r) => r.criterionId === "c3")?.met).toBe(false);
    });

    it("calculates correct score across all matching criteria", () => {
      const result = calculateEvaluation(criteria, [applyLog]);
      expect(result.score).toBe(30); // c1 (20) + c2 (10) both match apply_decision; c3 unmet = 0
    });

    it("passes when all criteria met and percentage >= 60", () => {
      const result = calculateEvaluation(criteria, [applyLog, demobLog]);
      expect(result.passed).toBe(true);
    });

    it("fails when critical criterion not met", () => {
      const result = calculateEvaluation(criteria, [applyLog]); // c3 not met
      expect(result.passed).toBe(false);
    });

    it("fails when score below 60% with no criteria met", () => {
      const result = calculateEvaluation([criteria[1]], []); // non-critical, 0 score
      expect(result.passed).toBe(false);
    });

    it("detects critical failures in result", () => {
      const result = calculateEvaluation(criteria, [applyLog]);
      expect(result.criticalFailures).toContain("Seguridad");
    });

    it("marks criterion as unmet when all matching logs exceed maxTime", () => {
      const lateCriteria: EvaluationCriterion[] = [
        { ...criteria[0], maxTime: 5 }
      ];
      const lateLog: DecisionLog = { ...applyLog, minute: 10 };
      const result = calculateEvaluation(lateCriteria, [lateLog]);
      expect(result.criterionResults[0].met).toBe(false);
    });

    it("percentage is 0 when no criteria provided", () => {
      expect(calculateEvaluation([], []).percentage).toBe(0);
    });
  });

  describe("detectCriticalFailures", () => {
    it("returns labels of unmet critical criteria", () => {
      const results = [
        { criterionId: "c1", label: "A", score: 0,  maxScore: 10, met: false, critical: true,  feedback: "" },
        { criterionId: "c2", label: "B", score: 10, maxScore: 10, met: true,  critical: true,  feedback: "" },
        { criterionId: "c3", label: "C", score: 0,  maxScore: 10, met: false, critical: false, feedback: "" }
      ];
      expect(detectCriticalFailures(results)).toEqual(["A"]);
    });

    it("returns empty when all critical criteria met", () => {
      const results = [
        { criterionId: "c1", label: "A", score: 10, maxScore: 10, met: true, critical: true, feedback: "" }
      ];
      expect(detectCriticalFailures(results)).toHaveLength(0);
    });
  });

  describe("getStrengths", () => {
    it("returns labels of met criteria", () => {
      const results = [
        { criterionId: "c1", label: "A", score: 10, maxScore: 10, met: true,  critical: false, feedback: "" },
        { criterionId: "c2", label: "B", score: 0,  maxScore: 10, met: false, critical: false, feedback: "" }
      ];
      expect(getStrengths(results)).toEqual(["A"]);
    });
  });

  describe("getImprovementAreas", () => {
    it("returns labels of unmet criteria", () => {
      const results = [
        { criterionId: "c1", label: "A", score: 10, maxScore: 10, met: true,  critical: false, feedback: "" },
        { criterionId: "c2", label: "B", score: 0,  maxScore: 10, met: false, critical: false, feedback: "" }
      ];
      expect(getImprovementAreas(results)).toEqual(["B"]);
    });
  });
});
