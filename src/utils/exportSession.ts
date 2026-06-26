import type { SimulationState } from "../types/sci";
import type { DecisionLog } from "../types/decisionLog";
import type { EvaluationSummary } from "../types/evaluation";
import type { InstructorEvent } from "../types/sessionEvents";
import type { FirebaseSession, SessionParticipant } from "../types/firebaseSession";
import type { DebriefingData } from "./debriefing";
import { buildDebriefingMarkdown } from "./debriefing";

function downloadBlob(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function buildCSVString(logs: DecisionLog[]): string {
  const header = "id,minute,actionType,label,source,severity";
  const rows = logs.map((l) =>
    [l.id, l.minute, l.actionType, `"${l.label.replace(/"/g, "'")}"`, l.source, l.severity].join(",")
  );
  return [header, ...rows].join("\n");
}

export interface ExportSessionOptions {
  instructorEvents?: InstructorEvent[];
  onlineSession?: FirebaseSession;
  participants?: SessionParticipant[];
}

export function exportSessionJSON(
  state: SimulationState,
  evaluation: EvaluationSummary,
  logs: DecisionLog[],
  instructorEventsOrOptions: InstructorEvent[] | ExportSessionOptions = []
): void {
  // Accept both legacy array arg and new options object
  const opts: ExportSessionOptions = Array.isArray(instructorEventsOrOptions)
    ? { instructorEvents: instructorEventsOrOptions }
    : instructorEventsOrOptions;

  const instructorEvents = opts.instructorEvents ?? [];

  const payload = {
    version: "1.2",
    exportedAt: new Date().toISOString(),
    scenario: { id: state.scenario.id, title: state.scenario.title, type: state.scenario.type },
    durationMinutes: state.minute,
    evaluation: {
      score: evaluation.score,
      maxScore: evaluation.maxScore,
      percentage: evaluation.percentage,
      passed: evaluation.passed,
      criticalFailures: evaluation.criticalFailures
    },
    decisions: state.selectedDecisions,
    timeline: state.timeline,
    decisionLogs: logs,
    instructorEvents: instructorEvents.map((e) => ({
      id: e.id,
      timestamp: e.timestamp,
      type: e.type,
      content: e.content,
      minute: e.minute,
      visibility: e.visibility,
      evaluable: false,
    })),
    // Fase 8: online session metadata (null when running local)
    session: opts.onlineSession
      ? {
          id: opts.onlineSession.id,
          joinCode: opts.onlineSession.joinCode,
          mode: opts.onlineSession.mode,
          instructorName: opts.onlineSession.instructorName,
          activeStudentName: opts.onlineSession.activeStudentName,
          createdAt: opts.onlineSession.createdAt,
        }
      : null,
    participants: opts.participants ?? [],
  };
  downloadBlob(
    JSON.stringify(payload, null, 2),
    `sci-sesion-${state.scenario.id}-${Date.now()}.json`,
    "application/json"
  );
}

export function exportDecisionsCSV(logs: DecisionLog[]): void {
  downloadBlob(
    buildCSVString(logs),
    `sci-decisiones-${Date.now()}.csv`,
    "text/csv"
  );
}

export function exportDebriefingMarkdown(
  data: DebriefingData,
  instructorNotes: string,
  logs: DecisionLog[]
): void {
  const md = buildDebriefingMarkdown(data, instructorNotes, logs);
  downloadBlob(md, `sci-debriefing-${data.scenarioId}-${Date.now()}.md`, "text/markdown");
}
