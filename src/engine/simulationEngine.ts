import { structuralFireRubric } from "../data/rubrics";
import { sciRoles } from "../data/sciDoctrine";
import type {
  EvaluationResult,
  IncidentMetric,
  IncidentStatus,
  RubricItem,
  Scenario,
  ScenarioDecision,
  ScenarioInject,
  SimulationAction,
  SimulationState
} from "../types/sci";
import { clamp } from "../utils/number";

function applyMetricImpact(metrics: IncidentMetric, impact: Partial<IncidentMetric>): IncidentMetric {
  return {
    risk: clamp(metrics.risk + (impact.risk ?? 0)),
    control: clamp(metrics.control + (impact.control ?? 0)),
    coordination: clamp(metrics.coordination + (impact.coordination ?? 0)),
    lifeSafety: clamp(metrics.lifeSafety + (impact.lifeSafety ?? 0)),
    propertyConservation: clamp(metrics.propertyConservation + (impact.propertyConservation ?? 0)),
    complexity: clamp(metrics.complexity + (impact.complexity ?? 0))
  };
}

function getStatus(metrics: IncidentMetric): IncidentStatus {
  if (metrics.control >= 78 && metrics.risk <= 35) return "controlado";
  if (metrics.risk >= 76 || metrics.lifeSafety <= 28) return "critico";
  if (metrics.complexity >= 55 || metrics.risk >= 52) return "dinamico";
  return "estable";
}

function decisionTimingModifier(state: SimulationState, decision: ScenarioDecision): Partial<IncidentMetric> {
  const tooEarly = state.minute < decision.recommendedFromMinute;
  const tooLate = decision.recommendedUntilMinute !== undefined && state.minute > decision.recommendedUntilMinute;

  if (tooEarly) {
    return { complexity: 3, coordination: -2 };
  }

  if (tooLate) {
    return { risk: 4, control: -3, coordination: -2 };
  }

  return {};
}

function getBlockedReason(state: SimulationState, decision: ScenarioDecision): string | null {
  if (!decision.requires?.length) return null;
  const missing = decision.requires.filter((id) => !state.selectedDecisions.includes(id));
  if (!missing.length) return null;
  return `Falta ejecutar requisito: ${missing.join(", ")}`;
}

function completeObjectives(state: SimulationState, selectedDecisions: string[]): string[] {
  const completed = state.scenario.objectives
    .filter((objective) => objective.completedByDecisionIds.every((decisionId) => selectedDecisions.includes(decisionId)))
    .map((objective) => objective.id);

  return Array.from(new Set([...state.completedObjectives, ...completed]));
}

function triggerAutomaticInjects(state: SimulationState, nextMinute: number): SimulationState {
  const dueInjects = state.scenario.injects.filter(
    (inject) =>
      inject.minute > state.minute &&
      inject.minute <= nextMinute &&
      !state.triggeredInjects.includes(inject.id)
  );

  if (!dueInjects.length) {
    return { ...state, minute: nextMinute };
  }

  return dueInjects.reduce((current, inject) => applyInject(current, inject), {
    ...state,
    minute: nextMinute
  });
}

function applyInject(state: SimulationState, inject: ScenarioInject): SimulationState {
  const metrics = applyMetricImpact(state.metrics, inject.metricImpact);

  return {
    ...state,
    metrics,
    status: getStatus(metrics),
    triggeredInjects: [...state.triggeredInjects, inject.id],
    timeline: [
      ...state.timeline,
      {
        minute: state.minute,
        type: "inject",
        title: inject.title,
        detail: inject.description
      }
    ]
  };
}

export function createInitialState(scenario: Scenario): SimulationState {
  const activeRoles = sciRoles.filter((role) => role.activeByDefault).map((role) => role.id);

  return {
    scenario,
    minute: 0,
    status: getStatus(scenario.initialMetrics),
    metrics: scenario.initialMetrics,
    activeRoles,
    selectedDecisions: [],
    triggeredInjects: [],
    completedObjectives: [],
    timeline: [
      {
        minute: 0,
        type: "system",
        title: "Inicio del ejercicio",
        detail: scenario.briefing
      }
    ],
    resources: scenario.resources
  };
}

export function simulationReducer(state: SimulationState, action: SimulationAction): SimulationState {
  switch (action.type) {
    case "APPLY_DECISION": {
      const decision = state.scenario.decisions.find((item) => item.id === action.decisionId);
      if (!decision) return state;

      const blockedReason = getBlockedReason(state, decision);
      if (blockedReason) {
        return {
          ...state,
          timeline: [
            ...state.timeline,
            {
              minute: state.minute,
              type: "system",
              title: "Decisión bloqueada",
              detail: blockedReason
            }
          ]
        };
      }

      const alreadySelected = state.selectedDecisions.includes(decision.id);
      if (alreadySelected && decision.penalizedIfRepeated) {
        const metrics = applyMetricImpact(state.metrics, { coordination: -4, complexity: 4 });
        return {
          ...state,
          metrics,
          status: getStatus(metrics),
          timeline: [
            ...state.timeline,
            {
              minute: state.minute,
              type: "decision",
              title: `Repetida: ${decision.title}`,
              detail: "La repetición de esta acción no agrega valor y aumenta carga de mando."
            }
          ]
        };
      }

      const selectedDecisions = alreadySelected ? state.selectedDecisions : [...state.selectedDecisions, decision.id];
      const timingImpact = decisionTimingModifier(state, decision);
      const metrics = applyMetricImpact(applyMetricImpact(state.metrics, decision.metricImpact), timingImpact);
      const completedObjectives = completeObjectives(state, selectedDecisions);

      return {
        ...state,
        metrics,
        status: getStatus(metrics),
        selectedDecisions,
        completedObjectives,
        timeline: [
          ...state.timeline,
          {
            minute: state.minute,
            type: "decision",
            title: decision.title,
            detail: decision.description
          }
        ]
      };
    }

    case "TRIGGER_INJECT": {
      const inject = state.scenario.injects.find((item) => item.id === action.injectId);
      if (!inject || state.triggeredInjects.includes(inject.id)) return state;
      return applyInject(state, inject);
    }

    case "ADVANCE_TIME": {
      const nextMinute = clamp(state.minute + action.minutes, 0, 180);
      const passiveImpact: Partial<IncidentMetric> =
        state.status === "controlado"
          ? { risk: -1, control: 1 }
          : { risk: 2, control: -1, complexity: 1 };
      const passiveMetrics = applyMetricImpact(state.metrics, passiveImpact);
      const nextState = {
        ...state,
        metrics: passiveMetrics,
        status: getStatus(passiveMetrics)
      };
      return triggerAutomaticInjects(nextState, nextMinute);
    }

    case "TOGGLE_ROLE": {
      const isActive = state.activeRoles.includes(action.roleId);
      const activeRoles = isActive
        ? state.activeRoles.filter((roleId) => roleId !== action.roleId)
        : [...state.activeRoles, action.roleId];

      const metrics = applyMetricImpact(state.metrics, isActive ? { complexity: -1 } : { coordination: 2, complexity: 1 });

      return {
        ...state,
        activeRoles,
        metrics,
        status: getStatus(metrics),
        timeline: [
          ...state.timeline,
          {
            minute: state.minute,
            type: "system",
            title: isActive ? "Rol desactivado" : "Rol activado",
            detail: action.roleId
          }
        ]
      };
    }

    case "RESET":
      return createInitialState(state.scenario);

    default:
      return state;
  }
}

export function evaluateSimulation(
  state: SimulationState,
  rubric: RubricItem[] = structuralFireRubric
): EvaluationResult[] {
  return rubric.map((item) => {
    const evidence = item.evidenceDecisionIds.filter((decisionId) => state.selectedDecisions.includes(decisionId));
    const ratio = evidence.length / item.evidenceDecisionIds.length;
    const points = Math.round(item.maxPoints * ratio);

    return {
      itemId: item.id,
      points,
      maxPoints: item.maxPoints,
      evidence,
      feedback:
        ratio === 1
          ? "Cumplido con evidencia suficiente."
          : ratio >= 0.5
            ? "Cumplimiento parcial; faltan decisiones clave."
            : "Evidencia insuficiente para aprobar este criterio."
    };
  });
}

export function getGlobalScore(results: EvaluationResult[]): number {
  const earned = results.reduce((sum, item) => sum + item.points, 0);
  const max = results.reduce((sum, item) => sum + item.maxPoints, 0);
  return max === 0 ? 0 : Math.round((earned / max) * 100);
}
