import type { Scenario } from "../../types/sci";

export const multiagencyComplexScenario: Scenario = {
  id: "explosion-terminal-buses-multiagencia",
  title: "Explosión en terminal de buses con incendio, víctimas y amenaza MATPEL",
  type: "multiagencia",
  difficulty: "avanzado",
  summary: "Explosión en bodega de terminal de buses, 25 víctimas, 6 críticos, incendio activo, humo negro denso, carga química desconocida en bodega adyacente, 6 instituciones respondiendo.",
  briefing: "A las 11:03 ocurre explosión en bodega de encomiendas del Terminal Central de Buses. Incendio activo con llamas visibles y humo negro denso. 25 víctimas confirmadas, 6 en estado crítico con posible exposición química. Bodega adyacente contiene carga química no identificada con placas MATPEL parcialmente visibles. Responden simultáneamente: Bomberos (incendio y rescate), Carabineros (seguridad y evidencia por posible artefacto), SAMU (atención médica), SEREMI de Salud (MATPEL y salud pública), administración del terminal y Municipio (EOC activado). Cobertura mediática nacional en vivo. Múltiples períodos operacionales necesarios. Riesgo de explosión secundaria no descartado. Ninguna agencia ha asumido coordinación formal aún.",
  learningObjectives: [
    "Establecer Comando Unificado funcional con mínimo tres agencias coordinando bajo un solo plan de acción",
    "Diseñar y ejecutar planificación de períodos operacionales con objetivos diferenciados por período",
    "Instalar Centro de Información Conjunta (PIO conjunto) con representantes de todas las agencias involucradas",
    "Integrar operaciones MATPEL con rescate activo sin comprometer seguridad de respondedores",
    "Coordinar logística multiagencia incluyendo área de escenificación, comunicaciones conjuntas y recursos compartidos"
  ],
  doctrinalForms: ["ICS 201", "ICS 202", "ICS 205", "ICS 207", "ICS 209"],
  criticalErrors: ["establecer-comando-unificado", "aislar-zona-matpel", "nombrar-pio-conjunto"],
  initialMetrics: {
    risk: 92,
    control: 12,
    coordination: 15,
    lifeSafety: 18,
    propertyConservation: 15,
    complexity: 95
  },
  objectives: [
    {
      id: "vida-respondedores-victimas",
      text: "Proteger la vida de todas las víctimas y respondedores mediante rescate seguro y atención priorizada.",
      priority: "vida",
      completedByDecisionIds: ["establecer-comando-unificado", "aislar-zona-matpel", "oficial-seguridad-cu", "rescate-integrado-matpel", "activar-triage-terminal"]
    },
    {
      id: "estabilizar-incendio-matpel",
      text: "Estabilizar el incendio y controlar la amenaza química sin generar exposición secundaria.",
      priority: "estabilizacion",
      completedByDecisionIds: ["aislar-zona-matpel", "identificar-matpel", "ataque-incendio-coordinado", "zona-exclusion-quimica"]
    },
    {
      id: "propiedad-terminal",
      text: "Limitar daños al terminal y estructuras adyacentes controlando propagación.",
      priority: "propiedad",
      completedByDecisionIds: ["ataque-incendio-coordinado", "evacuar-terminal", "solicitar-recursos-regionales"]
    },
    {
      id: "ambiente-quimico",
      text: "Prevenir contaminación ambiental por derrame o dispersión de carga química.",
      priority: "ambiente",
      completedByDecisionIds: ["aislar-zona-matpel", "identificar-matpel", "zona-exclusion-quimica", "notificar-seremi-salud"]
    },
    {
      id: "continuidad-operacional",
      text: "Mantener coordinación institucional sostenida a través de períodos operacionales documentados.",
      priority: "continuidad",
      completedByDecisionIds: ["establecer-comando-unificado", "iniciar-planificacion-segundo-periodo", "nombrar-pio-conjunto", "area-escenificacion", "pai-multiagencia"]
    }
  ],
  resources: [
    {
      id: "b1-terminal",
      name: "B-1 Compañía mando y ataque",
      type: "unidad",
      status: "disponible",
      capabilities: ["incendio estructural", "rescate", "mando inicial", "MATPEL nivel 1"]
    },
    {
      id: "b-matpel",
      name: "Carro MATPEL Bomberos",
      type: "unidad",
      status: "solicitado",
      etaMinutes: 15,
      capabilities: ["identificacion quimica", "contencion derrames", "descontaminacion", "MATPEL nivel 2"]
    },
    {
      id: "b-rescate",
      name: "Carro Rescate Pesado",
      type: "unidad",
      status: "solicitado",
      etaMinutes: 10,
      capabilities: ["rescate estructural", "acceso forzado", "soporte victimas"]
    },
    {
      id: "carabineros-cu",
      name: "Carabineros – Prefectura",
      type: "institucion",
      status: "disponible",
      capabilities: ["seguridad publica", "perimetro", "investigacion", "control accesos", "manejo de multitudes"]
    },
    {
      id: "samu-cu",
      name: "SAMU – Coordinador médico",
      type: "institucion",
      status: "disponible",
      capabilities: ["triage masivo", "atencion prehospitalaria avanzada", "coordinacion hospitalaria", "descontaminacion victimas"]
    },
    {
      id: "seremi-salud",
      name: "SEREMI de Salud",
      type: "institucion",
      status: "solicitado",
      etaMinutes: 20,
      capabilities: ["identificacion MATPEL", "salud publica", "alerta epidemiologica", "zonificacion quimica", "protocolo descontaminacion"]
    },
    {
      id: "admin-terminal",
      name: "Administración del Terminal",
      type: "institucion",
      status: "disponible",
      capabilities: ["informacion instalaciones", "manifiestos de carga", "comunicacion interna", "conocimiento rutas"]
    },
    {
      id: "municipio-eoc",
      name: "Municipio – Centro EOC activado",
      type: "institucion",
      status: "disponible",
      capabilities: ["evacuacion comunitaria", "albergues", "soporte logistico", "comunicacion publica"]
    },
    {
      id: "bomberos-regionales",
      name: "Compañías regionales (refuerzo)",
      type: "unidad",
      status: "solicitado",
      etaMinutes: 40,
      capabilities: ["agua", "foam", "relevo dotaciones", "apoyo logistico"]
    },
    {
      id: "pc-unificado",
      name: "PC Unificado – exterior terminal",
      type: "instalacion",
      status: "disponible",
      capabilities: ["mando", "coordinacion multiagencia", "registro", "comunicaciones"]
    },
    {
      id: "area-escenificacion-instalacion",
      name: "Área de escenificación – estacionamiento norte",
      type: "instalacion",
      status: "disponible",
      capabilities: ["concentracion recursos", "staging", "logistica"]
    }
  ],
  hotspots: [
    { id: "explosion-bodega", label: "Bodega explosión – foco principal", x: 55, y: 48, kind: "fuego", description: "Bodega de encomiendas con incendio activo post-explosión. Estructura comprometida." },
    { id: "bodega-matpel", label: "Bodega adyacente – carga química", x: 68, y: 48, kind: "riesgo", description: "Placas MATPEL 1203 y 1090 parcialmente visibles. Contenido exacto desconocido." },
    { id: "zona-victimas", label: "Zona de víctimas – andén central", x: 45, y: 60, kind: "victima", description: "25 víctimas en andén central. 6 inconscientes con posible exposición química." },
    { id: "humo-denso", label: "Pluma de humo negro denso", x: 60, y: 30, kind: "riesgo", description: "Humo negro indica posible combustión de sustancias sintéticas. Dirección noreste." },
    { id: "pc-unificado-spot", label: "PC Unificado propuesto", x: 25, y: 75, kind: "pc", description: "Exterior noreste del terminal, fuera de zona de riesgo, con visibilidad y acceso." },
    { id: "area-staging", label: "Área de escenificación", x: 20, y: 40, kind: "recurso", description: "Estacionamiento norte del terminal para concentración y asignación de recursos." },
    { id: "zona-descon", label: "Zona descontaminación", x: 30, y: 85, kind: "recurso", description: "Área propuesta para descontaminación de víctimas con exposición química." },
    { id: "medios-vivo", label: "Posición medios en vivo", x: 10, y: 60, kind: "riesgo", description: "Múltiples cámaras nacionales transmitiendo en vivo desde perímetro exterior." }
  ],
  injects: [
    {
      id: "nueva-identificacion-matpel",
      minute: 15,
      title: "Identificación de carga química: metanol y amoniaco anhidro",
      description: "El manifiesto de carga del terminal confirma: bodega adyacente contiene 12 tambores de metanol (1230) y 4 cilindros de amoniaco anhidro (1005). Riesgo de explosión secundaria elevado.",
      severity: "critica",
      metricImpact: { risk: 20, control: -12, lifeSafety: -10, complexity: 15 },
      expectedResponses: ["aislar-zona-matpel", "zona-exclusion-quimica", "notificar-seremi-salud", "solicitar-recursos-regionales"]
    },
    {
      id: "amenaza-explosion-secundaria",
      minute: 28,
      title: "Riesgo de explosión secundaria en bodega MATPEL",
      description: "Bomberos MATPEL confirma temperatura crítica en tambores de metanol. Se estima riesgo de deflagración en los próximos 15-20 minutos si no se controla incendio.",
      severity: "critica",
      metricImpact: { risk: 25, control: -15, lifeSafety: -12, complexity: 10 },
      expectedResponses: ["zona-exclusion-quimica", "ataque-incendio-coordinado", "evacuar-terminal", "solicitar-recursos-regionales"]
    },
    {
      id: "medios-cobertura-nacional",
      minute: 20,
      title: "Cadena nacional de televisión transmite en vivo desde el interior",
      description: "Un periodista logró acceso al interior del terminal y transmite en vivo. Familiares llaman exigiendo información. Redes sociales difunden imágenes de las víctimas.",
      severity: "media",
      metricImpact: { coordination: -10, complexity: 8 },
      expectedResponses: ["nombrar-pio-conjunto", "coordinar-mensaje-multiagencia", "notificar-carabineros-medios"]
    },
    {
      id: "llegada-autoridad-politica",
      minute: 35,
      title: "Arribo de Gobernador Regional y Subsecretario del Interior",
      description: "El Gobernador Regional y el Subsecretario del Interior llegan al PC exigiendo información inmediata y anunciando a medios que están a cargo de la coordinación.",
      severity: "alta",
      metricImpact: { coordination: -8, complexity: 10 },
      expectedResponses: ["establecer-comando-unificado", "nombrar-pio-conjunto", "pai-multiagencia"]
    },
    {
      id: "escasez-recursos-2h",
      minute: 50,
      title: "Fatiga de dotaciones y escasez de recursos al inicio de segunda hora",
      description: "Tres dotaciones de Bomberos reportan fatiga y consumo de aire. SAMU declara que ha enviado todos sus recursos disponibles. Se necesita planificación del segundo período operacional.",
      severity: "alta",
      metricImpact: { control: -10, lifeSafety: -6, coordination: -6, complexity: 8 },
      expectedResponses: ["iniciar-planificacion-segundo-periodo", "solicitar-recursos-regionales", "area-escenificacion"]
    }
  ],
  decisions: [
    {
      id: "asumir-mando-transitorio",
      title: "Asumir mando transitorio Bomberos hasta establecer CU",
      description: "Bomberos asume mando transitorio del incidente, notifica a todas las agencias presentes la necesidad inmediata de establecer Comando Unificado y convoca reunión en PC.",
      category: "mando",
      recommendedFromMinute: 0,
      recommendedUntilMinute: 5,
      metricImpact: { control: 10, coordination: 8, complexity: -3 },
      unlocks: ["establecer-comando-unificado", "oficial-seguridad-cu", "comunicaciones-cu"],
      penalizedIfRepeated: true,
      doctrineNotes: ["Mando transitorio", "Terminología común", "Preparación para Comando Unificado", "Cadena de mando"]
    },
    {
      id: "establecer-comando-unificado",
      title: "Establecer Comando Unificado formal (Bomberos, Carabineros, SAMU)",
      description: "Reunir CI de Bomberos, Jefe de Carabineros y Coordinador SAMU en PC. Establecer CU formal con un solo PAI, área de mando compartida y vocería unificada. Documentar en ICS 207.",
      category: "mando",
      recommendedFromMinute: 3,
      recommendedUntilMinute: 12,
      metricImpact: { coordination: 20, control: 15, complexity: -10, lifeSafety: 8 },
      requires: ["asumir-mando-transitorio"],
      unlocks: ["pai-multiagencia", "nombrar-pio-conjunto", "area-escenificacion", "iniciar-planificacion-segundo-periodo"],
      penalizedIfRepeated: true,
      doctrineNotes: ["Comando Unificado NIMS/ICS", "Un solo PAI", "Coordinación multiagencia", "ICS 207 Organigrama"]
    },
    {
      id: "aislar-zona-matpel",
      title: "Aislar zona MATPEL y establecer zona de exclusión química",
      description: "Declarar zona caliente química alrededor de bodega adyacente. Retirar todo personal no MATPEL. Solicitar carro MATPEL. Detener rescate en zona de exposición hasta evaluación.",
      category: "seguridad",
      recommendedFromMinute: 2,
      recommendedUntilMinute: 10,
      metricImpact: { risk: -18, lifeSafety: 14, control: 8, complexity: -6 },
      requires: ["asumir-mando-transitorio"],
      unlocks: ["identificar-matpel", "zona-exclusion-quimica", "notificar-seremi-salud"],
      penalizedIfRepeated: true,
      doctrineNotes: ["Seguridad MATPEL", "Zonas caliente, tibia y fría", "Protección de respondedores", "Responsabilidad"]
    },
    {
      id: "oficial-seguridad-cu",
      title: "Designar Oficial de Seguridad con autoridad sobre todos los respondedores",
      description: "Nombrar Oficial de Seguridad con autoridad para detener operaciones de cualquier agencia. Responsable de EPP, ingreso y evaluación dinámica de riesgo químico e incendio.",
      category: "seguridad",
      recommendedFromMinute: 2,
      recommendedUntilMinute: 10,
      metricImpact: { risk: -14, lifeSafety: 12, coordination: 6 },
      requires: ["asumir-mando-transitorio"],
      unlocks: ["rescate-integrado-matpel"],
      doctrineNotes: ["Responsabilidad", "Seguridad multiagencia", "Autoridad sobre todas las agencias en zona caliente"]
    },
    {
      id: "activar-triage-terminal",
      title: "Activar triage START y establecer zona de tratamiento fuera de zona química",
      description: "SAMU lidera triage START de las 25 víctimas. Zona de tratamiento ubicada fuera de la zona de exclusión MATPEL. Incluye corredor de descontaminación para víctimas con exposición.",
      category: "operaciones",
      recommendedFromMinute: 4,
      recommendedUntilMinute: 12,
      metricImpact: { lifeSafety: 18, control: 8, coordination: 8, risk: -4 },
      requires: ["aislar-zona-matpel", "oficial-seguridad-cu"],
      unlocks: ["rescate-integrado-matpel"],
      doctrineNotes: ["Triage START masivo", "Integración MATPEL con operaciones médicas", "Descontaminación de víctimas"]
    },
    {
      id: "comunicaciones-cu",
      title: "Establecer plan de comunicaciones conjunto para todas las agencias",
      description: "Asignar canales por función: mando CU, operaciones Bomberos, operaciones SAMU, Carabineros, MATPEL. Confirmar con todos los representantes del CU. Documentar en ICS 205.",
      category: "comunicaciones",
      recommendedFromMinute: 3,
      recommendedUntilMinute: 12,
      metricImpact: { coordination: 16, complexity: -10, control: 8 },
      requires: ["asumir-mando-transitorio"],
      doctrineNotes: ["Comunicaciones integradas", "ICS 205", "Terminología común", "Canal por función"]
    },
    {
      id: "evacuacion-terminal",
      title: "Ordenar evacuación completa del terminal de buses",
      description: "Coordinar con Carabineros, municipio y seguridad del terminal para evacuar todas las personas del recinto. Designar punto de reunión y registro de evacuados.",
      category: "seguridad",
      recommendedFromMinute: 5,
      recommendedUntilMinute: 15,
      metricImpact: { lifeSafety: 12, risk: -10, control: 6, complexity: -4 },
      requires: ["establecer-comando-unificado"],
      doctrineNotes: ["Evacuación", "Seguridad pública", "Coordinación Carabineros-Municipio"]
    },
    {
      id: "identificar-matpel",
      title: "Identificar carga química y consultar ERG",
      description: "Carro MATPEL identifica productos usando Guía ERG, placas y manifiestos. Determina zonas de seguridad, EPP requerido y posibles reacciones. Informa al CU y SEREMI Salud.",
      category: "operaciones",
      recommendedFromMinute: 15,
      recommendedUntilMinute: 30,
      metricImpact: { risk: -16, control: 12, coordination: 8, complexity: -8 },
      requires: ["aislar-zona-matpel"],
      unlocks: ["zona-exclusion-quimica", "ataque-incendio-coordinado"],
      doctrineNotes: ["Identificación MATPEL", "Guía ERG", "Integración con SEREMI Salud", "Manejo por objetivos"]
    },
    {
      id: "zona-exclusion-quimica",
      title: "Establecer zonas caliente, tibia y fría diferenciadas para MATPEL",
      description: "Basado en identificación ERG, delimitar zonas con radios específicos. Zona caliente solo MATPEL nivel 2+. Zona tibia con EPP nivel B. Zona fría para mando y apoyo.",
      category: "seguridad",
      recommendedFromMinute: 20,
      recommendedUntilMinute: 35,
      metricImpact: { risk: -20, lifeSafety: 14, control: 10, complexity: -6 },
      requires: ["identificar-matpel"],
      doctrineNotes: ["Zonificación MATPEL", "Zonas caliente tibia fría", "Responsabilidad", "Seguridad química"]
    },
    {
      id: "notificar-seremi-salud",
      title: "Notificar e integrar SEREMI de Salud al Comando Unificado",
      description: "Formalizar participación de SEREMI Salud en CU. Asignar responsabilidad sobre protocolo de descontaminación, alerta epidemiológica y seguimiento de expuestos.",
      category: "enlace",
      recommendedFromMinute: 8,
      recommendedUntilMinute: 20,
      metricImpact: { coordination: 12, lifeSafety: 8, complexity: -4 },
      requires: ["aislar-zona-matpel"],
      unlocks: ["zona-exclusion-quimica"],
      doctrineNotes: ["Enlace multiagencia", "Comando Unificado ampliado", "Integración salud pública"]
    },
    {
      id: "rescate-integrado-matpel",
      title: "Ejecutar rescate integrado con protocolo MATPEL activo",
      description: "Retomar rescate de víctimas con EPP adecuado, corredor de descontaminación activo y coordinación entre Bomberos rescate, MATPEL y SAMU en zona tibia.",
      category: "operaciones",
      recommendedFromMinute: 22,
      recommendedUntilMinute: 40,
      metricImpact: { lifeSafety: 16, control: 8, risk: -6, coordination: 6 },
      requires: ["activar-triage-terminal", "oficial-seguridad-cu", "identificar-matpel"],
      doctrineNotes: ["Integración MATPEL con rescate", "Operaciones coordinadas", "Seguridad de respondedores"]
    },
    {
      id: "ataque-incendio-coordinado",
      title: "Coordinar ataque al incendio con restricción por MATPEL",
      description: "Diseñar táctica de ataque al incendio que evite aplicación de agua a tambores de metanol. Usar espuma AFFF. Coordinar con Bomberos MATPEL la estrategia defensiva/ofensiva.",
      category: "operaciones",
      recommendedFromMinute: 25,
      recommendedUntilMinute: 45,
      metricImpact: { control: 14, propertyConservation: 12, risk: -10, complexity: -6 },
      requires: ["identificar-matpel", "establecer-comando-unificado"],
      doctrineNotes: ["Tácticas de incendio con MATPEL", "Uso de espuma", "Coordinación operacional"]
    },
    {
      id: "area-escenificacion",
      title: "Establecer y activar área de escenificación formal",
      description: "Designar estacionamiento norte como área de escenificación. Asignar Jefe de Escenificación. Todas las unidades se reportan allí antes de asignación. Registrar y controlar recursos.",
      category: "logistica",
      recommendedFromMinute: 8,
      recommendedUntilMinute: 20,
      metricImpact: { control: 12, coordination: 10, complexity: -8 },
      requires: ["establecer-comando-unificado"],
      doctrineNotes: ["Área de escenificación ICS", "Alcance de control", "Gestión integral de recursos", "Logística"]
    },
    {
      id: "nombrar-pio-conjunto",
      title: "Nombrar Oficial de Información Pública conjunto y establecer JIC",
      description: "CU designa PIO conjunto con representantes de Bomberos, Carabineros y SAMU. Establece Centro de Información Conjunto (JIC) fuera del PC. Una sola voz a medios por agencia.",
      category: "enlace",
      recommendedFromMinute: 10,
      recommendedUntilMinute: 22,
      metricImpact: { coordination: 14, complexity: -8, lifeSafety: 4 },
      requires: ["establecer-comando-unificado"],
      unlocks: ["coordinar-mensaje-multiagencia"],
      penalizedIfRepeated: true,
      doctrineNotes: ["Información pública NIMS", "Centro de Información Conjunto JIC", "Un solo mensaje por incidente"]
    },
    {
      id: "coordinar-mensaje-multiagencia",
      title: "Coordinar mensaje unificado ante cobertura mediática nacional",
      description: "PIO conjunto emite comunicado oficial con datos verificados. Informa sobre incidente, acciones en curso, restricción de zona y canalización de consultas de familiares.",
      category: "enlace",
      recommendedFromMinute: 20,
      recommendedUntilMinute: 40,
      metricImpact: { coordination: 10, complexity: -6, lifeSafety: 4 },
      requires: ["nombrar-pio-conjunto"],
      doctrineNotes: ["Gestión de información en emergencias", "Comunicación pública unificada", "JIC operativo"]
    },
    {
      id: "notificar-carabineros-medios",
      title: "Coordinar con Carabineros exclusión de medios de zona operacional",
      description: "Instrucciones a Carabineros para retirar equipos de medios que ingresaron a zona operacional. Establecer posición oficial de medios fuera del perímetro de seguridad.",
      category: "seguridad",
      recommendedFromMinute: 20,
      recommendedUntilMinute: 30,
      metricImpact: { risk: -8, control: 6, coordination: 6 },
      requires: ["establecer-comando-unificado"],
      doctrineNotes: ["Seguridad perimetral", "Gestión de medios", "Coordinación Bomberos-Carabineros"]
    },
    {
      id: "solicitar-recursos-regionales",
      title: "Solicitar recursos adicionales a nivel regional",
      description: "CU solicita al COSEM regional: compañías adicionales, más unidades SAMU, soporte logístico y eventual apoyo CONAF si hay propagación. Justificar con ICS 209.",
      category: "recursos",
      recommendedFromMinute: 20,
      recommendedUntilMinute: 40,
      metricImpact: { control: 10, coordination: 8, lifeSafety: 6 },
      requires: ["establecer-comando-unificado"],
      doctrineNotes: ["Escalamiento regional", "ICS 209 Informe de situación", "Gestión integral de recursos"]
    },
    {
      id: "pai-multiagencia",
      title: "Formalizar PAI multiagencia para primer período operacional",
      description: "CU redacta y aprueba PAI conjunto con objetivos del período, asignación de recursos por agencia, comunicaciones, seguridad y logística. Distribuir a todos los representantes del CU.",
      category: "planificacion",
      recommendedFromMinute: 15,
      recommendedUntilMinute: 30,
      metricImpact: { control: 14, coordination: 14, complexity: -10 },
      requires: ["establecer-comando-unificado", "comunicaciones-cu"],
      unlocks: ["iniciar-planificacion-segundo-periodo"],
      doctrineNotes: ["PAI multiagencia", "ICS 202", "Planificación", "Manejo por objetivos"]
    },
    {
      id: "iniciar-planificacion-segundo-periodo",
      title: "Iniciar planificación del segundo período operacional",
      description: "CU convoca reunión de planificación del segundo período. Evaluar avances, víctimas pendientes, estado MATPEL, fatiga de dotaciones y recursos necesarios para el siguiente turno.",
      category: "planificacion",
      recommendedFromMinute: 45,
      metricImpact: { control: 12, coordination: 10, complexity: -8 },
      requires: ["pai-multiagencia", "establecer-comando-unificado"],
      doctrineNotes: ["Planificación de períodos operacionales", "Ciclo de planificación ICS", "Sostenibilidad de la respuesta"]
    }
  ],
  rubric: [
    {
      id: "r-comando-unificado",
      title: "Coordina Comando Unificado efectivo con mínimo tres agencias",
      category: "mando",
      maxPoints: 20,
      evidenceDecisionIds: ["establecer-comando-unificado", "asumir-mando-transitorio", "notificar-seremi-salud"],
      failCondition: "No establece CU formal antes del minuto 15"
    },
    {
      id: "r-seguridad-matpel",
      title: "Aísla y gestiona amenaza MATPEL protegiendo respondedores y público",
      category: "seguridad",
      maxPoints: 20,
      evidenceDecisionIds: ["aislar-zona-matpel", "identificar-matpel", "zona-exclusion-quimica", "oficial-seguridad-cu"],
      failCondition: "No aísla zona MATPEL antes del minuto 10"
    },
    {
      id: "r-operaciones-integradas",
      title: "Ejecuta operaciones de rescate e incendio integradas con MATPEL",
      category: "operaciones",
      maxPoints: 18,
      evidenceDecisionIds: ["activar-triage-terminal", "rescate-integrado-matpel", "ataque-incendio-coordinado"]
    },
    {
      id: "r-planificacion-periodos",
      title: "Planifica períodos operacionales y formaliza PAI multiagencia",
      category: "planificacion",
      maxPoints: 15,
      evidenceDecisionIds: ["pai-multiagencia", "iniciar-planificacion-segundo-periodo"],
      failCondition: "No formaliza PAI multiagencia en el primer período operacional"
    },
    {
      id: "r-pio-jic",
      title: "Establece PIO conjunto y Centro de Información Conjunta",
      category: "enlace",
      maxPoints: 12,
      evidenceDecisionIds: ["nombrar-pio-conjunto", "coordinar-mensaje-multiagencia", "notificar-carabineros-medios"],
      failCondition: "No nombra PIO conjunto antes del minuto 25"
    },
    {
      id: "r-comunicaciones-cu",
      title: "Ordena comunicaciones integradas para todas las agencias del CU",
      category: "comunicaciones",
      maxPoints: 8,
      evidenceDecisionIds: ["comunicaciones-cu", "area-escenificacion"]
    },
    {
      id: "r-recursos-logistica",
      title: "Gestiona recursos, escenificación y escalamiento regional",
      category: "logistica",
      maxPoints: 7,
      evidenceDecisionIds: ["area-escenificacion", "solicitar-recursos-regionales", "evacuacion-terminal"]
    }
  ]
};
