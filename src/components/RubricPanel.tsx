import type { EvaluationResult, RubricItem } from "../types/sci";

interface RubricPanelProps {
  rubric: RubricItem[];
  evaluation: EvaluationResult[];
}

export function RubricPanel({ rubric, evaluation }: RubricPanelProps) {
  return (
    <section className="panel rubric-panel">
      <div className="panel-heading">
        <p className="eyebrow">Evaluación</p>
        <h2>Rúbrica automática</h2>
      </div>
      <div className="rubric-list">
        {rubric.map((item) => {
          const result = evaluation.find((entry) => entry.itemId === item.id);
          return (
            <article key={item.id} className="rubric-card">
              <div className="rubric-topline">
                <strong>{item.title}</strong>
                <span>
                  {result?.points ?? 0}/{item.maxPoints}
                </span>
              </div>
              <p>{result?.feedback}</p>
              <small>Evidencia: {result?.evidence.length ? result.evidence.join(", ") : "sin evidencia"}</small>
            </article>
          );
        })}
      </div>
    </section>
  );
}
