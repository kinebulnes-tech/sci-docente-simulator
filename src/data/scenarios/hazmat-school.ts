import type { Scenario } from "../../types/sci";

export const hazmatSchoolScenario: Scenario = {
  id: "fuga-quimica-laboratorio-escolar",
  title: "Fuga de producto químico desconocido en laboratorio de establecimiento escolar",
  type: "matpel",
  difficulty: "avanzado",
  summary: "Reacción química accidental en laboratorio escolar, vapores de color amarillo verdoso, 8 estudiantes con síntomas, producto desconocido, apoderados y medios en puerta.",
  briefing: "A las 10:50 se activa alarma de emergencia en colegio municipal de 500 alumnos. En laboratorio de química del segundo piso se produjo una reacción accidental entre dos productos no identificados. Vapores de color amarillo verdoso visibles en el corredor. Ocho estudiantes presentan síntomas: irritación ocular, tos, náuseas. El producto exacto se desconoce — la etiqueta del frasco está dañada. El establecimiento fue puesto en lockdown. Apoderados se congregan en la entrada principal. Cámaras de un medio de comunicación ya están filmando desde el exterior. Un helicóptero de noticias sobrevuela. Hospital regional está en alerta y esperando confirmación del agente. La identificación correcta del producto es la prioridad crítica antes de cualquier entrada a la zona contaminada.",
  learningObjectives: [
    "Aplicar protocolo de identificación de sustancia desconocida usando ERG, CHEMTREC y fichas de seguridad antes de ingresar a la zona",
    "Coordinar descontaminación masiva de hasta 500 estudiantes con recursos disponibles y en torno a la estructura escolar",
    "Gestionar públicos externos (apoderados y medios de comunicación) sin comprometer las operaciones ni generar pánico",
    "Ejecutar operaciones simultáneas de triage médico y MATPEL manteniendo cadena de mando unificada"
  ],
  doctrinalForms: ["ICS 201", "ICS 202", "ICS 205", "ICS 211", "ICS 214"],
  criticalErrors: ["identificacion-antes-entrada", "descon-antes-hospital", "perimetro-exterior"],
  initialMetrics: {
    risk: 80, control: 20, coordination: 22,
    lifeSafety: 25, propertyConservation: 50, complexity: 82
  },
  objectives: [
    {
      id: "identificacion-desconocido",
      text: "Identificar el producto químico desconocido antes de ordenar cualquier entrada a la zona contaminada.",
      priority: "vida",
      completedByDecisionIds: ["identificacion-antes-entrada", "llamar-chemtrec", "consultar-fichas-seguridad", "erg-desconocido"]
    },
    {
      id: "descontaminacion-masiva",
      text: "Establecer y ejecutar descontaminación masiva de estudiantes y personal afectado.",
      priority: "vida",
      completedByDecisionIds: ["descon-antes-hospital", "activar-descon-masiva", "sectorizar-descon-escuela", "triaje-masivo"]
    },
    {
      id: "manejo-publicos",
      text: "Gestionar apoderados y medios de comunicación manteniendo el perímetro operacional.",
      priority: "estabilizacion",
      completedByDecisionIds: ["perimetro-exterior", "voceria-apoderados", "voceria-medios", "zona-familiares"]
    },
    {
      id: "operaciones-simultaneas",
      text: "Mantener mando unificado durante operaciones simultáneas de MATPEL y atención médica masiva.",
      priority: "continuidad",
      completedByDecisionIds: ["asumir-mando", "mando-unificado-escuela", "sectorizar-operaciones-escuela", "pai-inicial"]
    }
  ],
  resources: [
    { id: "b1", name: "B-1 Primera respuesta MATPEL", type: "unidad", status: "disponible", capabilities: ["identificacion", "EPP nivel B", "contencion inicial"] },
    { id: "b2", name: "B-2 Segunda unidad", type: "unidad", status: "disponible", capabilities: ["apoyo operacional", "evacuacion", "confinamiento"] },
    { id: "eq-matpel", name: "Equipo MATPEL Especializado", type: "equipo", status: "solicitado", etaMinutes: 16, capabilities: ["EPP nivel A", "deteccion desconocido", "muestreo aire"] },
    { id: "und-descon", name: "Unidad Descontaminación", type: "unidad", status: "solicitado", etaMinutes: 14, capabilities: ["descontaminacion masiva", "duchas moviles", "descon hasta 200 personas/hora"] },
    { id: "samu", name: "SAMU", type: "institucion", status: "solicitado", etaMinutes: 9, capabilities: ["triage masivo", "atencion prehospitalaria", "coordinacion hospitales"] },
    { id: "carabineros", name: "Carabineros", type: "institucion", status: "solicitado", etaMinutes: 5, capabilities: ["perimetro externo", "control apoderados", "trafico"] },
    { id: "seremi-salud", name: "SEREMI Salud", type: "institucion", status: "disponible", capabilities: ["autoridad sanitaria", "protocolo escolar", "alerta hospitales"] },
    { id: "daem", name: "DAEM Municipal", type: "institucion", status: "disponible", capabilities: ["comunicacion apoderados", "protocolo escolar", "infraestructura"] },
    { id: "chemtrec", name: "CHEMTREC", type: "institucion", status: "disponible", capabilities: ["identificacion quimica", "asesoría tecnica", "fichas de seguridad"] },
    { id: "hospital", name: "Hospital Regional", type: "institucion", status: "disponible", capabilities: ["atencion masiva", "toxicologia", "unidad critica"] },
    { id: "direccion-colegio", name: "Director del establecimiento", type: "personal", status: "disponible", capabilities: ["inventario quimicos", "fichas seguridad", "listas de alumnos", "contacto apoderados"] },
    { id: "pc", name: "Puesto de Comando", type: "instalacion", status: "disponible", capabilities: ["mando unificado", "coordinacion", "registro", "comunicaciones"] }
  ],
  hotspots: [
    { id: "laboratorio", label: "Laboratorio de química", x: 60, y: 35, kind: "riesgo", description: "Zona caliente. Vapores amarillo-verdosos visibles. Producto desconocido." },
    { id: "corredor-2p", label: "Corredor segundo piso", x: 55, y: 40, kind: "riesgo", description: "Vapores se extienden. Posible zona tibia si el producto es identificado." },
    { id: "estudiantes-afectados", label: "8 estudiantes con síntomas", x: 48, y: 52, kind: "victima", description: "Irritación ocular, tos, náuseas. Requieren triage y descontaminación urgente." },
    { id: "entrada-principal", label: "Entrada principal colegio", x: 30, y: 75, kind: "riesgo", description: "Apoderados concentrados. Medios de comunicación filmando." },
    { id: "patio-colegio", label: "Patio interior para evacuación", x: 50, y: 68, kind: "perimetro", description: "Punto de reunión seguro para evacuación escolar. 500 alumnos." },
    { id: "zona-descon", label: "Zona descontaminación", x: 40, y: 60, kind: "perimetro", description: "Área propuesta para descontaminación masiva lejos del laboratorio." },
    { id: "pc", label: "PC sugerido", x: 22, y: 72, kind: "pc", description: "A favor del viento, con vista a la fachada y zona de descontaminación." }
  ],
  injects: [
    {
      id: "apoderado-ingresa",
      minute: 8,
      title: "Apoderado cruza el perímetro hacia el interior",
      description: "Un apoderado entra al establecimiento en busca de su hijo. Carabineros no pudo contenerlo. Ahora está en el pasillo de acceso al patio. Más apoderados amenazan con seguirlo.",
      severity: "alta",
      metricImpact: { lifeSafety: -10, risk: 8, coordination: -8, complexity: 10 },
      expectedResponses: ["perimetro-exterior", "voceria-apoderados", "zona-familiares"]
    },
    {
      id: "segunda-exposicion",
      minute: 14,
      title: "Segunda víctima con síntomas severos en zona de evacuación",
      description: "Estudiante que había evacuado al patio presenta deterioro rápido: disnea severa, cianosis labial. Posiblemente tuvo exposición mayor o tiene condición preexistente.",
      severity: "critica",
      metricImpact: { lifeSafety: -15, risk: 8, complexity: 10, coordination: -5 },
      expectedResponses: ["triaje-masivo", "descon-antes-hospital", "enlace-hospital"]
    },
    {
      id: "chemtrec-identifica",
      minute: 20,
      title: "CHEMTREC identifica el producto: mezcla de ácido clorhídrico y lejía",
      description: "CHEMTREC confirma que la reacción generó cloro gaseoso (Cl₂, UN 1017). ERG guía 124. IDLH: 10 ppm. Guía de respuesta específica ahora disponible.",
      severity: "media",
      metricImpact: { control: 15, risk: -10, complexity: -12, coordination: 8 },
      expectedResponses: ["identificacion-antes-entrada", "establecer-zonas-escuela", "erg-desconocido"]
    },
    {
      id: "helicoptero-medios",
      minute: 25,
      title: "Helicóptero de noticias sobrevuela a baja altura",
      description: "El helicóptero de una cadena televisiva está sobrevolando el colegio a baja altura, perturbando comunicaciones de radio y causando corrientes de aire sobre la zona de descontaminación.",
      severity: "media",
      metricImpact: { coordination: -10, risk: 6, complexity: 8 },
      expectedResponses: ["voceria-medios", "mando-unificado-escuela", "plan-comunicaciones"]
    }
  ],
  decisions: [
    {
      id: "asumir-mando",
      title: "Asumir mando y declarar incidente MATPEL escolar nivel 3",
      description: "Asumir CI. Declarar MATPEL nivel 3 por producto desconocido en recinto educacional con víctimas. Activar cadena de notificación: SAMU, Carabineros, SEREMI Salud, DAEM.",
      category: "mando",
      recommendedFromMinute: 0,
      recommendedUntilMinute: 3,
      metricImpact: { control: 12, coordination: 10, complexity: -4 },
      unlocks: ["establecer-zonas-escuela", "plan-comunicaciones", "perimetro-exterior", "erg-desconocido"],
      penalizedIfRepeated: true,
      doctrineNotes: ["Mando temprano", "MATPEL nivel 3", "Notificación cadena completa"]
    },
    {
      id: "erg-desconocido",
      title: "Consultar ERG para producto desconocido — Guía 111",
      description: "Ante producto no identificado, usar ERG Guía 111 (gas desconocido/mezcla). Definir distancias de aislamiento conservadoras y acciones iniciales de respuesta.",
      category: "planificacion",
      recommendedFromMinute: 1,
      recommendedUntilMinute: 8,
      metricImpact: { risk: -8, control: 6, complexity: -5 },
      requires: ["asumir-mando"],
      unlocks: ["identificacion-antes-entrada", "establecer-zonas-escuela"],
      doctrineNotes: ["ERG guía 111", "Sustancia desconocida", "Distancias conservadoras"]
    },
    {
      id: "identificacion-antes-entrada",
      title: "Detener toda entrada hasta identificar el producto",
      description: "Emitir orden explícita: nadie entra al laboratorio ni al corredor hasta tener identificación del agente. Iniciar protocolo de identificación: consultar director, fichas de seguridad, CHEMTREC.",
      category: "seguridad",
      recommendedFromMinute: 2,
      recommendedUntilMinute: 10,
      metricImpact: { lifeSafety: 18, risk: -15, control: 8 },
      requires: ["asumir-mando"],
      unlocks: ["consultar-fichas-seguridad", "llamar-chemtrec"],
      doctrineNotes: ["Identificación antes de entrada", "NFPA 472", "Principio de cautela"]
    },
    {
      id: "establecer-zonas-escuela",
      title: "Establecer zonas MATPEL adaptadas al entorno escolar",
      description: "Delimitar zona caliente (laboratorio + corredor), zona tibia (entrada al edificio, descontaminación), zona fría (patio, PC). Adaptar al diseño del colegio.",
      category: "seguridad",
      recommendedFromMinute: 3,
      recommendedUntilMinute: 10,
      metricImpact: { risk: -15, lifeSafety: 12, control: 10, coordination: 6 },
      requires: ["asumir-mando"],
      unlocks: ["activar-descon-masiva", "sectorizar-descon-escuela", "triaje-masivo"],
      doctrineNotes: ["Zonificación en edificio", "MATPEL escolar", "Adaptación del entorno"]
    },
    {
      id: "consultar-fichas-seguridad",
      title: "Solicitar inventario y fichas de seguridad al director",
      description: "Pedir al director del establecimiento el inventario de productos químicos del laboratorio y todas las fichas de datos de seguridad (MSDS/SDS) disponibles.",
      category: "operaciones",
      recommendedFromMinute: 3,
      recommendedUntilMinute: 10,
      metricImpact: { control: 8, complexity: -8, risk: -5 },
      requires: ["identificacion-antes-entrada"],
      unlocks: ["llamar-chemtrec"],
      doctrineNotes: ["Fichas de seguridad", "Inventario químico escolar", "NFPA 472"]
    },
    {
      id: "llamar-chemtrec",
      title: "Contactar CHEMTREC para identificación del agente",
      description: "Llamar a CHEMTREC (1-800-424-9300) con toda la información disponible: color del vapor, olor, síntomas de víctimas, posibles productos involucrados. Solicitar guía de respuesta específica.",
      category: "operaciones",
      recommendedFromMinute: 5,
      recommendedUntilMinute: 18,
      metricImpact: { control: 10, complexity: -10, risk: -6 },
      requires: ["consultar-fichas-seguridad"],
      doctrineNotes: ["CHEMTREC", "Identificación química", "Recursos de identificación"]
    },
    {
      id: "perimetro-exterior",
      title: "Establecer perímetro exterior y alejar apoderados y medios",
      description: "Definir perímetro exterior de al menos 100 m de la fachada. Coordinar con Carabineros para alejar apoderados y medios. Establecer zona de espera para familias a distancia segura.",
      category: "seguridad",
      recommendedFromMinute: 3,
      recommendedUntilMinute: 10,
      metricImpact: { lifeSafety: 12, risk: -8, coordination: 6, complexity: -4 },
      requires: ["asumir-mando"],
      unlocks: ["zona-familiares", "voceria-apoderados", "voceria-medios"],
      doctrineNotes: ["Perímetro externo", "Control de acceso", "Seguridad civil"]
    },
    {
      id: "zona-familiares",
      title: "Establecer zona de reunión segura para familiares",
      description: "Designar punto de reunión para apoderados a distancia segura, con información, lista de alumnos y enlace con el DAEM municipal.",
      category: "enlace",
      recommendedFromMinute: 6,
      recommendedUntilMinute: 18,
      metricImpact: { coordination: 10, lifeSafety: 6, complexity: -5 },
      requires: ["perimetro-exterior"],
      doctrineNotes: ["Gestión de familiares", "Reunificación familiar", "Apoyo psicosocial"]
    },
    {
      id: "voceria-apoderados",
      title: "Designar vocería oficial para apoderados",
      description: "Asignar a un representante (director o enlace SCI) para informar a los apoderados cada 10 minutos. Mensaje: niños están seguros, se está trabajando, no ingresen.",
      category: "enlace",
      recommendedFromMinute: 7,
      recommendedUntilMinute: 20,
      metricImpact: { coordination: 8, lifeSafety: 5, complexity: -6 },
      requires: ["perimetro-exterior"],
      doctrineNotes: ["Información pública", "Vocería de crisis", "Gestión de pánico"]
    },
    {
      id: "voceria-medios",
      title: "Designar oficial de información pública para medios",
      description: "Asignar Oficial de Información Pública. Un único vocero autorizado para declaraciones. Definir punto de prensa fuera del perímetro operacional. Solicitar a autoridad civil control de helicóptero.",
      category: "enlace",
      recommendedFromMinute: 10,
      recommendedUntilMinute: 25,
      metricImpact: { coordination: 10, complexity: -6 },
      requires: ["perimetro-exterior"],
      doctrineNotes: ["Oficial de Información Pública", "Gestión de medios", "Vocería única"]
    },
    {
      id: "triaje-masivo",
      title: "Activar triage masivo START con SAMU en zona de descontaminación",
      description: "Coordinar con médico regulador SAMU para aplicar triage START a los 8 estudiantes afectados en zona tibia. Priorizar los más graves para descontaminación inmediata.",
      category: "operaciones",
      recommendedFromMinute: 5,
      recommendedUntilMinute: 15,
      metricImpact: { lifeSafety: 15, coordination: 10, control: 5 },
      requires: ["establecer-zonas-escuela"],
      unlocks: ["descon-antes-hospital", "enlace-hospital"],
      doctrineNotes: ["Triage START", "Víctimas múltiples", "Coordinación SAMU"]
    },
    {
      id: "descon-antes-hospital",
      title: "Confirmar descontaminación completa antes de trasladar al hospital",
      description: "Exigir que todas las víctimas completen el corredor de descontaminación antes de ser trasladadas. Notificar hospital del agente y protocolos aplicados.",
      category: "operaciones",
      recommendedFromMinute: 8,
      recommendedUntilMinute: 22,
      metricImpact: { lifeSafety: 18, risk: -12, coordination: 8 },
      requires: ["triaje-masivo"],
      unlocks: ["enlace-hospital"],
      doctrineNotes: ["Descontaminación previa", "Protocolo hospitalario", "NFPA 472"]
    },
    {
      id: "activar-descon-masiva",
      title: "Activar descontaminación masiva para hasta 500 estudiantes",
      description: "Instalar sistema de descontaminación masiva en zona tibia del patio. Preparar capacidad para el peor escenario: descontaminar a la totalidad de los 500 alumnos.",
      category: "logistica",
      recommendedFromMinute: 8,
      recommendedUntilMinute: 20,
      metricImpact: { lifeSafety: 14, control: 8, coordination: 6 },
      requires: ["establecer-zonas-escuela"],
      doctrineNotes: ["Descontaminación masiva", "Capacidad escolar", "Planificación para el peor caso"]
    },
    {
      id: "sectorizar-descon-escuela",
      title: "Sectorizar el flujo de descontaminación según edad y género",
      description: "Organizar el corredor de descontaminación con separación por género y edad (menores). Asignar personal de apoyo (profesores, asistentes) para mantener calma.",
      category: "operaciones",
      recommendedFromMinute: 10,
      recommendedUntilMinute: 25,
      metricImpact: { lifeSafety: 10, coordination: 8, complexity: -5 },
      requires: ["activar-descon-masiva"],
      doctrineNotes: ["Descontaminación sensible a género", "Población vulnerable", "Organización del flujo"]
    },
    {
      id: "enlace-hospital",
      title: "Enlazar con hospital receptor para preparar recepción de víctimas",
      description: "Comunicar al hospital el número de víctimas, el agente identificado (o sospechado), los síntomas presentados y el tiempo estimado de llegada.",
      category: "enlace",
      recommendedFromMinute: 8,
      recommendedUntilMinute: 22,
      metricImpact: { lifeSafety: 10, coordination: 8, complexity: -4 },
      requires: ["descon-antes-hospital"],
      doctrineNotes: ["Coordinación hospitalaria", "Enlace médico", "Cadena de atención"]
    },
    {
      id: "plan-comunicaciones",
      title: "Establecer plan de comunicaciones multiagencia",
      description: "Asignar canales: mando, operaciones MATPEL, atención médica, enlace institucional y público. Briefing de comunicaciones a todos los sectores.",
      category: "comunicaciones",
      recommendedFromMinute: 3,
      recommendedUntilMinute: 12,
      metricImpact: { coordination: 14, complexity: -6 },
      requires: ["asumir-mando"],
      unlocks: ["mando-unificado-escuela"],
      doctrineNotes: ["Comunicaciones integradas", "ICS 205", "Canales diferenciados"]
    },
    {
      id: "sectorizar-operaciones-escuela",
      title: "Sectorizar operaciones: MATPEL, médico, evacuación y enlace",
      description: "Crear sectores diferenciados con responsables: sector MATPEL (laboratorio), sector médico (patio/descon), sector evacuación (edificio) y sector enlace (PC).",
      category: "operaciones",
      recommendedFromMinute: 10,
      recommendedUntilMinute: 22,
      metricImpact: { control: 14, coordination: 10, complexity: -10 },
      requires: ["establecer-zonas-escuela"],
      unlocks: ["pai-inicial"],
      doctrineNotes: ["Sectorización", "Alcance de control", "Organización modular"]
    },
    {
      id: "mando-unificado-escuela",
      title: "Establecer mando unificado con SAMU, Carabineros y SEREMI Salud",
      description: "Formalizar mando unificado. Incorporar representantes de SAMU, Carabineros, SEREMI Salud y DAEM en el PC. Definir objetivos comunes y flujo de información.",
      category: "mando",
      recommendedFromMinute: 15,
      metricImpact: { coordination: 16, control: 10, complexity: -8 },
      requires: ["plan-comunicaciones"],
      doctrineNotes: ["Mando unificado", "Multiagencia", "ICS 201"]
    },
    {
      id: "pai-inicial",
      title: "Formalizar PAI inicial para el período operacional",
      description: "Registrar objetivos prioritarios, estructura de mando, recursos asignados, comunicaciones, seguridad, zonas y acciones críticas para el primer período operacional.",
      category: "planificacion",
      recommendedFromMinute: 20,
      metricImpact: { control: 10, coordination: 12, complexity: -6 },
      requires: ["sectorizar-operaciones-escuela", "plan-comunicaciones"],
      doctrineNotes: ["Plan de acción del incidente", "ICS 202", "Planificación"]
    }
  ],
  rubric: [
    { id: "r-mando", title: "Asume mando y activa cadena de notificación completa", category: "mando", maxPoints: 10, evidenceDecisionIds: ["asumir-mando", "mando-unificado-escuela"] },
    { id: "r-identificacion", title: "Aplica protocolo de identificación antes de entrar a la zona", category: "operaciones", maxPoints: 20, evidenceDecisionIds: ["identificacion-antes-entrada", "erg-desconocido", "consultar-fichas-seguridad", "llamar-chemtrec"], failCondition: "Personal ingresa al laboratorio antes de iniciar protocolo de identificación del agente." },
    { id: "r-zonas", title: "Establece zonas MATPEL adaptadas al entorno escolar", category: "seguridad", maxPoints: 15, evidenceDecisionIds: ["establecer-zonas-escuela", "perimetro-exterior"], failCondition: "No se establece perimetro exterior para controlar acceso de apoderados y medios." },
    { id: "r-descontaminacion", title: "Ejecuta descontaminación masiva con protocolo correcto", category: "operaciones", maxPoints: 20, evidenceDecisionIds: ["descon-antes-hospital", "activar-descon-masiva", "sectorizar-descon-escuela", "triaje-masivo"], failCondition: "Víctimas transportadas al hospital sin descontaminación previa." },
    { id: "r-publicos", title: "Gestiona apoderados y medios sin comprometer operaciones", category: "enlace", maxPoints: 15, evidenceDecisionIds: ["voceria-apoderados", "voceria-medios", "zona-familiares"] },
    { id: "r-operaciones", title: "Sectoriza y coordina operaciones simultáneas", category: "operaciones", maxPoints: 10, evidenceDecisionIds: ["sectorizar-operaciones-escuela", "enlace-hospital"] },
    { id: "r-comunicaciones", title: "Establece comunicaciones integradas y PAI", category: "comunicaciones", maxPoints: 10, evidenceDecisionIds: ["plan-comunicaciones", "pai-inicial"] }
  ]
};
