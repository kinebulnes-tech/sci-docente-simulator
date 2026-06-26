export type EvaluationCategory =
  | "seguridad_escena"
  | "mando"
  | "comunicaciones"
  | "evaluacion_inicial"
  | "solicitud_recursos"
  | "sectorizacion"
  | "control_incidente"
  | "desmovilizacion"
  | "reevaluacion";

/** Configurable criterion — not hardcoded doctrine. Instructors may adjust criteria per exercise. */
export interface EvaluationCriterion {
  id: string;
  label: string;
  description: string;
  category: EvaluationCategory;
  maxPoints: number;
  required: boolean;
  critical: boolean;
  expectedActionTypes: string[];
  minTime?: number;
  maxTime?: number;
}

export interface CriterionResult {
  criterionId: string;
  label: string;
  score: number;
  maxScore: number;
  met: boolean;
  critical: boolean;
  feedback: string;
}

export interface EvaluationSummary {
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  criticalFailures: string[];
  strengths: string[];
  improvementAreas: string[];
  criterionResults: CriterionResult[];
}
