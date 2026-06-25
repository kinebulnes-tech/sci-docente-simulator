import type { DecisionLog } from "../types/decisionLog";

const SEVERITY_LABEL: Record<string, string> = {
  info:     "Info",
  warning:  "Alerta",
  critical: "Crítico"
};

const SOURCE_LABEL: Record<string, string> = {
  student:    "Alumno",
  instructor: "Instructor",
  system:     "Sistema"
};

interface DecisionLogPanelProps {
  logs: DecisionLog[];
}

export function DecisionLogPanel({ logs }: DecisionLogPanelProps) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Instructor</p>
          <h2>Registro de decisiones</h2>
        </div>
        <span className="log-count">{logs.length} entradas</span>
      </div>

      {logs.length === 0 ? (
        <p className="empty-state">Sin decisiones registradas aún.</p>
      ) : (
        <div className="decision-log-list">
          {logs.map((log) => (
            <article key={log.id} className={`decision-log-entry severity-${log.severity}`}>
              <div className="log-meta">
                <span className="log-minute">T+{log.minute}m</span>
                <span className={`log-severity sev-${log.severity}`}>
                  {SEVERITY_LABEL[log.severity] ?? log.severity}
                </span>
                <span className="log-source">{SOURCE_LABEL[log.source] ?? log.source}</span>
              </div>
              <strong>{log.label}</strong>
              {log.notes && <p className="log-notes">{log.notes}</p>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
