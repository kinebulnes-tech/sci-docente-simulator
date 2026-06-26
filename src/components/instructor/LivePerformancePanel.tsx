import { CheckCircle2, Clock, Target, TrendingUp } from "lucide-react";
import type { SimulationState } from "../../types/sci";

interface LivePerformancePanelProps {
  state: SimulationState;
  globalScore: number;
}

export function LivePerformancePanel({ state, globalScore }: LivePerformancePanelProps) {
  const totalDecisions      = state.scenario.decisions.length;
  const takenDecisions      = state.selectedDecisions.length;
  const totalObjectives     = state.scenario.objectives.length;
  const completedObjectives = state.completedObjectives.length;

  const pendingCritical = state.scenario.decisions.filter(
    (d) =>
      d.recommendedFromMinute <= state.minute &&
      !state.selectedDecisions.includes(d.id)
  );

  const scoreClass =
    globalScore >= 80 ? "perf-good" : globalScore >= 60 ? "perf-warn" : "perf-bad";

  return (
    <section className="panel live-performance-panel">
      <div className="panel-heading">
        <p className="eyebrow">Tiempo real</p>
        <h2>Desempeño</h2>
      </div>

      <div className="perf-grid">
        <div className={`perf-card ${scoreClass}`}>
          <TrendingUp size={15} />
          <span className="perf-value">{globalScore}%</span>
          <span className="perf-label">Score est.</span>
        </div>
        <div className="perf-card">
          <CheckCircle2 size={15} />
          <span className="perf-value">{takenDecisions}/{totalDecisions}</span>
          <span className="perf-label">Decisiones</span>
        </div>
        <div className="perf-card">
          <Target size={15} />
          <span className="perf-value">{completedObjectives}/{totalObjectives}</span>
          <span className="perf-label">Objetivos</span>
        </div>
        <div className="perf-card">
          <Clock size={15} />
          <span className="perf-value">T+{state.minute}m</span>
          <span className="perf-label">Tiempo</span>
        </div>
      </div>

      {pendingCritical.length > 0 && (
        <div className="perf-pending">
          <p className="perf-pending-label">Decisiones recomendadas aún no tomadas:</p>
          <ul className="perf-pending-list">
            {pendingCritical.slice(0, 3).map((d) => (
              <li key={d.id}>
                {d.title}
                <span className="perf-cat">[{d.category}]</span>
              </li>
            ))}
            {pendingCritical.length > 3 && (
              <li className="perf-more">…y {pendingCritical.length - 3} más</li>
            )}
          </ul>
        </div>
      )}
    </section>
  );
}
