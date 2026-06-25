import type { Scenario } from "../../types/sci";

export const wildlandIsolatedScenario: Scenario = {
  id: "incendio-forestal-aislado",
  title: "Incendio forestal en sector de cerro aislado con área recreacional",
  type: "forestal",
  difficulty: "basico",
  summary: "Incendio en ladera de cerro con 30 ha afectadas, vegetación seca, viento moderado SW 15 km/h, área de trekking con visitantes no ubicados.",
  briefing: "A las 14:15 se reporta humo visible desde ladera suroeste del Cerro Calvario. Al arribo de la primera unidad terrestre se confirma incendio activo en matorral seco con avance estimado de 30 ha. Viento SO a 15 km/h favorece propagación hacia sector de senderos recreativos. Se reportan visitantes en la zona según registro del acceso vehicular, pero su ubicación exacta es desconocida. El recurso aéreo solicitado no estará disponible en al menos 40 minutos. Acceso vehicular limitado a un camino de tierra que puede quedar cortado. Solo una dotación terrestre con capacidad de línea directa en primer arribo.",
  learningObjectives: [
    "Aplicar principios de estrategia forestal básica eligiendo entre ataque directo e indirecto según condiciones de terreno y viento",
    "Evaluar variables de terreno y comportamiento del fuego para posicionamiento seguro de respondedores",
    "Coordinar evacuación de visitantes en zona de recreación con información incompleta",
    "Establecer comunicación y coordinación efectiva con CONAF como agencia rectora en incendios forestales"
  ],
  doctrinalForms: ["ICS 201", "ICS 202", "ICS 205"],
  criticalErrors: ["asumir-mando-forestal", "seguridad-respondedores-terreno"],
  initialMetrics: {
    risk: 50, control: 35, coordination: 30,
    lifeSafety: 45, propertyConservation: 40, complexity: 40
  },
  objectives: [
    { id: "obj-vida", text: "Ubicar y evacuar visitantes del área recreacional hacia zona segura.", priority: "vida", completedByDecisionIds: ["asumir-mando-forestal", "evacuar-visitantes", "perimetro-seguro-forestal"] },
    { id: "obj-seguridad", text: "Garantizar seguridad de respondedores en terreno con rutas de escape identificadas.", priority: "vida", completedByDecisionIds: ["seguridad-respondedores-terreno", "rutas-escape", "zonas-seguras"] },
    { id: "obj-control", text: "Contener avance del incendio mediante estrategia directa o indirecta según condiciones.", priority: "estabilizacion", completedByDecisionIds: ["definir-estrategia-forestal", "linea-contencion", "ataque-directo-indirecto"] },
    { id: "obj-conaf", text: "Establecer coordinación operacional con CONAF como institución rectora.", priority: "continuidad", completedByDecisionIds: ["coordinar-conaf", "plan-comunicaciones-forestal", "pai-forestal"] }
  ],
  resources: [
    { id: "cuadrilla-1", name: "Cuadrilla forestal terrestre 1", type: "unidad", status: "disponible", capabilities: ["línea directa", "herramientas manuales", "bomba mochila"] },
    { id: "vehiculo-doble-traccion", name: "Vehículo doble tracción", type: "unidad", status: "disponible", capabilities: ["transporte terreno irregular", "depósito agua 500L", "herramientas"] },
    { id: "helicoptero-conaf", name: "Helicóptero CONAF", type: "unidad", status: "solicitado", etaMinutes: 40, capabilities: ["observación aérea", "descarga agua", "transporte personal"] },
    { id: "conaf-coordinacion", name: "CONAF Coordinación Regional", type: "institucion", status: "solicitado", etaMinutes: 15, capabilities: ["mando forestal", "recursos regionales", "mapas y cartografía"] },
    { id: "carabineros-acceso", name: "Carabineros control acceso", type: "institucion", status: "solicitado", etaMinutes: 20, capabilities: ["control acceso", "evacuación civil", "perimetro externo"] },
    { id: "pc-forestal", name: "Puesto de Comando Forestal", type: "instalacion", status: "disponible", capabilities: ["mando", "comunicaciones", "registro"] }
  ],
  hotspots: [
    { id: "frente-fuego", label: "Frente de fuego principal", x: 55, y: 38, kind: "fuego", description: "Frente activo con avance SO favorecido por viento y pendiente." },
    { id: "flancos-fuego", label: "Flancos activos", x: 68, y: 52, kind: "fuego", description: "Flancos con actividad media, potencial de expansión lateral." },
    { id: "visitantes-sendero", label: "Visitantes no ubicados", x: 45, y: 30, kind: "victima", description: "Sendero de trekking en zona de posible avance del fuego." },
    { id: "riesgo-camino", label: "Riesgo corte de acceso", x: 35, y: 65, kind: "riesgo", description: "Camino de tierra único puede quedar cortado por avance del fuego." },
    { id: "pc-sugerido", label: "PC sugerido", x: 20, y: 75, kind: "pc", description: "Zona segura en acceso inferior con visión del cerro y radio." }
  ],
  injects: [
    { id: "visitantes-avistados", minute: 10, title: "Avistamiento de visitantes en sector de riesgo", description: "Helicóptero en ruta reporta visualmente a dos personas en sendero superior, aprox. 600 m del frente. No responden llamados de radio.", severity: "alta", metricImpact: { lifeSafety: -12, risk: 8, complexity: 6 }, expectedResponses: ["evacuar-visitantes", "seguridad-respondedores-terreno", "coordinar-conaf"] },
    { id: "cambio-intensidad-viento", minute: 18, title: "Aumento de velocidad de viento", description: "CONAF informa ráfagas SW 25 km/h. El frente acelera hacia el sendero de acceso principal.", severity: "alta", metricImpact: { risk: 14, control: -10, complexity: 8, lifeSafety: -6 }, expectedResponses: ["definir-estrategia-forestal", "rutas-escape", "ataque-directo-indirecto"] },
    { id: "cuadrilla-amenaza", minute: 25, title: "Cuadrilla solicita salida de emergencia", description: "Cuadrilla 1 reporta flanqueo inesperado. Solicitan autorización para retirada inmediata.", severity: "critica", metricImpact: { risk: 16, lifeSafety: -14, complexity: 6 }, expectedResponses: ["rutas-escape", "zonas-seguras", "seguridad-respondedores-terreno"] }
  ],
  decisions: [
    { id: "asumir-mando-forestal", title: "Asumir mando y declarar SCI forestal", description: "Informar arribo, asumir Comando de Incidente, nombrar el incidente y entregar reporte inicial por radio.", category: "mando", recommendedFromMinute: 0, recommendedUntilMinute: 5, metricImpact: { control: 12, coordination: 10, complexity: -4 }, unlocks: ["definir-estrategia-forestal", "plan-comunicaciones-forestal", "perimetro-seguro-forestal"], penalizedIfRepeated: true, doctrineNotes: ["Mando temprano", "Terminología común SCI", "Cadena de mando"] },
    { id: "seguridad-respondedores-terreno", title: "Evaluar seguridad y briefing terreno a cuadrilla", description: "Identificar rutas de escape, zonas de seguridad, condiciones de viento/pendiente y entrega de LOC antes de comprometer personal.", category: "seguridad", recommendedFromMinute: 1, recommendedUntilMinute: 8, metricImpact: { risk: -14, lifeSafety: 16, coordination: 4 }, unlocks: ["rutas-escape", "zonas-seguras", "linea-contencion"], doctrineNotes: ["Regla de los 10 y 18", "LCES en incendios forestales", "Responsabilidad"] },
    { id: "perimetro-seguro-forestal", title: "Establecer perímetro de seguridad y control de acceso", description: "Delimitar zonas de exclusión, control de acceso al sendero y punto de reunión para visitantes.", category: "seguridad", recommendedFromMinute: 2, recommendedUntilMinute: 10, metricImpact: { lifeSafety: 12, risk: -8, coordination: 4 }, doctrineNotes: ["Instalaciones y zonas", "Seguridad pública", "Responsabilidad"] },
    { id: "plan-comunicaciones-forestal", title: "Establecer plan de comunicaciones forestal", description: "Definir canal mando, canal operacional con CONAF, y frecuencia de reportes de situación.", category: "comunicaciones", recommendedFromMinute: 2, recommendedUntilMinute: 10, metricImpact: { coordination: 14, complexity: -6 }, requires: ["asumir-mando-forestal"], unlocks: ["coordinar-conaf", "pai-forestal"], doctrineNotes: ["Comunicaciones integradas", "Terminología común", "Interoperabilidad CONAF-Bomberos"] },
    { id: "coordinar-conaf", title: "Coordinar con CONAF como agencia rectora", description: "Contactar Coordinación CONAF, reportar situación, solicitar mapas, recursos disponibles y asumir roles según convenio.", category: "enlace", recommendedFromMinute: 3, recommendedUntilMinute: 15, metricImpact: { coordination: 14, control: 6, complexity: -4 }, requires: ["plan-comunicaciones-forestal"], doctrineNotes: ["Enlace multiagencia", "CONAF como agencia rectora", "Convenio Bomberos-CONAF"] },
    { id: "definir-estrategia-forestal", title: "Definir estrategia de ataque directo o indirecto", description: "Evaluar seguridad, comportamiento del fuego, recursos disponibles y elegir táctica de línea directa o construcción de cortafuego indirecto.", category: "operaciones", recommendedFromMinute: 4, recommendedUntilMinute: 15, metricImpact: { control: 14, coordination: 6, complexity: -6 }, requires: ["asumir-mando-forestal", "seguridad-respondedores-terreno"], unlocks: ["ataque-directo-indirecto", "linea-contencion"], doctrineNotes: ["Ataque directo vs indirecto", "Comportamiento del fuego", "Principio de seguridad primero"] },
    { id: "evacuar-visitantes", title: "Ordenar evacuación de visitantes por ruta segura", description: "Activar protocolo de evacuación de área recreacional, designar punto de reunión y confirmar conteo de personas.", category: "operaciones", recommendedFromMinute: 5, recommendedUntilMinute: 18, metricImpact: { lifeSafety: 18, risk: -6, coordination: 4 }, doctrineNotes: ["Prioridad de vida", "Evacuación preventiva", "Control de acceso"] },
    { id: "rutas-escape", title: "Identificar y comunicar rutas de escape a todo el personal", description: "Briefing explícito de rutas de escape primaria y secundaria antes de comprometer cuadrillas en terreno.", category: "seguridad", recommendedFromMinute: 3, recommendedUntilMinute: 12, metricImpact: { lifeSafety: 14, risk: -10, complexity: -4 }, requires: ["seguridad-respondedores-terreno"], doctrineNotes: ["LCES", "Rutas de escape", "Seguridad de respondedores"] },
    { id: "zonas-seguras", title: "Designar y señalizar zonas de seguridad", description: "Establecer zonas refugio previamente reconocidas y comunicarlas a todos los equipos en terreno.", category: "seguridad", recommendedFromMinute: 5, recommendedUntilMinute: 15, metricImpact: { lifeSafety: 10, risk: -8 }, requires: ["seguridad-respondedores-terreno"], doctrineNotes: ["LCES", "Zonas de seguridad", "Estándares operacionales"] },
    { id: "ataque-directo-indirecto", title: "Ejecutar táctica seleccionada con cuadrilla terrestre", description: "Desplegar cuadrilla según estrategia definida, con rol asignado, objetivo específico y límite de tiempo.", category: "operaciones", recommendedFromMinute: 8, recommendedUntilMinute: 25, metricImpact: { control: 16, propertyConservation: 10, risk: -4 }, requires: ["definir-estrategia-forestal", "rutas-escape"], doctrineNotes: ["Tácticas forestales básicas", "Asignación de tareas", "Control de seguridad"] },
    { id: "linea-contencion", title: "Construir línea de contención o cortafuego", description: "Definir segmento de línea a construir, método, longitud estimada y asignar responsable de sector.", category: "operaciones", recommendedFromMinute: 10, recommendedUntilMinute: 30, metricImpact: { control: 14, propertyConservation: 12, complexity: -4 }, requires: ["definir-estrategia-forestal"], doctrineNotes: ["Construcción de línea", "Control del perímetro", "Prioridades tácticas forestales"] },
    { id: "solicitar-helicoptero", title: "Confirmar y coordinar arribo de helicóptero", description: "Establecer frecuencia de comunicación con piloto, punto de aterrizaje, misión asignada y condiciones de operación.", category: "recursos", recommendedFromMinute: 12, metricImpact: { control: 10, coordination: 8, complexity: 3 }, requires: ["plan-comunicaciones-forestal"], doctrineNotes: ["Gestión integral de recursos", "Coordinación aérea-terrestre"] },
    { id: "pai-forestal", title: "Formalizar PAI forestal para periodo inicial", description: "Registrar objetivos, táctica seleccionada, comunicaciones, seguridad, recursos y condiciones del incidente.", category: "planificacion", recommendedFromMinute: 15, metricImpact: { control: 10, coordination: 12, complexity: -6 }, requires: ["asumir-mando-forestal", "plan-comunicaciones-forestal", "definir-estrategia-forestal"], doctrineNotes: ["Plan de Acción del Incidente", "Planificación forestal", "ICS 202"] }
  ],
  rubric: [
    { id: "r-mando-forestal", title: "Establece mando SCI en incendio forestal", category: "mando", maxPoints: 15, evidenceDecisionIds: ["asumir-mando-forestal", "pai-forestal"] },
    { id: "r-seguridad-forestal", title: "Aplica LCES y gestiona seguridad en terreno", category: "seguridad", maxPoints: 25, evidenceDecisionIds: ["seguridad-respondedores-terreno", "rutas-escape", "zonas-seguras", "perimetro-seguro-forestal"], failCondition: "No realiza briefing de rutas de escape antes de comprometer personal" },
    { id: "r-estrategia", title: "Define y ejecuta estrategia forestal coherente", category: "operaciones", maxPoints: 20, evidenceDecisionIds: ["definir-estrategia-forestal", "ataque-directo-indirecto", "linea-contencion"] },
    { id: "r-evacuacion", title: "Gestiona evacuación de visitantes eficazmente", category: "operaciones", maxPoints: 15, evidenceDecisionIds: ["evacuar-visitantes", "perimetro-seguro-forestal"] },
    { id: "r-conaf", title: "Coordina con CONAF como agencia rectora", category: "enlace", maxPoints: 15, evidenceDecisionIds: ["coordinar-conaf", "solicitar-helicoptero"] },
    { id: "r-planificacion-forestal", title: "Planifica y documenta el periodo operacional", category: "planificacion", maxPoints: 10, evidenceDecisionIds: ["pai-forestal", "plan-comunicaciones-forestal"] }
  ]
};
