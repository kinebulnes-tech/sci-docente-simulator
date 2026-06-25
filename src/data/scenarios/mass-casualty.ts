import type { Scenario } from "../../types/sci";

export const massCasualtyScenario: Scenario = {
  id: "colapso-graderia-estadio",
  title: "Colapso de gradería en evento deportivo masivo",
  type: "evento_masivo",
  difficulty: "intermedio",
  summary: "Colapso parcial de gradería norte en partido de fútbol, 55 personas caídas, 8 en estado crítico, pánico generalizado, estadio con 15.000 espectadores.",
  briefing: "A las 19:17 colapsa parcialmente la gradería norte del Estadio Municipal durante partido de primera división. 55 personas han caído entre 4 y 8 metros. Espectadores huyen en pánico bloqueando accesos vehiculares. Se reportan 8 personas con lesiones visiblemente graves, incluyendo posibles TCE y fracturas de columna. El policlínico del estadio activa protocolo de emergencia con capacidad limitada (2 médicos, 4 paramédicos). Hay 3 puntos de acceso vehicular para emergencias: puerta norte (bloqueada por multitud), puerta sur (parcialmente libre), acceso vial lateral (disponible). El hospital regional ha sido informado y activa protocolo EM-Masiva. Equipos de medios nacionales y redes sociales transmiten en vivo. El director del estadio y la organización del evento exigen coordinación directa.",
  learningObjectives: [
    "Activar y aplicar protocolo de triage START masivo en escenario de evento deportivo con víctimas múltiples",
    "Coordinar con seguridad del estadio para establecer acceso y egreso controlado de recursos de emergencia",
    "Implementar distribución hospitalaria ordenada según capacidad receptora y criticidad de víctimas",
    "Gestionar control de masas y acceso al área de rescate en situación de pánico colectivo"
  ],
  doctrinalForms: ["ICS 201", "ICS 202", "ICS 205"],
  criticalErrors: ["activar-triage-start", "establecer-ruta-acceso"],
  initialMetrics: {
    risk: 72,
    control: 22,
    coordination: 25,
    lifeSafety: 28,
    propertyConservation: 52,
    complexity: 70
  },
  objectives: [
    {
      id: "vida-victimas",
      text: "Proteger la vida de todas las víctimas mediante triage START y atención priorizada.",
      priority: "vida",
      completedByDecisionIds: ["activar-triage-start", "zona-tratamiento", "solicitar-samu-masivo", "distribucion-hospitalaria"]
    },
    {
      id: "acceso-emergencias",
      text: "Establecer y mantener rutas de acceso y egreso seguras para recursos de emergencia.",
      priority: "estabilizacion",
      completedByDecisionIds: ["establecer-ruta-acceso", "coordinar-seguridad-estadio", "control-masas-perimetro"]
    },
    {
      id: "distribucion-hospital",
      text: "Coordinar distribución hospitalaria según capacidad y criticidad de víctimas.",
      priority: "estabilizacion",
      completedByDecisionIds: ["distribucion-hospitalaria", "activar-enlace-hospitales", "registro-victimas"]
    },
    {
      id: "informacion-publica",
      text: "Gestionar comunicación pública para reducir pánico y facilitar operaciones de rescate.",
      priority: "continuidad",
      completedByDecisionIds: ["pio-conjunto-estadio", "info-evacuacion-ordenada", "comunicaciones-plan"]
    }
  ],
  resources: [
    {
      id: "b1-estadio",
      name: "B-1 Compañía primera respuesta",
      type: "unidad",
      status: "disponible",
      capabilities: ["rescate", "estabilizacion victimas", "equipamiento"]
    },
    {
      id: "samu-1",
      name: "SAMU unidad básica 1",
      type: "institucion",
      status: "disponible",
      etaMinutes: 6,
      capabilities: ["triage", "atencion prehospitalaria", "traslado criticos"]
    },
    {
      id: "samu-2",
      name: "SAMU unidad básica 2",
      type: "institucion",
      status: "solicitado",
      etaMinutes: 12,
      capabilities: ["triage", "atencion prehospitalaria", "traslado"]
    },
    {
      id: "samu-medicalizado",
      name: "SAMU unidad medicalizada",
      type: "institucion",
      status: "solicitado",
      etaMinutes: 18,
      capabilities: ["atencion avanzada", "soporte vital", "traslado criticos"]
    },
    {
      id: "carabineros-estadio",
      name: "Carabineros Control de Orden Público",
      type: "institucion",
      status: "disponible",
      capabilities: ["control de masas", "perimetro externo", "trafico", "seguridad publica"]
    },
    {
      id: "seguridad-estadio",
      name: "Seguridad privada del estadio",
      type: "institucion",
      status: "disponible",
      capabilities: ["control accesos", "conocimiento instalaciones", "comunicacion interna", "evacuacion sectores"]
    },
    {
      id: "policlinico-estadio",
      name: "Policlínico del estadio",
      type: "instalacion",
      status: "disponible",
      capabilities: ["atencion primaria", "clasificacion inicial", "insumos medicos basicos"]
    },
    {
      id: "hospital-regional",
      name: "Hospital Regional (protocolo EM-Masiva activo)",
      type: "institucion",
      status: "disponible",
      capabilities: ["urgencias masivas", "pabellon", "uci", "banco sangre"]
    },
    {
      id: "hospital-clinico",
      name: "Hospital Clínico privado",
      type: "institucion",
      status: "disponible",
      etaMinutes: 0,
      capabilities: ["urgencias", "pabellon", "uci limitada"]
    },
    {
      id: "pc-estadio",
      name: "Puesto de Comando – Acceso Sur",
      type: "instalacion",
      status: "disponible",
      capabilities: ["mando", "coordinacion", "comunicaciones", "registro"]
    }
  ],
  hotspots: [
    { id: "colapso", label: "Zona colapso gradería norte", x: 50, y: 22, kind: "victima", description: "55 personas caídas, estructura inestable, víctimas atrapadas parcialmente." },
    { id: "zona-rojo", label: "Zona de tratamiento rojo (críticos)", x: 38, y: 35, kind: "victima", description: "Área designada para víctimas clasificadas rojo en triage START." },
    { id: "zona-amarillo", label: "Zona de tratamiento amarillo", x: 55, y: 35, kind: "victima", description: "Área designada para víctimas diferibles clasificadas amarillo." },
    { id: "acceso-sur", label: "Acceso sur (ruta principal emergencias)", x: 50, y: 88, kind: "recurso", description: "Puerta sur parcialmente libre, ruta principal para ambulancias." },
    { id: "acceso-lateral", label: "Acceso vial lateral", x: 82, y: 60, kind: "recurso", description: "Vía alternativa disponible para recursos adicionales." },
    { id: "pc", label: "PC – zona acceso sur", x: 42, y: 78, kind: "pc", description: "PC establecido con visibilidad y acceso a comunicaciones." },
    { id: "multitud-norte", label: "Multitud en pánico – acceso norte", x: 50, y: 12, kind: "riesgo", description: "Miles de espectadores intentando salir bloquean acceso norte." },
    { id: "estructura-inestable", label: "Estructura gradería comprometida", x: 62, y: 22, kind: "riesgo", description: "Sección adyacente con posible riesgo de colapso secundario." }
  ],
  injects: [
    {
      id: "segundo-colapso",
      minute: 14,
      title: "Colapso secundario de sección adyacente",
      description: "Sección este de la gradería norte cede parcialmente. Se reportan 12 víctimas adicionales y 2 bomberos quedan con acceso comprometido.",
      severity: "critica",
      metricImpact: { risk: 18, control: -12, lifeSafety: -15, complexity: 12 },
      expectedResponses: ["zona-tratamiento", "activar-triage-start", "solicitar-recursos-adicionales", "oficial-seguridad-mc"]
    },
    {
      id: "hospital-saturado",
      minute: 22,
      title: "Hospital Regional declara capacidad al límite",
      description: "El hospital regional informa que recibió 14 víctimas y está al límite de UCI. Solicita derivación de nuevas víctimas críticas a otros centros.",
      severity: "alta",
      metricImpact: { coordination: -10, lifeSafety: -8, complexity: 10 },
      expectedResponses: ["distribucion-hospitalaria", "activar-enlace-hospitales", "registro-victimas"]
    },
    {
      id: "corte-energia",
      minute: 30,
      title: "Corte de energía parcial en estadio",
      description: "Falla eléctrica apaga iluminación en gradería norte y zonas de tratamiento. Generadores de emergencia cubren solo zona administrativa.",
      severity: "alta",
      metricImpact: { risk: 10, control: -8, coordination: -6, complexity: 8 },
      expectedResponses: ["solicitar-recursos-adicionales", "comunicaciones-plan", "zona-tratamiento"]
    },
    {
      id: "extraccion-vip",
      minute: 18,
      title: "Autoridad exige extracción prioritaria de personas conocidas",
      description: "El presidente del club futbolístico identifica a un jugador y familiar entre las víctimas y exige extracción inmediata fuera del protocolo de triage.",
      severity: "media",
      metricImpact: { coordination: -8, complexity: 6 },
      expectedResponses: ["activar-triage-start", "pio-conjunto-estadio", "info-evacuacion-ordenada"]
    }
  ],
  decisions: [
    {
      id: "asumir-mando-mc",
      title: "Asumir mando y declarar SCI de víctimas masivas",
      description: "Informar arribo, asumir CI, declarar incidente de víctimas masivas, designar nombre del incidente y entregar reporte inicial al COSEM.",
      category: "mando",
      recommendedFromMinute: 0,
      recommendedUntilMinute: 4,
      metricImpact: { control: 14, coordination: 12, complexity: -5 },
      unlocks: ["activar-triage-start", "establecer-ruta-acceso", "comunicaciones-plan"],
      penalizedIfRepeated: true,
      doctrineNotes: ["Mando temprano", "Terminología común", "Cadena de mando", "Declaración de incidente masivo"]
    },
    {
      id: "activar-triage-start",
      title: "Activar protocolo triage START masivo",
      description: "Ordenar aplicación inmediata de triage START en zona de colapso. Designar área de triage, asignar personal categorizado y establecer zonas rojo, amarillo y verde.",
      category: "operaciones",
      recommendedFromMinute: 1,
      recommendedUntilMinute: 8,
      metricImpact: { lifeSafety: 20, control: 10, coordination: 8, complexity: -6 },
      requires: ["asumir-mando-mc"],
      unlocks: ["zona-tratamiento", "distribucion-hospitalaria", "registro-victimas"],
      penalizedIfRepeated: true,
      doctrineNotes: ["Triage START masivo", "Prioridades de atención", "Manejo por objetivos", "Organización modular"]
    },
    {
      id: "establecer-ruta-acceso",
      title: "Establecer ruta de acceso exclusiva para emergencias",
      description: "Coordinar con seguridad del estadio y Carabineros para despejar y mantener acceso sur y lateral exclusivos para ambulancias y equipos de rescate.",
      category: "seguridad",
      recommendedFromMinute: 1,
      recommendedUntilMinute: 10,
      metricImpact: { control: 12, coordination: 10, lifeSafety: 8, risk: -6 },
      requires: ["asumir-mando-mc"],
      unlocks: ["control-masas-perimetro", "coordinar-seguridad-estadio"],
      penalizedIfRepeated: true,
      doctrineNotes: ["Instalaciones y zonas", "Seguridad pública", "Gestión de accesos en eventos masivos"]
    },
    {
      id: "oficial-seguridad-mc",
      title: "Designar Oficial de Seguridad para evento masivo",
      description: "Asignar Oficial de Seguridad con responsabilidad sobre zona de colapso, riesgos de estructura, control de ingreso de respondedores y evaluación dinámica.",
      category: "seguridad",
      recommendedFromMinute: 2,
      recommendedUntilMinute: 12,
      metricImpact: { risk: -14, lifeSafety: 10, coordination: 6 },
      requires: ["asumir-mando-mc"],
      unlocks: ["zona-tratamiento"],
      doctrineNotes: ["Responsabilidad", "Seguridad de respondedores", "Organización modular"]
    },
    {
      id: "coordinar-seguridad-estadio",
      title: "Integrar seguridad del estadio a la estructura SCI",
      description: "Incorporar jefe de seguridad del estadio como recurso bajo enlace. Obtener planos, comunicaciones internas y capacidades de evacuación por sector.",
      category: "enlace",
      recommendedFromMinute: 3,
      recommendedUntilMinute: 12,
      metricImpact: { coordination: 12, control: 8, complexity: -4 },
      requires: ["establecer-ruta-acceso"],
      unlocks: ["info-evacuacion-ordenada"],
      doctrineNotes: ["Enlace con organizaciones del evento", "Gestión integral de recursos", "Interoperabilidad"]
    },
    {
      id: "comunicaciones-plan",
      title: "Establecer plan de comunicaciones para incidente masivo",
      description: "Designar canales separados para mando, operaciones médicas y coordinación hospitalaria. Asignar frecuencias y confirmar con todos los recursos.",
      category: "comunicaciones",
      recommendedFromMinute: 3,
      recommendedUntilMinute: 10,
      metricImpact: { coordination: 14, complexity: -8, control: 6 },
      requires: ["asumir-mando-mc"],
      doctrineNotes: ["Comunicaciones integradas", "Terminología común", "Gestión de información"]
    },
    {
      id: "zona-tratamiento",
      title: "Establecer zonas de tratamiento categorizadas",
      description: "Designar y señalizar zonas rojo, amarillo y verde en área segura fuera de estructura comprometida. Asignar recursos médicos por zona.",
      category: "operaciones",
      recommendedFromMinute: 5,
      recommendedUntilMinute: 15,
      metricImpact: { lifeSafety: 14, control: 8, coordination: 6, risk: -4 },
      requires: ["activar-triage-start", "oficial-seguridad-mc"],
      unlocks: ["solicitar-samu-masivo"],
      doctrineNotes: ["Organización del área de operaciones", "Triage y tratamiento", "Instalaciones y zonas"]
    },
    {
      id: "control-masas-perimetro",
      title: "Establecer control de masas y perímetro operacional",
      description: "Coordinar con Carabineros para perímetro exterior. Redirigir evacuación de espectadores lejos de zona operacional. Designar salidas exclusivas para público.",
      category: "seguridad",
      recommendedFromMinute: 4,
      recommendedUntilMinute: 14,
      metricImpact: { risk: -10, lifeSafety: 10, coordination: 8, control: 6 },
      requires: ["establecer-ruta-acceso"],
      doctrineNotes: ["Seguridad pública", "Instalaciones y zonas", "Control de perímetro en eventos"]
    },
    {
      id: "solicitar-samu-masivo",
      title: "Solicitar activación de protocolo SAMU masivo y recursos adicionales",
      description: "Solicitar todas las unidades SAMU disponibles, médico coordinador de emergencias y activar protocolo de derivación masiva regional.",
      category: "recursos",
      recommendedFromMinute: 5,
      recommendedUntilMinute: 14,
      metricImpact: { lifeSafety: 12, control: 8, coordination: 8 },
      requires: ["zona-tratamiento"],
      unlocks: ["distribucion-hospitalaria"],
      doctrineNotes: ["Gestión integral de recursos", "Despacho y despliegue", "Escalamiento de respuesta"]
    },
    {
      id: "distribucion-hospitalaria",
      title: "Coordinar distribución hospitalaria por criticidad",
      description: "Asignar destino hospitalario a cada víctima según categoría de triage y capacidad receptora. Mantener registro actualizado con número de víctimas por centro.",
      category: "planificacion",
      recommendedFromMinute: 10,
      recommendedUntilMinute: 30,
      metricImpact: { lifeSafety: 16, coordination: 12, complexity: -6 },
      requires: ["activar-triage-start", "solicitar-samu-masivo"],
      unlocks: ["activar-enlace-hospitales"],
      doctrineNotes: ["Manejo por objetivos", "Planificación", "Gestión de víctimas en masa"]
    },
    {
      id: "activar-enlace-hospitales",
      title: "Activar enlace directo con centros hospitalarios",
      description: "Establecer comunicación directa con hospital regional y clínico. Informar número y criticidad de víctimas en tránsito. Solicitar declaración de capacidad en tiempo real.",
      category: "enlace",
      recommendedFromMinute: 12,
      recommendedUntilMinute: 30,
      metricImpact: { coordination: 12, lifeSafety: 8, complexity: -4 },
      requires: ["distribucion-hospitalaria"],
      doctrineNotes: ["Enlace hospitalario", "Gestión de información", "Coordinación multiagencia"]
    },
    {
      id: "registro-victimas",
      title: "Implementar sistema de registro de víctimas",
      description: "Asignar personal a registro sistemático de víctimas con número de caso, categoría triage, destino y condición. Informar total a CI cada 10 minutos.",
      category: "recursos",
      recommendedFromMinute: 8,
      recommendedUntilMinute: 25,
      metricImpact: { coordination: 10, control: 8, lifeSafety: 6, complexity: -4 },
      requires: ["activar-triage-start"],
      doctrineNotes: ["Responsabilidad", "Gestión integral de recursos", "Documentación del incidente"]
    },
    {
      id: "pio-conjunto-estadio",
      title: "Designar vocero conjunto con administración del estadio",
      description: "Nombrar Oficial de Información Pública y coordinar mensaje unificado con administración del estadio y clubes. Canalizar información a medios y familiares.",
      category: "enlace",
      recommendedFromMinute: 10,
      recommendedUntilMinute: 20,
      metricImpact: { coordination: 8, complexity: -5, lifeSafety: 4 },
      requires: ["coordinar-seguridad-estadio"],
      doctrineNotes: ["Información pública", "Gestión de información en eventos masivos"]
    },
    {
      id: "info-evacuacion-ordenada",
      title: "Emitir instrucciones de evacuación ordenada por sectores",
      description: "Coordinar con sonido del estadio y seguridad para guiar evacuación por sectores, evitando colapso de salidas. Reducir presión sobre zonas operacionales.",
      category: "enlace",
      recommendedFromMinute: 6,
      recommendedUntilMinute: 18,
      metricImpact: { risk: -8, coordination: 8, lifeSafety: 8, complexity: -4 },
      requires: ["coordinar-seguridad-estadio"],
      doctrineNotes: ["Seguridad pública", "Evacuación en eventos masivos", "Comunicación de emergencias"]
    },
    {
      id: "solicitar-recursos-adicionales",
      title: "Solicitar recursos adicionales ante colapso secundario",
      description: "Escalar solicitud de recursos: más unidades de rescate, iluminación de emergencia, apoyo logístico y segunda guardia médica.",
      category: "recursos",
      recommendedFromMinute: 15,
      metricImpact: { control: 10, coordination: 6, lifeSafety: 8 },
      requires: ["asumir-mando-mc"],
      doctrineNotes: ["Escalamiento de respuesta", "Gestión integral de recursos", "Planificación de períodos operacionales"]
    }
  ],
  rubric: [
    {
      id: "r-mando-mc",
      title: "Establece mando SCI para incidente de víctimas masivas",
      category: "mando",
      maxPoints: 15,
      evidenceDecisionIds: ["asumir-mando-mc", "oficial-seguridad-mc"],
      failCondition: "No asume mando formal en los primeros 5 minutos"
    },
    {
      id: "r-triage-start",
      title: "Activa y aplica protocolo triage START masivo correctamente",
      category: "operaciones",
      maxPoints: 25,
      evidenceDecisionIds: ["activar-triage-start", "zona-tratamiento", "registro-victimas"],
      failCondition: "No activa triage START en los primeros 8 minutos"
    },
    {
      id: "r-acceso-control",
      title: "Establece control de acceso y rutas de emergencia",
      category: "seguridad",
      maxPoints: 15,
      evidenceDecisionIds: ["establecer-ruta-acceso", "control-masas-perimetro", "coordinar-seguridad-estadio"]
    },
    {
      id: "r-dist-hospitalaria",
      title: "Coordina distribución hospitalaria ordenada",
      category: "planificacion",
      maxPoints: 20,
      evidenceDecisionIds: ["distribucion-hospitalaria", "activar-enlace-hospitales", "solicitar-samu-masivo"],
      failCondition: "No establece coordinación con hospitales antes del minuto 20"
    },
    {
      id: "r-comunicaciones-mc",
      title: "Ordena comunicaciones multiagencia y gestión de información pública",
      category: "comunicaciones",
      maxPoints: 15,
      evidenceDecisionIds: ["comunicaciones-plan", "pio-conjunto-estadio", "info-evacuacion-ordenada"]
    },
    {
      id: "r-recursos-mc",
      title: "Solicita y asigna recursos proporcionales a la magnitud",
      category: "recursos",
      maxPoints: 10,
      evidenceDecisionIds: ["solicitar-samu-masivo", "solicitar-recursos-adicionales", "registro-victimas"]
    }
  ]
};
