export type DecisionSource = "student" | "system" | "instructor";
export type DecisionSeverity = "info" | "warning" | "critical";
export type DecisionActionType =
  | "apply_decision"
  | "trigger_inject"
  | "transfer_command"
  | "activate_unified_command"
  | "start_operational_period"
  | "demobilize_resource"
  | "advance_time"
  | "toggle_role"
  | "complete_scenario";

export interface DecisionLog {
  id: string;
  timestamp: number;
  minute: number;
  scenarioId: string;
  actionType: DecisionActionType;
  label: string;
  resourceId?: string;
  targetId?: string;
  phase?: string;
  source: DecisionSource;
  severity: DecisionSeverity;
  notes?: string;
}
