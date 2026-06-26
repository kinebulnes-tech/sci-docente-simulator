import { useCallback, useState } from "react";
import type { FirebaseSession } from "../../types/firebaseSession";
import type { SessionPersistenceAdapter } from "../../services/sessionAdapter";
import { formatJoinCode, isValidJoinCode, normalizeJoinCode } from "../../utils/joinCode";

interface JoinSessionPanelProps {
  adapter: SessionPersistenceAdapter;
  studentUid: string;
  onSessionJoined: (session: FirebaseSession) => void;
  onBack: () => void;
}

export function JoinSessionPanel({
  adapter,
  studentUid,
  onSessionJoined,
  onBack,
}: JoinSessionPanelProps) {
  const [rawCode, setRawCode]       = useState("");
  const [studentName, setStudentName] = useState("");
  const [joining, setJoining]       = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g, "").slice(0, 7);
    setRawCode(raw);
    setError(null);
  }, []);

  const handleJoin = useCallback(async () => {
    const code = normalizeJoinCode(rawCode);
    if (!isValidJoinCode(code)) {
      setError("El código debe tener 6 caracteres alfanuméricos.");
      return;
    }
    if (!studentName.trim()) {
      setError("Ingresa tu nombre.");
      return;
    }
    setJoining(true);
    setError(null);
    try {
      const session = await adapter.joinSession(
        code,
        studentUid,
        "student",
        studentName.trim()
      );
      onSessionJoined(session);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo unir a la sesión. Verifica el código."
      );
    } finally {
      setJoining(false);
    }
  }, [adapter, rawCode, studentName, studentUid, onSessionJoined]);

  const displayCode = rawCode ? formatJoinCode(rawCode) : "";

  return (
    <div className="session-landing">
      <div className="session-landing__card">
        <p className="eyebrow">Unirse a sesión</p>
        <h2>Ingresar código del instructor</h2>

        <div className="form-group">
          <label htmlFor="student-name">Tu nombre</label>
          <input
            id="student-name"
            type="text"
            className="form-input"
            placeholder="Ej. Alumno García"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            maxLength={60}
          />
        </div>

        <div className="form-group">
          <label htmlFor="join-code">Código de sesión</label>
          <input
            id="join-code"
            type="text"
            className="form-input form-input--code"
            placeholder="ABC 123"
            value={displayCode}
            onChange={handleCodeChange}
            autoComplete="off"
            spellCheck={false}
          />
          <p className="form-hint">Código de 6 caracteres proporcionado por el instructor.</p>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="session-landing__actions">
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            Volver
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleJoin}
            disabled={joining || !isValidJoinCode(rawCode)}
          >
            {joining ? "Conectando…" : "Unirse"}
          </button>
        </div>
      </div>
    </div>
  );
}
