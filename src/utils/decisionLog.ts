import type { DecisionLog, DecisionActionType, DecisionSeverity, DecisionSource } from "../types/decisionLog";
import type { TimelineEntry } from "../types/sci";

let _counter = 0;
function nextId(): string {
  return `log-${Date.now()}-${++_counter}`;
}

export function createDecisionLog(params: Omit<DecisionLog, "id">): DecisionLog {
  return { id: nextId(), ...params };
}

export function classifyDecision(actionType: DecisionActionType): DecisionSeverity {
  if (actionType === "trigger_inject") return "warning";
  return "info";
}

/**
 * Timeline entries of type "decision" are normally student decisions, but
 * TRANSFER_COMMAND and ACTIVATE_UNIFIED_COMMAND (instructor-only actions from
 * InstructorPanel) also produce type:"decision" entries. Detect them by title
 * to avoid crediting instructor actions to the student's score.
 */
const INSTRUCTOR_DECISION_PATTERNS = [
  /^Transferencia de mando:/,
  /^Mando unificado activado/,
] as const;

function classifyDecisionSource(title: string): DecisionSource {
  return INSTRUCTOR_DECISION_PATTERNS.some((p) => p.test(title))
    ? "instructor"
    : "student";
}

export function deriveLogsFromTimeline(
  timeline: TimelineEntry[],
  scenarioId: string
): DecisionLog[] {
  return timeline.map((entry, i) => {
    const actionType: DecisionActionType =
      entry.type === "inject" ? "trigger_inject" : "apply_decision";

    let source: DecisionSource;
    if (entry.type === "inject") {
      source = "instructor";
    } else if (entry.type === "system") {
      source = "system";
    } else {
      // type === "decision" — distinguish student vs instructor actions
      source = classifyDecisionSource(entry.title);
    }

    return {
      id: `tl-${scenarioId}-${i}`,
      timestamp: Date.now(),
      minute: entry.minute,
      scenarioId,
      actionType,
      label: entry.title,
      source,
      severity: classifyDecision(actionType),
      notes: entry.detail,
    };
  });
}

export function sortLogsByMinute(logs: DecisionLog[]): DecisionLog[] {
  return [...logs].sort((a, b) => a.minute - b.minute || a.timestamp - b.timestamp);
}

export function deduplicateLogs(logs: DecisionLog[]): DecisionLog[] {
  const seen = new Set<string>();
  return logs.filter((l) => {
    const key = `${l.minute}-${l.label}-${l.actionType}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
