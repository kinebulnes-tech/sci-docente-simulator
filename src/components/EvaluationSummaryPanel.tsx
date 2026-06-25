import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import type { EvaluationSummary } from "../types/evaluation";

interface EvaluationSummaryPanelProps {
  summary: EvaluationSummary;
}

export function EvaluationSummaryPanel({ summary }: EvaluationSummaryPanelProps) {
  return (
    <section className="panel eval-summary-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Evaluación automática</p>
          <h2>Resultado del ejercicio</h2>
        </div>
        <div className={`verdict-badge ${summary.passed ? "verdict-pass" : "verdict-fail"}`}>
          {summary.passed ? <CheckCircle size={18} /> : <XCircle size={18} />}
          {summary.passed ? "APROBADO" : "NO APROBADO"}
        </div>
      </div>

      <div className="eval-score-row">
        <div className="eval-score-box">
          <strong>{summary.score}/{summary.maxScore}</strong>
          <span>Puntaje</span>
        </div>
        <div className="eval-score-box">
          <strong>{summary.percentage}%</strong>
          <span>Porcentaje</span>
        </div>
        <div className="eval-score-box">
          <strong>{summary.criticalFailures.length}</strong>
          <span>Errores críticos</span>
        </div>
      </div>

      {summary.criticalFailures.length > 0 && (
        <div className="eval-critical">
          <AlertTriangle size={16} />
          <div>
            <strong>Errores críticos detectados</strong>
            <ul>
              {summary.criticalFailures.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        </div>
      )}

      <div className="eval-two-col">
        <div>
          <p className="eval-section-title">Fortalezas</p>
          {summary.strengths.length === 0
            ? <p className="empty-state">Sin fortalezas identificadas.</p>
            : <ul className="eval-list strengths">{summary.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
          }
        </div>
        <div>
          <p className="eval-section-title">Áreas de mejora</p>
          {summary.improvementAreas.length === 0
            ? <p className="empty-state">Sin áreas de mejora identificadas.</p>
            : <ul className="eval-list improvements">{summary.improvementAreas.map((a) => <li key={a}>{a}</li>)}</ul>
          }
        </div>
      </div>

      <details className="eval-criteria-detail">
        <summary>Ver criterios individuales ({summary.criterionResults.length})</summary>
        <div className="eval-criteria-list">
          {summary.criterionResults.map((r) => (
            <div key={r.criterionId} className={`eval-criterion ${r.met ? "met" : "unmet"}`}>
              <span>{r.met ? "✓" : "✗"}</span>
              <div>
                <strong>{r.label}</strong>
                {r.critical && <span className="critical-tag">Crítico</span>}
                <p>{r.feedback}</p>
                <small>{r.score}/{r.maxScore} pts</small>
              </div>
            </div>
          ))}
        </div>
      </details>
    </section>
  );
}
