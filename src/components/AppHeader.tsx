import type { Dispatch } from "react";
import { CheckCircle2, LogOut, RotateCcw, TimerReset } from "lucide-react";
import type { IncidentStatus, SessionRole, SimulationAction } from "../types/sci";
import { scoreLabel } from "../utils/number";

interface AppHeaderProps {
  title: string;
  minute: number;
  status: IncidentStatus;
  globalScore: number;
  role: SessionRole;
  isCompleted: boolean;
  dispatch: Dispatch<SimulationAction>;
  onComplete: () => void;
  onReset: () => void;
  onExit: () => void;
}

const STATUS_LABEL: Record<IncidentStatus, string> = {
  estable: "Estable",
  dinamico: "Dinámico",
  critico: "Crítico",
  controlado: "Controlado"
};

const ROLE_LABEL: Record<SessionRole, string> = {
  instructor: "Instructor",
  alumno: "Alumno"
};

export function AppHeader({
  title,
  minute,
  status,
  globalScore,
  role,
  isCompleted,
  dispatch,
  onComplete,
  onReset,
  onExit
}: AppHeaderProps) {
  function handleReset() {
    if (!window.confirm("¿Reiniciar la simulación? Se perderá el progreso guardado.")) return;
    onReset();
  }

  function handleComplete() {
    if (!window.confirm("¿Finalizar el ejercicio? Se revelará la rúbrica de evaluación.")) return;
    onComplete();
  }

  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">
          SCI Trainer ·{" "}
          <span className={`role-badge role-badge--${role}`}>{ROLE_LABEL[role]}</span>
        </p>
        <h1>{title}</h1>
      </div>

      <div className="header-actions">
        <div className={`status-pill status-${status}`}>{STATUS_LABEL[status]}</div>

        <div className="score-pill">
          <span>{globalScore}%</span>
          <small>{scoreLabel(globalScore)}</small>
        </div>

        <button
          className="icon-button"
          title="Avanzar 5 minutos"
          onClick={() => dispatch({ type: "ADVANCE_TIME", minutes: 5 })}
        >
          <TimerReset size={18} />
        </button>

        {role === "alumno" && !isCompleted && (
          <button className="small-button complete-button" onClick={handleComplete}>
            <CheckCircle2 size={14} />
            Finalizar
          </button>
        )}

        <button className="icon-button" title="Reiniciar simulación" onClick={handleReset}>
          <RotateCcw size={18} />
        </button>

        <button className="icon-button" title="Salir al menú" onClick={onExit}>
          <LogOut size={18} />
        </button>

        <div className="minute-box">
          <span>Min</span>
          <strong>{minute}</strong>
        </div>
      </div>
    </header>
  );
}
