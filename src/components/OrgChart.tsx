import type { Dispatch } from "react";
import { sciRoles } from "../data/sciDoctrine";
import type { SimulationAction } from "../types/sci";

interface OrgChartProps {
  activeRoles: string[];
  dispatch: Dispatch<SimulationAction>;
}

export function OrgChart({ activeRoles, dispatch }: OrgChartProps) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">SCI</p>
        <h2>Organización modular</h2>
      </div>
      <div className="org-grid">
        {sciRoles.map((role) => {
          const active = activeRoles.includes(role.id);
          return (
            <button
              key={role.id}
              className={`org-card ${active ? "active" : ""}`}
              onClick={() => dispatch({ type: "TOGGLE_ROLE", roleId: role.id })}
            >
              <strong>{role.title}</strong>
              <span>{role.function}</span>
              <p>{role.description}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
