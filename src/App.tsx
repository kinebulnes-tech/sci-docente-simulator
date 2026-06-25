import { AppHeader } from "./components/AppHeader";
import { DecisionPanel } from "./components/DecisionPanel";
import { DoctrinePanel } from "./components/DoctrinePanel";
import { InstructorPanel } from "./components/InstructorPanel";
import { MetricGrid } from "./components/MetricGrid";
import { ObjectivePanel } from "./components/ObjectivePanel";
import { OrgChart } from "./components/OrgChart";
import { ResourcePanel } from "./components/ResourcePanel";
import { RubricPanel } from "./components/RubricPanel";
import { ScenarioBoard } from "./components/ScenarioBoard";
import { Timeline } from "./components/Timeline";
import { useSimulation } from "./hooks/useSimulation";

export default function App() {
  const { state, dispatch, evaluation, globalScore, rubric } = useSimulation();

  return (
    <main className="app-shell">
      <AppHeader
        title={state.scenario.title}
        minute={state.minute}
        status={state.status}
        globalScore={globalScore}
        dispatch={dispatch}
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
          <InstructorPanel state={state} dispatch={dispatch} />
          <ResourcePanel resources={state.resources} />
          <RubricPanel rubric={rubric} evaluation={evaluation} />
        </div>
      </div>

      <div className="bottom-grid">
        <Timeline entries={state.timeline} />
        <DoctrinePanel />
      </div>
    </main>
  );
}
