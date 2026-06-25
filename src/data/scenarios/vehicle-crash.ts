import type { Scenario } from "../../types/sci";

export const vehicleCrashScenario: Scenario = {
  id: "colision-vehicular-simple",
  title: "Colisión vehicular con persona atrapada en ruta",
  type: "rescate_vehicular",
  difficulty: "basico",
  summary: "Choque frontal en ruta interurbana, 2 vehículos, 1 persona atrapada, 2 lesionados leves, sin derrames de relevancia.",
  briefing: "A las 10:15 se despacha un equipo de rescate por colisión frontal entre dos vehículos en ruta interurbana a 18 km de la ciudad. Al arribo se observa un automóvil con deformación severa de habitáculo, conductor atrapado sin respuesta verbal pero con signos de vida. Segundo vehículo con dos ocupantes ambulatorios que presentan lesiones leves. No hay control de tránsito activo, vehículos bloquean parcialmente la calzada. SAMU notificado con ETA estimado de 12 minutos. No se observan derrames de combustible significativos. El equipo actuante es la primera y única unidad en escena.",
  learningObjectives: [
    "Aplicar fundamentos de seguridad vial y zonificación en accidente de tránsito",
    "Ejecutar técnicas básicas de rescate vehicular con estabilización y excarcelación",
    "Coordinar acceso a víctima atrapada y transferencia oportuna a SAMU",
    "Establecer mando inicial y comunicar estado del incidente con terminología SCI"
  ],
  doctrinalForms: ["ICS 201", "ICS 205"],
  criticalErrors: ["estabilizar-vehiculo", "asegurar-escena-vial"],
  initialMetrics: {
    risk: 44, control: 38, coordination: 35,
    lifeSafety: 40, propertyConservation: 50, complexity: 32
  },
  objectives: [
    { id: "vida", text: "Proteger la vida de víctimas, respondedores y usuarios de la vía.", priority: "vida", completedByDecisionIds: ["asumir-mando-rv", "asegurar-escena-vial", "estabilizar-vehiculo", "acceso-victima"] },
    { id: "rescate", text: "Ejecutar excarcelación segura de persona atrapada y transferir a SAMU.", priority: "estabilizacion", completedByDecisionIds: ["estabilizar-vehiculo", "acceso-victima", "excarcelacion-controlada", "transferencia-samu"] },
    { id: "coordinar", text: "Coordinar con SAMU y Carabineros el manejo del incidente.", priority: "continuidad", completedByDecisionIds: ["coordinar-samu", "solicitar-carabineros", "plan-comunicaciones-rv"] },
    { id: "documentar", text: "Registrar acciones y preparar informe inicial del incidente.", priority: "continuidad", completedByDecisionIds: ["pai-rv", "registro-victimas"] }
  ],
  resources: [
    { id: "r1-rv", name: "R-1 Rescate (primera respuesta)", type: "unidad", status: "disponible", capabilities: ["rescate vehicular", "estabilizacion", "herramientas hidraulicas", "primeros auxilios"] },
    { id: "samu-rv", name: "SAMU", type: "institucion", status: "solicitado", etaMinutes: 12, capabilities: ["atencion prehospitalaria", "triage", "soporte vital"] },
    { id: "carabineros-rv", name: "Carabineros de Chile", type: "institucion", status: "solicitado", etaMinutes: 15, capabilities: ["transito", "perimetro externo", "seguridad publica"] },
    { id: "pc-rv", name: "Puesto de Comando", type: "instalacion", status: "disponible", capabilities: ["mando", "coordinacion", "registro"] }
  ],
  hotspots: [
    { id: "vehiculo-atrapado", label: "Vehículo con atrapado", x: 52, y: 45, kind: "victima", description: "Automóvil con deformación severa. Conductor atrapado, signos de vida presentes." },
    { id: "vehiculo-secundario", label: "Segundo vehículo", x: 65, y: 48, kind: "riesgo", description: "Vehículo con dos lesionados leves ambulatorios. Bloqueo parcial de calzada." },
    { id: "flujo-transito", label: "Tránsito sin control", x: 30, y: 70, kind: "riesgo", description: "Vehículos se aproximan a la escena sin señalización ni control activo." },
    { id: "zona-trabajo", label: "Zona de trabajo rescate", x: 52, y: 55, kind: "recurso", description: "Área donde se ejecutará la estabilización y excarcelación." },
    { id: "pc-rv-hs", label: "PC sugerido", x: 20, y: 30, kind: "pc", description: "Posición segura con visión de escena, fuera de trayectoria de colisión secundaria." }
  ],
  injects: [
    { id: "victima-deteriora", minute: 6, title: "Víctima atrapada pierde respuesta verbal", description: "La víctima atrapada deja de responder a llamados de voz. Signos vitales presentes pero disminuidos.", severity: "critica", metricImpact: { risk: 10, lifeSafety: -12, complexity: 8 }, expectedResponses: ["acceso-victima", "coordinar-samu", "excarcelacion-controlada"] },
    { id: "transito-incidente", minute: 9, title: "Vehículo a exceso de velocidad no reduce", description: "Un conductor no advierte la escena y frena de emergencia a 40 metros, quedando oblicuo en la calzada.", severity: "alta", metricImpact: { risk: 14, lifeSafety: -8, coordination: -5 }, expectedResponses: ["asegurar-escena-vial", "solicitar-carabineros", "asumir-mando-rv"] },
    { id: "lesionado-leve-agitado", minute: 14, title: "Lesionado leve intenta movilizar al atrapado", description: "Uno de los lesionados leves se acerca al vehículo e intenta sacar al conductor, arriesgando lesiones cervicales.", severity: "media", metricImpact: { risk: 8, lifeSafety: -10, coordination: -3 }, expectedResponses: ["asegurar-escena-vial", "acceso-victima", "coordinar-samu"] }
  ],
  decisions: [
    { id: "asumir-mando-rv", title: "Asumir mando y reportar estado inicial", description: "Informar arribo, asumir CI, nombrar incidente y transmitir evaluación inicial de la escena.", category: "mando", recommendedFromMinute: 0, recommendedUntilMinute: 3, metricImpact: { control: 12, coordination: 10, complexity: -4 }, unlocks: ["asegurar-escena-vial", "plan-comunicaciones-rv", "registro-victimas"], penalizedIfRepeated: true, doctrineNotes: ["Mando temprano", "Terminología común", "Cadena de mando"] },
    { id: "asegurar-escena-vial", title: "Asegurar escena vial con señalización y distanciamiento", description: "Desplegar triángulos, conos o unidad para bloquear tránsito, establecer zona caliente y señalizar aproximación.", category: "seguridad", recommendedFromMinute: 0, recommendedUntilMinute: 5, metricImpact: { risk: -14, lifeSafety: 12, coordination: 4 }, requires: ["asumir-mando-rv"], unlocks: ["estabilizar-vehiculo"], doctrineNotes: ["Seguridad", "Instalaciones y zonas", "Responsabilidad"] },
    { id: "estabilizar-vehiculo", title: "Estabilizar vehículo antes de acceso", description: "Instalar cuñas, calzar ruedas y asegurar vehículo para prevenir movimiento durante maniobras de rescate.", category: "seguridad", recommendedFromMinute: 2, recommendedUntilMinute: 8, metricImpact: { risk: -12, lifeSafety: 14, control: 6 }, requires: ["asegurar-escena-vial"], unlocks: ["acceso-victima"], doctrineNotes: ["Seguridad", "Responsabilidad", "Operaciones de rescate"] },
    { id: "acceso-victima", title: "Crear acceso seguro a víctima atrapada", description: "Retirar puerta o cristales para establecer acceso sin comprometer integridad de columna cervical.", category: "operaciones", recommendedFromMinute: 5, recommendedUntilMinute: 15, metricImpact: { lifeSafety: 16, control: 8, risk: -4 }, requires: ["estabilizar-vehiculo"], unlocks: ["excarcelacion-controlada"], doctrineNotes: ["Operaciones de rescate", "Unidad de mando", "Manejo por objetivos"] },
    { id: "excarcelacion-controlada", title: "Ejecutar excarcelación con control cervical", description: "Usar herramientas hidráulicas para liberar víctima manteniendo alineación de columna y control de hemorragias.", category: "operaciones", recommendedFromMinute: 8, recommendedUntilMinute: 20, metricImpact: { lifeSafety: 18, control: 10, risk: -6 }, requires: ["acceso-victima"], unlocks: ["transferencia-samu"], doctrineNotes: ["Operaciones de rescate", "Prioridades tácticas", "Coordinación con SEM"] },
    { id: "coordinar-samu", title: "Coordinar con SAMU estado de víctimas", description: "Transmitir número, condición y mecanismo de lesión de cada víctima para preparar recepción hospitalaria.", category: "comunicaciones", recommendedFromMinute: 2, recommendedUntilMinute: 12, metricImpact: { coordination: 14, lifeSafety: 10, complexity: -5 }, requires: ["asumir-mando-rv"], doctrineNotes: ["Comunicaciones integradas", "Enlace", "Cadena de atención"] },
    { id: "plan-comunicaciones-rv", title: "Establecer plan de comunicaciones del incidente", description: "Definir canal de mando y canal operativo, reportes periódicos de estado.", category: "comunicaciones", recommendedFromMinute: 2, recommendedUntilMinute: 10, metricImpact: { coordination: 12, complexity: -5 }, requires: ["asumir-mando-rv"], doctrineNotes: ["Comunicaciones integradas", "Terminología común"] },
    { id: "solicitar-carabineros", title: "Solicitar Carabineros para control de tránsito", description: "Requerir apoyo de Carabineros para corte de calzada, desvíos y seguridad perimetral.", category: "recursos", recommendedFromMinute: 1, recommendedUntilMinute: 10, metricImpact: { risk: -8, coordination: 8, lifeSafety: 6 }, doctrineNotes: ["Gestión integral de recursos", "Enlace", "Seguridad pública"] },
    { id: "triage-lesionados-leves", title: "Evaluar y separar lesionados leves", description: "Realizar triage primario de los dos lesionados ambulatorios, separarlos del área de trabajo y asignar vigilancia.", category: "operaciones", recommendedFromMinute: 3, recommendedUntilMinute: 12, metricImpact: { lifeSafety: 8, coordination: 5, complexity: -3 }, doctrineNotes: ["Prioridades tácticas", "Operaciones", "Manejo por objetivos"] },
    { id: "transferencia-samu", title: "Transferir víctima excarcelada a SAMU con informe", description: "Entregar víctima a paramédicos con reporte de mecanismo de lesión, signos vitales y tratamiento aplicado.", category: "operaciones", recommendedFromMinute: 15, metricImpact: { lifeSafety: 14, coordination: 10, complexity: -4 }, requires: ["excarcelacion-controlada", "coordinar-samu"], doctrineNotes: ["Coordinación con SEM", "Cadena de atención", "Responsabilidad"] },
    { id: "registro-victimas", title: "Registrar datos de todas las víctimas", description: "Documentar identidad, condición y destino de cada víctima para informe de incidente.", category: "planificacion", recommendedFromMinute: 10, metricImpact: { coordination: 8, complexity: -3 }, requires: ["asumir-mando-rv"], doctrineNotes: ["Responsabilidad", "Gestión de información", "Documentación"] },
    { id: "pai-rv", title: "Formalizar PAI inicial del incidente vial", description: "Registrar objetivos, estructura, recursos asignados y comunicaciones para el periodo operacional.", category: "planificacion", recommendedFromMinute: 12, metricImpact: { control: 10, coordination: 10, complexity: -6 }, requires: ["plan-comunicaciones-rv", "asumir-mando-rv"], doctrineNotes: ["Plan de acción del incidente", "Planificación", "Manejo por objetivos"] }
  ],
  rubric: [
    { id: "r-mando-rv", title: "Establece mando y comunicación inicial efectiva", category: "mando", maxPoints: 15, evidenceDecisionIds: ["asumir-mando-rv", "plan-comunicaciones-rv"] },
    { id: "r-seguridad-rv", title: "Asegura escena vial y estabiliza vehículo", category: "seguridad", maxPoints: 20, evidenceDecisionIds: ["asegurar-escena-vial", "estabilizar-vehiculo"] },
    { id: "r-rescate-rv", title: "Ejecuta acceso y excarcelación con técnica correcta", category: "operaciones", maxPoints: 25, evidenceDecisionIds: ["acceso-victima", "excarcelacion-controlada", "transferencia-samu"] },
    { id: "r-coord-rv", title: "Coordina con SAMU y Carabineros oportunamente", category: "comunicaciones", maxPoints: 20, evidenceDecisionIds: ["coordinar-samu", "solicitar-carabineros"] },
    { id: "r-recursos-rv", title: "Gestiona recursos y lesionados leves", category: "recursos", maxPoints: 10, evidenceDecisionIds: ["triage-lesionados-leves", "registro-victimas"] },
    { id: "r-planificacion-rv", title: "Documenta y formaliza objetivos del incidente", category: "planificacion", maxPoints: 10, evidenceDecisionIds: ["pai-rv", "registro-victimas"] }
  ]
};
