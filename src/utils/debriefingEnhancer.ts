import type { DebriefingData } from "./debriefing";
import type { DecisionLog } from "../types/decisionLog";
import type { TimelineEntry } from "../types/sci";

export interface AarSection {
  title: string;
  points: string[];
}

export interface AarData {
  happened: AarSection;
  decided: AarSection;
  wentWell: AarSection;
  couldImprove: AarSection;
  criticalErrors: AarSection;
  teachingRecommendations: AarSection;
}

export function buildAar(
  data: DebriefingData,
  logs: DecisionLog[],
  timeline: TimelineEntry[]
): AarData {
  const happenedItems: string[] = [
    `Escenario: ${data.scenarioTitle}`,
    `Duración: ${data.durationMinutes} minutos`,
    `Decisiones ejecutadas: ${data.decisionsCount}`,
    `Eventos activados: ${data.injectsCount}`,
    `Resultado: ${data.passed ? "APROBADO" : "NO APROBADO"} (${data.percentage}%)`,
  ];

  const keyMoments = timeline
    .filter((e) => e.type === "inject")
    .slice(0, 4)
    .map((e) => `T+${e.minute}m — ${e.title}`);
  if (keyMoments.length > 0) happenedItems.push(...keyMoments);

  const decidedItems =
    logs.length > 0
      ? logs.map((l) => `T+${l.minute}m — [${l.source}] ${l.label}`)
      : ["Sin decisiones registradas en la bitácora"];

  const teachingRecs: string[] = [];
  if (data.criticalFailures.length > 0) {
    teachingRecs.push(
      `Revisar doctrina SCI en: ${data.criticalFailures.slice(0, 2).join(", ")}`
    );
  }
  if (data.improvementAreas.length > 0) {
    teachingRecs.push(`Profundizar en: ${data.improvementAreas.slice(0, 3).join(", ")}`);
  }
  if (data.percentage >= 80) {
    teachingRecs.push(
      "Desempeño avanzado — proponer escenarios de mayor complejidad o multiagencia"
    );
  } else if (data.percentage >= 60) {
    teachingRecs.push("Consolidar fundamentos SCI antes de aumentar dificultad del caso");
  } else {
    teachingRecs.push(
      "Revisar principios básicos del SCI: mando, comunicaciones y recursos"
    );
  }
  if (teachingRecs.length === 0) {
    teachingRecs.push("Continuar con el siguiente escenario");
  }

  return {
    happened: { title: "1. Qué ocurrió", points: happenedItems },
    decided: { title: "2. Qué se decidió", points: decidedItems },
    wentWell: {
      title: "3. Qué salió bien",
      points:
        data.strengths.length > 0
          ? data.strengths
          : ["Sin fortalezas registradas en esta sesión"],
    },
    couldImprove: {
      title: "4. Qué pudo mejorar",
      points:
        data.improvementAreas.length > 0
          ? data.improvementAreas
          : ["Sin áreas de mejora identificadas"],
    },
    criticalErrors: {
      title: "5. Errores críticos",
      points:
        data.criticalFailures.length > 0
          ? data.criticalFailures
          : ["Sin errores críticos identificados"],
    },
    teachingRecommendations: {
      title: "6. Recomendaciones docentes",
      points: teachingRecs,
    },
  };
}

export function buildAarMarkdown(aar: AarData): string {
  const lines: string[] = ["## Análisis post-acción (AAR)", ""];
  const sections = [
    aar.happened,
    aar.decided,
    aar.wentWell,
    aar.couldImprove,
    aar.criticalErrors,
    aar.teachingRecommendations,
  ];
  for (const s of sections) {
    lines.push(`### ${s.title}`);
    s.points.forEach((p) => lines.push(`- ${p}`));
    lines.push("");
  }
  return lines.join("\n");
}

export function buildInstructorSummary(aar: AarData, data: DebriefingData): string {
  return [
    `RESUMEN DOCENTE — ${data.scenarioTitle}`,
    `Resultado: ${data.passed ? "APROBADO" : "NO APROBADO"} | ${data.percentage}%`,
    "",
    "FORTALEZAS:",
    ...aar.wentWell.points.map((p) => `• ${p}`),
    "",
    "RECOMENDACIONES:",
    ...aar.teachingRecommendations.points.map((p) => `• ${p}`),
  ].join("\n");
}

export function buildStudentFeedback(aar: AarData, data: DebriefingData): string {
  const lines = [
    `RETROALIMENTACIÓN — ${data.scenarioTitle}`,
    `Tu resultado: ${data.passed ? "APROBADO" : "NO APROBADO"} (${data.percentage}%)`,
    "",
    "Lo que hiciste bien:",
    ...aar.wentWell.points.map((p) => `• ${p}`),
    "",
    "Áreas a mejorar:",
    ...aar.couldImprove.points.map((p) => `• ${p}`),
  ];
  if (data.criticalFailures.length > 0) {
    lines.push("", "Errores críticos a revisar:");
    data.criticalFailures.forEach((f) => lines.push(`• ${f}`));
  }
  return lines.join("\n");
}
