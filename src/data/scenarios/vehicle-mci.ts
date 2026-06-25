import type { Scenario } from "../../types/sci";

export const vehicleMciScenario: Scenario = {
  id: "colision-multiple-carretera",
  title: "Accidente múltiple en carretera con múltiples víctimas",
  type: "rescate_vehicular",
  difficulty: "intermedio",
  summary: "Choque en cadena de 6 vehículos en autopista, 14 afectados, 3 atrapados, derrame menor de combustible, tránsito cortado.",
  briefing: "A las 08:32 se reporta colisión en cadena de 6 vehículos en autopista concesionada, kilómetro 47. Al arribo se confirma 14 afectados: 3 atrapados en dos vehículos con deformación severa, 5 lesionados que requieren atención y 6 ambulatorios. Derrame menor de combustible visible bajo uno de los vehículos. La autopista está cortada en ambos sentidos generando taco vehicular con riesgo de colisión secundaria. Dos unidades de rescate y una de apoyo se encuentran en ruta. SAMU activó procedimiento de IMV con 3 ambulancias en camino. Medios de comunicación ya están presentes en el perímetro externo.",
  learningObjectives: [
    "Activar y ejecutar protocolo de Incidente de Múltiples Víctimas con Triage START",
    "Organizar múltiples equipos simultáneos bajo estructura SCI con alcance de control adecuado",
    "Coordinar notificación y preparación hospitalaria para recepción de víctimas clasificadas",
    "Gestionar riesgos secundarios de derrame y tránsito en incidente de alta complejidad"
  ],
  doctrinalForms: ["ICS 201", "ICS 202", "ICS 205", "ICS 211"],
  criticalErrors: ["activar-imv", "triage-start"],
  initialMetrics: {
    risk: 60, control: 30, coordination: 28,
    lifeSafety: 35, propertyConservation: 45, complexity: 58
  },
  objectives: [
    { id: "vida-imv", text: "Clasificar y atender víctimas según prioridad preservando la vida.", priority: "vida", completedByDecisionIds: ["activar-imv", "triage-start", "atencion-rojos", "excarcelacion-atrapados"] },
    { id: "estabilizar-imv", text: "Controlar riesgos secundarios de derrame y tránsito.", priority: "estabilizacion", completedByDecisionIds: ["control-derrame", "corte-transito", "seguridad-perimetro-imv"] },
    { id: "coordinar-imv", text: "Coordinar múltiples equipos, SAMU y hospitales con estructura SCI.", priority: "continuidad", completedByDecisionIds: ["sectorizar-imv", "coordinar-hospitales", "plan-comunicaciones-imv"] },
    { id: "documentar-imv", text: "Registrar personal, víctimas y recursos para gestión del IMV.", priority: "continuidad", completedByDecisionIds: ["pai-imv", "control-personal-imv", "registro-victimas-imv"] }
  ],
  resources: [
    { id: "r1-imv", name: "R-1 Rescate (primera unidad)", type: "unidad", status: "disponible", capabilities: ["rescate vehicular", "herramientas hidraulicas", "primeros auxilios avanzados"] },
    { id: "r2-imv", name: "R-2 Rescate (segunda unidad)", type: "unidad", status: "solicitado", etaMinutes: 4, capabilities: ["rescate vehicular", "estabilizacion", "herramientas hidraulicas"] },
    { id: "apoyo-imv", name: "Unidad de Apoyo Logístico", type: "unidad", status: "solicitado", etaMinutes: 6, capabilities: ["material sanitario", "mantas", "iluminacion", "agua"] },
    { id: "samu-imv", name: "SAMU (3 ambulancias)", type: "institucion", status: "solicitado", etaMinutes: 8, capabilities: ["triage avanzado", "soporte vital basico y avanzado", "transporte hospitalario"] },
    { id: "carabineros-imv", name: "Carabineros / Autopista", type: "institucion", status: "solicitado", etaMinutes: 10, capabilities: ["transito", "desvio vehicular", "perimetro externo"] },
    { id: "pc-imv", name: "Puesto de Comando Unificado", type: "instalacion", status: "disponible", capabilities: ["mando", "coordinacion", "registro", "comunicaciones"] }
  ],
  hotspots: [
    { id: "foco-atrapados", label: "Vehículos con atrapados", x: 50, y: 42, kind: "victima", description: "Dos vehículos con 3 personas atrapadas. Deformación severa del habitáculo." },
    { id: "zona-triage", label: "Zona de triage y tratamiento", x: 70, y: 35, kind: "recurso", description: "Área despejada para clasificación START y atención inicial de víctimas." },
    { id: "derrame-comb", label: "Derrame de combustible", x: 42, y: 52, kind: "riesgo", description: "Derrame menor bajo vehículo. Riesgo de ignición si hay chispa o fuente de calor." },
    { id: "taco-vehicular", label: "Taco vehicular / colisión secundaria", x: 20, y: 65, kind: "riesgo", description: "Autopista bloqueada. Vehículos detenidos con riesgo de colisión en cadena." },
    { id: "area-media", label: "Media / Prensa", x: 15, y: 25, kind: "perimetro", description: "Medios de comunicación presentes en perímetro externo exigiendo información." },
    { id: "pc-imv-hs", label: "PC Unificado sugerido", x: 25, y: 22, kind: "pc", description: "Posición con visión de escena, acceso a radio y separada de zona de tránsito." }
  ],
  injects: [
    { id: "victima-roja-deteriora", minute: 7, title: "Víctima ROJA en paro respiratorio inminente", description: "Paramédico SAMU reporta víctima clasificada ROJA con saturación en caída y vía aérea comprometida.", severity: "critica", metricImpact: { risk: 12, lifeSafety: -14, complexity: 8 }, expectedResponses: ["atencion-rojos", "coordinar-hospitales", "triage-start"] },
    { id: "derrame-aumenta", minute: 11, title: "Derrame de combustible se expande", description: "El derrame aumenta por ruptura de línea de combustible de segundo vehículo. Olor intenso.", severity: "alta", metricImpact: { risk: 16, control: -8, propertyConservation: -10, complexity: 6 }, expectedResponses: ["control-derrame", "seguridad-perimetro-imv", "corte-transito"] },
    { id: "hospitales-saturados", minute: 15, title: "Hospital de referencia informa capacidad limitada", description: "Hospital más cercano anuncia que solo puede recibir 3 pacientes críticos. Solicitan derivación.", severity: "alta", metricImpact: { coordination: -10, complexity: 10, lifeSafety: -6 }, expectedResponses: ["coordinar-hospitales", "pai-imv", "plan-comunicaciones-imv"] },
    { id: "prensa-sobrepasa", minute: 18, title: "Periodista supera perímetro externo", description: "Un camarógrafo cruza el perímetro y filma dentro de la zona de triage, generando tensión.", severity: "baja", metricImpact: { coordination: -5, complexity: 4 }, expectedResponses: ["seguridad-perimetro-imv", "info-publica-imv"] }
  ],
  decisions: [
    { id: "asumir-mando-imv", title: "Asumir mando y declarar IMV", description: "Informar arribo, asumir CI, nombrar incidente como IMV y solicitar activación de protocolo regional.", category: "mando", recommendedFromMinute: 0, recommendedUntilMinute: 3, metricImpact: { control: 12, coordination: 10, complexity: -4 }, unlocks: ["activar-imv", "plan-comunicaciones-imv", "seguridad-perimetro-imv"], penalizedIfRepeated: true, doctrineNotes: ["Mando temprano", "Terminología común", "Escalamiento de recursos"] },
    { id: "activar-imv", title: "Activar protocolo IMV y solicitar recursos", description: "Declarar formalmente el IMV, solicitar recursos adicionales según estimación inicial de víctimas.", category: "mando", recommendedFromMinute: 1, recommendedUntilMinute: 5, metricImpact: { control: 14, coordination: 12, complexity: -6 }, requires: ["asumir-mando-imv"], unlocks: ["triage-start", "sectorizar-imv"], doctrineNotes: ["Escalamiento", "Gestión integral de recursos", "Plan de acción del incidente"] },
    { id: "triage-start", title: "Iniciar Triage START en todas las víctimas", description: "Asignar equipo de triage para clasificar las 14 víctimas en Rojo, Amarillo, Verde y Negro según protocolo START.", category: "operaciones", recommendedFromMinute: 2, recommendedUntilMinute: 10, metricImpact: { lifeSafety: 18, control: 10, coordination: 8, complexity: -8 }, requires: ["activar-imv"], unlocks: ["atencion-rojos", "registro-victimas-imv"], doctrineNotes: ["Triage START", "Prioridades tácticas", "Manejo por objetivos"] },
    { id: "sectorizar-imv", title: "Sectorizar operaciones en IMV", description: "Crear sector rescate, sector triage-tratamiento, sector tránsito y sector logístico con responsables.", category: "planificacion", recommendedFromMinute: 3, recommendedUntilMinute: 12, metricImpact: { control: 14, coordination: 12, complexity: -10 }, requires: ["activar-imv"], unlocks: ["excarcelacion-atrapados"], doctrineNotes: ["Organización modular", "Alcance de control", "Unidad de mando"] },
    { id: "seguridad-perimetro-imv", title: "Establecer perímetro y zonas de trabajo", description: "Definir zonas caliente, tibia y fría. Controlar acceso de personal y público.", category: "seguridad", recommendedFromMinute: 1, recommendedUntilMinute: 8, metricImpact: { risk: -10, lifeSafety: 8, coordination: 6 }, requires: ["asumir-mando-imv"], doctrineNotes: ["Seguridad", "Instalaciones y zonas", "Responsabilidad"] },
    { id: "corte-transito", title: "Coordinar corte total de autopista y desvíos", description: "Solicitar a Carabineros y concesionaria el corte total de autopista en ambos sentidos con desvíos señalizados.", category: "recursos", recommendedFromMinute: 2, recommendedUntilMinute: 10, metricImpact: { risk: -12, coordination: 8, lifeSafety: 6 }, requires: ["asumir-mando-imv"], doctrineNotes: ["Enlace", "Seguridad", "Gestión de tránsito"] },
    { id: "control-derrame", title: "Controlar derrame de combustible", description: "Aislar fuente, desplegar material absorbente y prohibir uso de equipo generador de chispas en el área.", category: "seguridad", recommendedFromMinute: 4, recommendedUntilMinute: 14, metricImpact: { risk: -14, control: 8, propertyConservation: 10 }, doctrineNotes: ["Seguridad", "Operaciones", "Prevención de escalamiento"] },
    { id: "atencion-rojos", title: "Priorizar atención de víctimas ROJAS", description: "Destinar paramédicos y equipo avanzado a víctimas clasificadas ROJO, estabilizar para transporte inmediato.", category: "operaciones", recommendedFromMinute: 6, recommendedUntilMinute: 18, metricImpact: { lifeSafety: 20, control: 6, complexity: -5 }, requires: ["triage-start"], doctrineNotes: ["Prioridades tácticas", "Triage", "Cadena de atención"] },
    { id: "excarcelacion-atrapados", title: "Ejecutar excarcelación de los 3 atrapados", description: "Asignar equipos diferenciados a cada vehículo con atrapado, coordinar secuencia y apoyo paramédico.", category: "operaciones", recommendedFromMinute: 8, recommendedUntilMinute: 22, metricImpact: { lifeSafety: 16, control: 10, risk: -6 }, requires: ["sectorizar-imv", "triage-start"], doctrineNotes: ["Operaciones de rescate", "Alcance de control", "Prioridades tácticas"] },
    { id: "coordinar-hospitales", title: "Notificar y coordinar hospitales receptores", description: "Informar número, clasificación y ETA de víctimas a hospitales. Distribuir carga según capacidad.", category: "comunicaciones", recommendedFromMinute: 6, recommendedUntilMinute: 18, metricImpact: { coordination: 16, lifeSafety: 12, complexity: -6 }, requires: ["triage-start"], doctrineNotes: ["Comunicaciones integradas", "Cadena de atención", "Enlace interinstitucional"] },
    { id: "plan-comunicaciones-imv", title: "Establecer plan de comunicaciones multi-agencia", description: "Definir canal de mando, canales operativos por sector y canal de enlace con SAMU y Carabineros.", category: "comunicaciones", recommendedFromMinute: 3, recommendedUntilMinute: 12, metricImpact: { coordination: 14, complexity: -8 }, requires: ["asumir-mando-imv"], doctrineNotes: ["Comunicaciones integradas", "Terminología común", "Enlace"] },
    { id: "info-publica-imv", title: "Designar vocería y manejar prensa", description: "Nombrar vocero oficial, habilitar punto de prensa fuera del perímetro y entregar comunicados periódicos.", category: "enlace", recommendedFromMinute: 10, metricImpact: { coordination: 8, complexity: -4 }, doctrineNotes: ["Información pública", "Gestión de información", "Enlace"] },
    { id: "control-personal-imv", title: "Implementar control de personal en escena", description: "Registrar ingreso y egreso de todos los respondedores. Asegurar identificación visible de roles.", category: "recursos", recommendedFromMinute: 5, metricImpact: { lifeSafety: 6, coordination: 8, complexity: -4 }, requires: ["sectorizar-imv"], doctrineNotes: ["Responsabilidad", "Seguridad", "Gestión integral de recursos"] },
    { id: "registro-victimas-imv", title: "Registrar y rotular todas las víctimas", description: "Asignar número de víctima, registrar clasificación, tratamiento y destino de cada paciente.", category: "planificacion", recommendedFromMinute: 8, metricImpact: { coordination: 10, complexity: -5 }, requires: ["triage-start"], doctrineNotes: ["Responsabilidad", "Documentación", "Cadena de custodia"] },
    { id: "pai-imv", title: "Formalizar PAI del IMV", description: "Registrar estructura SCI, objetivos por periodo, sectores, recursos y plan de comunicaciones.", category: "planificacion", recommendedFromMinute: 15, metricImpact: { control: 12, coordination: 12, complexity: -8 }, requires: ["plan-comunicaciones-imv", "sectorizar-imv"], doctrineNotes: ["Plan de acción del incidente", "Planificación", "Manejo por objetivos"] }
  ],
  rubric: [
    { id: "r-mando-imv", title: "Activa IMV y declara estructura de mando", category: "mando", maxPoints: 15, evidenceDecisionIds: ["asumir-mando-imv", "activar-imv"] },
    { id: "r-triage-imv", title: "Ejecuta Triage START completo y prioriza ROJOS", category: "operaciones", maxPoints: 25, evidenceDecisionIds: ["triage-start", "atencion-rojos", "excarcelacion-atrapados"] },
    { id: "r-seguridad-imv", title: "Controla riesgos secundarios de escena", category: "seguridad", maxPoints: 20, evidenceDecisionIds: ["seguridad-perimetro-imv", "corte-transito", "control-derrame"] },
    { id: "r-coord-imv", title: "Coordina SAMU, hospitales y agencias", category: "comunicaciones", maxPoints: 20, evidenceDecisionIds: ["coordinar-hospitales", "plan-comunicaciones-imv", "info-publica-imv"] },
    { id: "r-recursos-imv", title: "Sectoriza, controla personal y recursos", category: "recursos", maxPoints: 10, evidenceDecisionIds: ["sectorizar-imv", "control-personal-imv"] },
    { id: "r-plan-imv", title: "Documenta IMV y formaliza PAI", category: "planificacion", maxPoints: 10, evidenceDecisionIds: ["pai-imv", "registro-victimas-imv"] }
  ]
};
