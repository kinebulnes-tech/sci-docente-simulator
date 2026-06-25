import type { Dispatch } from "react";
import { AlertTriangle, Play } from "lucide-react";
import type { SimulationAction, SimulationState } from "../types/sci";

interface InstructorPanelProps {
  state: SimulationState;
  dispatch: Dispatch<SimulationAction>;
}

export function InstructorPanel({ state, dispatch }: InstructorPanelProps) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">Instructor</p>
        <h2>Eventos inyectables</h2>
      </div>
      <div className="inject-list">
        {state.scenario.injects.map((inject) => {
          const triggered = state.triggeredInjects.includes(inject.id);
          return (
            <article key={inject.id} className={`inject-card severity-${inject.severity}`}>
              <div className="inject-title">
                <AlertTriangle size={16} />
                <strong>{inject.title}</strong>
              </div>
              <p>{inject.description}</p>
              <div className="inject-footer">
                <span>Min {inject.minute}</span>
                <button
                  className="small-button"
                  onClick={() => dispatch({ type: "TRIGGER_INJECT", injectId: inject.id })}
                  disabled={triggered}
                >
                  <Play size={14} />
                  {triggered ? "Activado" : "Activar"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
