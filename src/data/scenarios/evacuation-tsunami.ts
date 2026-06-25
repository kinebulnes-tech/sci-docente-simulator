import type { Scenario } from "../../types/sci";

export const evacuationTsunamiScenario: Scenario = {
  id: "evacuacion-alerta-tsunami-zona-costera",
  title: "Evacuación masiva por alerta de tsunami en zona costera",
  type: "evacuacion",
  difficulty: "avanzado",
  summary: "Alerta de tsunami emitida por SHOA post sismo M7.8, zona costera con 5.000 residentes, tiempo estimado de arribo: 45 minutos, hospitales costeros en evacuación.",
  briefing: "El SHOA emite alerta de tsunami a las 09:15 tras sismo de magnitud 7.8 con epicentro a 80 km de la costa. El tiempo estimado de arribo de la primera ola es 45 minutos. La zona costera alberga 5.000 residentes permanentes más turistas de temporada. La ruta de evacuación norte (principal) presenta daños por el sismo y está bloqueada por derrumbe. Solo las rutas este y sur están operativas pero con capacidad reducida. El Hospital Costero inicia evacuación de 180 pacientes, muchos en condición crítica, y requiere transporte urgente. Turistas desconocen las rutas de evacuación y hay desinformación circulando en redes sociales. El SENAPRED requiere reporte de situación para coordinar recursos regionales.",
  learningObjectives: [
    "Gestionar logística de evacuación masiva en tiempo crítico con rutas limitadas",
    "Administrar rutas de evacuación alternativas ante bloqueo de ruta principal",
    "Coordinar con SENAPRED, SHOA y municipio en emergencia multiagencia de nivel regional",
    "Organizar transporte y evacuación prioritaria de pacientes hospitalarios y vulnerables",
    "Gestionar puntos de encuentro masivos y prevenir colapso logístico"
  ],
  doctrinalForms: ["ICS 201", "ICS 202", "ICS 203", "ICS 205", "ICS 206", "ICS 209"],
  criticalErrors: ["activar-rutas-alternativas", "prioridad-hospital-costero", "comunicacion-shoa"],
  initialMetrics: {
    risk: 90, control: 15, coordination: 18,
    lifeSafety: 22, propertyConservation: 20, complexity: 88
  },
  objectives: [
    {
      id: "evacuacion-masiva",
      text: "Evacuar a los 5.000 residentes y turistas fuera de zona de inundación antes del arribo de la ola.",
      priority: "vida",
      completedByDecisionIds: ["asumir-mando-tsunami", "activar-rutas-alternativas", "coordinar-transporte-masivo", "puntos-encuentro-tsunami", "gestionar-turistas"]
    },
    {
      id: "hospital-evacuacion",
      text: "Evacuar los 180 pacientes del Hospital Costero con prioridad según condición clínica.",
      priority: "vida",
      completedByDecisionIds: ["prioridad-hospital-costero", "coordinar-ambulancias", "enlace-samu-tsunami"]
    },
    {
      id: "gestion-rutas",
      text: "Gestionar rutas de evacuación alternativas y control del flujo vehicular.",
      priority: "estabilizacion",
      completedByDecisionIds: ["activar-rutas-alternativas", "control-trafico-tsunami", "despejar-ruta-norte"]
    },
    {
      id: "coordinacion-shoa-senapred",
      text: "Mantener enlace activo con SHOA y SENAPRED para actualización de información y recursos.",
      priority: "continuidad",
      completedByDecisionIds: ["comunicacion-shoa", "enlace-senapred", "plan-comunicaciones-tsunami"]
    },
    {
      id: "puntos-encuentro-masivos",
      text: "Establecer y gestionar puntos de encuentro en zona segura con registro de evacuados.",
      priority: "continuidad",
      completedByDecisionIds: ["puntos-encuentro-tsunami", "registro-evacuados-tsunami", "activar-albergues"]
    }
  ],
  resources: [
    { id: "bomberos-tsunami", name: "Compañía de Bomberos Costera", type: "unidad", status: "disponible", capabilities: ["evacuacion", "rescate", "primeros auxilios", "control perimetro"] },
    { id: "carabineros-tsunami", name: "Carabineros", type: "institucion", status: "disponible", etaMinutes: 0, capabilities: ["control transito", "seguridad publica", "evacuacion civil", "perimetro"] },
    { id: "senapred", name: "SENAPRED (ONEMI)", type: "institucion", status: "disponible", etaMinutes: 0, capabilities: ["coordinacion regional", "recursos apoyo", "comunicacion oficial", "albergues"] },
    { id: "shoa", name: "SHOA", type: "institucion", status: "disponible", etaMinutes: 0, capabilities: ["monitoreo maremoto", "actualizacion alerta", "prediccion arribo ola", "informacion tecnica"] },
    { id: "municipio-tsunami", name: "Municipio / Departamento Emergencias", type: "institucion", status: "disponible", etaMinutes: 0, capabilities: ["albergues municipales", "buses municipales", "informacion a la comunidad", "catastro vulnerables"] },
    { id: "ambulancias-tsunami", name: "SAMU / Ambulancias", type: "unidad", status: "disponible", capabilities: ["transporte criticos", "atencion prehospitalaria", "triage", "traslado hospital"] },
    { id: "buses-municipales", name: "Buses Municipales y Transporte Público", type: "unidad", status: "solicitado", etaMinutes: 8, capabilities: ["transporte masivo personas", "evacuacion colectiva", "movilidad reducida"] },
    { id: "ffaa", name: "Fuerzas Armadas", type: "institucion", status: "solicitado", etaMinutes: 20, capabilities: ["transporte aereo", "helicopteros", "logistica", "control orden publico"] },
    { id: "hospital-costero", name: "Hospital Costero", type: "instalacion", status: "disponible", capabilities: ["evacuacion pacientes", "lista criticos", "coordinacion medica"] },
    { id: "pc-tsunami", name: "Puesto de Comando Avanzado", type: "instalacion", status: "disponible", capabilities: ["mando", "coordinacion", "registro", "comunicaciones multiagencia"] }
  ],
  hotspots: [
    { id: "costa", label: "Zona costera riesgo máximo", x: 15, y: 60, kind: "riesgo", description: "Área de inundación estimada. Todos los residentes deben abandonar en menos de 45 min." },
    { id: "ruta-norte-bloqueada", label: "Ruta norte bloqueada", x: 40, y: 20, kind: "riesgo", description: "Derrumbe por sismo bloquea acceso norte. Principal vía de evacuación inutilizable." },
    { id: "hospital", label: "Hospital Costero", x: 20, y: 48, kind: "victima", description: "180 pacientes en evacuación. Zona baja con riesgo de inundación." },
    { id: "sector-turistas", label: "Sector hotelero", x: 18, y: 70, kind: "victima", description: "Alta concentración de turistas sin conocimiento de rutas de evacuación." },
    { id: "punto-encuentro-sur", label: "Punto de encuentro sur", x: 55, y: 88, kind: "perimetro", description: "Estadio municipal en zona alta. Capacidad estimada 3.000 personas." },
    { id: "punto-encuentro-este", label: "Punto de encuentro este", x: 82, y: 50, kind: "perimetro", description: "Centro comunitario en cerro. Capacidad 1.500 personas." },
    { id: "pc-tsunami-ubicacion", label: "PC Avanzado", x: 60, y: 35, kind: "pc", description: "Zona alta segura con visión de rutas de evacuación principales." }
  ],
  injects: [
    {
      id: "ruta-este-colapsa",
      minute: 10,
      title: "Ruta este reporta embotellamiento crítico",
      description: "La ruta este, ahora la principal vía de evacuación, está colapsada por accidente vehicular entre dos autos. El flujo se detiene completamente. Hay 800 personas atrapadas en el tramo. Quedan 35 minutos para el arribo estimado.",
      severity: "critica",
      metricImpact: { risk: 20, control: -15, lifeSafety: -18, complexity: 18 },
      expectedResponses: ["activar-rutas-alternativas", "control-trafico-tsunami", "comunicacion-shoa"]
    },
    {
      id: "hospital-solicita-transporte",
      minute: 15,
      title: "Hospital solicita transporte urgente para críticos",
      description: "Director del Hospital Costero reporta que tienen 12 pacientes en UCI que no pueden ser movidos sin transporte especializado. Los buses regulares no son adecuados. Solicitan helicóptero o ambulancias de alta complejidad. La zona baja ya muestra indicios de inundación temprana.",
      severity: "critica",
      metricImpact: { risk: 16, lifeSafety: -20, complexity: 14, coordination: -8 },
      expectedResponses: ["prioridad-hospital-costero", "coordinar-ambulancias", "enlace-senapred"]
    },
    {
      id: "actualizacion-15min",
      minute: 20,
      title: "SHOA actualiza: arribo en 25 minutos",
      description: "SHOA actualiza tiempo de arribo: primera ola llegará en 25 minutos, no 45 como estimado inicial. La magnitud de inundación esperada aumenta a 8 metros. Quedan sectores sin evacuación completa.",
      severity: "critica",
      metricImpact: { risk: 25, control: -12, lifeSafety: -15, complexity: 20 },
      expectedResponses: ["comunicacion-shoa", "activar-rutas-alternativas", "coordinar-transporte-masivo"]
    },
    {
      id: "multitud-punto-encuentro",
      minute: 25,
      title: "Punto de encuentro sur al límite de capacidad",
      description: "El estadio municipal ya tiene 2.900 personas y la cifra sigue aumentando. La capacidad nominal es 3.000. No hay control de ingreso. Se generan peleas por espacio. Se requiere activar punto de encuentro adicional y redirigir el flujo.",
      severity: "alta",
      metricImpact: { coordination: -10, lifeSafety: -8, complexity: 12, control: -6 },
      expectedResponses: ["puntos-encuentro-tsunami", "activar-albergues", "registro-evacuados-tsunami"]
    },
    {
      id: "segundo-sismo",
      minute: 30,
      title: "Sismo secundario M5.5",
      description: "Se registra réplica de M5.5. Genera pánico en personas en tránsito. Varios vehículos se detienen en medio de las rutas. Un puente en ruta sur reporta grietas y su integridad estructural es incierta.",
      severity: "alta",
      metricImpact: { risk: 18, control: -10, coordination: -8, complexity: 16, lifeSafety: -10 },
      expectedResponses: ["activar-rutas-alternativas", "control-trafico-tsunami", "comunicacion-shoa"]
    }
  ],
  decisions: [
    {
      id: "asumir-mando-tsunami",
      title: "Asumir mando y declarar SCI nivel regional",
      description: "Informar arribo, asumir CI, nombrar incidente como alerta tsunami activa y solicitar activación de protocolos de nivel regional. Entregar primer reporte a SENAPRED.",
      category: "mando",
      recommendedFromMinute: 0,
      recommendedUntilMinute: 3,
      metricImpact: { control: 14, coordination: 12, complexity: -6 },
      unlocks: ["activar-rutas-alternativas", "plan-comunicaciones-tsunami", "enlace-senapred"],
      penalizedIfRepeated: true,
      doctrineNotes: ["Mando temprano", "Terminología común", "Cadena de mando", "Multiagencia"]
    },
    {
      id: "activar-rutas-alternativas",
      title: "Activar rutas de evacuación alternativas",
      description: "Con ruta norte bloqueada, activar inmediatamente rutas este y sur. Asignar Carabineros en puntos críticos. Establecer flujo unidireccional en todas las vías de evacuación hacia zonas altas.",
      category: "operaciones",
      recommendedFromMinute: 1,
      recommendedUntilMinute: 8,
      metricImpact: { lifeSafety: 20, control: 14, coordination: 8, risk: -10 },
      requires: ["asumir-mando-tsunami"],
      unlocks: ["control-trafico-tsunami", "coordinar-transporte-masivo"],
      doctrineNotes: ["Manejo por objetivos", "Operaciones", "Gestión integral de recursos"]
    },
    {
      id: "comunicacion-shoa",
      title: "Establecer enlace directo con SHOA",
      description: "Contactar SHOA para actualizaciones cada 5 minutos sobre tiempo de arribo, altura de ola estimada y posibles réplicas. Integrar información en decisiones operacionales en tiempo real.",
      category: "enlace",
      recommendedFromMinute: 1,
      recommendedUntilMinute: 8,
      metricImpact: { control: 12, coordination: 14, complexity: -8, risk: -6 },
      requires: ["asumir-mando-tsunami"],
      unlocks: ["plan-comunicaciones-tsunami"],
      doctrineNotes: ["Enlace", "Comunicaciones integradas", "Multiagencia"]
    },
    {
      id: "prioridad-hospital-costero",
      title: "Declarar evacuación prioritaria del Hospital Costero",
      description: "Asignar todos los recursos de transporte disponibles al Hospital Costero. Priorizar pacientes críticos para traslado inmediato. Coordinar con SAMU y solicitar apoyo aéreo a FFAA para UCI.",
      category: "operaciones",
      recommendedFromMinute: 2,
      recommendedUntilMinute: 10,
      metricImpact: { lifeSafety: 22, coordination: 10, risk: -8, complexity: -5 },
      requires: ["asumir-mando-tsunami"],
      unlocks: ["coordinar-ambulancias", "enlace-samu-tsunami"],
      doctrineNotes: ["Manejo por objetivos", "Operaciones", "Responsabilidad", "Seguridad pública"]
    },
    {
      id: "enlace-senapred",
      title: "Activar enlace con SENAPRED y municipio",
      description: "Integrar representante SENAPRED y municipio al PC. Solicitar activación de albergues regionales, buses adicionales y apoyo logístico. Reportar situación cada 10 minutos.",
      category: "enlace",
      recommendedFromMinute: 2,
      recommendedUntilMinute: 10,
      metricImpact: { coordination: 16, control: 8, complexity: -6 },
      requires: ["asumir-mando-tsunami"],
      unlocks: ["activar-albergues", "coordinar-transporte-masivo"],
      doctrineNotes: ["Enlace", "Comando unificado cuando corresponda", "Multiagencia"]
    },
    {
      id: "plan-comunicaciones-tsunami",
      title: "Establecer plan de comunicaciones multiagencia",
      description: "Canal de mando, canal operativo evacuación, canal hospital, canal SHOA/SENAPRED y sistema de altavoces municipales. Establecer frecuencias de respaldo.",
      category: "comunicaciones",
      recommendedFromMinute: 3,
      recommendedUntilMinute: 10,
      metricImpact: { coordination: 16, complexity: -8 },
      requires: ["comunicacion-shoa"],
      doctrineNotes: ["Comunicaciones integradas", "Terminología común", "Multiagencia"]
    },
    {
      id: "control-trafico-tsunami",
      title: "Establecer control de tráfico en rutas de evacuación",
      description: "Asignar Carabineros en cada intersección crítica. Suspender tráfico entrante a zona costera. Habilitar vías contraflujo donde sea posible.",
      category: "operaciones",
      recommendedFromMinute: 3,
      recommendedUntilMinute: 12,
      metricImpact: { lifeSafety: 14, control: 10, coordination: 6, complexity: -6 },
      requires: ["activar-rutas-alternativas"],
      doctrineNotes: ["Operaciones", "Instalaciones y zonas", "Gestión integral de recursos"]
    },
    {
      id: "coordinar-transporte-masivo",
      title: "Coordinar transporte masivo para evacuados sin vehículo",
      description: "Desplegar buses municipales en sectores identificados con mayor concentración de personas sin movilidad propia (sector hotelero, zonas residenciales populares). Establecer circuito de recolección.",
      category: "logistica",
      recommendedFromMinute: 4,
      recommendedUntilMinute: 14,
      metricImpact: { lifeSafety: 16, coordination: 10, control: 6, complexity: -4 },
      requires: ["enlace-senapred", "activar-rutas-alternativas"],
      doctrineNotes: ["Logística", "Gestión integral de recursos", "Despacho y despliegue"]
    },
    {
      id: "gestionar-turistas",
      title: "Gestionar evacuación de turistas y visitantes",
      description: "Desplegar personal bilingüe en sector hotelero. Usar altavoces y señalética adicional. Coordinar con administraciones de hoteles para guiar a sus huéspedes a rutas de evacuación.",
      category: "operaciones",
      recommendedFromMinute: 5,
      recommendedUntilMinute: 15,
      metricImpact: { lifeSafety: 12, coordination: 8, complexity: -4 },
      requires: ["activar-rutas-alternativas"],
      doctrineNotes: ["Operaciones", "Responsabilidad", "Información pública"]
    },
    {
      id: "coordinar-ambulancias",
      title: "Coordinar recursos de ambulancias y SAMU",
      description: "Asignar ambulancias de alta complejidad a UCI del hospital. Escalonar traslados según prioridad clínica. Coordinar hospital receptor en zona segura.",
      category: "logistica",
      recommendedFromMinute: 5,
      recommendedUntilMinute: 15,
      metricImpact: { lifeSafety: 18, coordination: 8, control: 5, complexity: -4 },
      requires: ["prioridad-hospital-costero"],
      doctrineNotes: ["Logística", "Gestión integral de recursos", "Operaciones"]
    },
    {
      id: "enlace-samu-tsunami",
      title: "Activar enlace SAMU para coordinación médica",
      description: "Establecer médico coordinador SAMU en PC para priorizar traslados hospitalarios. Activar hospitales receptores en zonas seguras para recibir pacientes evacuados.",
      category: "enlace",
      recommendedFromMinute: 6,
      recommendedUntilMinute: 18,
      metricImpact: { lifeSafety: 14, coordination: 10, complexity: -5 },
      requires: ["prioridad-hospital-costero"],
      doctrineNotes: ["Enlace", "Multiagencia", "Comunicaciones integradas"]
    },
    {
      id: "puntos-encuentro-tsunami",
      title: "Establecer y gestionar puntos de encuentro",
      description: "Activar estadio municipal (3.000 personas) y centro comunitario cerro (1.500 personas) como puntos de encuentro. Instalar control de ingreso y registro de evacuados.",
      category: "operaciones",
      recommendedFromMinute: 6,
      recommendedUntilMinute: 18,
      metricImpact: { lifeSafety: 12, coordination: 10, control: 8, complexity: -5 },
      requires: ["activar-rutas-alternativas"],
      unlocks: ["registro-evacuados-tsunami", "activar-albergues"],
      doctrineNotes: ["Instalaciones y zonas", "Operaciones", "Responsabilidad"]
    },
    {
      id: "despejar-ruta-norte",
      title: "Gestionar despeje de ruta norte bloqueada",
      description: "Solicitar maquinaria pesada para evaluación y eventual despeje del derrumbe en ruta norte. Establecer tiempo estimado y considerar como ruta de reserva si se despeja antes del arribo.",
      category: "logistica",
      recommendedFromMinute: 8,
      recommendedUntilMinute: 25,
      metricImpact: { control: 8, coordination: 6, lifeSafety: 8, complexity: -4 },
      requires: ["activar-rutas-alternativas"],
      doctrineNotes: ["Logística", "Gestión integral de recursos", "Operaciones"]
    },
    {
      id: "registro-evacuados-tsunami",
      title: "Establecer registro y control de evacuados",
      description: "Instalar puntos de registro en cada punto de encuentro. Identificar personas no encontradas. Coordinar con municipio para catastro de residentes vulnerables no localizados.",
      category: "planificacion",
      recommendedFromMinute: 10,
      recommendedUntilMinute: 30,
      metricImpact: { lifeSafety: 10, coordination: 10, control: 6, complexity: -4 },
      requires: ["puntos-encuentro-tsunami"],
      doctrineNotes: ["Responsabilidad", "Gestión integral de recursos", "Planificación"]
    },
    {
      id: "activar-albergues",
      title: "Activar albergues de emergencia",
      description: "Coordinar con SENAPRED y municipio para activar albergues formales. Gestionar necesidades básicas: agua, alimento, abrigo y atención médica básica para evacuados.",
      category: "logistica",
      recommendedFromMinute: 12,
      recommendedUntilMinute: 35,
      metricImpact: { lifeSafety: 8, coordination: 10, control: 6, complexity: -4 },
      requires: ["enlace-senapred", "puntos-encuentro-tsunami"],
      doctrineNotes: ["Logística", "Enlace", "Gestión integral de recursos"]
    },
    {
      id: "pai-tsunami",
      title: "Formalizar PAI y reportar a SENAPRED",
      description: "Registrar objetivos, estructura SCI, comunicaciones, recursos y estado de evacuación. Emitir reporte formal ICS 209 a SENAPRED para coordinación regional.",
      category: "planificacion",
      recommendedFromMinute: 15,
      metricImpact: { control: 12, coordination: 14, complexity: -8 },
      requires: ["enlace-senapred", "plan-comunicaciones-tsunami"],
      doctrineNotes: ["Plan de acción del incidente", "Planificación", "Multiagencia"]
    }
  ],
  rubric: [
    { id: "r-mando-tsunami", title: "Establece mando regional y estructura SCI completa", category: "mando", maxPoints: 12, evidenceDecisionIds: ["asumir-mando-tsunami", "plan-comunicaciones-tsunami"] },
    { id: "r-seguridad-tsunami", title: "Gestiona rutas de evacuación y zonas de peligro", category: "seguridad", maxPoints: 18, evidenceDecisionIds: ["activar-rutas-alternativas", "control-trafico-tsunami", "despejar-ruta-norte"], failCondition: "No se activan rutas alternativas en los primeros 5 minutos" },
    { id: "r-operaciones-tsunami", title: "Coordina evacuación masiva y población vulnerable", category: "operaciones", maxPoints: 20, evidenceDecisionIds: ["coordinar-transporte-masivo", "gestionar-turistas", "puntos-encuentro-tsunami"], failCondition: "No se gestiona evacuación del sector hotelero" },
    { id: "r-hospital-tsunami", title: "Prioriza y ejecuta evacuación hospitalaria", category: "logistica", maxPoints: 20, evidenceDecisionIds: ["prioridad-hospital-costero", "coordinar-ambulancias", "enlace-samu-tsunami"], failCondition: "No se declara prioridad hospitalaria en los primeros 5 minutos" },
    { id: "r-coordinacion-tsunami", title: "Mantiene enlace con SHOA, SENAPRED y municipio", category: "enlace", maxPoints: 18, evidenceDecisionIds: ["comunicacion-shoa", "enlace-senapred", "activar-albergues"], failCondition: "No se establece enlace con SHOA en los primeros 5 minutos" },
    { id: "r-planificacion-tsunami", title: "Registra evacuados, PAI y coordina albergues", category: "planificacion", maxPoints: 12, evidenceDecisionIds: ["pai-tsunami", "registro-evacuados-tsunami"] }
  ]
};
