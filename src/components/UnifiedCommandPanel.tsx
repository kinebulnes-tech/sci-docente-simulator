import { useState } from "react";
import type { Dispatch } from "react";
import { Users } from "lucide-react";
import type { SimulationAction, SimulationState } from "../types/sci";

interface UnifiedCommandPanelProps {
  state: SimulationState;
  dispatch: Dispatch<SimulationAction>;
}

export function UnifiedCommandPanel({ state, dispatch }: UnifiedCommandPanelProps) {
  const institutions = state.resources
    .filter((r) => r.type === "institucion")
    .map((r) => r.name);

  const [selected, setSelected] = useState<string[]>([]);

  function toggle(name: string) {
    setSelected((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]);
  }

  if (state.unifiedCommand?.active) {
    return (
      <div className="uc-panel active">
        <div className="uc-header">
          <Users size={16} />
          <strong>Mando Unificado activo</strong>
          <span className="uc-badge">Desde min {state.unifiedCommand.activatedAtMinute}</span>
        </div>
        <ul className="uc-agency-list">
          {state.unifiedCommand.agencies.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
        <p className="uc-doctrine">
          Principio SCI: Mando Unificado — las agencias comparten objetivos sin perder autoridad propia. Designar PIO conjunto.
        </p>
      </div>
    );
  }

  return (
    <div className="uc-panel">
      <div className="uc-header">
        <Users size={16} />
        <strong>Mando Unificado</strong>
      </div>
      {institutions.length === 0 ? (
        <p className="uc-empty">No hay instituciones en este escenario para conformar mando unificado.</p>
      ) : (
        <>
          <p className="uc-hint">Selecciona las agencias que formarán el CU:</p>
          <div className="uc-agency-selector">
            {institutions.map((name) => (
              <button
                key={name}
                className={`uc-agency-btn ${selected.includes(name) ? "selected" : ""}`}
                onClick={() => toggle(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <button
            className="small-button"
            disabled={selected.length < 2}
            onClick={() => dispatch({ type: "ACTIVATE_UNIFIED_COMMAND", agencies: selected })}
          >
            Activar Mando Unificado
          </button>
          {selected.length < 2 && (
            <p className="uc-hint">Selecciona al menos 2 agencias.</p>
          )}
        </>
      )}
    </div>
  );
}
