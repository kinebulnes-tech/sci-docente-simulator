import { lazy, Suspense, useState } from "react";
import { Flame, MapPin, ShieldAlert, Siren, UserRoundSearch } from "lucide-react";
import type { SimulationState } from "../types/sci";
import { WebGLFallback } from "./scene3d/WebGLFallback";

// Lazy-load Three.js bundle — only downloaded on first 3D toggle
const Scene3D = lazy(() =>
  import("./scene3d/Scene3D").then((m) => ({ default: m.Scene3D }))
);

interface ScenarioBoardProps {
  state: SimulationState;
}

function iconFor(kind: string) {
  if (kind === "fuego")   return <Flame size={18} />;
  if (kind === "victima") return <UserRoundSearch size={18} />;
  if (kind === "riesgo")  return <ShieldAlert size={18} />;
  if (kind === "pc")      return <Siren size={18} />;
  return <MapPin size={18} />;
}

export function ScenarioBoard({ state }: ScenarioBoardProps) {
  const [view, setView] = useState<"2d" | "3d">("2d");
  const { scenario, selectedDecisions } = state;

  const hasCommand      = selectedDecisions.includes("asumir-mando");
  const hasPerimeter    = selectedDecisions.includes("perimetro-evacuacion");
  const hasExposureLine = selectedDecisions.includes("linea-exposicion");

  return (
    <section className="scenario-board">
      <div className="board-toolbar">
        <div>
          <p className="eyebrow">Tablero {view === "3d" ? "3D isométrico" : "2.5D"}</p>
          <h2>Escena operacional</h2>
        </div>
        <div className="board-controls">
          <div className="board-legend">
            <span>Fuego</span>
            <span>Riesgo</span>
            <span>Víctima</span>
            <span>PC</span>
          </div>
          <div className="view-toggle">
            <button
              className={`view-toggle-btn ${view === "2d" ? "active" : ""}`}
              onClick={() => setView("2d")}
            >
              2D
            </button>
            <button
              className={`view-toggle-btn ${view === "3d" ? "active" : ""}`}
              onClick={() => setView("3d")}
            >
              3D
            </button>
          </div>
        </div>
      </div>

      {view === "2d" ? (
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
          {hasCommand   && <div className="command-post">PC</div>}
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
      ) : (
        <WebGLFallback
          fallback={
            <div className="scene3d-fallback">
              <p>Vista 3D no disponible en este dispositivo (WebGL no soportado).</p>
              <button className="small-button" onClick={() => setView("2d")}>
                Volver a vista 2D
              </button>
            </div>
          }
        >
          <Suspense
            fallback={
              <div className="scene3d-loading">
                <span>Cargando vista 3D…</span>
              </div>
            }
          >
            <Scene3D state={state} />
          </Suspense>
        </WebGLFallback>
      )}
    </section>
  );
}
