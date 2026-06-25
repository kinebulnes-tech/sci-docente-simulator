import type { Dispatch } from "react";
import { sciRoles } from "../data/sciDoctrine";
import type { SimulationAction, SessionRole } from "../types/sci";
import { SpanOfControlAlert } from "./SpanOfControlAlert";
import { evaluateSpanOfControl } from "../engine/simulationEngine";

interface OrgChartProps {
  activeRoles: string[];
  spanOfControlWarning: boolean;
  role: SessionRole;
  dispatch: Dispatch<SimulationAction>;
}

export function OrgChart({ activeRoles, spanOfControlWarning, role, dispatch }: OrgChartProps) {
  const spanStatus = evaluateSpanOfControl(activeRoles);

  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">SCI</p>
        <h2>Organización modular</h2>
      </div>
      <SpanOfControlAlert
        exceeded={spanOfControlWarning}
        count={spanStatus.count}
        threshold={spanStatus.threshold}
        role={role}
      />
      <div className="org-grid">
        {sciRoles.map((sciRole) => {
          const active = activeRoles.includes(sciRole.id);
          return (
            <button
              key={sciRole.id}
              className={`org-card ${active ? "active" : ""}`}
              onClick={() => dispatch({ type: "TOGGLE_ROLE", roleId: sciRole.id })}
            >
              <strong>{sciRole.title}</strong>
              <span>{sciRole.function}</span>
              <p>{sciRole.description}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
