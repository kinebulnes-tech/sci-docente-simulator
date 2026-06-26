import type { FirebaseSession } from "../../types/firebaseSession";
import type { SessionPersistenceAdapter } from "../../services/sessionAdapter";
import { formatJoinCode } from "../../utils/joinCode";

interface SessionStatusBarProps {
  session: FirebaseSession;
  adapter: SessionPersistenceAdapter;
  currentUid: string;
}

const STATUS_LABELS: Record<FirebaseSession["status"], string> = {
  waiting:   "Esperando",
  active:    "Activa",
  completed: "Completada",
  closed:    "Cerrada",
};

export function SessionStatusBar({ session, adapter, currentUid }: SessionStatusBarProps) {
  const isInstructor = session.instructorUid === currentUid;
  const adapterLabel = adapter.mode === "firebase" ? "Firebase" : "Local";

  return (
    <div className="session-status-bar">
      <span className="session-status-bar__code">
        Código: <strong>{formatJoinCode(session.joinCode)}</strong>
      </span>

      <span className="session-status-bar__scenario">
        {session.scenarioName}
      </span>

      <span
        className={`session-status-bar__status session-status-bar__status--${session.status}`}
      >
        {STATUS_LABELS[session.status]}
      </span>

      <span className="session-status-bar__role">
        {isInstructor ? "Instructor" : "Alumno"}
      </span>

      <span className="session-status-bar__adapter" title={`Modo adaptador: ${adapterLabel}`}>
        {adapter.mode === "firebase" ? "📡" : "💻"} {adapterLabel}
      </span>
    </div>
  );
}
