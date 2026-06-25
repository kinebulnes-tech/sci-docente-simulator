import type { Scenario } from "../../types/sci";

export const hazmatMinorScenario: Scenario = {
  id: "derrame-combustible-menor",
  title: "Derrame de combustible en colisión vehicular con amenaza de alcantarillado",
  type: "matpel",
  difficulty: "basico",
  summary: "Colisión de camión repartidor, derrame de ~200 L de diésel, sin lesionados, alcantarilla pluvial a 5 metros, zona comercial.",
  briefing: "A las 10:15 se reporta colisión entre camión repartidor y un vehículo liviano en zona comercial. Al arribo se observa derrame activo de aproximadamente 200 litros de diésel sobre la calzada. No hay víctimas con lesiones visibles. La alcantarilla pluvial está a 5 metros del derrame y el líquido avanza hacia ella. El placardo del camión no es claramente visible desde la calle. Transeúntes se acumulan en los bordes. La empresa distribuidora no ha sido notificada. Autoridades ambientales desconocen el evento.",
  learningObjectives: [
    "Identificar correctamente el material peligroso mediante placardo y documentación del vehículo",
    "Establecer y comunicar zonas de trabajo caliente, tibia y fría conforme a doctrina MATPEL",
    "Aplicar procedimientos de contención básica para evitar contaminación de alcantarillado",
    "Notificar a autoridad ambiental SEREMI y coordinar con empresa responsable del derrame"
  ],
  doctrinalForms: ["ICS 201", "ICS 202", "ICS 205"],
  criticalErrors: ["establecer-zonas", "notificar-seremi"],
  initialMetrics: {
    risk: 45, control: 40, coordination: 35,
    lifeSafety: 55, propertyConservation: 42, complexity: 35
  },
  objectives: [
    {
      id: "identificacion-matpel",
      text: "Identificar el material peligroso y sus riesgos antes de aproximarse.",
      priority: "vida",
      completedByDecisionIds: ["leer-placardo", "solicitar-documentos", "consultar-erg"]
    },
    {
      id: "zonas-trabajo",
      text: "Establecer zonas caliente, tibia y fría con control de acceso.",
      priority: "estabilizacion",
      completedByDecisionIds: ["establecer-zonas", "control-acceso-civil"]
    },
    {
      id: "contencion-derrame",
      text: "Contener el derrame evitando que alcance la red de alcantarillado.",
      priority: "ambiente",
      completedByDecisionIds: ["contener-alcantarilla", "aplicar-absorbente", "diques-contension"]
    },
    {
      id: "notificacion-ambiental",
      text: "Notificar a SEREMI del Medio Ambiente y empresa responsable.",
      priority: "continuidad",
      completedByDecisionIds: ["notificar-seremi", "contactar-empresa"]
    }
  ],
  resources: [
    { id: "b1", name: "B-1 Primera respuesta MATPEL", type: "unidad", status: "disponible", capabilities: ["identificacion", "contencion basica", "EPP nivel B"] },
    { id: "eq-matpel", name: "Equipo MATPEL Especializado", type: "equipo", status: "solicitado", etaMinutes: 12, capabilities: ["EPP nivel A", "contencion avanzada", "muestreo"] },
    { id: "und-descon", name: "Unidad Descontaminación", type: "unidad", status: "solicitado", etaMinutes: 15, capabilities: ["descontaminacion personal", "descontaminacion equipo"] },
    { id: "carabineros", name: "Carabineros", type: "institucion", status: "solicitado", etaMinutes: 6, capabilities: ["transito", "perimetro externo", "seguridad publica"] },
    { id: "seremi-ma", name: "SEREMI Medio Ambiente", type: "institucion", status: "disponible", capabilities: ["autoridad ambiental", "notificacion", "coordinacion limpieza"] },
    { id: "empresa-resp", name: "Empresa responsable del camión", type: "institucion", status: "disponible", capabilities: ["hoja de datos seguridad", "empresa limpieza", "responsabilidad civil"] },
    { id: "pc", name: "Puesto de Comando", type: "instalacion", status: "disponible", capabilities: ["mando", "coordinacion", "registro"] }
  ],
  hotspots: [
    { id: "derrame", label: "Zona de derrame diésel", x: 55, y: 48, kind: "riesgo", description: "Charco activo de ~200 L sobre calzada, expansión en curso." },
    { id: "alcantarilla", label: "Alcantarilla pluvial", x: 62, y: 55, kind: "riesgo", description: "Sumidero a 5 m del derrame. Diésel avanza hacia él." },
    { id: "camion", label: "Camión repartidor", x: 50, y: 44, kind: "recurso", description: "Vehículo siniestrado. Placardo en parte trasera." },
    { id: "zona-caliente", label: "Zona caliente", x: 55, y: 48, kind: "perimetro", description: "Radio mínimo 10 m del derrame. Solo personal con EPP adecuado." },
    { id: "pc", label: "PC sugerido", x: 25, y: 30, kind: "pc", description: "Posición a favor del viento, con visión del área." }
  ],
  injects: [
    {
      id: "alcantarilla-contaminada",
      minute: 7,
      title: "Se detecta diésel ingresando a la red de alcantarillado",
      description: "Un transeúnte reporta mancha aceitosa visible en la boca de tormenta. El diésel ya está entrando al sistema pluvial.",
      severity: "alta",
      metricImpact: { risk: 12, propertyConservation: -15, coordination: -5, complexity: 10 },
      expectedResponses: ["contener-alcantarilla", "notificar-seremi", "diques-contension"]
    },
    {
      id: "seremi-arriba",
      minute: 18,
      title: "Funcionario de SEREMI llega al lugar",
      description: "Inspector de SEREMI del Medio Ambiente solicita informe de la situación, volumen derramado y acciones de contención tomadas.",
      severity: "media",
      metricImpact: { coordination: 10, complexity: 5 },
      expectedResponses: ["notificar-seremi", "contactar-empresa", "pai-inicial"]
    },
    {
      id: "cambio-viento",
      minute: 14,
      title: "Cambio de dirección del viento",
      description: "Viento gira 90°. Vapores de diésel ahora se dirigen hacia zona de trabajo tibia donde espera personal.",
      severity: "alta",
      metricImpact: { risk: 15, lifeSafety: -10, complexity: 8 },
      expectedResponses: ["establecer-zonas", "reubicar-pc", "control-acceso-civil"]
    }
  ],
  decisions: [
    {
      id: "asumir-mando",
      title: "Asumir mando y declarar incidente MATPEL",
      description: "Informar arribo, asumir CI, declarar incidente MATPEL nivel 1, nombrar incidente, reporte inicial a radio.",
      category: "mando",
      recommendedFromMinute: 0,
      recommendedUntilMinute: 3,
      metricImpact: { control: 12, coordination: 10, complexity: -4 },
      unlocks: ["leer-placardo", "establecer-zonas", "plan-comunicaciones"],
      penalizedIfRepeated: true,
      doctrineNotes: ["Mando temprano", "Terminología común", "Cadena de mando"]
    },
    {
      id: "leer-placardo",
      title: "Identificar placardo y número ONU del camión",
      description: "Leer placardo a distancia segura. Identificar número ONU (diésel: UN 1202), usar ERG para guía inicial.",
      category: "operaciones",
      recommendedFromMinute: 1,
      recommendedUntilMinute: 6,
      metricImpact: { risk: -8, control: 8, lifeSafety: 8 },
      requires: ["asumir-mando"],
      unlocks: ["consultar-erg", "establecer-zonas"],
      doctrineNotes: ["Identificación de MATPEL", "ERG", "Acercamiento seguro"]
    },
    {
      id: "consultar-erg",
      title: "Consultar ERG y definir distancias de seguridad iniciales",
      description: "Usar Guía de Respuesta en Emergencias para diésel. Definir distancias mínimas y precauciones de incendio.",
      category: "planificacion",
      recommendedFromMinute: 2,
      recommendedUntilMinute: 8,
      metricImpact: { risk: -6, control: 6, complexity: -5 },
      requires: ["leer-placardo"],
      unlocks: ["establecer-zonas"],
      doctrineNotes: ["ERG", "NFPA 472", "Distancias de seguridad"]
    },
    {
      id: "establecer-zonas",
      title: "Establecer zonas caliente, tibia y fría con señalización",
      description: "Delimitar zona caliente (solo EPP adecuado), zona tibia (área de trabajo y descontaminación) y zona fría (mando y apoyo). Señalizar con cinta.",
      category: "seguridad",
      recommendedFromMinute: 3,
      recommendedUntilMinute: 10,
      metricImpact: { risk: -15, lifeSafety: 15, control: 10, coordination: 6 },
      requires: ["asumir-mando"],
      unlocks: ["control-acceso-civil", "contener-alcantarilla", "aplicar-absorbente"],
      doctrineNotes: ["Zonas de trabajo MATPEL", "NFPA 472", "Control de zonas"]
    },
    {
      id: "control-acceso-civil",
      title: "Establecer control de acceso civil y solicitar apoyo Carabineros",
      description: "Retirar transeúntes del área de exclusión. Solicitar a Carabineros controlar tránsito y perímetro externo.",
      category: "seguridad",
      recommendedFromMinute: 3,
      recommendedUntilMinute: 12,
      metricImpact: { lifeSafety: 12, risk: -5, coordination: 5 },
      doctrineNotes: ["Seguridad pública", "Zonificación", "Responsabilidad"]
    },
    {
      id: "contener-alcantarilla",
      title: "Taponar alcantarilla para evitar contaminación hídrica",
      description: "Sellar sumidero con tapón de emergencia o material disponible. Documentar hora de la acción para informe ambiental.",
      category: "operaciones",
      recommendedFromMinute: 4,
      recommendedUntilMinute: 12,
      metricImpact: { propertyConservation: 18, risk: -5, coordination: 5 },
      requires: ["establecer-zonas"],
      unlocks: ["diques-contension"],
      doctrineNotes: ["Contención ambiental", "Prioridad ambiental", "Acciones defensivas"]
    },
    {
      id: "solicitar-documentos",
      title: "Solicitar hoja de ruta y fichas de seguridad al conductor",
      description: "Pedir al conductor (en zona fría) la documentación de carga, hoja de ruta y ficha de datos de seguridad del producto.",
      category: "operaciones",
      recommendedFromMinute: 3,
      recommendedUntilMinute: 10,
      metricImpact: { control: 6, coordination: 4, complexity: -4 },
      doctrineNotes: ["Identificación de MATPEL", "Documentación de carga", "NFPA 472"]
    },
    {
      id: "aplicar-absorbente",
      title: "Aplicar material absorbente sobre el derrame",
      description: "Usar arena, absorbente específico o material disponible para reducir superficie de evaporación y avance del líquido.",
      category: "operaciones",
      recommendedFromMinute: 6,
      recommendedUntilMinute: 18,
      metricImpact: { propertyConservation: 10, risk: -8, control: 5 },
      requires: ["establecer-zonas"],
      doctrineNotes: ["Contención activa", "Técnicas de absorción", "Reducción de riesgo ambiental"]
    },
    {
      id: "diques-contension",
      title: "Construir diques de contención para delimitar el derrame",
      description: "Con arena o material disponible, construir diques perimetrales para impedir expansión del diésel hacia el alcantarillado.",
      category: "operaciones",
      recommendedFromMinute: 6,
      recommendedUntilMinute: 20,
      metricImpact: { propertyConservation: 12, risk: -6, control: 4 },
      requires: ["contener-alcantarilla"],
      doctrineNotes: ["Diques de contención", "Control de flujo", "MATPEL ambiental"]
    },
    {
      id: "plan-comunicaciones",
      title: "Establecer plan de comunicaciones",
      description: "Definir canal de mando, canal operativo y canal de enlace institucional. Reportes periódicos cada 10 minutos.",
      category: "comunicaciones",
      recommendedFromMinute: 3,
      recommendedUntilMinute: 12,
      metricImpact: { coordination: 14, complexity: -6 },
      requires: ["asumir-mando"],
      unlocks: ["notificar-seremi", "contactar-empresa"],
      doctrineNotes: ["Comunicaciones integradas", "Terminología común"]
    },
    {
      id: "notificar-seremi",
      title: "Notificar a SEREMI del Medio Ambiente",
      description: "Contactar a la autoridad ambiental SEREMI para reportar derrame con riesgo de contaminación hídrica. Indicar volumen, producto y acciones tomadas.",
      category: "enlace",
      recommendedFromMinute: 5,
      recommendedUntilMinute: 20,
      metricImpact: { coordination: 12, complexity: -5, propertyConservation: 6 },
      requires: ["plan-comunicaciones"],
      doctrineNotes: ["Notificación ambiental", "Cadena de notificación", "Responsabilidades legales"]
    },
    {
      id: "contactar-empresa",
      title: "Contactar empresa responsable del camión",
      description: "Llamar al centro de emergencias de la empresa distribuidora. Solicitar empresa de limpieza especializada, MSDS y responsable en terreno.",
      category: "enlace",
      recommendedFromMinute: 8,
      recommendedUntilMinute: 25,
      metricImpact: { coordination: 8, complexity: -4, propertyConservation: 5 },
      requires: ["plan-comunicaciones"],
      doctrineNotes: ["Enlace con empresa", "Responsabilidad del generador", "Coordinación privada"]
    },
    {
      id: "reubicar-pc",
      title: "Reubicar puesto de comando por cambio de viento",
      description: "Mover el PC a posición a favor del nuevo vector de viento, comunicar nueva ubicación a todos los sectores.",
      category: "mando",
      recommendedFromMinute: 14,
      recommendedUntilMinute: 22,
      metricImpact: { risk: -10, lifeSafety: 10, coordination: 4 },
      doctrineNotes: ["Posición del PC", "Adaptabilidad", "Seguridad del mando"]
    },
    {
      id: "pai-inicial",
      title: "Formalizar PAI inicial",
      description: "Registrar objetivos, zonas, recursos asignados, comunicaciones y acciones de contención para el período inicial.",
      category: "planificacion",
      recommendedFromMinute: 15,
      metricImpact: { control: 10, coordination: 10, complexity: -6 },
      requires: ["establecer-zonas", "plan-comunicaciones"],
      doctrineNotes: ["Plan de acción del incidente", "Planificación", "Documentación"]
    }
  ],
  rubric: [
    { id: "r-mando", title: "Asume mando y declara incidente MATPEL", category: "mando", maxPoints: 15, evidenceDecisionIds: ["asumir-mando", "reubicar-pc"] },
    { id: "r-identificacion", title: "Identifica correctamente el material peligroso", category: "operaciones", maxPoints: 20, evidenceDecisionIds: ["leer-placardo", "consultar-erg", "solicitar-documentos"] },
    { id: "r-zonas", title: "Establece y comunica zonas de trabajo MATPEL", category: "seguridad", maxPoints: 20, evidenceDecisionIds: ["establecer-zonas", "control-acceso-civil"] },
    { id: "r-contencion", title: "Aplica contención efectiva del derrame", category: "operaciones", maxPoints: 20, evidenceDecisionIds: ["contener-alcantarilla", "aplicar-absorbente", "diques-contension"] },
    { id: "r-notificacion", title: "Notifica autoridad ambiental y empresa responsable", category: "enlace", maxPoints: 15, evidenceDecisionIds: ["notificar-seremi", "contactar-empresa"], failCondition: "No se notifica a SEREMI dentro de los primeros 20 minutos del incidente." },
    { id: "r-planificacion", title: "Formaliza comunicaciones y PAI", category: "planificacion", maxPoints: 10, evidenceDecisionIds: ["plan-comunicaciones", "pai-inicial"] }
  ]
};
