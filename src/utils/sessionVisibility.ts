import type { DecisionLog } from "../types/decisionLog";
import type { SessionMode } from "../types/sessionEvents";
import type { SessionRole } from "../types/sci";

/**
 * Returns only logs originating from the student.
 * These are the only logs that should contribute to evaluation.
 */
export function filterEvaluableLogs(logs: DecisionLog[]): DecisionLog[] {
  return logs.filter((l) => l.source === "student");
}

/**
 * Returns logs visible to the student:
 * own decisions + system events; excludes instructor-only events.
 */
export function filterLogsForStudent(logs: DecisionLog[]): DecisionLog[] {
  return logs.filter((l) => l.source === "student" || l.source === "system");
}

/** Returns all logs — instructors see the full picture. */
export function filterLogsForInstructor(logs: DecisionLog[]): DecisionLog[] {
  return logs;
}

/** Whether a log contributes to the student's grade. */
export function isEvaluable(log: DecisionLog): boolean {
  return log.source === "student";
}

/**
 * Whether the live score should be shown.
 * Instructors always see it. Students only see it after completion.
 */
export function shouldShowLiveScore(role: SessionRole, isCompleted: boolean): boolean {
  return role === "instructor" || isCompleted;
}

/**
 * Whether timing hints ("Recomendada ahora", pending count) should appear
 * in the decision panel. Instructors only — keeps student evaluation clean.
 */
export function shouldShowDecisionHints(role: SessionRole): boolean {
  return role === "instructor";
}

/**
 * Whether instructor-facing tools (notes, pauses, live performance) are visible.
 * Hidden in projector mode to avoid cluttering the class projection.
 */
export function shouldShowInstructorTools(mode: SessionMode): boolean {
  return mode !== "projector";
}

/**
 * Whether guided questions and teaching tools are active.
 * Only in teaching mode.
 */
export function shouldShowTeachingTools(mode: SessionMode, role: SessionRole): boolean {
  return role === "instructor" && mode === "teaching";
}

/**
 * Whether the rubric should be shown to this role in the current state.
 * Instructors always see it. Students only after completing the exercise.
 */
export function shouldShowRubric(role: SessionRole, isCompleted: boolean): boolean {
  return role === "instructor" || isCompleted;
}

/**
 * Returns a neutral visibility class for projector mode.
 * Can be used to suppress non-essential UI panels.
 */
export function isProjectorSafe(mode: SessionMode): boolean {
  return mode === "projector" || mode === "evaluation";
}
