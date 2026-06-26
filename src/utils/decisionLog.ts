import type { DecisionLog, DecisionActionType, DecisionSeverity } from "../types/decisionLog";
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

export function deriveLogsFromTimeline(
  timeline: TimelineEntry[],
  scenarioId: string
): DecisionLog[] {
  return timeline.map((entry, i) => {
    const actionType: DecisionActionType =
      entry.type === "inject" ? "trigger_inject" : "apply_decision";
    const source =
      entry.type === "inject" ? "instructor" : entry.type === "system" ? "system" : "student";
    return {
      id: `tl-${scenarioId}-${i}`,
      timestamp: Date.now(),
      minute: entry.minute,
      scenarioId,
      actionType,
      label: entry.title,
      source,
      severity: classifyDecision(actionType),
      notes: entry.detail
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
