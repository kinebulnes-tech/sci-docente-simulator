import { useState } from "react";
import { CheckCircle2, HelpCircle } from "lucide-react";

interface GuidedQuestionPanelProps {
  learningObjectives: string[];
  scenarioTitle: string;
}

export function GuidedQuestionPanel({
  learningObjectives,
  scenarioTitle,
}: GuidedQuestionPanelProps) {
  const [discussed, setDiscussed] = useState<Set<number>>(new Set());

  function toggle(idx: number) {
    setDiscussed((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  return (
    <section className="panel guided-question-panel">
      <div className="panel-heading">
        <p className="eyebrow">Modo enseñanza</p>
        <h2>Preguntas guiadas</h2>
      </div>

      {learningObjectives.length === 0 ? (
        <p className="instructor-hint">
          Este escenario no tiene objetivos de aprendizaje definidos.
        </p>
      ) : (
        <>
          <p className="instructor-hint">
            Objetivos de <em>{scenarioTitle}</em>. Marca los que ya hayas discutido con el
            alumno.
          </p>
          <div className="question-list">
            {learningObjectives.map((obj, idx) => (
              <button
                key={idx}
                className={`question-item${discussed.has(idx) ? " discussed" : ""}`}
                onClick={() => toggle(idx)}
              >
                {discussed.has(idx) ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <HelpCircle size={14} />
                )}
                <span>{obj}</span>
              </button>
            ))}
          </div>
          <p className="instructor-hint">
            {discussed.size}/{learningObjectives.length} temas discutidos
          </p>
        </>
      )}
    </section>
  );
}
