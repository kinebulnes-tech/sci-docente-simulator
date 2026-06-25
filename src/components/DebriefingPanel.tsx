import { useState, useCallback } from "react";
import { CheckCircle, XCircle, Copy, RefreshCw, X } from "lucide-react";
import type { SimulationState } from "../types/sci";
import type { EvaluationSummary } from "../types/evaluation";
import type { DecisionLog } from "../types/decisionLog";
import type { DebriefingData } from "../utils/debriefing";
import { buildDebriefingMarkdown } from "../utils/debriefing";
import { EvaluationSummaryPanel } from "./EvaluationSummaryPanel";
import { ExportPanel } from "./ExportPanel";

interface DebriefingPanelProps {
  state: SimulationState;
  evaluation: EvaluationSummary;
  debriefing: DebriefingData;
  logs: DecisionLog[];
  onRestart: () => void;
  onExit: () => void;
}

export function DebriefingPanel({
  state,
  evaluation,
  debriefing,
  logs,
  onRestart,
  onExit
}: DebriefingPanelProps) {
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const md = buildDebriefingMarkdown(debriefing, notes, logs);
    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // fallback: silently fail if clipboard unavailable
    });
  }, [debriefing, notes, logs]);

  return (
    <div className="debriefing-overlay">
      <div className="debriefing-container">
        <div className="debriefing-header">
          <div>
            <p className="eyebrow">Cierre de caso</p>
            <h1>{state.scenario.title}</h1>
            <p className="debriefing-meta">
              Duración: {debriefing.durationMinutes} min ·
              {" "}{debriefing.decisionsCount} decisiones ·
              {" "}{debriefing.injectsCount} eventos activados
            </p>
          </div>
          <div className={`verdict-badge large ${debriefing.passed ? "verdict-pass" : "verdict-fail"}`}>
            {debriefing.passed ? <CheckCircle size={22} /> : <XCircle size={22} />}
            {debriefing.passed ? "APROBADO" : "NO APROBADO"}
          </div>
        </div>

        <EvaluationSummaryPanel summary={evaluation} />

        <section className="panel debriefing-timeline-section">
          <div className="panel-heading">
            <div><p className="eyebrow">Evidencia</p><h2>Línea de tiempo resumida</h2></div>
          </div>
          <div className="timeline debriefing-timeline">
            {state.timeline.slice().reverse().map((entry, i) => (
              <article key={i} className={`timeline-entry type-${entry.type}`}>
                <span>Min {entry.minute}</span>
                <strong>{entry.title}</strong>
                <p>{entry.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel debriefing-notes-section">
          <div className="panel-heading">
            <div><p className="eyebrow">Instructor</p><h2>Observaciones finales</h2></div>
          </div>
          <textarea
            className="instructor-notes-input"
            placeholder="Escribe tus observaciones y recomendaciones para el alumno…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </section>

        <ExportPanel state={state} evaluation={evaluation} debriefing={debriefing} logs={logs} instructorNotes={notes} />

        <div className="debriefing-actions">
          <button className="icon-button" onClick={handleCopy} title="Copiar resumen">
            <Copy size={18} />
            {copied ? "¡Copiado!" : "Copiar resumen"}
          </button>
          <button className="secondary-button" onClick={onRestart}>
            <RefreshCw size={16} />
            Reiniciar caso
          </button>
          <button className="icon-button danger-btn" onClick={onExit} title="Cerrar caso">
            <X size={18} />
            Cerrar caso
          </button>
        </div>
      </div>
    </div>
  );
}
