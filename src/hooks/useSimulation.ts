import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { scenarios, scenarioMap } from "../data/scenarios";
import { structuralFireRubric } from "../data/rubrics";
import {
  createInitialState,
  evaluateSimulation,
  getGlobalScore,
  simulationReducer
} from "../engine/simulationEngine";
import type {
  DecisionCategory,
  DecisionFeedback,
  ScenarioDecision,
  SessionConfig,
  SimulationAction,
  SimulationState
} from "../types/sci";

// ─── Persistence ───────────────────────────────────────────────────────────

type PersistedState = Omit<SimulationState, "scenario"> & { isCompleted: boolean };

function storageKey({ scenarioId, role }: SessionConfig): string {
  return `sci-trainer-${scenarioId}-${role}`;
}

function loadPersisted(config: SessionConfig): PersistedState | null {
  try {
    const raw = localStorage.getItem(storageKey(config));
    return raw ? (JSON.parse(raw) as PersistedState) : null;
  } catch {
    return null;
  }
}

function savePersisted(config: SessionConfig, state: SimulationState, isCompleted: boolean): void {
  try {
    const serializable: PersistedState = {
      minute: state.minute,
      status: state.status,
      metrics: state.metrics,
      activeRoles: state.activeRoles,
      selectedDecisions: state.selectedDecisions,
      triggeredInjects: state.triggeredInjects,
      completedObjectives: state.completedObjectives,
      timeline: state.timeline,
      resources: state.resources,
      isCompleted
    };
    localStorage.setItem(storageKey(config), JSON.stringify(serializable));
  } catch {
    // ignore — storage unavailable or quota exceeded
  }
}

// ─── Initial state builder ─────────────────────────────────────────────────

function buildInitialState(config: SessionConfig, scenario: SimulationState["scenario"]): SimulationState {
  const saved = loadPersisted(config);
  if (saved) {
    return {
      scenario,
      minute: saved.minute,
      status: saved.status,
      metrics: saved.metrics,
      activeRoles: saved.activeRoles,
      selectedDecisions: saved.selectedDecisions,
      triggeredInjects: saved.triggeredInjects,
      completedObjectives: saved.completedObjectives,
      timeline: saved.timeline,
      resources: saved.resources
    };
  }
  return createInitialState(scenario);
}

// ─── Feedback builder ──────────────────────────────────────────────────────

const CATEGORY_PRINCIPLE: Record<DecisionCategory, string> = {
  mando: "Principio SCI: Establecer y transferir mando.",
  seguridad: "Principio SCI: Responsabilidad y seguridad de respondedores.",
  objetivos: "Principio SCI: Manejo por objetivos.",
  recursos: "Principio SCI: Gestión integral de recursos.",
  comunicaciones: "Principio SCI: Comunicaciones integradas.",
  operaciones: "Principio SCI: Organización modular.",
  planificacion: "Principio SCI: Plan de Acción del Incidente.",
  logistica: "Principio SCI: Logística del incidente.",
  enlace: "Principio SCI: Enlace y mando unificado."
};

function buildFeedback(state: SimulationState, decision: ScenarioDecision): DecisionFeedback {
  const isBlocked = decision.requires?.some((id) => !state.selectedDecisions.includes(id)) ?? false;
  const isAlreadyTaken = state.selectedDecisions.includes(decision.id);

  if (isBlocked) {
    return {
      decisionId: decision.id,
      variant: "danger",
      title: "Acción bloqueada",
      message: `"${decision.title}" requiere decisiones previas que aún no han sido ejecutadas.`
    };
  }

  if (isAlreadyTaken && decision.penalizedIfRepeated) {
    return {
      decisionId: decision.id,
      variant: "warning",
      title: "Acción repetida",
      message: "Repetir esta decisión aumenta la complejidad de mando sin agregar valor operativo."
    };
  }

  return {
    decisionId: decision.id,
    variant: "success",
    title: decision.title,
    message: CATEGORY_PRINCIPLE[decision.category] ?? "Decisión registrada en la bitácora."
  };
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useSimulation(config: SessionConfig) {
  const scenario = scenarioMap[config.scenarioId] ?? scenarios[0];

  const [state, baseDispatch] = useReducer(
    simulationReducer,
    config,
    (cfg) => buildInitialState(cfg, scenario)
  );

  const [isCompleted, setIsCompleted] = useState<boolean>(
    () => loadPersisted(config)?.isCompleted ?? false
  );

  const [feedback, setFeedback] = useState<DecisionFeedback | null>(null);

  // Stable ref so dispatch closure doesn't go stale
  const stateRef = useRef(state);
  stateRef.current = state;

  // Persist every time state or completion flag changes
  const { scenarioId, role } = config;
  useEffect(() => {
    savePersisted({ scenarioId, role }, state, isCompleted);
  }, [scenarioId, role, state, isCompleted]);

  // Wrapped dispatch: intercepts APPLY_DECISION to generate feedback
  const dispatch = useCallback((action: SimulationAction) => {
    if (action.type === "APPLY_DECISION") {
      const decision = stateRef.current.scenario.decisions.find((d) => d.id === action.decisionId);
      if (decision) setFeedback(buildFeedback(stateRef.current, decision));
    }
    baseDispatch(action);
  }, []);

  const clearFeedback = useCallback(() => setFeedback(null), []);

  const complete = useCallback(() => setIsCompleted(true), []);

  const clearSession = useCallback(() => {
    try {
      localStorage.removeItem(`sci-trainer-${scenarioId}-${role}`);
    } catch {
      // ignore
    }
    baseDispatch({ type: "RESET" });
    setIsCompleted(false);
    setFeedback(null);
  }, [scenarioId, role]);

  const evaluation = useMemo(() => evaluateSimulation(state, structuralFireRubric), [state]);
  const globalScore = useMemo(() => getGlobalScore(evaluation), [evaluation]);

  return {
    state,
    dispatch,
    evaluation,
    globalScore,
    rubric: structuralFireRubric,
    role: config.role,
    feedback,
    clearFeedback,
    isCompleted,
    complete,
    clearSession
  };
}
