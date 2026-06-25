import type { ScenarioResource } from "../types/sci";

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
          <article key={resource.id} className={`resource-card resource-${resource.status}`}>
            <div>
              <strong>{resource.name}</strong>
              <span>{resource.type}</span>
            </div>
            <p>{resource.capabilities.join(" · ")}</p>
            <small>
              {resource.status}
              {resource.etaMinutes ? ` · ETA ${resource.etaMinutes} min` : ""}
            </small>
          </article>
        ))}
      </div>
    </section>
  );
}
