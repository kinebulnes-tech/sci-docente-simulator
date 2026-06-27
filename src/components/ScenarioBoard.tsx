import { lazy, Suspense, useEffect, useState } from "react";
import { Flame, MapPin, ShieldAlert, Siren, UserRoundSearch } from "lucide-react";
import type { SimulationState } from "../types/sci";
import type { QualityMode } from "../utils/sceneQuality";
import { detectQualityMode } from "../utils/sceneQuality";
import { SceneHUD } from "./scene3d/SceneHUD";
import { WebGLFallback } from "./scene3d/WebGLFallback";
import { Scene3DControls } from "./scene3d/Scene3DControls";
import type { Scene3DState } from "./scene3d/Scene3DControls";

const Scene3D = lazy(() =>
  import("./scene3d/Scene3D").then((m) => ({ default: m.Scene3D }))
);

interface ScenarioBoardProps {
  state: SimulationState;
  /** When true, auto-switches to 3D view and hides the 2D/3D toggle. */
  immersive?: boolean;
}

function iconFor(kind: string) {
  if (kind === "fuego")   return <Flame size={18} />;
  if (kind === "victima") return <UserRoundSearch size={18} />;
  if (kind === "riesgo")  return <ShieldAlert size={18} />;
  if (kind === "pc")      return <Siren size={18} />;
  return <MapPin size={18} />;
}

export function ScenarioBoard({ state, immersive = false }: ScenarioBoardProps) {
  const [view, setView] = useState<"2d" | "3d">(immersive ? "3d" : "2d");

  useEffect(() => {
    if (immersive) setView("3d");
  }, [immersive]);
  const [resetSignal, setResetSignal] = useState(0);
  const [scene3d, setScene3d] = useState<Scene3DState>({
    showGrid: true,
    showLabels: true,
    showZones: true,
    animated: true,
    quality: detectQualityMode(),
    cameraPreset: "general",
  });

  const { scenario, selectedDecisions } = state;
  const hasCommand      = selectedDecisions.includes("asumir-mando");
  const hasPerimeter    = selectedDecisions.includes("perimetro-evacuacion");
  const hasExposureLine = selectedDecisions.includes("linea-exposicion");

  function toggle(key: keyof Scene3DState) {
    setScene3d((s) => ({ ...s, [key]: !s[key] }));
  }

  function handleReset() {
    setScene3d((s) => ({ ...s, cameraPreset: "general" }));
    setResetSignal((n) => n + 1);
  }

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
          {!immersive && (
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
          )}
        </div>
      </div>

      {view === "3d" && (
        <Scene3DControls
          state={scene3d}
          onToggleGrid={() => toggle("showGrid")}
          onToggleLabels={() => toggle("showLabels")}
          onToggleZones={() => toggle("showZones")}
          onToggleAnimated={() => toggle("animated")}
          onQualityChange={(q: QualityMode) => setScene3d((s) => ({ ...s, quality: q }))}
          onPresetChange={(name: string) => setScene3d((s) => ({ ...s, cameraPreset: name }))}
          onReset={handleReset}
        />
      )}

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
        <div className="scene3d-canvas">
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
              <Scene3D
                state={state}
                resetSignal={resetSignal}
                animated={scene3d.animated}
                showGrid={scene3d.showGrid}
                showLabels={scene3d.showLabels}
                showZones={scene3d.showZones}
                quality={scene3d.quality}
                cameraPreset={scene3d.cameraPreset}
              />
            </Suspense>
          </WebGLFallback>

          <SceneHUD
            metrics={state.metrics}
            status={state.status}
            minute={state.minute}
            triggeredInjects={state.triggeredInjects}
          />
        </div>
      )}
    </section>
  );
}
