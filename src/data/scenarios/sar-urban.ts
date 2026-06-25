import type { Scenario } from "../../types/sci";

export const sarUrbanScenario: Scenario = {
  id: "busqueda-adulto-mayor-extraviado",
  title: "Búsqueda de adulto mayor con demencia extraviado en zona urbana",
  type: "sar",
  difficulty: "basico",
  summary: "Adulto mayor (78 años, demencia avanzada) no regresa al hogar desde hace 4 horas. Última vez visto en feria libre, 6 PM, barrio residencial céntrico.",
  briefing: "A las 18:00 hrs el sujeto fue visto en feria libre del sector. A las 22:00 la familia alertó a Carabineros. Se desconoce ruta tomada y no hay visibilidad del sujeto. Familia desesperada en domicilio, luz natural escasa. Punto Último Conocido (PUC) establecido en intersección de Av. Libertad con Calle 5. Carabineros dispone de unidades patrulla. Vecinos del sector colaborativos y dispuestos a apoyar.",
  learningObjectives: [
    "Aplicar metodología SAR urbana con establecimiento de Punto Último Seguro (PUS) y Punto Último Conocido (PUC)",
    "Organizar cuadrículas de búsqueda urbana asignando sectores a equipos",
    "Coordinar búsqueda integrada civil-policial-bomberos bajo mando unificado",
    "Gestionar información con familia y aplicar teoría de búsqueda básica (comportamiento de extraviados con demencia)"
  ],
  doctrinalForms: ["ICS 201", "ICS 202", "ICS 205"],
  criticalErrors: ["establecer-pus", "coordinar-carabineros"],
  initialMetrics: {
    risk: 38, control: 42, coordination: 32,
    lifeSafety: 48, propertyConservation: 60, complexity: 30
  },
  objectives: [
    { id: "localizar-sujeto", text: "Localizar al adulto mayor con vida en el menor tiempo posible.", priority: "vida", completedByDecisionIds: ["establecer-pus", "cuadricula-busqueda", "asignar-equipos-sector", "perros-busqueda"] },
    { id: "coordinar-operacion", text: "Establecer mando unificado y coordinación efectiva entre instituciones.", priority: "estabilizacion", completedByDecisionIds: ["asumir-mando-sar", "coordinar-carabineros", "plan-comunicaciones-sar", "activar-enlace-sar"] },
    { id: "gestionar-familia", text: "Mantener a la familia informada y alejada de la operación sin interferencia.", priority: "continuidad", completedByDecisionIds: ["entrevista-familia", "designar-enlace-familia", "info-publica-sar"] },
    { id: "documentar-sar", text: "Registrar sectores buscados, recursos asignados y hallazgos parciales.", priority: "continuidad", completedByDecisionIds: ["pai-sar", "registro-sectores", "registro-recursos-sar"] }
  ],
  resources: [
    { id: "b1-sar", name: "B-1 Búsqueda urbana", type: "unidad", status: "disponible", capabilities: ["búsqueda a pie", "linterna", "comunicaciones"] },
    { id: "b2-sar", name: "B-2 Apoyo logístico", type: "unidad", status: "disponible", capabilities: ["iluminación área", "comunicaciones", "primeros auxilios"] },
    { id: "carabineros-patrulla", name: "Carabineros Patrullas", type: "institucion", status: "disponible", capabilities: ["búsqueda vehicular", "control de perímetro", "radio policial"] },
    { id: "samur-sar", name: "SAMU", type: "institucion", status: "solicitado", etaMinutes: 10, capabilities: ["atención prehospitalaria", "evaluación geriátrica", "traslado"] },
    { id: "vecinos-voluntarios", name: "Vecinos colaboradores", type: "personal", status: "disponible", capabilities: ["conocimiento del sector", "apoyo visual"] },
    { id: "pc-sar", name: "Puesto de Comando SAR", type: "instalacion", status: "disponible", capabilities: ["mando", "coordinación", "mapa de cuadrículas", "registro"] }
  ],
  hotspots: [
    { id: "puc", label: "Punto Último Conocido", x: 55, y: 48, kind: "victima", description: "Intersección Av. Libertad con Calle 5, último avistamiento a las 18:00." },
    { id: "feria-libre", label: "Feria libre", x: 58, y: 44, kind: "riesgo", description: "Área de alto tránsito donde fue visto por última vez. Actualmente cerrada." },
    { id: "zona-oscura", label: "Parque sin iluminación", x: 42, y: 60, kind: "riesgo", description: "Área arbolada sin luz artificial, posible refugio nocturno." },
    { id: "domicilio-familia", label: "Domicilio familiar", x: 36, y: 35, kind: "recurso", description: "Punto de reunión con familia y origen del reporte." },
    { id: "pc-ubicacion", label: "PC SAR", x: 28, y: 30, kind: "pc", description: "Puesto de Comando con mapa del sector y acceso a comunicaciones." }
  ],
  injects: [
    { id: "testigo-feria", minute: 10, title: "Testigo en feria reporta dirección tomada", description: "Un comerciante de la feria contacta a Carabineros e indica haber visto al adulto mayor caminar hacia el parque Libertad hace 3 horas.", severity: "media", metricImpact: { lifeSafety: 8, control: 6, coordination: 4 }, expectedResponses: ["cuadricula-busqueda", "asignar-equipos-sector", "actualizar-puc"] },
    { id: "cae-la-noche", minute: 18, title: "Oscuridad total, temperatura baja", description: "Temperatura desciende a 9°C y no hay luz natural. Riesgo de hipotermia aumenta. Visibilidad reducida dificulta búsqueda a pie.", severity: "alta", metricImpact: { risk: 14, lifeSafety: -12, complexity: 8 }, expectedResponses: ["iluminacion-sector", "asignar-equipos-sector", "evaluar-recursos-adicionales"] },
    { id: "info-medica", minute: 25, title: "Familia entrega información médica crítica", description: "Hija indica que el adulto mayor usa bastón, calza zapatos café y tiende a buscar parques o plazas cuando está desorientado.", severity: "baja", metricImpact: { control: 8, lifeSafety: 6, coordination: 4 }, expectedResponses: ["actualizar-puc", "cuadricula-busqueda", "perros-busqueda"] }
  ],
  decisions: [
    { id: "asumir-mando-sar", title: "Asumir mando del operativo SAR", description: "Informar arribo, asumir CI del operativo SAR, nombrar incidente y asignar canales de comunicación.", category: "mando", recommendedFromMinute: 0, recommendedUntilMinute: 5, metricImpact: { control: 14, coordination: 12, complexity: -4 }, unlocks: ["establecer-pus", "coordinar-carabineros", "plan-comunicaciones-sar"], penalizedIfRepeated: true, doctrineNotes: ["Mando temprano", "Terminología común", "Cadena de mando"] },
    { id: "establecer-pus", title: "Establecer Punto Último Seguro (PUS)", description: "Determinar PUS y PUC en mapa, fijar límites de cuadrícula de búsqueda inicial y registrar hora.", category: "planificacion", recommendedFromMinute: 1, recommendedUntilMinute: 8, metricImpact: { control: 16, coordination: 10, lifeSafety: 10 }, requires: ["asumir-mando-sar"], unlocks: ["cuadricula-busqueda", "registro-sectores"], doctrineNotes: ["Punto Último Seguro", "Teoría de búsqueda", "Planificación SAR"] },
    { id: "entrevista-familia", title: "Entrevistar a la familia del extraviado", description: "Recopilar descripción física, ropa, hábitos, lugares conocidos, condición médica y medicamentos.", category: "planificacion", recommendedFromMinute: 2, recommendedUntilMinute: 10, metricImpact: { lifeSafety: 10, control: 8, coordination: 4 }, requires: ["asumir-mando-sar"], unlocks: ["designar-enlace-familia", "actualizar-puc"], doctrineNotes: ["Comportamiento de extraviados", "Recopilación de datos SAR"] },
    { id: "coordinar-carabineros", title: "Coordinar con Carabineros bajo mando unificado", description: "Establecer mando unificado, asignar sectores a patrullas, definir canal común y protocolos de hallazgo.", category: "enlace", recommendedFromMinute: 2, recommendedUntilMinute: 10, metricImpact: { coordination: 16, lifeSafety: 8, control: 6 }, requires: ["asumir-mando-sar"], unlocks: ["asignar-equipos-sector"], doctrineNotes: ["Mando unificado", "Enlace interinstitucional", "Comunicaciones integradas"] },
    { id: "plan-comunicaciones-sar", title: "Establecer plan de comunicaciones SAR", description: "Designar canal primario, canal de emergencias y frecuencias para Carabineros y SAMU.", category: "comunicaciones", recommendedFromMinute: 3, recommendedUntilMinute: 12, metricImpact: { coordination: 14, complexity: -6 }, requires: ["asumir-mando-sar"], doctrineNotes: ["Comunicaciones integradas", "Terminología común"] },
    { id: "cuadricula-busqueda", title: "Diseñar cuadrículas de búsqueda urbana", description: "Dividir el área de búsqueda en sectores numerados, asignar prioridades según estadísticas de comportamiento.", category: "operaciones", recommendedFromMinute: 5, recommendedUntilMinute: 15, metricImpact: { control: 14, lifeSafety: 12, coordination: 8 }, requires: ["establecer-pus"], unlocks: ["asignar-equipos-sector", "perros-busqueda"], doctrineNotes: ["Cuadrículas de búsqueda", "Probabilidad de área", "Metodología SAR"] },
    { id: "asignar-equipos-sector", title: "Asignar equipos a sectores de búsqueda", description: "Designar equipos de bomberos, carabineros y civiles a cuadrículas con instrucciones de búsqueda y reporte.", category: "operaciones", recommendedFromMinute: 6, recommendedUntilMinute: 18, metricImpact: { control: 12, lifeSafety: 14, coordination: 10 }, requires: ["cuadricula-busqueda", "coordinar-carabineros"], doctrineNotes: ["Alcance de control", "Unidad de mando", "Asignación táctica"] },
    { id: "iluminacion-sector", title: "Desplegar iluminación adicional", description: "Solicitar o desplegar equipos de iluminación en zonas críticas de búsqueda nocturna.", category: "recursos", recommendedFromMinute: 15, recommendedUntilMinute: 30, metricImpact: { lifeSafety: 8, control: 6, risk: -6 }, doctrineNotes: ["Gestión de recursos", "Seguridad operacional nocturna"] },
    { id: "perros-busqueda", title: "Solicitar unidad canina de búsqueda", description: "Requerir equipo con perros rastreadores orientados al PUC como punto de inicio.", category: "recursos", recommendedFromMinute: 10, recommendedUntilMinute: 25, metricImpact: { lifeSafety: 12, control: 8, coordination: 4 }, requires: ["cuadricula-busqueda"], doctrineNotes: ["Recursos especializados SAR", "Búsqueda canina"] },
    { id: "designar-enlace-familia", title: "Designar enlace exclusivo con la familia", description: "Asignar un integrante del equipo para comunicación continua con familiares, mantenerlos fuera de la zona operativa.", category: "enlace", recommendedFromMinute: 5, recommendedUntilMinute: 20, metricImpact: { coordination: 10, complexity: -4, lifeSafety: 4 }, requires: ["entrevista-familia"], doctrineNotes: ["Enlace", "Gestión de información", "Reducción de interferencia"] },
    { id: "actualizar-puc", title: "Actualizar PUC según nueva información", description: "Revisar y reubicar el Punto Último Conocido en mapa con nueva información de testigos o familia.", category: "planificacion", recommendedFromMinute: 10, recommendedUntilMinute: 30, metricImpact: { control: 8, lifeSafety: 10, coordination: 6 }, requires: ["establecer-pus"], doctrineNotes: ["Planificación adaptativa SAR", "Actualización continua"] },
    { id: "evaluar-recursos-adicionales", title: "Evaluar y solicitar recursos adicionales", description: "Determinar si se requieren más equipos, drones de búsqueda nocturna o ampliar perímetro.", category: "recursos", recommendedFromMinute: 20, metricImpact: { control: 8, coordination: 6, complexity: 3 }, doctrineNotes: ["Escalada de recursos", "Gestión integral de recursos"] },
    { id: "activar-enlace-sar", title: "Activar coordinación con municipio", description: "Informar al municipio para apoyo en iluminación, personal de emergencias sociales y registro.", category: "enlace", recommendedFromMinute: 12, metricImpact: { coordination: 10, lifeSafety: 4, complexity: -2 }, doctrineNotes: ["Enlace multiagencia", "Apoyo institucional"] },
    { id: "info-publica-sar", title: "Gestionar información pública", description: "Difundir alerta comunitaria controlada con descripción del extraviado y número de contacto.", category: "enlace", recommendedFromMinute: 15, metricImpact: { coordination: 8, lifeSafety: 6, complexity: -3 }, doctrineNotes: ["Información pública", "Difusión controlada"] },
    { id: "registro-sectores", title: "Registrar sectores buscados y estado", description: "Marcar en mapa de cuadrícula los sectores completados, en progreso y pendientes con hora y resultado.", category: "recursos", recommendedFromMinute: 10, metricImpact: { control: 10, coordination: 8, complexity: -5 }, requires: ["establecer-pus"], doctrineNotes: ["Responsabilidad", "Registro operacional"] },
    { id: "registro-recursos-sar", title: "Registrar personal y recursos comprometidos", description: "Actualizar estado de equipos, turnos, asignaciones y bienestar del personal en operativo SAR.", category: "recursos", recommendedFromMinute: 15, metricImpact: { lifeSafety: 6, coordination: 6, complexity: -3 }, doctrineNotes: ["Responsabilidad", "Gestión integral de recursos"] },
    { id: "pai-sar", title: "Formalizar PAI del operativo SAR", description: "Registrar objetivos de búsqueda, estructura SCI, comunicaciones, seguridad y recursos para el período operativo.", category: "planificacion", recommendedFromMinute: 15, metricImpact: { control: 10, coordination: 12, complexity: -6 }, requires: ["establecer-pus", "plan-comunicaciones-sar"], doctrineNotes: ["Plan de acción del incidente", "Planificación SAR"] }
  ],
  rubric: [
    { id: "r-mando-sar", title: "Establece mando y estructura SAR inicial", category: "mando", maxPoints: 15, evidenceDecisionIds: ["asumir-mando-sar", "coordinar-carabineros"] },
    { id: "r-metodologia", title: "Aplica metodología SAR urbana (PUS/PUC/cuadrículas)", category: "planificacion", maxPoints: 25, evidenceDecisionIds: ["establecer-pus", "cuadricula-busqueda", "actualizar-puc", "registro-sectores"] },
    { id: "r-operaciones-sar", title: "Asigna equipos y ejecuta búsqueda sistemática", category: "operaciones", maxPoints: 20, evidenceDecisionIds: ["asignar-equipos-sector", "perros-busqueda", "iluminacion-sector"] },
    { id: "r-enlace-familia", title: "Gestiona enlace con familia e instituciones", category: "enlace", maxPoints: 20, evidenceDecisionIds: ["entrevista-familia", "designar-enlace-familia", "activar-enlace-sar", "info-publica-sar"] },
    { id: "r-recursos-sar", title: "Solicita y registra recursos operativos", category: "recursos", maxPoints: 10, evidenceDecisionIds: ["evaluar-recursos-adicionales", "registro-recursos-sar"] },
    { id: "r-pai-sar", title: "Formaliza comunicaciones y PAI", category: "comunicaciones", maxPoints: 10, evidenceDecisionIds: ["plan-comunicaciones-sar", "pai-sar"] }
  ]
};
