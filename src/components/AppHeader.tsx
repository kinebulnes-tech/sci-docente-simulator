import type { Dispatch } from "react";
import { RotateCcw, TimerReset } from "lucide-react";
import type { IncidentStatus, SimulationAction } from "../types/sci";
import { scoreLabel } from "../utils/number";

interface AppHeaderProps {
  title: string;
  minute: number;
  status: IncidentStatus;
  globalScore: number;
  dispatch: Dispatch<SimulationAction>;
}

const statusCopy: Record<IncidentStatus, string> = {
  estable: "Estable",
  dinamico: "Dinámico",
  critico: "Crítico",
  controlado: "Controlado"
};

export function AppHeader({ title, minute, status, globalScore, dispatch }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">SCI Trainer</p>
        <h1>{title}</h1>
      </div>
      <div className="header-actions">
        <div className={`status-pill status-${status}`}>{statusCopy[status]}</div>
        <div className="score-pill">
          <span>{globalScore}%</span>
          <small>{scoreLabel(globalScore)}</small>
        </div>
        <button className="icon-button" title="Avanzar 5 minutos" onClick={() => dispatch({ type: "ADVANCE_TIME", minutes: 5 })}>
          <TimerReset size={18} />
        </button>
        <button className="icon-button" title="Reiniciar simulación" onClick={() => dispatch({ type: "RESET" })}>
          <RotateCcw size={18} />
        </button>
        <div className="minute-box">
          <span>Min</span>
          <strong>{minute}</strong>
        </div>
      </div>
    </header>
  );
}
