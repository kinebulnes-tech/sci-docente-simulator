import type { Scenario } from "../../types/sci";

export const hazmatUrbanScenario: Scenario = {
  id: "fuga-gas-industrial-amoniaco",
  title: "Fuga de amoniaco en empresa industrial con exposición a zona residencial",
  type: "matpel",
  difficulty: "intermedio",
  summary: "Fuga de amoniaco (UN 1005) en planta frigorífica, nube visible, 4 trabajadores con síntomas respiratorios, zona residencial a 200 m.",
  briefing: "A las 08:35 se reporta fuga de amoniaco (UN 1005, clase 2.3) en sala de máquinas de planta frigorífica. Al arribo se observa nube blanquecina visible que se desplaza hacia zona residencial ubicada a 200 metros al norte. Cuatro trabajadores presentan irritación ocular, tos y dificultad respiratoria. Condiciones IDLH confirmadas en el perímetro de la planta. Brigada de emergencia de la empresa realizó evacuación parcial pero no cuenta con EPP nivel adecuado. Hospital regional fue notificado. Residentes en dirección de la nube no han sido alertados. La decisión crítica es evacuación versus confinamiento de la zona residencial.",
  learningObjectives: [
    "Establecer zonas caliente, tibia y fría para incidente con gas tóxico en área urbana",
    "Aplicar protocolos de descontaminación de víctimas previo al traslado hospitalario",
    "Evaluar y decidir entre evacuación activa y confinamiento según condiciones meteorológicas",
    "Coordinar respuesta multiagencia con SAMU, SEREMI Salud, SESMA y brigada empresarial"
  ],
  doctrinalForms: ["ICS 201", "ICS 202", "ICS 205", "ICS 211"],
  criticalErrors: ["epp-entrada-zona-caliente", "descontaminacion-previo-traslado"],
  initialMetrics: {
    risk: 72, control: 25, coordination: 28,
    lifeSafety: 30, propertyConservation: 45, complexity: 65
  },
  objectives: [
    {
      id: "zonas-gas-toxico",
      text: "Establecer zonas de trabajo para incidente con gas tóxico y controlar acceso.",
      priority: "vida",
      completedByDecisionIds: ["asumir-mando", "establecer-zonas-amoniaco", "consultar-erg-amoniaco"]
    },
    {
      id: "decontaminacion-victimas",
      text: "Descontaminar a todas las víctimas antes de trasladarlas al hospital.",
      priority: "vida",
      completedByDecisionIds: ["descontaminacion-previo-traslado", "activar-corredor-descon", "triaje-inicial"]
    },
    {
      id: "evacuacion-confinamiento",
      text: "Decidir e implementar evacuación o confinamiento de la zona residencial expuesta.",
      priority: "estabilizacion",
      completedByDecisionIds: ["evaluar-meteorologia", "decidir-evacuacion", "coordinacion-residentes"]
    },
    {
      id: "coordinacion-multiagencia",
      text: "Integrar SAMU, SEREMI Salud, SESMA y empresa en estructura de mando unificado.",
      priority: "continuidad",
      completedByDecisionIds: ["enlace-samu", "notificar-seremi-salud", "coordinacion-empresa", "mando-unificado"]
    }
  ],
  resources: [
    { id: "b1", name: "B-1 Primera respuesta MATPEL", type: "unidad", status: "disponible", capabilities: ["identificacion", "EPP nivel B", "confinamiento inicial"] },
    { id: "b2", name: "B-2 Segunda unidad", type: "unidad", status: "disponible", capabilities: ["apoyo operacional", "agua", "ventilacion"] },
    { id: "eq-matpel", name: "Equipo MATPEL Especializado", type: "equipo", status: "solicitado", etaMinutes: 14, capabilities: ["EPP nivel A", "medicion amoniaco", "entrada zona caliente"] },
    { id: "und-descon", name: "Unidad Descontaminación", type: "unidad", status: "solicitado", etaMinutes: 16, capabilities: ["ducha descontaminacion", "descon masiva", "triage"] },
    { id: "samu", name: "SAMU", type: "institucion", status: "solicitado", etaMinutes: 8, capabilities: ["triage", "atencion prehospitalaria", "traslado hospital"] },
    { id: "seremi-salud", name: "SEREMI Salud", type: "institucion", status: "disponible", capabilities: ["autoridad sanitaria", "evacuacion", "confinamiento", "alerta publica"] },
    { id: "sesma", name: "SESMA", type: "institucion", status: "disponible", capabilities: ["epidemiologia", "control sanitario", "coordinacion hospitales"] },
    { id: "empresa-frig", name: "Brigada Emergencia Empresa", type: "institucion", status: "disponible", capabilities: ["conocimiento planta", "cierre valvulas", "planos instalacion"] },
    { id: "carabineros", name: "Carabineros", type: "institucion", status: "solicitado", etaMinutes: 5, capabilities: ["evacuacion residencial", "perimetro externo", "trafico"] },
    { id: "pc", name: "Puesto de Comando", type: "instalacion", status: "disponible", capabilities: ["mando unificado", "coordinacion", "registro"] }
  ],
  hotspots: [
    { id: "fuga", label: "Punto de fuga amoniaco", x: 60, y: 50, kind: "riesgo", description: "Sala de máquinas frigorífica. Válvula dañada con fuga activa." },
    { id: "nube", label: "Nube de amoniaco", x: 55, y: 38, kind: "riesgo", description: "Nube blanquecina desplazándose al norte hacia zona residencial." },
    { id: "victimas", label: "4 trabajadores afectados", x: 65, y: 58, kind: "victima", description: "Irritación ocular, tos, disnea. Requieren descontaminación y triage." },
    { id: "zona-residencial", label: "Zona residencial expuesta", x: 55, y: 20, kind: "riesgo", description: "Población civil a 200 m. En trayectoria de la nube." },
    { id: "perimetro-planta", label: "Perímetro de planta", x: 68, y: 45, kind: "perimetro", description: "IDLH confirmado. Solo EPP nivel A." },
    { id: "pc", label: "PC sugerido", x: 25, y: 65, kind: "pc", description: "A favor del viento sur, fuera de zona de riesgo inmediato." }
  ],
  injects: [
    {
      id: "quinto-trabajador",
      minute: 6,
      title: "Quinto trabajador inconsciente hallado dentro de la planta",
      description: "La brigada de empresa reporta que encontraron un trabajador inconsciente en zona de máquinas. Solicitan ingreso de bomberos para rescate.",
      severity: "critica",
      metricImpact: { lifeSafety: -18, risk: 10, complexity: 12, coordination: -5 },
      expectedResponses: ["epp-entrada-zona-caliente", "establecer-zonas-amoniaco", "triaje-inicial"]
    },
    {
      id: "residentes-no-evacuan",
      minute: 12,
      title: "Residentes rechazan evacuar o no escuchan alertas",
      description: "Carabineros reporta que parte de los residentes se niegan a salir. Otros no responden en sus domicilios. Estimación: 40 personas no evacuadas.",
      severity: "alta",
      metricImpact: { lifeSafety: -12, coordination: -8, complexity: 10 },
      expectedResponses: ["decidir-evacuacion", "coordinacion-residentes", "notificar-seremi-salud"]
    },
    {
      id: "nube-intensifica",
      minute: 18,
      title: "Concentración de amoniaco aumenta en zona tibia",
      description: "Detector de multigas registra concentraciones sobre 300 ppm en zona tibia. Viento disminuye su velocidad. Nube estancada sobre área residencial.",
      severity: "critica",
      metricImpact: { risk: 15, lifeSafety: -10, complexity: 12, control: -8 },
      expectedResponses: ["establecer-zonas-amoniaco", "decidir-evacuacion", "epp-entrada-zona-caliente"]
    },
    {
      id: "hospital-alerta",
      minute: 22,
      title: "Hospital reporta saturación en Urgencias",
      description: "Hospital Regional informa que llegan víctimas sin descontaminación previa y el servicio de urgencias está en alerta roja. Solicitan protocolo.",
      severity: "alta",
      metricImpact: { coordination: -10, lifeSafety: -8, complexity: 8 },
      expectedResponses: ["descontaminacion-previo-traslado", "activar-corredor-descon", "enlace-samu"]
    }
  ],
  decisions: [
    {
      id: "asumir-mando",
      title: "Asumir mando y declarar incidente MATPEL nivel 2",
      description: "Asumir CI, declarar MATPEL nivel 2 por gas tóxico en área industrial con exposición urbana. Reporte inicial a radio y solicitar recursos especializados.",
      category: "mando",
      recommendedFromMinute: 0,
      recommendedUntilMinute: 3,
      metricImpact: { control: 12, coordination: 10, complexity: -4 },
      unlocks: ["establecer-zonas-amoniaco", "plan-comunicaciones", "consultar-erg-amoniaco"],
      penalizedIfRepeated: true,
      doctrineNotes: ["Mando temprano", "MATPEL nivel 2", "Cadena de mando"]
    },
    {
      id: "consultar-erg-amoniaco",
      title: "Consultar ERG Guía 125 para amoniaco anidro",
      description: "Usar ERG guía 125. Identificar distancias de aislamiento inicial, riesgos de salud, riesgo de incendio y acciones de respuesta recomendadas.",
      category: "planificacion",
      recommendedFromMinute: 1,
      recommendedUntilMinute: 6,
      metricImpact: { risk: -8, control: 6, complexity: -5 },
      requires: ["asumir-mando"],
      unlocks: ["establecer-zonas-amoniaco", "evaluar-meteorologia"],
      doctrineNotes: ["ERG guía 125", "NFPA 472", "Distancias de seguridad"]
    },
    {
      id: "establecer-zonas-amoniaco",
      title: "Establecer zonas de exclusión para gas tóxico",
      description: "Delimitar zona caliente (solo EPP nivel A), zona tibia (EPP nivel B, descontaminación) y zona fría (mando y apoyo). Señalizar y asignar control de acceso.",
      category: "seguridad",
      recommendedFromMinute: 2,
      recommendedUntilMinute: 8,
      metricImpact: { risk: -18, lifeSafety: 15, control: 12, coordination: 6 },
      requires: ["asumir-mando"],
      unlocks: ["epp-entrada-zona-caliente", "activar-corredor-descon", "triaje-inicial"],
      doctrineNotes: ["Zonificación MATPEL gas tóxico", "NFPA 472", "IDLH", "Control de acceso"]
    },
    {
      id: "epp-entrada-zona-caliente",
      title: "Verificar EPP nivel A antes de toda entrada a zona caliente",
      description: "Exigir EPP nivel A (traje encapsulado, SCBA) para todo personal que ingrese a zona caliente. Registrar nombre, hora de entrada y misión.",
      category: "seguridad",
      recommendedFromMinute: 4,
      recommendedUntilMinute: 15,
      metricImpact: { lifeSafety: 18, risk: -12, coordination: 4 },
      requires: ["establecer-zonas-amoniaco"],
      unlocks: ["rescate-trabajador"],
      doctrineNotes: ["EPP MATPEL", "NFPA 472 nivel operaciones", "Responsabilidad de entrada"]
    },
    {
      id: "triaje-inicial",
      title: "Establecer triaje médico en zona tibia",
      description: "Coordinar con SAMU para triaje START de los 4 trabajadores afectados en zona tibia, previo a descontaminación.",
      category: "operaciones",
      recommendedFromMinute: 4,
      recommendedUntilMinute: 14,
      metricImpact: { lifeSafety: 14, coordination: 8, control: 4 },
      requires: ["establecer-zonas-amoniaco"],
      unlocks: ["descontaminacion-previo-traslado"],
      doctrineNotes: ["Triage prehospitalario", "Coordinación SAMU", "Prioridad vida"]
    },
    {
      id: "descontaminacion-previo-traslado",
      title: "Descontaminar víctimas antes de traslado hospitalario",
      description: "Activar corredor de descontaminación. Todas las víctimas deben recibir descontaminación húmeda completa antes de ser trasladadas al hospital.",
      category: "operaciones",
      recommendedFromMinute: 6,
      recommendedUntilMinute: 20,
      metricImpact: { lifeSafety: 16, risk: -10, coordination: 8, propertyConservation: 5 },
      requires: ["triaje-inicial"],
      unlocks: ["enlace-samu"],
      doctrineNotes: ["Descontaminación MATPEL", "Protocolo hospitalario", "NFPA 472"]
    },
    {
      id: "activar-corredor-descon",
      title: "Activar corredor de descontaminación con unidad especializada",
      description: "Instalar sistema de ducha para descontaminación masiva en zona tibia. Asignar personal de unidad descontaminación. Definir flujo de pacientes.",
      category: "logistica",
      recommendedFromMinute: 8,
      recommendedUntilMinute: 20,
      metricImpact: { lifeSafety: 12, control: 8, coordination: 6 },
      requires: ["establecer-zonas-amoniaco"],
      doctrineNotes: ["Sistema de descontaminación", "Unidad descon", "Flujo de pacientes"]
    },
    {
      id: "evaluar-meteorologia",
      title: "Evaluar condiciones meteorológicas para evacuación o confinamiento",
      description: "Obtener velocidad y dirección de viento, condiciones de estabilidad atmosférica. Determinar si el confinamiento es viable o la evacuación es necesaria.",
      category: "planificacion",
      recommendedFromMinute: 5,
      recommendedUntilMinute: 15,
      metricImpact: { control: 8, coordination: 5, complexity: -6 },
      requires: ["consultar-erg-amoniaco"],
      unlocks: ["decidir-evacuacion"],
      doctrineNotes: ["Modelado de dispersión", "ERG", "Meteorología MATPEL"]
    },
    {
      id: "decidir-evacuacion",
      title: "Decidir e implementar evacuación de zona residencial",
      description: "Con base en condiciones meteorológicas y concentraciones medidas, ordenar evacuación activa de zona residencial. Coordinar con Carabineros y SEREMI Salud.",
      category: "operaciones",
      recommendedFromMinute: 8,
      recommendedUntilMinute: 20,
      metricImpact: { lifeSafety: 18, risk: -10, coordination: 8, complexity: 5 },
      requires: ["evaluar-meteorologia"],
      unlocks: ["coordinacion-residentes"],
      doctrineNotes: ["Evacuación protectora", "Zonas residenciales", "Decisión evacuación vs confinamiento"]
    },
    {
      id: "coordinacion-residentes",
      title: "Coordinar puntos de reunión y mensaje a la comunidad",
      description: "Establecer puntos de reunión para evacuados. Emitir mensaje claro a la comunidad sobre qué hacer, cómo salir y adónde ir.",
      category: "enlace",
      recommendedFromMinute: 10,
      recommendedUntilMinute: 25,
      metricImpact: { lifeSafety: 10, coordination: 8, complexity: -4 },
      requires: ["decidir-evacuacion"],
      doctrineNotes: ["Información pública emergencia", "Coordinación residentes", "Mensaje de alerta"]
    },
    {
      id: "plan-comunicaciones",
      title: "Establecer plan de comunicaciones multiagencia",
      description: "Asignar canales separados para mando, operaciones y enlace institucional. Definir frecuencias para SAMU, Carabineros, empresa y autoridades.",
      category: "comunicaciones",
      recommendedFromMinute: 3,
      recommendedUntilMinute: 12,
      metricImpact: { coordination: 14, complexity: -6 },
      requires: ["asumir-mando"],
      unlocks: ["enlace-samu", "notificar-seremi-salud", "coordinacion-empresa"],
      doctrineNotes: ["Comunicaciones integradas", "Terminología común", "Canales multiagencia"]
    },
    {
      id: "enlace-samu",
      title: "Enlazar con SAMU para coordinación médica",
      description: "Establecer coordinación con médico regulador SAMU. Definir hospital receptor, protocolo de descontaminación previa y número de víctimas.",
      category: "enlace",
      recommendedFromMinute: 5,
      recommendedUntilMinute: 18,
      metricImpact: { lifeSafety: 10, coordination: 10, complexity: -4 },
      requires: ["plan-comunicaciones"],
      doctrineNotes: ["Enlace SAMU", "Coordinación hospitalaria", "Cadena de atención"]
    },
    {
      id: "notificar-seremi-salud",
      title: "Notificar a SEREMI de Salud y SESMA",
      description: "Reportar incidente con gas tóxico a SEREMI Salud y SESMA. Informar número de afectados, producto, concentraciones y decisión de evacuación.",
      category: "enlace",
      recommendedFromMinute: 6,
      recommendedUntilMinute: 20,
      metricImpact: { coordination: 10, lifeSafety: 6, complexity: -5 },
      requires: ["plan-comunicaciones"],
      doctrineNotes: ["Notificación autoridad sanitaria", "SEREMI Salud", "Cadena de notificación"]
    },
    {
      id: "coordinacion-empresa",
      title: "Integrar brigada de empresa en estructura de mando",
      description: "Incorporar jefe de brigada como asesor técnico en el PC. Obtener planos de la planta, ubicación de válvulas de cierre y cantidad total de amoniaco en sistema.",
      category: "enlace",
      recommendedFromMinute: 4,
      recommendedUntilMinute: 15,
      metricImpact: { control: 8, coordination: 8, complexity: -6 },
      requires: ["plan-comunicaciones"],
      unlocks: ["mando-unificado", "rescate-trabajador"],
      doctrineNotes: ["Integración empresa", "Asesoría técnica", "Planos de instalación"]
    },
    {
      id: "mando-unificado",
      title: "Establecer mando unificado con instituciones presentes",
      description: "Formalizar mando unificado con representantes de SAMU, SEREMI Salud, Carabineros y empresa. Definir objetivos comunes y división de responsabilidades.",
      category: "mando",
      recommendedFromMinute: 15,
      metricImpact: { coordination: 16, control: 10, complexity: -8 },
      requires: ["coordinacion-empresa"],
      doctrineNotes: ["Mando unificado", "Multiagencia", "Objetivos comunes"]
    },
    {
      id: "rescate-trabajador",
      title: "Ordenar rescate del trabajador inconsciente con EPP nivel A",
      description: "Enviar equipo con EPP nivel A para rescate del trabajador inconsciente. Comunicar hora de entrada, ruta de salida y punto de descontaminación.",
      category: "operaciones",
      recommendedFromMinute: 8,
      recommendedUntilMinute: 20,
      metricImpact: { lifeSafety: 20, risk: 8, control: 4 },
      requires: ["epp-entrada-zona-caliente", "coordinacion-empresa"],
      doctrineNotes: ["Rescate MATPEL", "EPP nivel A", "Operaciones en IDLH"]
    }
  ],
  rubric: [
    { id: "r-mando", title: "Establece mando y declara MATPEL nivel 2", category: "mando", maxPoints: 10, evidenceDecisionIds: ["asumir-mando", "mando-unificado"] },
    { id: "r-zonas", title: "Establece zonas MATPEL para gas tóxico", category: "seguridad", maxPoints: 18, evidenceDecisionIds: ["establecer-zonas-amoniaco", "consultar-erg-amoniaco"], failCondition: "No se establecen zonas de trabajo diferenciadas para gas tóxico." },
    { id: "r-epp", title: "Verifica EPP adecuado antes de entrada a zona caliente", category: "seguridad", maxPoints: 18, evidenceDecisionIds: ["epp-entrada-zona-caliente", "rescate-trabajador"], failCondition: "Personal ingresa a zona caliente sin EPP nivel A verificado." },
    { id: "r-decon", title: "Descontamina víctimas antes del traslado hospitalario", category: "operaciones", maxPoints: 18, evidenceDecisionIds: ["descontaminacion-previo-traslado", "activar-corredor-descon", "triaje-inicial"], failCondition: "Víctimas trasladadas al hospital sin descontaminación previa." },
    { id: "r-evacuacion", title: "Decide e implementa protección de zona residencial", category: "operaciones", maxPoints: 16, evidenceDecisionIds: ["evaluar-meteorologia", "decidir-evacuacion", "coordinacion-residentes"] },
    { id: "r-multiagencia", title: "Coordina multiagencia con SAMU, SEREMI y empresa", category: "enlace", maxPoints: 12, evidenceDecisionIds: ["enlace-samu", "notificar-seremi-salud", "coordinacion-empresa"] },
    { id: "r-comunicaciones", title: "Establece comunicaciones integradas y PAI", category: "comunicaciones", maxPoints: 8, evidenceDecisionIds: ["plan-comunicaciones"] }
  ]
};
