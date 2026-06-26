import { useState } from "react";
import type { TimelineEntry } from "../types/sci";
import { filterTimelineByType, getTimelineStats, sortTimelineDesc } from "../utils/timeline";

const TYPE_LABELS: Record<TimelineEntry["type"], string> = {
  decision: "Decisión",
  inject:   "Evento",
  system:   "Sistema",
  score:    "Puntaje"
};

interface SimulationTimelineProps {
  entries: TimelineEntry[];
}

export function SimulationTimeline({ entries }: SimulationTimelineProps) {
  const [filter, setFilter] = useState<TimelineEntry["type"] | "all">("all");

  const filtered = filter === "all" ? entries : filterTimelineByType(entries, [filter]);
  const sorted = sortTimelineDesc(filtered);
  const stats = getTimelineStats(entries);

  return (
    <section className="panel timeline-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Evidencia</p>
          <h2>Línea de tiempo</h2>
        </div>
        <div className="timeline-stats">
          <span>{stats.decisions} decisiones</span>
          <span>{stats.injects} eventos</span>
        </div>
      </div>

      <div className="timeline-filters">
        {(["all", "decision", "inject", "system"] as const).map((t) => (
          <button
            key={t}
            className={`timeline-filter-btn ${filter === t ? "active" : ""}`}
            onClick={() => setFilter(t)}
          >
            {t === "all" ? "Todo" : TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="timeline">
        {sorted.length === 0 ? (
          <p className="empty-state">Sin entradas en la línea de tiempo.</p>
        ) : (
          sorted.map((entry, i) => (
            <article
              key={`${entry.minute}-${entry.title}-${i}`}
              className={`timeline-entry type-${entry.type}`}
            >
              <span>Min {entry.minute}</span>
              <strong>{entry.title}</strong>
              <p>{entry.detail}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
