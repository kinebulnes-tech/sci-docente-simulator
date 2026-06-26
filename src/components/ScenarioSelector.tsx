import { useState } from "react";
import { scenarios } from "../data/scenarios";
import type { SessionConfig, SessionRole } from "../types/sci";
import {
  groupScenariosByDifficulty,
  sortScenariosByDifficulty,
} from "../utils/scenarioSorting";

interface ScenarioSelectorProps {
  onStart: (config: SessionConfig) => void;
}

const INCIDENT_TYPE_LABEL: Record<string, string> = {
  incendio_estructural: "Incendio estructural",
  rescate_vehicular: "Rescate vehicular",
  matpel: "Materiales peligrosos",
  forestal: "Incendio forestal",
  evacuacion: "Evacuación masiva",
  sar: "Búsqueda y rescate",
  evento_masivo: "Evento masivo",
  multiagencia: "Multiagencia",
};

const DIFFICULTY_LABEL: Record<string, string> = {
  basico: "Básico",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
  experto: "Experto",
};

const DIFFICULTY_ORDER = ["basico", "intermedio", "avanzado", "experto"];

const sorted = sortScenariosByDifficulty(scenarios);
const grouped = groupScenariosByDifficulty(sorted);

export function ScenarioSelector({ onStart }: ScenarioSelectorProps) {
  const [scenarioId, setScenarioId] = useState(sorted[0].id);
  const [role, setRole] = useState<SessionRole | null>(null);

  function handleStart() {
    if (!role) return;
    onStart({ scenarioId, role });
  }

  return (
    <div className="selector-screen">
      <header className="selector-header">
        <p className="eyebrow">SCI Trainer</p>
        <h1>Sistema de Comando de Incidentes</h1>
        <p className="selector-subtitle">
          Simulador docente interactivo · Selecciona escenario y rol para comenzar
        </p>
      </header>

      <div className="selector-body">
        <section className="selector-section">
          <h2>Escenario de ejercicio</h2>
          <div className="scenario-option-list">
            {DIFFICULTY_ORDER.filter((d) => grouped.has(d)).map((difficulty) => (
              <div key={difficulty} className="scenario-difficulty-group">
                <div className="scenario-group-header">
                  <span className={`scenario-difficulty-tag difficulty-${difficulty}`}>
                    {DIFFICULTY_LABEL[difficulty] ?? difficulty}
                  </span>
                  <span className="scenario-group-count">
                    {grouped.get(difficulty)!.length} caso
                    {grouped.get(difficulty)!.length !== 1 ? "s" : ""}
                  </span>
                </div>
                {grouped.get(difficulty)!.map((scenario) => (
                  <button
                    key={scenario.id}
                    className={`scenario-option ${scenarioId === scenario.id ? "selected" : ""}`}
                    onClick={() => setScenarioId(scenario.id)}
                  >
                    <div className="scenario-option-top">
                      <strong>{scenario.title}</strong>
                      <div className="scenario-tags">
                        <span className="scenario-type-tag">
                          {INCIDENT_TYPE_LABEL[scenario.type] ?? scenario.type}
                        </span>
                      </div>
                    </div>
                    <p>{scenario.summary}</p>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="selector-section">
          <h2>Selecciona tu rol</h2>
          <div className="role-option-list">
            <button
              className={`role-option ${role === "instructor" ? "selected" : ""}`}
              onClick={() => setRole("instructor")}
            >
              <strong>Instructor</strong>
              <p>
                Control total: inyecta eventos, controla tiempo, evalúa decisiones y ve la rúbrica
                completa.
              </p>
            </button>
            <button
              className={`role-option ${role === "alumno" ? "selected" : ""}`}
              onClick={() => setRole("alumno")}
            >
              <strong>Alumno</strong>
              <p>
                Toma de decisiones en tiempo real. La rúbrica se revela al finalizar el ejercicio.
              </p>
            </button>
          </div>
        </section>

        <button className="start-button" onClick={handleStart} disabled={!role}>
          {role ? `Comenzar como ${role}` : "Elige un rol para continuar"}
        </button>
      </div>
    </div>
  );
}
