import type { Scenario } from "../../types/sci";

export const residentialBuildingScenario: Scenario = {
  id: "incendio-edificio-residencial",
  title: "Incendio nocturno en edificio residencial de cuatro pisos",
  type: "incendio_estructural",
  difficulty: "intermedio",
  summary: "A las 03:20 se reporta incendio en segundo piso de edificio de 4 pisos con 24 departamentos. Humo denso, residentes evacuando en desorden, posible persona atrapada en piso 3.",
  briefing: "A las 03:20 hrs Central despacha unidades por reporte de incendio en edificio residencial de cuatro pisos ubicado en Av. Los Pinos 842. Al arribo se observa humo denso saliendo por ventanas del segundo piso y pasillo de escalera bloqueado visualmente. Residentes en distintos estados de confusión bajan por escalera central gritando, algunos bloquean el acceso vehicular. Una vecina del piso 1 señala que su vecina del piso 3 departamento 302 no baja y tiene movilidad reducida. No hay ascensor en el edificio. Son las 03:27 hrs, dotaciones en turno reducido nocturno, fatiga acumulada posible. Media con dron en dos cuadras. No se conoce sistema de rociadores ni compartimentación real de la estructura.",
  learningObjectives: [
    "Aplicar protocolos de búsqueda y rescate en operaciones nocturnas con visibilidad reducida y dotación limitada",
    "Evaluar y gestionar el riesgo de propagación vertical en edificio de altura media sin ascensor",
    "Establecer mando, organización funcional y comunicaciones efectivas con recursos de turno nocturno",
    "Coordinar evacuación de múltiples pisos y gestionar civiles en zona caliente con apoyo interinstitucional"
  ],
  doctrinalForms: ["ICS 201", "ICS 202", "ICS 205"],
  criticalErrors: ["busqueda-piso3", "oficial-seguridad-noche"],
  initialMetrics: {
    risk: 62, control: 28, coordination: 32, lifeSafety: 38, propertyConservation: 30, complexity: 55
  },
  objectives: [
    {
      id: "vida-noche",
      text: "Localizar, rescatar y evacuar a persona con movilidad reducida en piso 3 y proteger a todos los residentes.",
      priority: "vida",
      completedByDecisionIds: ["asumir-mando-noche", "oficial-seguridad-noche", "busqueda-piso3", "evacuacion-controlada"]
    },
    {
      id: "estabilizar-vertical",
      text: "Controlar el fuego en piso 2 y evitar propagación vertical hacia pisos superiores.",
      priority: "estabilizacion",
      completedByDecisionIds: ["objetivos-noche", "ataque-piso2", "ventilacion-controlada", "sectorizar-pisos"]
    },
    {
      id: "propiedad-edificio",
      text: "Limitar daños estructurales y proteger departamentos no comprometidos.",
      priority: "propiedad",
      completedByDecisionIds: ["sectorizar-pisos", "ataque-piso2", "registro-recursos-noche"]
    },
    {
      id: "continuidad-operacion",
      text: "Mantener la capacidad operativa del turno nocturno mediante relevos, control de personal y coordinación institucional.",
      priority: "continuidad",
      completedByDecisionIds: ["plan-comunicaciones-noche", "solicitar-apoyo-noche", "activar-enlace-noche", "pai-noche"]
    }
  ],
  resources: [
    { id: "b1-noche", name: "B-1 Primera respuesta nocturna", type: "unidad", status: "disponible", capabilities: ["agua", "ataque inicial", "busqueda"] },
    { id: "r1-noche", name: "R-1 Rescate vertical", type: "unidad", status: "disponible", capabilities: ["rescate en altura", "entrada forzada", "busqueda primaria"] },
    { id: "b3-apoyo", name: "B-3 Abastecimiento", type: "unidad", status: "solicitado", etaMinutes: 9, capabilities: ["agua", "abastecimiento", "relevo dotacion"] },
    { id: "carabineros-noche", name: "Carabineros", type: "institucion", status: "solicitado", etaMinutes: 6, capabilities: ["perimetro externo", "control civiles", "transito"] },
    { id: "samu-noche", name: "SAMU", type: "institucion", status: "solicitado", etaMinutes: 11, capabilities: ["triage", "atencion prehospitalaria", "traslado critico"] },
    { id: "pc-edificio", name: "Puesto de Comando", type: "instalacion", status: "disponible", capabilities: ["mando", "coordinacion", "registro"] }
  ],
  hotspots: [
    { id: "foco-piso2", label: "Foco piso 2", x: 52, y: 55, kind: "fuego", description: "Departamento 201 con fuego activo y humo denso en pasillo del segundo piso." },
    { id: "victima-302", label: "Persona en depto 302", x: 52, y: 38, kind: "victima", description: "Vecina con movilidad reducida reportada no evacuada en tercer piso." },
    { id: "escalera-riesgo", label: "Escalera única comprometida", x: 50, y: 48, kind: "riesgo", description: "Humo ingresando a caja de escalera, único medio de egreso vertical." },
    { id: "acceso-bloqueado", label: "Acceso bloqueado por civiles", x: 30, y: 78, kind: "riesgo", description: "Residentes confundidos bloquean entrada al edificio y vía de acceso vehicular." },
    { id: "pc-sugerido", label: "PC sugerido", x: 18, y: 25, kind: "pc", description: "Posición segura con visión fachada principal y acceso a comunicaciones." }
  ],
  injects: [
    {
      id: "humo-escalera-avanza",
      minute: 5,
      title: "Humo invade caja de escalera hasta piso 3",
      description: "Se confirma que la caja de escalera está llena de humo hasta el tercer piso. Residentes de pisos 3 y 4 quedan aislados.",
      severity: "critica",
      metricImpact: { risk: 14, lifeSafety: -12, control: -8, complexity: 8 },
      expectedResponses: ["busqueda-piso3", "ventilacion-controlada", "solicitar-apoyo-noche"]
    },
    {
      id: "media-llega",
      minute: 12,
      title: "Medios de comunicación solicitan declaración",
      description: "Periodista con dron en terreno exige información. Familiar de vecina de piso 3 grita frente a cámaras.",
      severity: "media",
      metricImpact: { coordination: -6, complexity: 5 },
      expectedResponses: ["activar-enlace-noche", "info-publica-noche", "plan-comunicaciones-noche"]
    },
    {
      id: "fatiga-dotacion",
      minute: 18,
      title: "Dotación interior reporta fatiga y baja de aire",
      description: "Equipo en piso 2 y 3 solicita relevo urgente. Un bombero con síntoma de mareo es retirado.",
      severity: "critica",
      metricImpact: { risk: 12, lifeSafety: -10, control: -6, complexity: 7 },
      expectedResponses: ["registro-recursos-noche", "oficial-seguridad-noche", "solicitar-apoyo-noche"]
    },
    {
      id: "propagacion-piso3",
      minute: 25,
      title: "Fuego se propaga hacia cielo de piso 3",
      description: "Se observa llamas asomando por ventana del piso 3, lado oriente. Riesgo de involucrar piso 4.",
      severity: "alta",
      metricImpact: { risk: 10, control: -8, propertyConservation: -12, complexity: 6 },
      expectedResponses: ["sectorizar-pisos", "ataque-piso2", "pai-noche"]
    }
  ],
  decisions: [
    {
      id: "asumir-mando-noche",
      title: "Asumir mando y declarar SCI nocturno",
      description: "Informar arribo, asumir CI, designar incidente con nombre, emitir reporte inicial y reconocer condiciones nocturnas limitantes.",
      category: "mando",
      recommendedFromMinute: 0,
      recommendedUntilMinute: 4,
      metricImpact: { control: 12, coordination: 10, complexity: -5 },
      unlocks: ["objetivos-noche", "plan-comunicaciones-noche", "oficial-seguridad-noche"],
      penalizedIfRepeated: true,
      doctrineNotes: ["Mando temprano", "Cadena de mando", "Terminología común"]
    },
    {
      id: "oficial-seguridad-noche",
      title: "Designar Oficial de Seguridad para operación nocturna",
      description: "Asignar oficial de seguridad con énfasis en control de ingreso al edificio, EPP nocturno y monitoreo de fatiga de dotación.",
      category: "seguridad",
      recommendedFromMinute: 1,
      recommendedUntilMinute: 8,
      metricImpact: { risk: -14, lifeSafety: 14, coordination: 5 },
      requires: ["asumir-mando-noche"],
      unlocks: ["busqueda-piso3", "registro-recursos-noche"],
      doctrineNotes: ["Seguridad", "Responsabilidad", "Organización modular"]
    },
    {
      id: "objetivos-noche",
      title: "Definir objetivos operacionales nocturnos",
      description: "Priorizar rescate de persona en piso 3, control de escalera, ataque al foco y evacuación ordenada con dotación reducida.",
      category: "objetivos",
      recommendedFromMinute: 1,
      recommendedUntilMinute: 8,
      metricImpact: { control: 10, coordination: 9, lifeSafety: 5 },
      requires: ["asumir-mando-noche"],
      unlocks: ["ataque-piso2", "evacuacion-controlada", "sectorizar-pisos"],
      doctrineNotes: ["Manejo por objetivos", "Plan de acción del incidente", "Prioridades tácticas"]
    },
    {
      id: "evacuacion-controlada",
      title: "Ordenar evacuación controlada y despejar acceso",
      description: "Asignar personal para guiar residentes hacia punto de reunión, despejar acceso vehicular y establecer área de apoyo.",
      category: "seguridad",
      recommendedFromMinute: 2,
      recommendedUntilMinute: 10,
      metricImpact: { lifeSafety: 12, risk: -8, coordination: 6 },
      requires: ["objetivos-noche"],
      doctrineNotes: ["Instalaciones y zonas", "Seguridad", "Responsabilidad"]
    },
    {
      id: "busqueda-piso3",
      title: "Ordenar búsqueda primaria en piso 3 con equipo asignado",
      description: "Enviar equipo de dos con comunicación continua, línea de vida, meta de búsqueda en depto 302 y respaldo confirmado.",
      category: "operaciones",
      recommendedFromMinute: 3,
      recommendedUntilMinute: 12,
      metricImpact: { lifeSafety: 18, risk: 5, control: 3 },
      requires: ["oficial-seguridad-noche"],
      doctrineNotes: ["Unidad de mando", "Operaciones", "Responsabilidad", "Seguridad"]
    },
    {
      id: "ataque-piso2",
      title: "Iniciar ataque al foco en piso 2",
      description: "Desplegar línea de ataque hacia departamento 201 con ventilación coordinada y control de avance.",
      category: "operaciones",
      recommendedFromMinute: 4,
      recommendedUntilMinute: 15,
      metricImpact: { control: 12, propertyConservation: 10, risk: -6 },
      requires: ["objetivos-noche"],
      doctrineNotes: ["Manejo por objetivos", "Operaciones", "Prioridades tácticas"]
    },
    {
      id: "plan-comunicaciones-noche",
      title: "Establecer plan de comunicaciones nocturno",
      description: "Asignar canal de mando, canal operativo y frecuencia de reportes periódicos; confirmar cobertura radial en el edificio.",
      category: "comunicaciones",
      recommendedFromMinute: 2,
      recommendedUntilMinute: 10,
      metricImpact: { coordination: 14, complexity: -7 },
      requires: ["asumir-mando-noche"],
      doctrineNotes: ["Comunicaciones integradas", "Terminología común", "Organización modular"]
    },
    {
      id: "ventilacion-controlada",
      title: "Ordenar ventilación táctica de caja de escalera",
      description: "Coordinar apertura de ventana superior o acceso a terraza para extraer humo y liberar vía de egreso vertical.",
      category: "operaciones",
      recommendedFromMinute: 5,
      recommendedUntilMinute: 18,
      metricImpact: { lifeSafety: 10, control: 7, risk: -5 },
      requires: ["ataque-piso2"],
      doctrineNotes: ["Operaciones", "Prioridades tácticas", "Seguridad"]
    },
    {
      id: "sectorizar-pisos",
      title: "Sectorizar por pisos y asignar responsables",
      description: "Crear sector piso 2 (ataque), sector piso 3 (búsqueda/rescate), sector exterior (evacuación/SAMU) con jefes de sector.",
      category: "operaciones",
      recommendedFromMinute: 7,
      recommendedUntilMinute: 20,
      metricImpact: { control: 13, coordination: 11, complexity: -9 },
      requires: ["objetivos-noche"],
      unlocks: ["pai-noche"],
      doctrineNotes: ["Organización modular", "Alcance de control", "Unidad de mando"]
    },
    {
      id: "solicitar-apoyo-noche",
      title: "Solicitar recursos adicionales nocturnos",
      description: "Pedir abastecimiento, relevo de dotación, segunda ambulancia y apoyo de Carabineros para perimetro extendido.",
      category: "recursos",
      recommendedFromMinute: 5,
      recommendedUntilMinute: 18,
      metricImpact: { control: 8, coordination: 7, complexity: 3 },
      requires: ["objetivos-noche"],
      doctrineNotes: ["Gestión integral de recursos", "Despacho y despliegue"]
    },
    {
      id: "registro-recursos-noche",
      title: "Registrar personal, turnos y estado de recursos",
      description: "Actualizar control de personal en riesgo, horas de trabajo, relevos necesarios y estado de equipos en el turno nocturno.",
      category: "recursos",
      recommendedFromMinute: 8,
      recommendedUntilMinute: 25,
      metricImpact: { lifeSafety: 8, coordination: 8, complexity: -5 },
      doctrineNotes: ["Responsabilidad", "Gestión integral de recursos", "Seguridad"]
    },
    {
      id: "activar-enlace-noche",
      title: "Activar enlace con Carabineros y municipio",
      description: "Coordinar control de acceso externo con Carabineros y notificar a municipio para apoyo social a residentes desalojados.",
      category: "enlace",
      recommendedFromMinute: 10,
      metricImpact: { coordination: 12, lifeSafety: 4, complexity: -3 },
      doctrineNotes: ["Enlace", "Coordinación multiagencia"]
    },
    {
      id: "info-publica-noche",
      title: "Designar vocería y atender medios",
      description: "Asignar oficial de información pública para dar declaración controlada a medios y contener rumores sobre víctimas.",
      category: "enlace",
      recommendedFromMinute: 12,
      metricImpact: { coordination: 7, complexity: -4 },
      doctrineNotes: ["Información pública", "Gestión de información"]
    },
    {
      id: "pai-noche",
      title: "Formalizar PAI para el período operacional nocturno",
      description: "Documentar objetivos, estructura SCI, comunicaciones, seguridad y recursos asignados para el período operacional nocturno.",
      category: "planificacion",
      recommendedFromMinute: 15,
      metricImpact: { control: 10, coordination: 12, complexity: -7 },
      requires: ["objetivos-noche", "plan-comunicaciones-noche", "sectorizar-pisos"],
      doctrineNotes: ["Plan de acción del incidente", "Planificación", "Manejo por objetivos"]
    }
  ],
  rubric: [
    { id: "r-mando-noche", title: "Establece mando oportuno y estructura nocturna", category: "mando", maxPoints: 15, evidenceDecisionIds: ["asumir-mando-noche", "objetivos-noche"] },
    { id: "r-seguridad-noche", title: "Gestiona seguridad de respondedores con fatiga nocturna", category: "seguridad", maxPoints: 20, evidenceDecisionIds: ["oficial-seguridad-noche", "evacuacion-controlada", "registro-recursos-noche"], failCondition: "No designa Oficial de Seguridad antes del minuto 10" },
    { id: "r-busqueda", title: "Ordena y controla búsqueda primaria en piso 3", category: "operaciones", maxPoints: 20, evidenceDecisionIds: ["busqueda-piso3", "ventilacion-controlada", "sectorizar-pisos"], failCondition: "No envía equipo a piso 3 antes del minuto 15" },
    { id: "r-comunicaciones-noche", title: "Establece comunicaciones efectivas en operación nocturna", category: "comunicaciones", maxPoints: 15, evidenceDecisionIds: ["plan-comunicaciones-noche", "activar-enlace-noche", "info-publica-noche"] },
    { id: "r-recursos-noche", title: "Solicita, asigna y registra recursos de turno nocturno", category: "recursos", maxPoints: 15, evidenceDecisionIds: ["solicitar-apoyo-noche", "registro-recursos-noche"] },
    { id: "r-planificacion-noche", title: "Formaliza objetivos y PAI nocturno", category: "planificacion", maxPoints: 15, evidenceDecisionIds: ["pai-noche", "objetivos-noche"] }
  ]
};
