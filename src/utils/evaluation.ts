import type { CriterionResult, EvaluationCriterion, EvaluationSummary } from "../types/evaluation";
import type { DecisionLog } from "../types/decisionLog";

export function calculateEvaluation(
  criteria: EvaluationCriterion[],
  logs: DecisionLog[]
): EvaluationSummary {
  const criterionResults: CriterionResult[] = criteria.map((criterion) => {
    const matching = logs.filter((log) =>
      criterion.expectedActionTypes.includes(log.actionType)
    );
    const tooLate =
      criterion.maxTime !== undefined &&
      matching.length > 0 &&
      matching.every((l) => l.minute > criterion.maxTime!);
    const met = matching.length > 0 && !tooLate;
    const score = met ? criterion.maxPoints : 0;
    return {
      criterionId: criterion.id,
      label: criterion.label,
      score,
      maxScore: criterion.maxPoints,
      met,
      critical: criterion.critical,
      feedback: met
        ? `✓ ${criterion.label} ejecutado correctamente.`
        : `✗ ${criterion.label} no fue ejecutado${tooLate ? " a tiempo" : ""}.`
    };
  });

  const score = criterionResults.reduce((s, r) => s + r.score, 0);
  const maxScore = criterionResults.reduce((s, r) => s + r.maxScore, 0);
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const criticalFailures = detectCriticalFailures(criterionResults);
  const passed = percentage >= 60 && criticalFailures.length === 0;

  return {
    score,
    maxScore,
    percentage,
    passed,
    criticalFailures,
    strengths: getStrengths(criterionResults),
    improvementAreas: getImprovementAreas(criterionResults),
    criterionResults
  };
}

export function detectCriticalFailures(results: CriterionResult[]): string[] {
  return results.filter((r) => r.critical && !r.met).map((r) => r.label);
}

export function getStrengths(results: CriterionResult[]): string[] {
  return results.filter((r) => r.met).map((r) => r.label);
}

export function getImprovementAreas(results: CriterionResult[]): string[] {
  return results.filter((r) => !r.met).map((r) => r.label);
}
