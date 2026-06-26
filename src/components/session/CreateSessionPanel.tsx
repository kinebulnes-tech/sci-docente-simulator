import { useCallback, useState } from "react";
import type { FirebaseSession } from "../../types/firebaseSession";
import type { SessionMode } from "../../types/sessionEvents";
import type { SessionPersistenceAdapter } from "../../services/sessionAdapter";
import { formatJoinCode } from "../../utils/joinCode";

interface CreateSessionPanelProps {
  adapter: SessionPersistenceAdapter;
  instructorUid: string;
  onSessionCreated: (session: FirebaseSession, scenarioId: string) => void;
  onBack: () => void;
}

const SESSION_MODES: { value: SessionMode; label: string; description: string }[] = [
  { value: "full",       label: "Completo",    description: "Todas las herramientas docentes activas." },
  { value: "teaching",  label: "Enseñanza",   description: "Modo guiado con pausas pedagógicas." },
  { value: "evaluation",label: "Evaluación",  description: "Sin pistas. Solo registra decisiones del alumno." },
  { value: "projector", label: "Proyector",   description: "Vista limpia para proyección en aula." },
];

export function CreateSessionPanel({
  adapter,
  instructorUid,
  onSessionCreated,
  onBack,
}: CreateSessionPanelProps) {
  const [instructorName, setInstructorName] = useState("");
  const [scenarioId, setScenarioId]         = useState("incendio_001");
  const [scenarioName, setScenarioName]     = useState("Incendio estructural básico");
  const [mode, setMode]                     = useState<SessionMode>("full");
  const [creating, setCreating]             = useState(false);
  const [error, setError]                   = useState<string | null>(null);
  const [created, setCreated]               = useState<FirebaseSession | null>(null);

  const handleCreate = useCallback(async () => {
    if (!instructorName.trim()) {
      setError("Ingresa tu nombre como instructor.");
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const session = await adapter.createSession({
        sessionId: crypto.randomUUID(),
        scenarioId,
        scenarioName,
        mode,
        instructorUid,
        instructorName: instructorName.trim(),
      });
      setCreated(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la sesión.");
    } finally {
      setCreating(false);
    }
  }, [adapter, instructorUid, instructorName, scenarioId, scenarioName, mode]);

  const handleContinue = useCallback(() => {
    if (created) onSessionCreated(created, scenarioId);
  }, [created, onSessionCreated, scenarioId]);

  if (created) {
    return (
      <div className="session-landing">
        <div className="session-landing__card">
          <p className="eyebrow">Sesión creada</p>
          <h2>Comparte este código con el alumno</h2>

          <div className="join-code-display">
            {formatJoinCode(created.joinCode)}
          </div>

          <p className="session-info-line">
            Modo: <strong>{SESSION_MODES.find((m) => m.value === created.mode)?.label}</strong>
            &nbsp;·&nbsp;
            Adaptador: <strong>{adapter.mode === "firebase" ? "Firebase" : "Local"}</strong>
          </p>

          <div className="session-landing__actions">
            <button type="button" className="btn btn-primary" onClick={handleContinue}>
              Continuar al escenario
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="session-landing">
      <div className="session-landing__card">
        <p className="eyebrow">Nueva sesión conectada</p>
        <h2>Configurar sesión</h2>

        <div className="form-group">
          <label htmlFor="instructor-name">Tu nombre (instructor)</label>
          <input
            id="instructor-name"
            type="text"
            className="form-input"
            placeholder="Ej. Cap. Rodríguez"
            value={instructorName}
            onChange={(e) => setInstructorName(e.target.value)}
            maxLength={60}
          />
        </div>

        <div className="form-group">
          <label htmlFor="scenario-id">Escenario</label>
          <input
            id="scenario-id"
            type="text"
            className="form-input"
            placeholder="ID del escenario"
            value={scenarioId}
            onChange={(e) => { setScenarioId(e.target.value); setScenarioName(e.target.value); }}
          />
        </div>

        <div className="form-group">
          <label>Modo de sesión</label>
          <div className="mode-selector">
            {SESSION_MODES.map((m) => (
              <button
                key={m.value}
                type="button"
                className={`mode-btn${mode === m.value ? " mode-btn--active" : ""}`}
                onClick={() => setMode(m.value)}
              >
                <strong>{m.label}</strong>
                <span>{m.description}</span>
              </button>
            ))}
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="session-landing__actions">
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            Volver
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCreate}
            disabled={creating}
          >
            {creating ? "Creando…" : "Crear sesión"}
          </button>
        </div>
      </div>
    </div>
  );
}
