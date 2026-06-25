import type { Dispatch } from "react";
import { CheckCircle2, LockKeyhole } from "lucide-react";
import type { ScenarioDecision, SimulationAction, SimulationState } from "../types/sci";

interface DecisionPanelProps {
  state: SimulationState;
  dispatch: Dispatch<SimulationAction>;
}

function isLocked(decision: ScenarioDecision, selectedDecisions: string[]) {
  return Boolean(decision.requires?.some((id) => !selectedDecisions.includes(id)));
}

export function DecisionPanel({ state, dispatch }: DecisionPanelProps) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">Alumno</p>
        <h2>Decisiones disponibles</h2>
      </div>
      <div className="decision-list">
        {state.scenario.decisions.map((decision) => {
          const selected = state.selectedDecisions.includes(decision.id);
          const locked = isLocked(decision, state.selectedDecisions);

          return (
            <button
              key={decision.id}
              className={`decision-card ${selected ? "selected" : ""}`}
              onClick={() => dispatch({ type: "APPLY_DECISION", decisionId: decision.id })}
              disabled={locked}
            >
              <div className="decision-title">
                <strong>{decision.title}</strong>
                {locked && <LockKeyhole size={16} />}
                {selected && <CheckCircle2 size={16} />}
              </div>
              <p>{decision.description}</p>
              <div className="tag-row">
                <span>{decision.category}</span>
                <span>
                  min {decision.recommendedFromMinute}
                  {decision.recommendedUntilMinute ? `-${decision.recommendedUntilMinute}` : "+"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
