import type { Scenario } from "../../types/sci";

export const commercialComplexScenario: Scenario = {
  id: "incendio-mall-comercial",
  title: "Incendio en centro comercial con focos múltiples y evacuación masiva",
  type: "incendio_estructural",
  difficulty: "avanzado",
  summary: "14:30, incendio en mall con 3 focos simultáneos reportados, 2.000 personas en interior, huida masiva, MATPEL confirmado en bodega de mantenimiento.",
  briefing: "A las 14:30 hrs se activa alarma de incendio en Mall Paseo Central. Primeras unidades informan humo denso en tres sectores: ala norte primer piso (tiendas de ropa), casino del tercer piso y bodega de mantenimiento en subterráneo. Rociadores activos parcialmente en ala norte, inoperantes en el resto. Aproximadamente 2.000 personas intentan evacuar simultáneamente por accesos principales, generando colapso de pasillos. Personal de seguridad del mall solicita apoyo pero actúa de forma descoordinada. Se confirma presencia de productos MATPEL (solventes y gases comprimidos) en bodega subterránea. Familias de evacuados se concentran en estacionamiento exterior. Medios nacionales presentes. Administración del mall ofrece planos y coordinación, pero sus canales de radio son incompatibles con los de bomberos.",
  learningObjectives: [
    "Establecer Comando Unificado con mall y otras instituciones para coordinar respuesta en incidente multiagencia complejo",
    "Gestionar operaciones en múltiples sectores simultáneos con cadena de mando clara y alcance de control efectivo",
    "Coordinar evacuación masiva, triage prehospitalario y atención a población afectada bajo presión mediática",
    "Integrar gestión de amenaza MATPEL secundaria sin comprometer prioridad de rescate y control de incendio"
  ],
  doctrinalForms: ["ICS 201", "ICS 202", "ICS 205", "ICS 207"],
  criticalErrors: ["comando-unificado", "sector-matpel"],
  initialMetrics: {
    risk: 78, control: 22, coordination: 20, lifeSafety: 35, propertyConservation: 25, complexity: 80
  },
  objectives: [
    {
      id: "vida-mall",
      text: "Evacuar a las 2.000 personas del interior del mall y atender a lesionados con triage organizado.",
      priority: "vida",
      completedByDecisionIds: ["asumir-mando-mall", "comando-unificado", "sector-evacuacion", "triage-externo", "activar-enlace-mall"]
    },
    {
      id: "estabilizar-focos",
      text: "Controlar y extinguir los tres focos de incendio evitando su integración en un solo incendio general.",
      priority: "estabilizacion",
      completedByDecisionIds: ["objetivos-mall", "sector-norte", "sector-casino", "sectorizar-mall", "solicitar-refuerzos"]
    },
    {
      id: "matpel-contencion",
      text: "Identificar, aislar y mitigar la amenaza MATPEL en bodega subterránea sin exposición de personal no equipado.",
      priority: "propiedad",
      completedByDecisionIds: ["sector-matpel", "oficial-seguridad-mall", "solicitar-refuerzos", "pai-mall"]
    },
    {
      id: "continuidad-coordinacion",
      text: "Mantener coordinación multiagencia, comunicaciones efectivas y documentación formal del incidente durante toda la operación.",
      priority: "continuidad",
      completedByDecisionIds: ["plan-comunicaciones-mall", "comando-unificado", "info-publica-mall", "pai-mall", "registro-recursos-mall"]
    }
  ],
  resources: [
    { id: "b1-mall", name: "B-1 Primera respuesta", type: "unidad", status: "disponible", capabilities: ["agua", "ataque inicial", "busqueda"] },
    { id: "r1-mall", name: "R-1 Rescate", type: "unidad", status: "disponible", capabilities: ["rescate estructural", "entrada forzada", "busqueda primaria"] },
    { id: "matpel-unidad", name: "Unidad MATPEL", type: "unidad", status: "solicitado", etaMinutes: 12, capabilities: ["identificacion materiales peligrosos", "contencion quimica", "EPP nivel A"] },
    { id: "b4-abastecimiento", name: "B-4 Abastecimiento", type: "unidad", status: "solicitado", etaMinutes: 8, capabilities: ["agua", "abastecimiento", "relevo"] },
    { id: "b5-refuerzo", name: "B-5 Refuerzo", type: "unidad", status: "solicitado", etaMinutes: 14, capabilities: ["agua", "ataque", "busqueda"] },
    { id: "carabineros-mall", name: "Carabineros", type: "institucion", status: "solicitado", etaMinutes: 5, capabilities: ["perimetro externo", "control multitud", "transito"] },
    { id: "samu-mall", name: "SAMU", type: "institucion", status: "solicitado", etaMinutes: 8, capabilities: ["triage masivo", "atencion prehospitalaria", "traslado critico"] },
    { id: "onemi-mall", name: "SENAPRED", type: "institucion", status: "solicitado", etaMinutes: 20, capabilities: ["coordinacion multiagencia", "albergue", "apoyo social"] },
    { id: "admin-mall", name: "Administración Mall", type: "institucion", status: "disponible", capabilities: ["planos edificio", "sistemas contra incendio", "personal interno"] },
    { id: "pc-mall", name: "Puesto de Comando Unificado", type: "instalacion", status: "disponible", capabilities: ["mando", "coordinacion multiagencia", "registro", "comunicaciones"] }
  ],
  hotspots: [
    { id: "foco-norte", label: "Foco ala norte piso 1", x: 22, y: 55, kind: "fuego", description: "Tiendas de ropa en llamas con carga combustible alta. Rociadores activos parcialmente." },
    { id: "foco-casino", label: "Foco casino piso 3", x: 58, y: 28, kind: "fuego", description: "Incendio en casino con grasa y materiales de cocina. Sin rociadores activos." },
    { id: "foco-subterraneo", label: "Foco bodega subterránea", x: 48, y: 78, kind: "fuego", description: "Incendio en bodega de mantenimiento con MATPEL. Acceso restringido sin EPP adecuado." },
    { id: "matpel-zona", label: "Zona MATPEL confirmada", x: 52, y: 82, kind: "riesgo", description: "Solventes y gases comprimidos expuestos a calor. Riesgo de BLEVE y gases tóxicos." },
    { id: "triage-punto", label: "Zona de triage", x: 15, y: 30, kind: "victima", description: "Estacionamiento exterior con evacuados, varios con humo inhalado y trauma por caídas." },
    { id: "pc-unificado", label: "PC Unificado sugerido", x: 10, y: 15, kind: "pc", description: "Posición exterior con visión de accesos principales y cobertura de comunicaciones." }
  ],
  injects: [
    {
      id: "colapso-salida",
      minute: 5,
      title: "Colapso de salida norte por estampida",
      description: "Acceso norte colapsado por avalancha humana. Tres personas con trauma reportadas en la puerta. Acceso de bomberos bloqueado.",
      severity: "critica",
      metricImpact: { risk: 15, lifeSafety: -15, control: -10, complexity: 10 },
      expectedResponses: ["sector-evacuacion", "triage-externo", "activar-enlace-mall", "asumir-mando-mall"]
    },
    {
      id: "focos-se-unen",
      minute: 12,
      title: "Riesgo de integración de focos norte y casino",
      description: "Servicio de detección informa propagación por ductos hacia piso 2 central. Focos norte y casino podrían unirse en 8 a 10 minutos.",
      severity: "alta",
      metricImpact: { risk: 12, control: -10, propertyConservation: -14, complexity: 8 },
      expectedResponses: ["sector-norte", "sector-casino", "solicitar-refuerzos", "sectorizar-mall"]
    },
    {
      id: "matpel-confirmado",
      minute: 18,
      title: "MATPEL en bodega alcanza temperatura crítica",
      description: "Unidad de primer arribo informa olor a solventes y cilindros con válvulas calientes en bodega subterránea. Se retiran de inmediato.",
      severity: "critica",
      metricImpact: { risk: 18, lifeSafety: -12, control: -8, complexity: 12 },
      expectedResponses: ["sector-matpel", "oficial-seguridad-mall", "solicitar-refuerzos", "comando-unificado"]
    },
    {
      id: "medios-presionan",
      minute: 25,
      title: "Medios nacionales exigen cifras de víctimas",
      description: "Canal de televisión transmite en vivo desde perímetro. Familiar de trabajador del mall irrumpe en zona de mando exigiendo información.",
      severity: "media",
      metricImpact: { coordination: -8, complexity: 6 },
      expectedResponses: ["info-publica-mall", "activar-enlace-mall", "plan-comunicaciones-mall"]
    }
  ],
  decisions: [
    {
      id: "asumir-mando-mall",
      title: "Asumir mando y declarar SCI complejo",
      description: "Informar arribo, asumir CI, nombrar incidente, reconocer escala multi-foco y multi-institucional, emitir reporte inicial.",
      category: "mando",
      recommendedFromMinute: 0,
      recommendedUntilMinute: 4,
      metricImpact: { control: 10, coordination: 10, complexity: -5 },
      unlocks: ["objetivos-mall", "plan-comunicaciones-mall", "oficial-seguridad-mall", "comando-unificado"],
      penalizedIfRepeated: true,
      doctrineNotes: ["Mando temprano", "Cadena de mando", "Terminología común", "Escalabilidad"]
    },
    {
      id: "comando-unificado",
      title: "Establecer Comando Unificado con instituciones clave",
      description: "Integrar a Carabineros, SAMU y administración del mall al Comando Unificado con objetivos compartidos, vocería acordada y plan conjunto.",
      category: "mando",
      recommendedFromMinute: 2,
      recommendedUntilMinute: 12,
      metricImpact: { control: 14, coordination: 18, complexity: -10 },
      requires: ["asumir-mando-mall"],
      unlocks: ["sector-evacuacion", "triage-externo", "sectorizar-mall"],
      doctrineNotes: ["Comando unificado", "Coordinación multiagencia", "Cadena de mando", "Terminología común"]
    },
    {
      id: "oficial-seguridad-mall",
      title: "Designar Oficial de Seguridad para operación multi-sector",
      description: "Asignar Oficial de Seguridad con evaluación de riesgos por sector, control de acceso a zonas calientes y monitoreo de EPP en MATPEL.",
      category: "seguridad",
      recommendedFromMinute: 1,
      recommendedUntilMinute: 8,
      metricImpact: { risk: -14, lifeSafety: 12, coordination: 6 },
      requires: ["asumir-mando-mall"],
      unlocks: ["sector-matpel"],
      doctrineNotes: ["Seguridad", "Responsabilidad", "Organización modular"]
    },
    {
      id: "objetivos-mall",
      title: "Definir objetivos operacionales priorizados",
      description: "Establecer prioridades: evacuación masiva, control de tres focos, contención MATPEL y coordinación con administración del mall.",
      category: "objetivos",
      recommendedFromMinute: 2,
      recommendedUntilMinute: 8,
      metricImpact: { control: 10, coordination: 10, lifeSafety: 5 },
      requires: ["asumir-mando-mall"],
      unlocks: ["sector-norte", "sector-casino", "solicitar-refuerzos"],
      doctrineNotes: ["Manejo por objetivos", "Plan de acción del incidente", "Prioridades tácticas"]
    },
    {
      id: "sector-evacuacion",
      title: "Crear sector evacuación y designar jefe de sector",
      description: "Asignar personal a canales de salida, designar jefe de sector evacuación y coordinar con seguridad del mall para orientar flujos.",
      category: "operaciones",
      recommendedFromMinute: 3,
      recommendedUntilMinute: 12,
      metricImpact: { lifeSafety: 16, coordination: 8, risk: -5 },
      requires: ["comando-unificado"],
      doctrineNotes: ["Alcance de control", "Unidad de mando", "Operaciones", "Responsabilidad"]
    },
    {
      id: "triage-externo",
      title: "Activar área de triage y clasificación de víctimas",
      description: "Establecer zona de triage en estacionamiento exterior, coordinar con SAMU, designar responsable y clasificar por prioridad START.",
      category: "operaciones",
      recommendedFromMinute: 4,
      recommendedUntilMinute: 14,
      metricImpact: { lifeSafety: 14, coordination: 9, risk: -3 },
      requires: ["sector-evacuacion"],
      doctrineNotes: ["Operaciones", "Responsabilidad", "Manejo por objetivos"]
    },
    {
      id: "sector-norte",
      title: "Crear sector ala norte y atacar foco piso 1",
      description: "Asignar jefe de sector norte con dotación de ataque, línea de agua y objetivo de contención de foco principal.",
      category: "operaciones",
      recommendedFromMinute: 4,
      recommendedUntilMinute: 16,
      metricImpact: { control: 12, propertyConservation: 9, risk: -6 },
      requires: ["objetivos-mall"],
      doctrineNotes: ["Operaciones", "Alcance de control", "Prioridades tácticas"]
    },
    {
      id: "sector-casino",
      title: "Crear sector casino piso 3 y controlar foco secundario",
      description: "Asignar jefe de sector casino con equipo de ataque y coordinación de acceso por escalera alternativa.",
      category: "operaciones",
      recommendedFromMinute: 6,
      recommendedUntilMinute: 18,
      metricImpact: { control: 11, propertyConservation: 8, risk: -5 },
      requires: ["objetivos-mall", "sector-norte"],
      doctrineNotes: ["Operaciones", "Alcance de control", "Unidad de mando"]
    },
    {
      id: "sector-matpel",
      title: "Crear sector MATPEL y aislar bodega subterránea",
      description: "Designar jefe de sector MATPEL, establecer zona de exclusión, ordenar retiro de personal sin EPP nivel adecuado y esperar unidad especializada.",
      category: "operaciones",
      recommendedFromMinute: 8,
      recommendedUntilMinute: 20,
      metricImpact: { risk: -16, lifeSafety: 12, control: 8, complexity: -6 },
      requires: ["oficial-seguridad-mall"],
      unlocks: ["pai-mall"],
      doctrineNotes: ["Seguridad", "Operaciones", "Responsabilidad", "Manejo por objetivos"]
    },
    {
      id: "sectorizar-mall",
      title: "Formalizar estructura sectorial con ICS 207",
      description: "Completar organigrama SCI con todos los sectores activos, jefes asignados y tramos de control validados para el período operacional.",
      category: "planificacion",
      recommendedFromMinute: 10,
      recommendedUntilMinute: 22,
      metricImpact: { control: 14, coordination: 14, complexity: -12 },
      requires: ["comando-unificado", "sector-norte", "sector-evacuacion"],
      unlocks: ["pai-mall"],
      doctrineNotes: ["Organización modular", "Alcance de control", "Unidad de mando", "Planificación"]
    },
    {
      id: "plan-comunicaciones-mall",
      title: "Establecer plan de comunicaciones multiagencia",
      description: "Asignar canales diferenciados por sector, resolver incompatibilidad de radios con mall, establecer frecuencia de reportes y registrar en ICS 205.",
      category: "comunicaciones",
      recommendedFromMinute: 3,
      recommendedUntilMinute: 12,
      metricImpact: { coordination: 16, complexity: -8 },
      requires: ["asumir-mando-mall"],
      doctrineNotes: ["Comunicaciones integradas", "Terminología común", "Organización modular"]
    },
    {
      id: "solicitar-refuerzos",
      title: "Solicitar refuerzos con misión y ETA definidos",
      description: "Pedir unidades adicionales especificando sector de destino, tipo de tarea y ETA para planificación; incluir unidad MATPEL y apoyo SAMU.",
      category: "recursos",
      recommendedFromMinute: 5,
      recommendedUntilMinute: 18,
      metricImpact: { control: 10, coordination: 8, complexity: 4 },
      requires: ["objetivos-mall"],
      doctrineNotes: ["Gestión integral de recursos", "Despacho y despliegue", "Organización modular"]
    },
    {
      id: "registro-recursos-mall",
      title: "Registrar y controlar todos los recursos en operación",
      description: "Mantener control de personal por sector, estado de unidades, asignaciones y relevos. Actualizar con cada cambio de sector.",
      category: "recursos",
      recommendedFromMinute: 10,
      recommendedUntilMinute: 30,
      metricImpact: { lifeSafety: 8, coordination: 9, complexity: -6 },
      requires: ["sectorizar-mall"],
      doctrineNotes: ["Responsabilidad", "Gestión integral de recursos", "Organización modular"]
    },
    {
      id: "activar-enlace-mall",
      title: "Activar enlace formal con todas las instituciones",
      description: "Designar Oficial de Enlace, establecer contacto con Carabineros, SAMU, SENAPRED, administración mall y municipio. Resolver interoperabilidad.",
      category: "enlace",
      recommendedFromMinute: 6,
      metricImpact: { coordination: 14, lifeSafety: 5, complexity: -5 },
      requires: ["comando-unificado"],
      doctrineNotes: ["Enlace", "Coordinación multiagencia", "Comando unificado"]
    },
    {
      id: "info-publica-mall",
      title: "Designar vocería unificada y gestionar comunicación pública",
      description: "Asignar Oficial de Información Pública del Comando Unificado. Una sola voz institucional para medios y familiares. Acordar mensajes con mall.",
      category: "enlace",
      recommendedFromMinute: 10,
      metricImpact: { coordination: 9, complexity: -5, lifeSafety: 3 },
      requires: ["comando-unificado"],
      doctrineNotes: ["Información pública", "Gestión de información", "Comando unificado"]
    },
    {
      id: "pai-mall",
      title: "Formalizar PAI para incidente complejo multi-sector",
      description: "Registrar objetivos del período, estructura sectorial, comunicaciones, seguridad, recursos y amenaza MATPEL en formularios ICS 201 a 207.",
      category: "planificacion",
      recommendedFromMinute: 18,
      metricImpact: { control: 12, coordination: 14, complexity: -10 },
      requires: ["objetivos-mall", "plan-comunicaciones-mall", "sectorizar-mall", "sector-matpel"],
      doctrineNotes: ["Plan de acción del incidente", "Planificación", "Manejo por objetivos", "Organización modular"]
    }
  ],
  rubric: [
    { id: "r-mando-mall", title: "Establece mando y Comando Unificado efectivo", category: "mando", maxPoints: 20, evidenceDecisionIds: ["asumir-mando-mall", "comando-unificado", "objetivos-mall"], failCondition: "No establece Comando Unificado antes del minuto 15" },
    { id: "r-seguridad-mall", title: "Gestiona seguridad con amenaza MATPEL activa", category: "seguridad", maxPoints: 20, evidenceDecisionIds: ["oficial-seguridad-mall", "sector-matpel", "registro-recursos-mall"], failCondition: "No crea sector MATPEL o envía personal sin EPP adecuado" },
    { id: "r-operaciones-mall", title: "Controla múltiples sectores simultáneos con estructura clara", category: "operaciones", maxPoints: 20, evidenceDecisionIds: ["sector-norte", "sector-casino", "sector-evacuacion", "triage-externo", "sectorizar-mall"] },
    { id: "r-comunicaciones-mall", title: "Establece comunicaciones multiagencia e interoperables", category: "comunicaciones", maxPoints: 15, evidenceDecisionIds: ["plan-comunicaciones-mall", "activar-enlace-mall", "info-publica-mall"] },
    { id: "r-recursos-mall", title: "Solicita y controla recursos de incidente complejo", category: "recursos", maxPoints: 10, evidenceDecisionIds: ["solicitar-refuerzos", "registro-recursos-mall"] },
    { id: "r-planificacion-mall", title: "Formaliza estructura y PAI para incidente avanzado", category: "planificacion", maxPoints: 15, evidenceDecisionIds: ["sectorizar-mall", "pai-mall"] }
  ]
};
