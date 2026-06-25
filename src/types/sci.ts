export type SciFunction =
  | "mando"
  | "operaciones"
  | "planificacion"
  | "logistica"
  | "administracion"
  | "seguridad"
  | "informacionPublica"
  | "enlace";

export type IncidentType =
  | "incendio_estructural"
  | "rescate_vehicular"
  | "matpel"
  | "forestal"
  | "evacuacion"
  | "sar"
  | "evento_masivo"
  | "multiagencia";

export type ScenarioDifficulty = "basico" | "intermedio" | "avanzado";

export type DecisionCategory =
  | "mando"
  | "seguridad"
  | "objetivos"
  | "recursos"
  | "comunicaciones"
  | "operaciones"
  | "planificacion"
  | "logistica"
  | "enlace";

export type IncidentStatus = "estable" | "dinamico" | "critico" | "controlado";

export interface SciPrinciple {
  id: string;
  title: string;
  description: string;
  simulatorRule: string;
}

export interface SciRole {
  id: string;
  title: string;
  function: SciFunction;
  description: string;
  activeByDefault: boolean;
}

export interface IncidentMetric {
  risk: number;
  control: number;
  coordination: number;
  lifeSafety: number;
  propertyConservation: number;
  complexity: number;
}

export interface ScenarioResource {
  id: string;
  name: string;
  type: "unidad" | "personal" | "equipo" | "institucion" | "instalacion";
  status: "disponible" | "asignado" | "solicitado" | "fuera_servicio";
  etaMinutes?: number;
  capabilities: string[];
}

export interface ScenarioInject {
  id: string;
  minute: number;
  title: string;
  description: string;
  severity: "baja" | "media" | "alta" | "critica";
  metricImpact: Partial<IncidentMetric>;
  expectedResponses: string[];
}

export interface ScenarioDecision {
  id: string;
  title: string;
  description: string;
  category: DecisionCategory;
  recommendedFromMinute: number;
  recommendedUntilMinute?: number;
  metricImpact: Partial<IncidentMetric>;
  unlocks?: string[];
  requires?: string[];
  penalizedIfRepeated?: boolean;
  doctrineNotes: string[];
}

export interface ScenarioObjective {
  id: string;
  text: string;
  priority: "vida" | "estabilizacion" | "propiedad" | "ambiente" | "continuidad";
  completedByDecisionIds: string[];
}

export interface ScenarioHotspot {
  id: string;
  label: string;
  x: number;
  y: number;
  kind: "fuego" | "victima" | "riesgo" | "recurso" | "perimetro" | "pc";
  description: string;
}

export interface Scenario {
  id: string;
  title: string;
  type: IncidentType;
  difficulty: ScenarioDifficulty;
  summary: string;
  briefing: string;
  learningObjectives: string[];
  doctrinalForms: string[];
  criticalErrors: string[];
  initialMetrics: IncidentMetric;
  objectives: ScenarioObjective[];
  resources: ScenarioResource[];
  injects: ScenarioInject[];
  decisions: ScenarioDecision[];
  hotspots: ScenarioHotspot[];
  rubric: RubricItem[];
}

export interface TimelineEntry {
  minute: number;
  type: "decision" | "inject" | "system" | "score";
  title: string;
  detail: string;
}

export interface RubricItem {
  id: string;
  title: string;
  category: DecisionCategory;
  maxPoints: number;
  evidenceDecisionIds: string[];
  failCondition?: string;
}

export interface EvaluationResult {
  itemId: string;
  points: number;
  maxPoints: number;
  evidence: string[];
  feedback: string;
}

export interface SimulationState {
  scenario: Scenario;
  minute: number;
  status: IncidentStatus;
  metrics: IncidentMetric;
  activeRoles: string[];
  selectedDecisions: string[];
  triggeredInjects: string[];
  completedObjectives: string[];
  timeline: TimelineEntry[];
  resources: ScenarioResource[];
}

export type SimulationAction =
  | { type: "APPLY_DECISION"; decisionId: string }
  | { type: "TRIGGER_INJECT"; injectId: string }
  | { type: "ADVANCE_TIME"; minutes: number }
  | { type: "TOGGLE_ROLE"; roleId: string }
  | { type: "RESET" };

export type SessionRole = "instructor" | "alumno";

export interface SessionConfig {
  role: SessionRole;
  scenarioId: string;
}

export type FeedbackVariant = "success" | "warning" | "danger";

export interface DecisionFeedback {
  decisionId: string;
  variant: FeedbackVariant;
  title: string;
  message: string;
}
