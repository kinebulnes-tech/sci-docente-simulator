interface SessionLandingPanelProps {
  onLocalMode: () => void;
  onCreateSession: () => void;
  onJoinSession: () => void;
}

export function SessionLandingPanel({
  onLocalMode,
  onCreateSession,
  onJoinSession,
}: SessionLandingPanelProps) {
  return (
    <div className="session-landing">
      <div className="session-landing__card">
        <div className="session-landing__header">
          <p className="eyebrow">SCI Docente Simulator</p>
          <h1>Seleccionar modo de sesión</h1>
          <p className="session-landing__subtitle">
            Elige si trabajarás en modo local (un dispositivo) o en sesión conectada
            con Firebase (instructor y alumno en dispositivos separados).
          </p>
        </div>

        <div className="session-landing__options">
          <button
            type="button"
            className="session-option-btn session-option-btn--local"
            onClick={onLocalMode}
          >
            <span className="session-option-btn__icon">💻</span>
            <div>
              <strong>Modo local</strong>
              <p>Instructor y alumno en el mismo dispositivo. Sin conexión requerida.</p>
            </div>
          </button>

          <button
            type="button"
            className="session-option-btn session-option-btn--create"
            onClick={onCreateSession}
          >
            <span className="session-option-btn__icon">📡</span>
            <div>
              <strong>Crear sesión conectada</strong>
              <p>Instructor: genera un código para que el alumno se una remotamente.</p>
            </div>
          </button>

          <button
            type="button"
            className="session-option-btn session-option-btn--join"
            onClick={onJoinSession}
          >
            <span className="session-option-btn__icon">🔑</span>
            <div>
              <strong>Unirse a sesión</strong>
              <p>Alumno: ingresa el código del instructor para conectarte.</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
