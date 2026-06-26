import type { SimulationState } from "../types/sci";
import type { EvaluationSummary } from "../types/evaluation";
import type { DecisionLog } from "../types/decisionLog";

export interface DebriefingData {
  scenarioTitle: string;
  scenarioId: string;
  durationMinutes: number;
  passed: boolean;
  score: number;
  maxScore: number;
  percentage: number;
  criticalFailures: string[];
  strengths: string[];
  improvementAreas: string[];
  decisionsCount: number;
  injectsCount: number;
}

export function buildDebriefing(
  state: SimulationState,
  evaluation: EvaluationSummary
): DebriefingData {
  return {
    scenarioTitle: state.scenario.title,
    scenarioId: state.scenario.id,
    durationMinutes: state.minute,
    passed: evaluation.passed,
    score: evaluation.score,
    maxScore: evaluation.maxScore,
    percentage: evaluation.percentage,
    criticalFailures: evaluation.criticalFailures,
    strengths: evaluation.strengths,
    improvementAreas: evaluation.improvementAreas,
    decisionsCount: state.selectedDecisions.length,
    injectsCount: state.triggeredInjects.length
  };
}

export function buildDebriefingMarkdown(
  data: DebriefingData,
  instructorNotes: string,
  logs: DecisionLog[]
): string {
  const lines: string[] = [
    `# Debriefing — ${data.scenarioTitle}`,
    "",
    `**Resultado:** ${data.passed ? "APROBADO ✓" : "NO APROBADO ✗"}  `,
    `**Puntaje:** ${data.score}/${data.maxScore} (${data.percentage}%)  `,
    `**Duración:** ${data.durationMinutes} minutos  `,
    `**Decisiones:** ${data.decisionsCount} · **Eventos activados:** ${data.injectsCount}  `,
    ""
  ];

  if (data.strengths.length > 0) {
    lines.push("## Fortalezas");
    data.strengths.forEach((s) => lines.push(`- ${s}`));
    lines.push("");
  }

  if (data.improvementAreas.length > 0) {
    lines.push("## Áreas de mejora");
    data.improvementAreas.forEach((a) => lines.push(`- ${a}`));
    lines.push("");
  }

  if (data.criticalFailures.length > 0) {
    lines.push("## Errores críticos");
    data.criticalFailures.forEach((f) => lines.push(`- ❌ ${f}`));
    lines.push("");
  }

  if (logs.length > 0) {
    lines.push("## Línea de tiempo");
    logs.forEach((l) => lines.push(`- T+${l.minute}m — [${l.source}] ${l.label}`));
    lines.push("");
  }

  if (instructorNotes.trim()) {
    lines.push("## Notas del instructor", instructorNotes.trim());
  }

  return lines.join("\n");
}
