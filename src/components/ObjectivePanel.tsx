import { CheckCircle2, Circle } from "lucide-react";
import type { SimulationState } from "../types/sci";

interface ObjectivePanelProps {
  state: SimulationState;
}

export function ObjectivePanel({ state }: ObjectivePanelProps) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">PAI</p>
        <h2>Objetivos del incidente</h2>
      </div>
      <div className="objective-list">
        {state.scenario.objectives.map((objective) => {
          const done = state.completedObjectives.includes(objective.id);
          return (
            <article key={objective.id} className={`objective-card ${done ? "done" : ""}`}>
              {done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
              <div>
                <strong>{objective.text}</strong>
                <span>{objective.priority}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
