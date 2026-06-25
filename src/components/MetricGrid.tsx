import type { IncidentMetric } from "../types/sci";

interface MetricGridProps {
  metrics: IncidentMetric;
}

const metricLabels: Array<{ key: keyof IncidentMetric; label: string; inverse?: boolean }> = [
  { key: "risk", label: "Riesgo", inverse: true },
  { key: "control", label: "Control" },
  { key: "coordination", label: "Coordinación" },
  { key: "lifeSafety", label: "Vida/seguridad" },
  { key: "propertyConservation", label: "Conservación" },
  { key: "complexity", label: "Complejidad", inverse: true }
];

function tone(value: number, inverse?: boolean) {
  const adjusted = inverse ? 100 - value : value;
  if (adjusted >= 75) return "good";
  if (adjusted >= 50) return "warning";
  return "danger";
}

export function MetricGrid({ metrics }: MetricGridProps) {
  return (
    <section className="metric-grid" aria-label="Indicadores del incidente">
      {metricLabels.map((metric) => (
        <article key={metric.key} className="metric-card">
          <div className="metric-topline">
            <span>{metric.label}</span>
            <strong>{metrics[metric.key]}</strong>
          </div>
          <div className="meter">
            <div
              className={`meter-fill ${tone(metrics[metric.key], metric.inverse)}`}
              style={{ width: `${metrics[metric.key]}%` }}
            />
          </div>
        </article>
      ))}
    </section>
  );
}
