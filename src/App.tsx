import { useState } from "react";
import { AppHeader } from "./components/AppHeader";
import { DecisionPanel } from "./components/DecisionPanel";
import { DoctrinePanel } from "./components/DoctrinePanel";
import { FeedbackToast } from "./components/FeedbackToast";
import { InstructorPanel } from "./components/InstructorPanel";
import { MetricGrid } from "./components/MetricGrid";
import { ObjectivePanel } from "./components/ObjectivePanel";
import { OrgChart } from "./components/OrgChart";
import { ResourcePanel } from "./components/ResourcePanel";
import { RubricPanel } from "./components/RubricPanel";
import { ScenarioBoard } from "./components/ScenarioBoard";
import { ScenarioSelector } from "./components/ScenarioSelector";
import { Timeline } from "./components/Timeline";
import { useSimulation } from "./hooks/useSimulation";
import type { SessionConfig } from "./types/sci";

// ─── Simulation screen (only mounted when config is set) ───────────────────

interface SimulationScreenProps {
  config: SessionConfig;
  onExit: () => void;
}

function SimulationScreen({ config, onExit }: SimulationScreenProps) {
  const {
    state,
    dispatch,
    evaluation,
    globalScore,
    rubric,
    role,
    feedback,
    clearFeedback,
    isCompleted,
    complete,
    clearSession
  } = useSimulation(config);

  const isInstructor = role === "instructor";

  return (
    <main className="app-shell">
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
          <ScenarioBoard scenario={state.scenario} selectedDecisions={state.selectedDecisions} />
          <ObjectivePanel state={state} />
          <OrgChart activeRoles={state.activeRoles} dispatch={dispatch} />
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
        <Timeline entries={state.timeline} />
        {isInstructor && <DoctrinePanel />}
      </div>

      <FeedbackToast feedback={feedback} onClose={clearFeedback} />
    </main>
  );
}

// ─── Root app ──────────────────────────────────────────────────────────────

export default function App() {
  const [config, setConfig] = useState<SessionConfig | null>(null);

  if (!config) {
    return <ScenarioSelector onStart={setConfig} />;
  }

  return <SimulationScreen config={config} onExit={() => setConfig(null)} />;
}
