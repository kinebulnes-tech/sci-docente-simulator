import { useState } from "react";
import type { SimulationState } from "../types/sci";
import {
  buildIcs201,
  buildIcs202,
  buildIcs205,
  buildIcs207,
  buildIcs214
} from "../utils/icsForms";

interface IcsFormViewerProps {
  state: SimulationState;
}

type ICSTab = "ics201" | "ics202" | "ics205" | "ics207" | "ics214";

const ICS_LABELS: Record<ICSTab, string> = {
  ics201: "ICS 201",
  ics202: "ICS 202",
  ics205: "ICS 205",
  ics207: "ICS 207",
  ics214: "ICS 214"
};

const ICS_TITLES: Record<ICSTab, string> = {
  ics201: "Briefing Inicial",
  ics202: "Objetivos",
  ics205: "Comunicaciones",
  ics207: "Organigrama",
  ics214: "Bitácora"
};

const STATUS_ES: Record<string, string> = {
  disponible: "Disponible",
  asignado: "Asignado",
  solicitado: "En ruta",
  fuera_servicio: "Fuera de servicio",
  desmovilizado: "Desmovilizado"
};

const PRIORITY_ES: Record<string, string> = {
  vida: "Vida",
  estabilizacion: "Estabilización",
  propiedad: "Propiedad",
  ambiente: "Ambiente",
  continuidad: "Continuidad"
};

export function IcsFormViewer({ state }: IcsFormViewerProps) {
  const [tab, setTab] = useState<ICSTab>("ics201");

  const ics201 = buildIcs201(state);
  const ics202 = buildIcs202(state);
  const ics205 = buildIcs205(state);
  const ics207 = buildIcs207(state);
  const ics214 = buildIcs214(state);

  return (
    <section className="panel ics-panel">
      <div className="panel-heading">
        <p className="eyebrow">Formularios ICS</p>
        <h2>Documentación docente</h2>
      </div>
      <p className="ics-disclaimer">
        Representación pedagógica simplificada. No reemplaza formularios oficiales FEMA/NIMS.
      </p>
      <div className="ics-tab-bar">
        {(Object.keys(ICS_LABELS) as ICSTab[]).map((t) => (
          <button
            key={t}
            className={`ics-tab-btn ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {ICS_LABELS[t]}
            <span className="ics-tab-subtitle">{ICS_TITLES[t]}</span>
          </button>
        ))}
      </div>

      <div className="ics-body">
        {tab === "ics201" && (
          <div className="ics-form">
            <div className="ics-field-row">
              <span className="ics-label">Nombre del incidente</span>
              <span className="ics-value">{ics201.incidentName}</span>
            </div>
            <div className="ics-field-row">
              <span className="ics-label">Preparado por (CI)</span>
              <span className="ics-value">{ics201.preparedBy}</span>
            </div>
            <div className="ics-field-row">
              <span className="ics-label">Minuto de reporte</span>
              <span className="ics-value">T+{ics201.minute} min</span>
            </div>
            <div className="ics-section-title">Situación actual</div>
            <p className="ics-text">{ics201.situation}</p>
            <div className="ics-section-title">Objetivos</div>
            <ul className="ics-list">
              {ics201.objectives.map((o, i) => <li key={i}>{o}</li>)}
            </ul>
            <div className="ics-section-title">Acciones tomadas</div>
            {ics201.currentActions.length === 0
              ? <p className="ics-text ics-empty">Sin decisiones tomadas aún.</p>
              : <ul className="ics-list">{ics201.currentActions.map((a, i) => <li key={i}>{a}</li>)}</ul>}
            <div className="ics-section-title">Recursos en escena</div>
            <table className="ics-table">
              <thead><tr><th>Recurso</th><th>Estado</th><th>Capacidades</th></tr></thead>
              <tbody>
                {ics201.resources.map((r, i) => (
                  <tr key={i}>
                    <td>{r.name}</td>
                    <td><span className={`res-badge status-${r.status}`}>{STATUS_ES[r.status] ?? r.status}</span></td>
                    <td>{r.capabilities}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "ics202" && (
          <div className="ics-form">
            <div className="ics-field-row">
              <span className="ics-label">Período operacional</span>
              <span className="ics-value">{ics202.operationalPeriod === 0 ? "Inicial" : `Período ${ics202.operationalPeriod}`}</span>
            </div>
            <div className="ics-section-title">Objetivos del incidente</div>
            <div className="ics-objective-list">
              {ics202.objectives.map((o, i) => (
                <div key={i} className={`ics-objective-row ${o.completed ? "completed" : ""}`}>
                  <span className="ics-obj-priority">{PRIORITY_ES[o.priority] ?? o.priority}</span>
                  <span className="ics-obj-text">{o.text}</span>
                  <span className="ics-obj-status">{o.completed ? "✓ Completado" : "Pendiente"}</span>
                </div>
              ))}
            </div>
            <div className="ics-section-title">Énfasis de mando</div>
            <p className="ics-text">{ics202.commandEmphasis}</p>
          </div>
        )}

        {tab === "ics205" && (
          <div className="ics-form">
            <div className="ics-field-row">
              <span className="ics-label">Período operacional</span>
              <span className="ics-value">{ics205.operationalPeriod === 0 ? "Inicial" : `Período ${ics205.operationalPeriod}`}</span>
            </div>
            <div className="ics-section-title">Asignación de canales</div>
            <table className="ics-table">
              <thead><tr><th>Función</th><th>Canal</th><th>Observaciones</th></tr></thead>
              <tbody>
                {ics205.channelAssignments.map((ch, i) => (
                  <tr key={i}><td>{ch.function}</td><td>{ch.channel}</td><td>{ch.remarks}</td></tr>
                ))}
              </tbody>
            </table>
            <div className="ics-section-title">Decisiones de comunicaciones tomadas</div>
            {ics205.communicationsDecisions.length === 0
              ? <p className="ics-text ics-empty">Aún no se han tomado decisiones de comunicaciones.</p>
              : <ul className="ics-list">{ics205.communicationsDecisions.map((d, i) => <li key={i}>{d}</li>)}</ul>}
          </div>
        )}

        {tab === "ics207" && (
          <div className="ics-form">
            <div className="ics-field-row">
              <span className="ics-label">Comandante del Incidente</span>
              <span className="ics-value">{ics207.commandHolder}</span>
            </div>
            {ics207.unifiedCommand && (
              <div className="ics-field-row">
                <span className="ics-label">Mando Unificado</span>
                <span className="ics-value">{ics207.unifiedCommand.join(", ")}</span>
              </div>
            )}
            {ics207.spanOfControlWarning && (
              <div className="ics-warning">⚠️ Tramo de control excedido. Revisa sectorización u organización modular.</div>
            )}
            <div className="ics-section-title">Estructura activa</div>
            <div className="ics-org-grid">
              {ics207.roles.map((r) => (
                <div key={r.id} className={`ics-org-card ${r.active ? "active" : "inactive"}`}>
                  <strong>{r.title}</strong>
                  <span>{r.function}</span>
                  {!r.active && <span className="ics-org-inactive">No activado</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "ics214" && (
          <div className="ics-form">
            <div className="ics-field-row">
              <span className="ics-label">Operador / CI</span>
              <span className="ics-value">{ics214.operatorName}</span>
            </div>
            <div className="ics-section-title">Registro de actividades</div>
            <div className="ics-log">
              {ics214.entries.map((e, i) => (
                <div key={i} className={`ics-log-entry log-type-${e.type}`}>
                  <span className="log-minute">T+{e.minute}</span>
                  <div className="log-content">
                    <strong>{e.title}</strong>
                    <p>{e.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
