import { useCallback, useEffect, useState } from "react";
import { AppHeader } from "./components/AppHeader";
import { BriefingPanel } from "./components/BriefingPanel";
import { DebriefingPanel } from "./components/DebriefingPanel";
import { DecisionLogPanel } from "./components/DecisionLogPanel";
import { DecisionPanel } from "./components/DecisionPanel";
import { DoctrinePanel } from "./components/DoctrinePanel";
import { FeedbackToast } from "./components/FeedbackToast";
import { IcsFormViewer } from "./components/IcsFormViewer";
import { InstructorPanel } from "./components/InstructorPanel";
import { MetricGrid } from "./components/MetricGrid";
import { ObjectivePanel } from "./components/ObjectivePanel";
import { OrgChart } from "./components/OrgChart";
import { ResourcePanel } from "./components/ResourcePanel";
import { RubricPanel } from "./components/RubricPanel";
import { ScenarioBoard } from "./components/ScenarioBoard";
import { ScenarioSelector } from "./components/ScenarioSelector";
import { SimulationTimeline } from "./components/SimulationTimeline";
import { useSimulation } from "./hooks/useSimulation";
import { scenarioMap, scenarios } from "./data/scenarios";
import type { SessionConfig } from "./types/sci";

// ─── Simulation screen ─────────────────────────────────────────────────────

interface SimulationScreenProps {
  config: SessionConfig;
  onExit: () => void;
  projector: boolean;
  onToggleProjector: () => void;
}

function SimulationScreen({ config, onExit, projector, onToggleProjector }: SimulationScreenProps) {
  const {
    state, dispatch, evaluation, globalScore, rubric, role,
    feedback, clearFeedback, isCompleted, complete, clearSession,
    decisionLogs, evaluationSummary, debriefingData
  } = useSimulation(config);

  const [showDebriefing, setShowDebriefing] = useState(false);
  const isInstructor = role === "instructor";

  // Auto-show debriefing when instructor marks complete
  useEffect(() => {
    if (isCompleted) setShowDebriefing(true);
  }, [isCompleted]);

  const handleRestart = useCallback(() => {
    setShowDebriefing(false);
    clearSession();
  }, [clearSession]);

  if (showDebriefing && isCompleted) {
    return (
      <DebriefingPanel
        state={state}
        evaluation={evaluationSummary}
        debriefing={debriefingData}
        logs={decisionLogs}
        onRestart={handleRestart}
        onExit={onExit}
      />
    );
  }

  return (
    <main className={`app-shell${projector ? " projector-mode" : ""}`}>
      <AppHeader
        title={state.scenario.title}
        minute={state.minute}
        status={state.status}
        globalScore={globalScore}
        role={role}
        isCompleted={isCompleted}
        dispatch={dispatch}
        onComplete={complete}
        onReset={clearSession}
        onExit={onExit}
        projector={projector}
        onToggleProjector={onToggleProjector}
      />

      <section className="briefing-band">
        <div>
          <p className="eyebrow">Briefing operacional</p>
          <h2>{state.scenario.summary}</h2>
          <p>{state.scenario.briefing}</p>
        </div>
      </section>

      <MetricGrid metrics={state.metrics} />

      <div className="main-grid">
        <div className="left-stack">
          <ScenarioBoard state={state} />
          <ObjectivePanel state={state} />
          <OrgChart
            activeRoles={state.activeRoles}
            spanOfControlWarning={state.spanOfControlWarning}
            role={role}
            dispatch={dispatch}
          />
        </div>

        <div className="center-stack">
          <DecisionPanel state={state} dispatch={dispatch} />
        </div>

        <div className="right-stack">
          {isInstructor && <InstructorPanel state={state} dispatch={dispatch} />}
          <ResourcePanel resources={state.resources} />

          {isInstructor || isCompleted ? (
            <RubricPanel rubric={rubric} evaluation={evaluation} />
          ) : (
            <section className="panel">
              <div className="panel-heading">
                <p className="eyebrow">Evaluación</p>
                <h2>Rúbrica del ejercicio</h2>
              </div>
              <p className="rubric-locked-msg">
                La rúbrica estará disponible al finalizar el ejercicio.
                <br />
                <small>Usa el botón "Finalizar" cuando hayas tomado todas tus decisiones.</small>
              </p>
            </section>
          )}
        </div>
      </div>

      <div className={`bottom-grid${!isInstructor ? " bottom-grid--single" : ""}`}>
        <SimulationTimeline entries={state.timeline} />
        {isInstructor && <DoctrinePanel />}
      </div>

      {isInstructor && <DecisionLogPanel logs={decisionLogs} />}
      {isInstructor && <IcsFormViewer state={state} />}

      <FeedbackToast feedback={feedback} onClose={clearFeedback} />
    </main>
  );
}

// ─── Root app ──────────────────────────────────────────────────────────────

export default function App() {
  const [pendingConfig, setPendingConfig] = useState<SessionConfig | null>(null);
  const [activeConfig, setActiveConfig]   = useState<SessionConfig | null>(null);
  const [projector, setProjector]         = useState(false);

  const handleStart = useCallback((cfg: SessionConfig) => setPendingConfig(cfg), []);

  const handleBeginSim = useCallback(() => {
    if (!pendingConfig) return;
    setActiveConfig(pendingConfig);
    setPendingConfig(null);
  }, [pendingConfig]);

  const handleExit = useCallback(() => {
    setActiveConfig(null);
    setPendingConfig(null);
  }, []);

  const handleBack = useCallback(() => setPendingConfig(null), []);

  const toggleProjector = useCallback(() => setProjector((p) => !p), []);

  // Fullscreen
  useEffect(() => {
    const handler = () => {};
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  if (!pendingConfig && !activeConfig) {
    return <ScenarioSelector onStart={handleStart} />;
  }

  if (pendingConfig && !activeConfig) {
    const scenario = scenarioMap[pendingConfig.scenarioId] ?? scenarios[0];
    return (
      <BriefingPanel
        scenario={scenario}
        role={pendingConfig.role}
        onStart={handleBeginSim}
        onBack={handleBack}
      />
    );
  }

  return (
    <SimulationScreen
      config={activeConfig!}
      onExit={handleExit}
      projector={projector}
      onToggleProjector={toggleProjector}
    />
  );
}
