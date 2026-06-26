import { useState } from "react";
import type { Dispatch } from "react";
import { CheckCircle2, Filter, LockKeyhole } from "lucide-react";
import type { DecisionCategory, ScenarioDecision, SimulationAction, SimulationState } from "../types/sci";

interface DecisionPanelProps {
  state: SimulationState;
  dispatch: Dispatch<SimulationAction>;
}

const CATEGORY_LABELS: Record<DecisionCategory, string> = {
  mando:          "Mando",
  seguridad:      "Seguridad",
  objetivos:      "Objetivos",
  recursos:       "Recursos",
  comunicaciones: "Comun.",
  operaciones:    "Operaciones",
  planificacion:  "Planif.",
  logistica:      "Logística",
  enlace:         "Enlace",
};

function isLocked(decision: ScenarioDecision, selectedDecisions: string[]) {
  return Boolean(decision.requires?.some((id) => !selectedDecisions.includes(id)));
}

function isTimed(decision: ScenarioDecision, minute: number) {
  if (decision.recommendedUntilMinute && minute > decision.recommendedUntilMinute) return "late";
  if (minute >= decision.recommendedFromMinute) return "now";
  return "early";
}

export function DecisionPanel({ state, dispatch }: DecisionPanelProps) {
  const [activeFilter, setActiveFilter] = useState<DecisionCategory | "todos">("todos");

  const categories = Array.from(
    new Set(state.scenario.decisions.map((d) => d.category))
  ) as DecisionCategory[];

  const filtered =
    activeFilter === "todos"
      ? state.scenario.decisions
      : state.scenario.decisions.filter((d) => d.category === activeFilter);

  const criticalPending = state.scenario.decisions.filter(
    (d) =>
      d.recommendedFromMinute <= state.minute &&
      !state.selectedDecisions.includes(d.id) &&
      !isLocked(d, state.selectedDecisions)
  ).length;

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>Decisiones disponibles</h2>
          {criticalPending > 0 && (
            <p className="decision-pending-hint">
              {criticalPending} decisión(es) recomendada(s) en el minuto actual
            </p>
          )}
        </div>
        <Filter size={16} color="var(--text-soft)" />
      </div>

      <div className="decision-filter-bar">
        <button
          className={`decision-filter-btn${activeFilter === "todos" ? " active" : ""}`}
          onClick={() => setActiveFilter("todos")}
        >
          Todas
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`decision-filter-btn${activeFilter === cat ? " active" : ""}`}
            onClick={() => setActiveFilter(cat)}
          >
            {CATEGORY_LABELS[cat] ?? cat}
          </button>
        ))}
      </div>

      <div className="decision-list">
        {filtered.length === 0 && (
          <p className="decision-empty">No hay decisiones en esta categoría.</p>
        )}
        {filtered.map((decision) => {
          const selected = state.selectedDecisions.includes(decision.id);
          const locked   = isLocked(decision, state.selectedDecisions);
          const timing   = isTimed(decision, state.minute);

          return (
            <button
              key={decision.id}
              className={`decision-card ${selected ? "selected" : ""} timing-${timing}`}
              onClick={() => dispatch({ type: "APPLY_DECISION", decisionId: decision.id })}
              disabled={locked}
            >
              <div className="decision-title">
                <strong>{decision.title}</strong>
                <div className="decision-title-icons">
                  {locked    && <LockKeyhole size={14} />}
                  {selected  && <CheckCircle2 size={14} />}
                </div>
              </div>
              <p>{decision.description}</p>
              <div className="tag-row">
                <span className={`decision-cat-badge cat-${decision.category}`}>
                  {CATEGORY_LABELS[decision.category] ?? decision.category}
                </span>
                <span className="decision-timing-tag">
                  min {decision.recommendedFromMinute}
                  {decision.recommendedUntilMinute ? `–${decision.recommendedUntilMinute}` : "+"}
                </span>
                {selected && (
                  <span className="decision-registered-tag">Registrada</span>
                )}
                {!selected && timing === "now" && !locked && (
                  <span className="decision-recommended-tag">Recomendada ahora</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
