import { useState } from "react";
import type { Dispatch } from "react";
import { AlertTriangle, ArrowRightLeft, Clock, Play, Truck } from "lucide-react";
import { UnifiedCommandPanel } from "./UnifiedCommandPanel";
import type { SimulationAction, SimulationState } from "../types/sci";

interface InstructorPanelProps {
  state: SimulationState;
  dispatch: Dispatch<SimulationAction>;
}

type Tab = "injects" | "mando" | "periodos" | "recursos";

const TAB_LABELS: Record<Tab, string> = {
  injects: "Eventos",
  mando: "Mando",
  periodos: "Períodos",
  recursos: "Recursos"
};

export function InstructorPanel({ state, dispatch }: InstructorPanelProps) {
  const [tab, setTab] = useState<Tab>("injects");
  const [transferTo, setTransferTo] = useState("");

  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">Instructor</p>
        <h2>Herramientas doctrinales</h2>
      </div>

      <div className="instructor-tab-bar">
        {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
          <button
            key={t}
            className={`instructor-tab-btn ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {tab === "injects" && (
        <div className="inject-list">
          {state.scenario.injects.map((inject) => {
            const triggered = state.triggeredInjects.includes(inject.id);
            return (
              <article key={inject.id} className={`inject-card severity-${inject.severity}`}>
                <div className="inject-title">
                  <AlertTriangle size={16} />
                  <strong>{inject.title}</strong>
                </div>
                <p>{inject.description}</p>
                <div className="inject-footer">
                  <span>Min {inject.minute}</span>
                  <button
                    className="small-button"
                    onClick={() => dispatch({ type: "TRIGGER_INJECT", injectId: inject.id })}
                    disabled={triggered}
                  >
                    <Play size={14} />
                    {triggered ? "Activado" : "Activar"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {tab === "mando" && (
        <div className="instructor-tab-content">
          <div className="instructor-sub-section">
            <h3 className="instructor-sub-title">
              <ArrowRightLeft size={14} />
              Transferencia de mando
            </h3>
            <p className="instructor-hint">
              CI actual: <strong>{state.currentCommandHolder}</strong>
              {state.commandHistory.length > 0 && ` · ${state.commandHistory.length} transferencia(s)`}
            </p>
            <div className="transfer-form">
              <input
                type="text"
                className="transfer-input"
                placeholder="Nombre del nuevo CI (ej. Cap. García)"
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
              />
              <button
                className="small-button"
                disabled={!transferTo.trim()}
                onClick={() => {
                  dispatch({ type: "TRANSFER_COMMAND", toName: transferTo.trim() });
                  setTransferTo("");
                }}
              >
                Transferir mando
              </button>
            </div>
            {state.commandHistory.length > 0 && (
              <div className="command-history">
                {state.commandHistory.map((t, i) => (
                  <div key={i} className="command-history-entry">
                    <span className="log-minute">T+{t.minute}</span>
                    <span>{t.fromName} → {t.toName}</span>
                    {!t.briefingConfirmed && <span className="warn-tag">sin briefing</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="instructor-sub-section">
            <h3 className="instructor-sub-title">
              Mando unificado
            </h3>
            <UnifiedCommandPanel state={state} dispatch={dispatch} />
          </div>
        </div>
      )}

      {tab === "periodos" && (
        <div className="instructor-tab-content">
          <h3 className="instructor-sub-title">
            <Clock size={14} />
            Períodos operacionales
          </h3>
          <p className="instructor-hint">
            Período actual: <strong>{state.currentPeriod === 0 ? "Inicial" : `Período ${state.currentPeriod}`}</strong>
            {" · "}Minuto actual: <strong>{state.minute}</strong>
          </p>
          <button
            className="small-button"
            onClick={() => dispatch({ type: "START_OPERATIONAL_PERIOD" })}
          >
            Iniciar nuevo período operacional
          </button>
          {state.operationalPeriods.length > 0 && (
            <div className="period-list">
              {state.operationalPeriods.map((p) => (
                <div key={p.id} className="period-entry">
                  <strong>Período {p.number}</strong>
                  <span>Inicio: T+{p.startMinute}</span>
                  {p.endMinute !== undefined && <span>Fin: T+{p.endMinute}</span>}
                  <span>{p.objectives.length} objetivo(s) asignado(s)</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "recursos" && (
        <div className="instructor-tab-content">
          <h3 className="instructor-sub-title">
            <Truck size={14} />
            Desmovilización de recursos
          </h3>
          <div className="resource-demob-list">
            {state.resources.map((r) => (
              <div key={r.id} className="resource-demob-row">
                <div>
                  <strong>{r.name}</strong>
                  <span className={`res-badge status-${r.status}`}>{r.status}</span>
                </div>
                <button
                  className="small-button danger"
                  disabled={r.status === "desmovilizado" || r.status === "fuera_servicio"}
                  onClick={() => dispatch({ type: "DEMOBILIZE_RESOURCE", resourceId: r.id })}
                >
                  {r.status === "desmovilizado" ? "Desmovilizado" : "Desmov."}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
