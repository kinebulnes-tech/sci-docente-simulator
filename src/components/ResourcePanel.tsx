import type { ScenarioResource } from "../types/sci";

const STATUS_ES: Record<string, string> = {
  disponible: "Disponible",
  asignado: "Asignado",
  solicitado: "En ruta",
  fuera_servicio: "Fuera de servicio",
  desmovilizado: "Desmovilizado"
};

interface ResourcePanelProps {
  resources: ScenarioResource[];
}

export function ResourcePanel({ resources }: ResourcePanelProps) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">Recursos</p>
        <h2>Estado operativo</h2>
      </div>
      <div className="resource-list">
        {resources.map((resource) => (
          <article key={resource.id} className="resource-card">
            <div>
              <strong>{resource.name}</strong>
              <span>{resource.type}</span>
            </div>
            <p>{resource.capabilities.join(" · ")}</p>
            <small>
              <span className={`res-badge status-${resource.status}`}>
                {STATUS_ES[resource.status] ?? resource.status}
              </span>
              {resource.etaMinutes ? ` · ETA ${resource.etaMinutes} min` : ""}
            </small>
          </article>
        ))}
      </div>
    </section>
  );
}
