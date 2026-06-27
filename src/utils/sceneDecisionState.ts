import type { SimulationState } from "../types/sci";

export interface SceneDecisionState {
  hasCommand: boolean;
  hasPerimeter: boolean;
  hasExposureLine: boolean;
  hasSectors: boolean;
  hasSafetyOfficer: boolean;
  hasSearchTeam: boolean;
  hasResourceEnRoute: boolean;
  /** 0.4 – 2.0: grows with risk/time, falls when exposure line taken */
  fireIntensity: number;
  /** 0.4 – 2.0: tied to fireIntensity, boosted by roofPropagation inject */
  smokeIntensity: number;
  roofPropagation: boolean;
  civilianRisk: boolean;
  firefighterFatigue: boolean;
  cylinderRisk: boolean;
}

export function deriveSceneDecisionState(state: SimulationState): SceneDecisionState {
  const { selectedDecisions, triggeredInjects, minute, metrics, scenario } = state;
  const has    = (id: string) => selectedDecisions.includes(id);
  const inject = (id: string) => triggeredInjects.includes(id);

  const initialRisk  = scenario.initialMetrics.risk || 56;
  const riskRatio    = metrics.risk / initialRisk;
  const timeBoost    = 1 + (minute / 80) * 0.5;
  const controlSave  = has("linea-exposicion") ? 0.35 : 0;
  const roofBoost    = inject("propagacion-techo") ? 0.25 : 0;
  // Control reduces fire visual as students gain control of the incident
  const controlDamp  = (metrics.control / 100) * 0.45;

  const fireIntensity  = Math.max(0.4, Math.min(2.0, riskRatio * timeBoost - controlSave - controlDamp + roofBoost));
  const smokeIntensity = Math.min(2.0, fireIntensity * (inject("propagacion-techo") ? 1.4 : 1.0));

  return {
    hasCommand:         has("asumir-mando"),
    hasPerimeter:       has("perimetro-evacuacion"),
    hasExposureLine:    has("linea-exposicion"),
    hasSectors:         has("sectorizar-operaciones"),
    hasSafetyOfficer:   has("oficial-seguridad"),
    hasSearchTeam:      has("busqueda-primaria"),
    hasResourceEnRoute: has("solicitar-apoyo"),
    fireIntensity,
    smokeIntensity,
    roofPropagation:    inject("propagacion-techo"),
    civilianRisk:       inject("vecinos-presionan") && !has("perimetro-evacuacion"),
    firefighterFatigue: inject("bombero-fatiga"),
    cylinderRisk:       inject("cilindros-patio"),
  };
}
