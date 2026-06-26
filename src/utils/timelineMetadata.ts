import type { TimelineEntry, TimelineSource, TimelineVisibility } from "../types/sci";

// Instructor-originated entries that arrive as type:"decision" from the engine.
// Kept in sync with the patterns in decisionLog.ts.
const INSTRUCTOR_DECISION_PATTERNS = [
  /^Transferencia de mando:/,
  /^Mando unificado activado/,
] as const;

/**
 * Infers the originating actor for a timeline entry.
 * Used as a fallback for entries loaded from old localStorage sessions that
 * were persisted before Fase 7 added the `source` field.
 */
export function inferTimelineSource(entry: TimelineEntry): TimelineSource {
  if (entry.source) return entry.source;
  if (entry.type === "inject") return "instructor";
  if (entry.type === "system") return "system";
  // type === "decision" — distinguish instructor structural actions
  if (INSTRUCTOR_DECISION_PATTERNS.some((p) => p.test(entry.title))) return "instructor";
  return "student";
}

/**
 * Returns true only for entries that count toward the student's grade.
 * All instructor/system entries are non-evaluable by definition.
 */
export function isTimelineEntryEvaluable(entry: TimelineEntry): boolean {
  if (entry.evaluable !== undefined) return entry.evaluable;
  const src = inferTimelineSource(entry);
  return src === "student" && entry.type === "decision";
}

/**
 * Returns the visibility level for a timeline entry.
 * Defaults to "all" so old sessions remain fully visible.
 */
export function getTimelineVisibility(entry: TimelineEntry): TimelineVisibility {
  return entry.visibility ?? "all";
}

export type NormalizedEntry = TimelineEntry &
  Required<Pick<TimelineEntry, "source" | "evaluable" | "visibility">>;

/** Guarantees source/evaluable/visibility are set on a single entry. */
export function normalizeTimelineEntry(entry: TimelineEntry): NormalizedEntry {
  return {
    ...entry,
    source: inferTimelineSource(entry),
    evaluable: isTimelineEntryEvaluable(entry),
    visibility: getTimelineVisibility(entry),
  };
}

/** Guarantees source/evaluable/visibility are set on every entry. */
export function normalizeTimelineEntries(entries: TimelineEntry[]): NormalizedEntry[] {
  return entries.map(normalizeTimelineEntry);
}

/**
 * Returns only entries the student is allowed to see.
 * Entries with visibility:"instructor" are hidden; everything else is shown.
 */
export function filterTimelineForStudent(entries: NormalizedEntry[]): NormalizedEntry[] {
  return entries.filter((e) => e.visibility !== "instructor");
}

/**
 * Returns only entries that contribute to the student's evaluation.
 */
export function filterEvaluableTimelineEntries(entries: NormalizedEntry[]): NormalizedEntry[] {
  return entries.filter((e) => e.evaluable);
}
