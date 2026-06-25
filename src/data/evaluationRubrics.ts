import type { EvaluationCriterion } from "../types/evaluation";

/**
 * Criterios configurables por ejercicio.
 * No representan doctrina absoluta — el instructor puede ajustar
 * maxPoints, maxTime, critical y expectedActionTypes por sesión.
 */
export const DEFAULT_EVALUATION_RUBRIC: EvaluationCriterion[] = [
  {
    id: "ev-mando",
    label: "Establecimiento de mando",
    description: "El CI asume mando explícito al inicio del incidente.",
    category: "mando",
    maxPoints: 15,
    required: true,
    critical: true,
    expectedActionTypes: ["apply_decision"],
    maxTime: 10
  },
  {
    id: "ev-seguridad",
    label: "Evaluación de seguridad de escena",
    description: "Se identifica y comunica si la escena es segura para los respondedores.",
    category: "seguridad_escena",
    maxPoints: 15,
    required: true,
    critical: true,
    expectedActionTypes: ["apply_decision"]
  },
  {
    id: "ev-evaluacion",
    label: "Evaluación inicial del incidente",
    description: "Se evalúan dimensiones, víctimas y riesgos en la etapa de llegada.",
    category: "evaluacion_inicial",
    maxPoints: 10,
    required: true,
    critical: false,
    expectedActionTypes: ["apply_decision"],
    maxTime: 15
  },
  {
    id: "ev-recursos",
    label: "Solicitud de recursos proporcional",
    description: "Se solicitan recursos acordes a la magnitud del incidente.",
    category: "solicitud_recursos",
    maxPoints: 15,
    required: false,
    critical: false,
    expectedActionTypes: ["apply_decision"]
  },
  {
    id: "ev-comunicaciones",
    label: "Comunicaciones integradas",
    description: "Se mantiene canal de comunicación claro entre sectores.",
    category: "comunicaciones",
    maxPoints: 10,
    required: false,
    critical: false,
    expectedActionTypes: ["apply_decision", "transfer_command"]
  },
  {
    id: "ev-sectorizacion",
    label: "Sectorización del incidente",
    description: "Se definen sectores operacionales y se asignan responsables.",
    category: "sectorizacion",
    maxPoints: 10,
    required: false,
    critical: false,
    expectedActionTypes: ["apply_decision"]
  },
  {
    id: "ev-periodos",
    label: "Gestión de períodos operacionales",
    description: "Se inician períodos operacionales con objetivos definidos.",
    category: "control_incidente",
    maxPoints: 10,
    required: false,
    critical: false,
    expectedActionTypes: ["start_operational_period"]
  },
  {
    id: "ev-desmovilizacion",
    label: "Desmovilización oportuna",
    description: "Se desmoviliza al menos un recurso al concluir operaciones.",
    category: "desmovilizacion",
    maxPoints: 10,
    required: false,
    critical: false,
    expectedActionTypes: ["demobilize_resource"]
  },
  {
    id: "ev-reevaluacion",
    label: "Reevaluación y adaptación",
    description: "Se revisan y ajustan las acciones ante cambios en el incidente.",
    category: "reevaluacion",
    maxPoints: 5,
    required: false,
    critical: false,
    expectedActionTypes: ["apply_decision"]
  }
];
