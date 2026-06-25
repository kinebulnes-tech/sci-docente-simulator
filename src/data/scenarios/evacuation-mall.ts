import type { Scenario } from "../../types/sci";

export const evacuationMallScenario: Scenario = {
  id: "evacuacion-amenaza-bomba-mall",
  title: "Evacuación por amenaza de bomba en centro comercial durante fin de semana",
  type: "evacuacion",
  difficulty: "intermedio",
  summary: "Amenaza de bomba recibida vía teléfono en mall, domingo a las 16:00, 2.200 personas en interior, múltiples salidas, pánico incipiente.",
  briefing: "El centro comercial recibe una llamada telefónica con amenaza de bomba. Son las 16:00 del domingo, el mall se encuentra en su horario de mayor afluencia con aproximadamente 2.200 personas. El protocolo de seguridad del mall se activó pero el personal civil está generando mensajes contradictorios. La policía está al mando de la investigación y requiere coordinación SCI. La unidad K-9 antiexplosivos tarda 25 minutos en llegar. Hay indicios de una amenaza secundaria: posible dispositivo en una de las salidas de emergencia. Medios de comunicación ya se encuentran en el exterior del perímetro. La evaluación inicial indica que la amenaza es creíble y debe tomarse en serio.",
  learningObjectives: [
    "Coordinar evacuación masiva y ordenada de recinto con alta afluencia de público",
    "Coordinar con policía la búsqueda sistemática del recinto ante amenaza de artefacto",
    "Controlar rumores y gestionar comunicación interna durante la emergencia",
    "Realizar transferencia de mando operacional a unidades especializadas de policía"
  ],
  doctrinalForms: ["ICS 201", "ICS 202", "ICS 205", "ICS 206"],
  criticalErrors: ["busqueda-sistematica-mall", "evaluar-amenaza-salida"],
  initialMetrics: {
    risk: 62, control: 28, coordination: 32,
    lifeSafety: 38, propertyConservation: 48, complexity: 62
  },
  objectives: [
    {
      id: "evacuacion-masiva-ordenada",
      text: "Evacuar a las 2.200 personas del recinto de forma ordenada sin generar pánico.",
      priority: "vida",
      completedByDecisionIds: ["asumir-mando-mall", "activar-protocolo-evacuacion", "coordinar-personal-mall", "puntos-encuentro-mall"]
    },
    {
      id: "busqueda-coordinada",
      text: "Coordinar búsqueda sistemática del recinto con policía y personal de seguridad.",
      priority: "estabilizacion",
      completedByDecisionIds: ["busqueda-sistematica-mall", "enlace-policial-mall", "evaluar-amenaza-salida"]
    },
    {
      id: "gestion-comunicacion",
      text: "Controlar rumores y establecer mensaje único hacia el público y medios.",
      priority: "continuidad",
      completedByDecisionIds: ["voceria-mall", "plan-comunicaciones-mall", "gestionar-medios-mall"]
    },
    {
      id: "transferencia-mando",
      text: "Efectuar transferencia de mando a Carabineros / GOPE según protocolos.",
      priority: "continuidad",
      completedByDecisionIds: ["enlace-policial-mall", "transferencia-mando-policial", "pai-mall"]
    }
  ],
  resources: [
    { id: "bomberos-mall", name: "Compañía de Bomberos", type: "unidad", status: "disponible", capabilities: ["evacuacion", "busqueda", "control perimetro", "primeros auxilios"] },
    { id: "carabineros-mall", name: "Carabineros", type: "institucion", status: "disponible", etaMinutes: 0, capabilities: ["seguridad publica", "control multitud", "perimetro", "investigacion"] },
    { id: "gope", name: "GOPE (Grupo de Operaciones Especiales)", type: "institucion", status: "solicitado", etaMinutes: 25, capabilities: ["neutralizacion explosivos", "busqueda dispositivos", "K-9 antiexplosivos"] },
    { id: "samu-mall", name: "SAMU", type: "institucion", status: "solicitado", etaMinutes: 8, capabilities: ["triage", "atencion prehospitalaria", "traslado heridos"] },
    { id: "seguridad-mall", name: "Seguridad del Mall", type: "personal", status: "disponible", capabilities: ["conocimiento recinto", "acceso camaras", "control accesos", "protocolo interno"] },
    { id: "municipio-mall", name: "Municipio", type: "institucion", status: "solicitado", etaMinutes: 18, capabilities: ["apoyo logistico", "albergue temporal", "informacion publica"] },
    { id: "pc-mall", name: "Puesto de Comando", type: "instalacion", status: "disponible", capabilities: ["mando", "coordinacion", "registro"] },
    { id: "sala-monitoreo", name: "Sala de Monitoreo Mall", type: "instalacion", status: "disponible", capabilities: ["camaras seguridad", "intercomunicacion interna", "control accesos", "registro"] }
  ],
  hotspots: [
    { id: "entrada-principal", label: "Entrada principal", x: 50, y: 90, kind: "riesgo", description: "Acceso principal con mayor flujo de personas evacuando. Posible punto de estampida." },
    { id: "salida-emergencia-sospechosa", label: "Salida emergencia norte", x: 22, y: 35, kind: "riesgo", description: "Salida donde se reportó posible amenaza secundaria. Requiere evaluación antes de usar como ruta de evacuación." },
    { id: "zona-comercio", label: "Zona comercial piso 2", x: 55, y: 45, kind: "victima", description: "Alta concentración de público. Pasillos angostos en hora peak." },
    { id: "patio-comidas", label: "Patio de comidas", x: 50, y: 30, kind: "victima", description: "600 personas aproximadas. Zona de mayor densidad y probable foco de pánico." },
    { id: "pc-exterior", label: "PC exterior sugerido", x: 75, y: 85, kind: "pc", description: "Estacionamiento sur, a 150m del recinto. Visión de accesos principales." }
  ],
  injects: [
    {
      id: "dispositivo-bano",
      minute: 8,
      title: "Seguridad reporta objeto sospechoso en baño",
      description: "Personal de seguridad del mall reporta un maletín abandonado en baño de hombres piso 2. Se desconoce si contiene dispositivo. El público en ese sector aún no ha sido evacuado.",
      severity: "critica",
      metricImpact: { risk: 20, lifeSafety: -12, control: -8, complexity: 12 },
      expectedResponses: ["busqueda-sistematica-mall", "evaluar-amenaza-salida", "enlace-policial-mall"]
    },
    {
      id: "intento-estampida",
      minute: 13,
      title: "Intento de estampida en patio de comidas",
      description: "Un rumor de que hay una bomba activa genera pánico en el patio de comidas. Personas corren hacia las salidas desordenadamente. Se reportan 3 personas con golpes leves por empujones.",
      severity: "alta",
      metricImpact: { risk: 12, lifeSafety: -15, coordination: -8, complexity: 10 },
      expectedResponses: ["voceria-mall", "coordinar-personal-mall", "activar-protocolo-evacuacion"]
    },
    {
      id: "medios-ingresan",
      minute: 17,
      title: "Periodista ingresa al perímetro",
      description: "Un camarógrafo de canal de noticias logró ingresar al perímetro de seguridad y está transmitiendo en vivo desde el interior. Su presencia genera más pánico entre los evacuados.",
      severity: "media",
      metricImpact: { coordination: -8, complexity: 8, lifeSafety: -5 },
      expectedResponses: ["gestionar-medios-mall", "voceria-mall", "perimetro-seguridad-mall"]
    },
    {
      id: "segunda-amenaza",
      minute: 22,
      title: "Segunda llamada de amenaza",
      description: "El mall recibe una segunda llamada amenazando con un segundo dispositivo en el estacionamiento subterráneo. El vehículo de mando está ubicado cerca del acceso al estacionamiento.",
      severity: "critica",
      metricImpact: { risk: 18, control: -10, lifeSafety: -10, complexity: 15 },
      expectedResponses: ["evaluar-amenaza-salida", "busqueda-sistematica-mall", "enlace-policial-mall"]
    }
  ],
  decisions: [
    {
      id: "asumir-mando-mall",
      title: "Asumir mando y declarar SCI",
      description: "Informar arribo, asumir CI, nombrar incidente como amenaza de bomba activa y establecer primer reporte.",
      category: "mando",
      recommendedFromMinute: 0,
      recommendedUntilMinute: 4,
      metricImpact: { control: 12, coordination: 10, complexity: -4 },
      unlocks: ["activar-protocolo-evacuacion", "plan-comunicaciones-mall", "perimetro-seguridad-mall"],
      penalizedIfRepeated: true,
      doctrineNotes: ["Mando temprano", "Terminología común", "Cadena de mando"]
    },
    {
      id: "perimetro-seguridad-mall",
      title: "Establecer perímetro de seguridad exterior",
      description: "Delimitar zona de exclusión alrededor del recinto. Establecer puntos de acceso controlados para respondedores y rutas de salida para evacuados.",
      category: "seguridad",
      recommendedFromMinute: 1,
      recommendedUntilMinute: 8,
      metricImpact: { risk: -10, lifeSafety: 10, coordination: 6 },
      requires: ["asumir-mando-mall"],
      unlocks: ["puntos-encuentro-mall", "evaluar-amenaza-salida"],
      doctrineNotes: ["Seguridad", "Instalaciones y zonas", "Responsabilidad"]
    },
    {
      id: "activar-protocolo-evacuacion",
      title: "Activar protocolo de evacuación del recinto",
      description: "Coordinar con seguridad del mall para activar sistema de altavoces con mensaje claro de evacuación. Designar rutas primarias y alternativas verificando amenaza en salida norte.",
      category: "operaciones",
      recommendedFromMinute: 2,
      recommendedUntilMinute: 10,
      metricImpact: { lifeSafety: 14, control: 8, coordination: 8, complexity: -5 },
      requires: ["asumir-mando-mall"],
      unlocks: ["coordinar-personal-mall", "busqueda-sistematica-mall"],
      doctrineNotes: ["Manejo por objetivos", "Operaciones", "Seguridad pública"]
    },
    {
      id: "evaluar-amenaza-salida",
      title: "Evaluar amenaza en salida de emergencia norte",
      description: "No utilizar salida norte como ruta de evacuación hasta que sea verificada por personal especializado. Redirigir flujo evacuados hacia salidas este y sur.",
      category: "seguridad",
      recommendedFromMinute: 3,
      recommendedUntilMinute: 12,
      metricImpact: { risk: -15, lifeSafety: 16, control: 6 },
      requires: ["perimetro-seguridad-mall"],
      doctrineNotes: ["Seguridad", "Responsabilidad", "Manejo por objetivos"]
    },
    {
      id: "enlace-policial-mall",
      title: "Establecer enlace con Carabineros y GOPE",
      description: "Integrar oficial de policía al PC como enlace operacional. Coordinar roles: bomberos lidera evacuación, policía lidera búsqueda e investigación.",
      category: "enlace",
      recommendedFromMinute: 3,
      recommendedUntilMinute: 12,
      metricImpact: { control: 12, coordination: 14, complexity: -6 },
      requires: ["asumir-mando-mall"],
      unlocks: ["transferencia-mando-policial", "busqueda-sistematica-mall"],
      doctrineNotes: ["Enlace", "Comando unificado cuando corresponda", "Multiagencia"]
    },
    {
      id: "coordinar-personal-mall",
      title: "Coordinar personal de seguridad del mall",
      description: "Asignar personal de seguridad del mall como guías en rutas de evacuación. Obtener acceso a sistema de cámaras y plano del recinto.",
      category: "operaciones",
      recommendedFromMinute: 4,
      recommendedUntilMinute: 12,
      metricImpact: { control: 8, coordination: 10, lifeSafety: 8, complexity: -4 },
      requires: ["activar-protocolo-evacuacion"],
      doctrineNotes: ["Organización modular", "Alcance de control", "Gestión integral de recursos"]
    },
    {
      id: "puntos-encuentro-mall",
      title: "Establecer puntos de encuentro seguros",
      description: "Designar puntos de encuentro en estacionamiento sur y plaza oriente, ambos fuera del perímetro de seguridad. Instalar control de personas evacuadas.",
      category: "operaciones",
      recommendedFromMinute: 4,
      recommendedUntilMinute: 14,
      metricImpact: { lifeSafety: 10, coordination: 8, control: 5, complexity: -4 },
      requires: ["perimetro-seguridad-mall"],
      doctrineNotes: ["Instalaciones y zonas", "Operaciones", "Responsabilidad"]
    },
    {
      id: "busqueda-sistematica-mall",
      title: "Coordinar búsqueda sistemática del recinto",
      description: "Establecer cuadrícula de búsqueda con personal de seguridad del mall. Definir sectores, protocolo de comunicación y criterios para reportar objetos sospechosos. No tocar ningún objeto sospechoso.",
      category: "operaciones",
      recommendedFromMinute: 6,
      recommendedUntilMinute: 20,
      metricImpact: { control: 12, coordination: 10, risk: -8, complexity: -5 },
      requires: ["enlace-policial-mall", "activar-protocolo-evacuacion"],
      doctrineNotes: ["Operaciones", "Manejo por objetivos", "Responsabilidad"]
    },
    {
      id: "voceria-mall",
      title: "Designar vocería y controlar mensajes",
      description: "Nombrar oficial de información pública. Emitir comunicado único hacia medios y evacuados para evitar rumores. Prohibir mensajes no autorizados por altavoces.",
      category: "enlace",
      recommendedFromMinute: 8,
      recommendedUntilMinute: 20,
      metricImpact: { coordination: 12, lifeSafety: 6, complexity: -6 },
      doctrineNotes: ["Información pública", "Gestión de información", "Comunicaciones integradas"]
    },
    {
      id: "plan-comunicaciones-mall",
      title: "Establecer plan de comunicaciones",
      description: "Canal de mando, canal operativo evacuación, canal enlace policial y reporte periódico. Incluir sistema de altavoces del mall en el plan.",
      category: "comunicaciones",
      recommendedFromMinute: 3,
      recommendedUntilMinute: 12,
      metricImpact: { coordination: 14, complexity: -6 },
      requires: ["asumir-mando-mall"],
      doctrineNotes: ["Comunicaciones integradas", "Terminología común"]
    },
    {
      id: "gestionar-medios-mall",
      title: "Gestionar medios de comunicación externos",
      description: "Delimitar zona de prensa fuera del perímetro. Coordinar con vocería para entregar información periódica que evite especulaciones.",
      category: "enlace",
      recommendedFromMinute: 10,
      recommendedUntilMinute: 25,
      metricImpact: { coordination: 8, complexity: -4, lifeSafety: 4 },
      doctrineNotes: ["Información pública", "Enlace", "Gestión de información"]
    },
    {
      id: "transferencia-mando-policial",
      title: "Efectuar transferencia de mando a policía",
      description: "Una vez completada la evacuación, transferir mando del incidente a Carabineros para fase de búsqueda e investigación. Mantener rol de apoyo técnico y evacuación.",
      category: "mando",
      recommendedFromMinute: 18,
      metricImpact: { control: 10, coordination: 12, complexity: -8 },
      requires: ["enlace-policial-mall"],
      doctrineNotes: ["Cadena de mando", "Comando unificado cuando corresponda", "Transferencia de mando"]
    },
    {
      id: "pai-mall",
      title: "Formalizar PAI inicial",
      description: "Registrar objetivos, estructura SCI, comunicaciones, roles y recursos para el periodo operacional.",
      category: "planificacion",
      recommendedFromMinute: 14,
      metricImpact: { control: 10, coordination: 12, complexity: -6 },
      requires: ["enlace-policial-mall", "plan-comunicaciones-mall"],
      doctrineNotes: ["Plan de acción del incidente", "Planificación"]
    }
  ],
  rubric: [
    { id: "r-mando-mall", title: "Establece mando y estructura SCI con policía", category: "mando", maxPoints: 15, evidenceDecisionIds: ["asumir-mando-mall", "transferencia-mando-policial"] },
    { id: "r-seguridad-mall", title: "Controla salidas y amenaza en perímetro", category: "seguridad", maxPoints: 20, evidenceDecisionIds: ["evaluar-amenaza-salida", "perimetro-seguridad-mall"], failCondition: "Se utiliza salida norte sin verificación previa" },
    { id: "r-operaciones-mall", title: "Ejecuta evacuación masiva ordenada", category: "operaciones", maxPoints: 25, evidenceDecisionIds: ["activar-protocolo-evacuacion", "busqueda-sistematica-mall", "coordinar-personal-mall", "puntos-encuentro-mall"], failCondition: "No se coordina búsqueda sistemática antes de ingreso de GOPE" },
    { id: "r-comunicaciones-mall", title: "Controla mensajes y coordina multiagencia", category: "comunicaciones", maxPoints: 20, evidenceDecisionIds: ["plan-comunicaciones-mall", "voceria-mall", "gestionar-medios-mall"] },
    { id: "r-enlace-mall", title: "Coordina enlace policial y transferencia de mando", category: "enlace", maxPoints: 10, evidenceDecisionIds: ["enlace-policial-mall", "gestionar-medios-mall"] },
    { id: "r-planificacion-mall", title: "Planifica operación y registra PAI", category: "planificacion", maxPoints: 10, evidenceDecisionIds: ["pai-mall"] }
  ]
};
