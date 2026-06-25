import { Flame, MapPin, ShieldAlert, Siren, UserRoundSearch } from "lucide-react";
import type { Scenario } from "../types/sci";

interface ScenarioBoardProps {
  scenario: Scenario;
  selectedDecisions: string[];
}

function iconFor(kind: string) {
  if (kind === "fuego") return <Flame size={18} />;
  if (kind === "victima") return <UserRoundSearch size={18} />;
  if (kind === "riesgo") return <ShieldAlert size={18} />;
  if (kind === "pc") return <Siren size={18} />;
  return <MapPin size={18} />;
}

export function ScenarioBoard({ scenario, selectedDecisions }: ScenarioBoardProps) {
  const hasCommand = selectedDecisions.includes("asumir-mando");
  const hasPerimeter = selectedDecisions.includes("perimetro-evacuacion");
  const hasExposureLine = selectedDecisions.includes("linea-exposicion");

  return (
    <section className="scenario-board">
      <div className="board-toolbar">
        <div>
          <p className="eyebrow">Tablero 2.5D</p>
          <h2>Escena operacional</h2>
        </div>
        <div className="board-legend">
          <span>Fuego</span>
          <span>Riesgo</span>
          <span>Víctima</span>
          <span>PC</span>
        </div>
      </div>

      <div className="map-canvas">
        <div className="street horizontal" />
        <div className="street vertical" />
        <div className="building main-building">
          <span>Ferretería</span>
        </div>
        <div className="building exposure-building">
          <span>Exposición</span>
        </div>
        <div className={`fire-layer ${hasExposureLine ? "contained" : ""}`} />
        {hasPerimeter && <div className="perimeter-ring" />}
        {hasCommand && <div className="command-post">PC</div>}

        {scenario.hotspots.map((hotspot) => (
          <button
            key={hotspot.id}
            className={`hotspot hotspot-${hotspot.kind}`}
            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
            title={`${hotspot.label}: ${hotspot.description}`}
          >
            {iconFor(hotspot.kind)}
          </button>
        ))}
      </div>
    </section>
  );
}
