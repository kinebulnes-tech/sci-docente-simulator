import { structuralFireRubric } from "../data/rubrics";
import { sciRoles } from "../data/sciDoctrine";
import type {
  CommandTransfer,
  EvaluationResult,
  IncidentMetric,
  IncidentStatus,
  OperationalPeriod,
  RubricItem,
  Scenario,
  ScenarioDecision,
  ScenarioInject,
  SimulationAction,
  SimulationState,
  TimelineEntry,
  UnifiedCommand
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

function updateResourceETAs(state: SimulationState, fromMinute: number, toMinute: number): SimulationState {
  const elapsed = toMinute - fromMinute;
  const arrivedNames: string[] = [];

  const resources = state.resources.map((r) => {
    if (r.status !== "solicitado" || r.etaMinutes === undefined || r.etaMinutes <= 0) return r;
    const newEta = Math.max(0, r.etaMinutes - elapsed);
    if (newEta === 0) {
      arrivedNames.push(r.name);
      return { ...r, etaMinutes: 0, status: "disponible" as const };
    }
    return { ...r, etaMinutes: newEta };
  });

  const arrivalEntries: TimelineEntry[] = arrivedNames.map((name) => ({
    minute: toMinute,
    type: "system" as const,
    title: `Recurso disponible: ${name}`,
    detail: `${name} llegó a escena. Asignar misión específica y registrar en control de personal.`,
    source: "system" as const,
    evaluable: false,
    visibility: "all" as const,
  }));

  return { ...state, resources, timeline: [...state.timeline, ...arrivalEntries] };
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

function applyInject(
  state: SimulationState,
  inject: ScenarioInject,
  triggerSource: "instructor" | "system" = "system"
): SimulationState {
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
        detail: inject.description,
        source: triggerSource,
        evaluable: false,
        visibility: "all" as const,
      }
    ]
  };
}

export function evaluateSpanOfControl(activeRoles: string[]): { exceeded: boolean; count: number; threshold: number } {
  const count = sciRoles.filter((r) => activeRoles.includes(r.id) && r.function !== "mando").length;
  return { exceeded: count >= 7, count, threshold: 7 };
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
        detail: scenario.briefing,
        source: "system" as const,
        evaluable: false,
        visibility: "all" as const,
      }
    ],
    resources: scenario.resources,
    commandHistory: [],
    currentCommandHolder: "CI",
    unifiedCommand: null,
    operationalPeriods: [],
    currentPeriod: 0,
    spanOfControlWarning: false
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
              type: "system" as const,
              title: "Decisión bloqueada",
              detail: blockedReason,
              source: "system" as const,
              evaluable: false,
              visibility: "instructor" as const,
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
              type: "decision" as const,
              title: `Repetida: ${decision.title}`,
              detail: "La repetición de esta acción no agrega valor y aumenta carga de mando.",
              source: "student" as const,
              evaluable: false,
              visibility: "all" as const,
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
            type: "decision" as const,
            title: decision.title,
            detail: decision.description,
            source: "student" as const,
            evaluable: true,
            visibility: "all" as const,
          }
        ]
      };
    }

    case "TRIGGER_INJECT": {
      const inject = state.scenario.injects.find((item) => item.id === action.injectId);
      if (!inject || state.triggeredInjects.includes(inject.id)) return state;
      return applyInject(state, inject, "instructor");
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
      const afterInjects = triggerAutomaticInjects(nextState, nextMinute);
      return updateResourceETAs(afterInjects, state.minute, nextMinute);
    }

    case "TOGGLE_ROLE": {
      const isActive = state.activeRoles.includes(action.roleId);
      const activeRoles = isActive
        ? state.activeRoles.filter((roleId) => roleId !== action.roleId)
        : [...state.activeRoles, action.roleId];

      const metrics = applyMetricImpact(state.metrics, isActive ? { complexity: -1 } : { coordination: 2, complexity: 1 });
      const spanCheck = evaluateSpanOfControl(activeRoles);

      return {
        ...state,
        activeRoles,
        metrics,
        status: getStatus(metrics),
        spanOfControlWarning: spanCheck.exceeded,
        timeline: [
          ...state.timeline,
          {
            minute: state.minute,
            type: "system" as const,
            title: isActive ? "Rol desactivado" : "Rol activado",
            detail: spanCheck.exceeded
              ? `${action.roleId} — ⚠️ Tramo de control excedido (${spanCheck.count}/${spanCheck.threshold})`
              : action.roleId,
            source: "instructor" as const,
            evaluable: false,
            visibility: "instructor" as const,
          }
        ]
      };
    }

    case "TRANSFER_COMMAND": {
      const fromName = action.fromName ?? state.currentCommandHolder;
      const briefingDecisions = ["pai-inicial", "objetivos-iniciales", "asumir-mando"];
      const briefingConfirmed = briefingDecisions.some((id) => state.selectedDecisions.includes(id));
      const transfer: CommandTransfer = { minute: state.minute, fromName, toName: action.toName, briefingConfirmed };
      const metrics = applyMetricImpact(state.metrics, briefingConfirmed
        ? { coordination: 6, complexity: -2 }
        : { coordination: -4, complexity: 3 });

      return {
        ...state,
        metrics,
        status: getStatus(metrics),
        currentCommandHolder: action.toName,
        commandHistory: [...state.commandHistory, transfer],
        timeline: [
          ...state.timeline,
          {
            minute: state.minute,
            type: "decision" as const,
            title: `Transferencia de mando: ${fromName} → ${action.toName}`,
            detail: briefingConfirmed
              ? `Transferencia formal con briefing documentado (ICS 201). Mando asumido por ${action.toName}.`
              : `⚠️ Transferencia sin briefing formal. Riesgo de pérdida de conciencia situacional. Documentar ICS 201.`,
            source: "instructor" as const,
            evaluable: false,
            visibility: "all" as const,
          }
        ]
      };
    }

    case "ACTIVATE_UNIFIED_COMMAND": {
      if (state.unifiedCommand?.active) return state;
      const uc: UnifiedCommand = { active: true, agencies: action.agencies, activatedAtMinute: state.minute };
      const metrics = applyMetricImpact(state.metrics, { coordination: 15, complexity: -5, control: 8 });

      return {
        ...state,
        metrics,
        status: getStatus(metrics),
        unifiedCommand: uc,
        timeline: [
          ...state.timeline,
          {
            minute: state.minute,
            type: "decision" as const,
            title: "Mando unificado activado",
            detail: `Agencias en CU: ${action.agencies.join(", ")}. Establecer objetivos comunes, PIO conjunto y reunión inicial de CU.`,
            source: "instructor" as const,
            evaluable: false,
            visibility: "all" as const,
          }
        ]
      };
    }

    case "START_OPERATIONAL_PERIOD": {
      const periodNumber = state.currentPeriod + 1;
      const period: OperationalPeriod = {
        id: `periodo-${periodNumber}`,
        number: periodNumber,
        startMinute: state.minute,
        objectives: action.objectives ?? state.scenario.objectives.map((o) => o.id)
      };
      const closedPeriods = state.operationalPeriods.map((p, i) =>
        i === state.operationalPeriods.length - 1 && p.endMinute === undefined
          ? { ...p, endMinute: state.minute }
          : p
      );
      const metrics = applyMetricImpact(state.metrics, { control: 8, coordination: 8, complexity: -5 });

      return {
        ...state,
        metrics,
        status: getStatus(metrics),
        currentPeriod: periodNumber,
        operationalPeriods: [...closedPeriods, period],
        timeline: [
          ...state.timeline,
          {
            minute: state.minute,
            type: "system" as const,
            title: `Inicio Período Operacional ${periodNumber}`,
            detail: `Período ${periodNumber} activado en minuto ${state.minute}. Actualizar PAI, asignaciones y comunicaciones.`,
            source: "instructor" as const,
            evaluable: false,
            visibility: "all" as const,
          }
        ]
      };
    }

    case "DEMOBILIZE_RESOURCE": {
      const resource = state.resources.find((r) => r.id === action.resourceId);
      if (!resource || resource.status === "desmovilizado") return state;
      const wasCritical = resource.status === "asignado";
      const metrics = wasCritical
        ? applyMetricImpact(state.metrics, { control: -4, coordination: -2 })
        : state.metrics;

      return {
        ...state,
        metrics,
        status: getStatus(metrics),
        resources: state.resources.map((r) =>
          r.id === action.resourceId ? { ...r, status: "desmovilizado" as const } : r
        ),
        timeline: [
          ...state.timeline,
          {
            minute: state.minute,
            type: "system" as const,
            title: `Desmovilización: ${resource.name}`,
            detail: wasCritical
              ? `⚠️ ${resource.name} desmovilizado mientras estaba asignado. Verificar cobertura operacional.`
              : `Desmovilización formal de ${resource.name}. Registrar en ICS 221.`,
            source: "instructor" as const,
            evaluable: false,
            visibility: "all" as const,
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
