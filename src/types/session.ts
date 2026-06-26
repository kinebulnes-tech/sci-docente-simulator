import type { DecisionLog } from "./decisionLog";
import type { EvaluationSummary } from "./evaluation";

export interface SessionRecord {
  id: string;
  scenarioId: string;
  instructorId?: string;
  studentId?: string;
  startedAt: number;
  endedAt?: number;
  decisionLogs: DecisionLog[];
  evaluationResult?: EvaluationSummary;
  instructorNotes?: string;
  exportedAt?: number;
}

export interface ScenarioAssignment {
  id: string;
  scenarioId: string;
  assignedTo: string;
  assignedBy: string;
  dueDate?: number;
  status: "pending" | "in_progress" | "completed";
}
