import { sciPrinciples } from "../data/sciDoctrine";

export function DoctrinePanel() {
  return (
    <section className="panel doctrine-panel">
      <div className="panel-heading">
        <p className="eyebrow">Base doctrinaria</p>
        <h2>Principios SCI usados por la lógica</h2>
      </div>
      <div className="principle-list">
        {sciPrinciples.map((principle) => (
          <details key={principle.id} className="principle-card">
            <summary>{principle.title}</summary>
            <p>{principle.description}</p>
            <small>Regla: {principle.simulatorRule}</small>
          </details>
        ))}
      </div>
    </section>
  );
}
