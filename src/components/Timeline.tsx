import type { TimelineEntry } from "../types/sci";

interface TimelineProps {
  entries: TimelineEntry[];
}

export function Timeline({ entries }: TimelineProps) {
  return (
    <section className="panel timeline-panel">
      <div className="panel-heading">
        <p className="eyebrow">Evidencia</p>
        <h2>Línea de tiempo</h2>
      </div>
      <div className="timeline">
        {entries
          .slice()
          .reverse()
          .map((entry, index) => (
            <article key={`${entry.minute}-${entry.title}-${index}`} className={`timeline-entry type-${entry.type}`}>
              <span>Min {entry.minute}</span>
              <strong>{entry.title}</strong>
              <p>{entry.detail}</p>
            </article>
          ))}
      </div>
    </section>
  );
}
