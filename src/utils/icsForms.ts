import { sciRoles } from "../data/sciDoctrine";
import type { SimulationState, TimelineEntry } from "../types/sci";

export interface ICS201Data {
  incidentName: string;
  preparedBy: string;
  minute: number;
  situation: string;
  objectives: string[];
  currentActions: string[];
  resources: Array<{ name: string; status: string; capabilities: string }>;
  metrics: Record<string, number>;
}

export interface ICS202Data {
  incidentName: string;
  operationalPeriod: number;
  objectives: Array<{ text: string; priority: string; completed: boolean }>;
  commandEmphasis: string;
  criticalErrorIds: string[];
}

export interface ICS205Data {
  incidentName: string;
  operationalPeriod: number;
  communicationsDecisions: string[];
  channelAssignments: Array<{ function: string; channel: string; remarks: string }>;
}

export interface ICS207Data {
  incidentName: string;
  commandHolder: string;
  unifiedCommand: string[] | null;
  roles: Array<{ id: string; title: string; function: string; active: boolean }>;
  spanOfControlWarning: boolean;
}

export interface ICS214LogEntry {
  minute: number;
  type: string;
  title: string;
  detail: string;
}

export interface ICS214Data {
  incidentName: string;
  operatorName: string;
  entries: ICS214LogEntry[];
}

export function buildIcs201(state: SimulationState): ICS201Data {
  const decisions = state.scenario.decisions.filter((d) => state.selectedDecisions.includes(d.id));
  return {
    incidentName: state.scenario.title,
    preparedBy: state.currentCommandHolder,
    minute: state.minute,
    situation: state.scenario.summary,
    objectives: state.scenario.objectives.map((o) => o.text),
    currentActions: decisions.slice(0, 8).map((d) => d.title),
    resources: state.resources.map((r) => ({
      name: r.name,
      status: r.status,
      capabilities: r.capabilities.join(", ")
    })),
    metrics: {
      riesgo: state.metrics.risk,
      control: state.metrics.control,
      coordinacion: state.metrics.coordination,
      vidaSeguridad: state.metrics.lifeSafety
    }
  };
}

export function buildIcs202(state: SimulationState): ICS202Data {
  return {
    incidentName: state.scenario.title,
    operationalPeriod: state.currentPeriod,
    objectives: state.scenario.objectives.map((o) => ({
      text: o.text,
      priority: o.priority,
      completed: state.completedObjectives.includes(o.id)
    })),
    commandEmphasis: state.scenario.criticalErrors.length > 0
      ? `Errores críticos a evitar en este incidente: ${state.scenario.criticalErrors.join(", ")}`
      : "Mantener protocolo SCI en todas las fases del incidente.",
    criticalErrorIds: state.scenario.criticalErrors
  };
}

export function buildIcs205(state: SimulationState): ICS205Data {
  const commsDecisions = state.scenario.decisions
    .filter((d) => d.category === "comunicaciones" && state.selectedDecisions.includes(d.id))
    .map((d) => d.title);

  const channels = [
    { function: "Mando", channel: "Canal 1 (Mando)", remarks: "CI y secciones" },
    { function: "Operaciones", channel: "Canal 2 (Táctica)", remarks: "Sectores y recursos operativos" },
    { function: "Logística", channel: "Canal 3 (Logística)", remarks: "Apoyo y abastecimiento" },
    { function: "Emergencia", channel: "Canal 0 (Emergencia)", remarks: "Mayday y emergencias de personal" }
  ];

  return {
    incidentName: state.scenario.title,
    operationalPeriod: state.currentPeriod,
    communicationsDecisions: commsDecisions,
    channelAssignments: channels
  };
}

export function buildIcs207(state: SimulationState): ICS207Data {
  return {
    incidentName: state.scenario.title,
    commandHolder: state.currentCommandHolder,
    unifiedCommand: state.unifiedCommand?.active ? state.unifiedCommand.agencies : null,
    roles: sciRoles.map((r) => ({
      id: r.id,
      title: r.title,
      function: r.function,
      active: state.activeRoles.includes(r.id)
    })),
    spanOfControlWarning: state.spanOfControlWarning
  };
}

export function buildIcs214(state: SimulationState): ICS214Data {
  const entries: ICS214LogEntry[] = state.timeline.map((e: TimelineEntry) => ({
    minute: e.minute,
    type: e.type,
    title: e.title,
    detail: e.detail
  }));

  return {
    incidentName: state.scenario.title,
    operatorName: state.currentCommandHolder,
    entries
  };
}
