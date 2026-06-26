import { ArrowLeft, Play, ShieldAlert, Users } from "lucide-react";
import type { Scenario } from "../types/sci";
import type { SessionRole } from "../types/sci";

const DIFFICULTY_LABEL: Record<string, string> = {
  basico: "Básico",
  intermedio: "Intermedio",
  avanzado: "Avanzado"
};

const TYPE_LABEL: Record<string, string> = {
  incendio_estructural: "Incendio estructural",
  rescate_vehicular: "Rescate vehicular",
  matpel: "Materiales peligrosos",
  forestal: "Incendio forestal",
  evacuacion: "Evacuación masiva",
  sar: "Búsqueda y rescate",
  evento_masivo: "Evento masivo",
  multiagencia: "Multiagencia"
};

interface BriefingPanelProps {
  scenario: Scenario;
  role: SessionRole;
  onStart: () => void;
  onBack: () => void;
}

export function BriefingPanel({ scenario, role, onStart, onBack }: BriefingPanelProps) {
  return (
    <div className="briefing-screen">
      <header className="briefing-screen-header">
        <button className="icon-button" onClick={onBack} title="Volver">
          <ArrowLeft size={20} />
        </button>
        <div>
          <p className="eyebrow">Briefing operacional · {role === "instructor" ? "Instructor" : "Alumno"}</p>
          <h1>{scenario.title}</h1>
        </div>
        <div className="briefing-tags">
          <span className={`scenario-difficulty-tag difficulty-${scenario.difficulty}`}>
            {DIFFICULTY_LABEL[scenario.difficulty] ?? scenario.difficulty}
          </span>
          <span className="scenario-type-tag">{TYPE_LABEL[scenario.type] ?? scenario.type}</span>
        </div>
      </header>

      <div className="briefing-screen-body">
        <section className="briefing-section">
          <h2>Situación inicial</h2>
          <p className="briefing-summary">{scenario.summary}</p>
          <p>{scenario.briefing}</p>
        </section>

        <section className="briefing-section">
          <h2>Objetivos de aprendizaje</h2>
          <ul className="briefing-list">
            {scenario.learningObjectives.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </section>

        <div className="briefing-two-col">
          <section className="briefing-section">
            <h2>
              <Users size={16} />
              Unidades disponibles ({scenario.resources.length})
            </h2>
            <ul className="briefing-list">
              {scenario.resources.map((r) => (
                <li key={r.id}>
                  <strong>{r.name}</strong>
                  {r.etaMinutes !== undefined && r.etaMinutes > 0
                    ? ` — en ruta (ETA ${r.etaMinutes} min)`
                    : " — disponible"}
                </li>
              ))}
            </ul>
          </section>

          <section className="briefing-section">
            <h2>Objetivos del ejercicio</h2>
            <ul className="briefing-list">
              {scenario.objectives.map((obj) => (
                <li key={obj.id}>{obj.text}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="briefing-alert">
          <ShieldAlert size={18} />
          <p>
            <strong>Información incompleta por diseño.</strong>{" "}
            En incidentes reales la información inicial es parcial. Actúa con lo disponible y reevalúa.
          </p>
        </div>

        <div className="briefing-actions">
          <button className="secondary-button" onClick={onBack}>
            Cambiar escenario
          </button>
          <button className="start-button briefing-start" onClick={onStart}>
            <Play size={18} />
            Iniciar simulación
          </button>
        </div>
      </div>
    </div>
  );
}
