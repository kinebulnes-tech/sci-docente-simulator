import { CAMERA_PRESETS } from "../../utils/cameraPresets";
import type { QualityMode } from "../../utils/sceneQuality";
import { qualityLabel } from "../../utils/sceneQuality";

export interface Scene3DState {
  showGrid: boolean;
  showLabels: boolean;
  showZones: boolean;
  animated: boolean;
  quality: QualityMode;
  cameraPreset: string;
}

interface Scene3DControlsProps {
  state: Scene3DState;
  onToggleGrid: () => void;
  onToggleLabels: () => void;
  onToggleZones: () => void;
  onToggleAnimated: () => void;
  onQualityChange: (q: QualityMode) => void;
  onPresetChange: (name: string) => void;
  onReset: () => void;
}

const QUALITY_CYCLE: QualityMode[] = ["high", "balanced", "low"];

/** HTML toolbar rendered outside the Canvas for 3D scene layer toggles. */
export function Scene3DControls({
  state,
  onToggleGrid,
  onToggleLabels,
  onToggleZones,
  onToggleAnimated,
  onQualityChange,
  onPresetChange,
  onReset,
}: Scene3DControlsProps) {
  function cycleQuality() {
    const idx = QUALITY_CYCLE.indexOf(state.quality);
    onQualityChange(QUALITY_CYCLE[(idx + 1) % QUALITY_CYCLE.length]);
  }

  return (
    <div className="scene3d-controls">
      <div className="scene3d-controls-group">
        <span className="scene3d-controls-label">Capas</span>
        <button
          className={`scene3d-toggle-btn${state.showGrid ? " active" : ""}`}
          onClick={onToggleGrid}
          title="Mostrar/Ocultar grilla"
        >
          Grilla
        </button>
        <button
          className={`scene3d-toggle-btn${state.showLabels ? " active" : ""}`}
          onClick={onToggleLabels}
          title="Mostrar/Ocultar etiquetas"
        >
          Labels
        </button>
        <button
          className={`scene3d-toggle-btn${state.showZones ? " active" : ""}`}
          onClick={onToggleZones}
          title="Mostrar/Ocultar zonas operacionales"
        >
          Zonas
        </button>
        <button
          className={`scene3d-toggle-btn${state.animated ? " active" : ""}`}
          onClick={onToggleAnimated}
          title="Activar/Desactivar animaciones"
        >
          ✦ Anim
        </button>
      </div>

      <div className="scene3d-controls-group">
        <span className="scene3d-controls-label">Cámara</span>
        {CAMERA_PRESETS.map((p) => (
          <button
            key={p.name}
            className={`scene3d-toggle-btn${state.cameraPreset === p.name ? " active" : ""}`}
            onClick={() => onPresetChange(p.name)}
            title={`Vista ${p.label}`}
          >
            {p.label}
          </button>
        ))}
        <button
          className="scene3d-toggle-btn"
          onClick={onReset}
          title="Centrar cámara"
        >
          ⌖ Reset
        </button>
      </div>

      <div className="scene3d-controls-group">
        <span className="scene3d-controls-label">Calidad</span>
        <button
          className="scene3d-toggle-btn"
          onClick={cycleQuality}
          title="Cambiar calidad visual"
        >
          {qualityLabel(state.quality)}
        </button>
      </div>
    </div>
  );
}
