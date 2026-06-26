import { useState } from "react";
import type { SessionRole, TimelineEntry } from "../types/sci";
import { filterTimelineByType, getTimelineStats, sortTimelineDesc } from "../utils/timeline";
import {
  filterTimelineForStudent,
  normalizeTimelineEntries,
} from "../utils/timelineMetadata";

const TYPE_LABELS: Record<TimelineEntry["type"], string> = {
  decision: "Decisión",
  inject:   "Evento",
  system:   "Sistema",
  score:    "Puntaje"
};

const SOURCE_BADGE: Record<string, string> = {
  student:    "Alumno",
  instructor: "Instructor",
  system:     "Sistema",
};

const SOURCE_CSS: Record<string, string> = {
  student:    "tl-src-student",
  instructor: "tl-src-instructor",
  system:     "tl-src-system",
};

interface SimulationTimelineProps {
  entries: TimelineEntry[];
  role?: SessionRole;
}

export function SimulationTimeline({ entries, role = "instructor" }: SimulationTimelineProps) {
  const [filter, setFilter] = useState<TimelineEntry["type"] | "all">("all");

  const normalized = normalizeTimelineEntries(entries);
  // Students only see entries not marked visibility:"instructor"
  const roleFiltered = role === "alumno"
    ? filterTimelineForStudent(normalized)
    : normalized;

  const typeFiltered = filter === "all"
    ? roleFiltered
    : filterTimelineByType(roleFiltered, [filter]);

  const sorted = sortTimelineDesc(typeFiltered);
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
              <div className="timeline-entry-header">
                <span>Min {entry.minute}</span>
                {role === "instructor" && entry.source && (
                  <span className={`tl-source-badge ${SOURCE_CSS[entry.source] ?? ""}`}>
                    {SOURCE_BADGE[entry.source] ?? entry.source}
                  </span>
                )}
              </div>
              <strong>{entry.title}</strong>
              <p>{entry.detail}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
