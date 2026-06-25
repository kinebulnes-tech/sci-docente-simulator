import type { Scenario } from "../types/sci";

export const structuralFireScenario: Scenario = {
  id: "incendio-bodega-centro",
  title: "Incendio estructural en bodega con exposición comercial",
  type: "incendio_estructural",
  summary: "Fuego en bodega posterior de local comercial, humo denso, exposición lateral, una persona no ubicada y vecinos autoevacuando.",
  briefing:
    "A las 15:42 se despachan unidades por humo visible desde bodega posterior de ferretería. Al arribo hay fuego en crecimiento, tránsito activo, cilindros menores en patio y vecinos presionando por información. Se desconoce si queda una persona al interior.",
  initialMetrics: {
    risk: 56,
    control: 34,
    coordination: 28,
    lifeSafety: 42,
    propertyConservation: 32,
    complexity: 45
  },
  objectives: [
    {
      id: "vida",
      text: "Proteger la vida de ocupantes, respondedores y comunidad.",
      priority: "vida",
      completedByDecisionIds: ["asumir-mando", "oficial-seguridad", "perimetro-evacuacion", "busqueda-primaria"]
    },
    {
      id: "estabilizar",
      text: "Estabilizar el incendio y controlar exposición lateral.",
      priority: "estabilizacion",
      completedByDecisionIds: ["objetivos-iniciales", "sectorizar-operaciones", "linea-exposicion"]
    },
    {
      id: "coordinar",
      text: "Organizar recursos, comunicaciones y coordinación multiagencia.",
      priority: "continuidad",
      completedByDecisionIds: ["plan-comunicaciones", "solicitar-apoyo", "activar-enlace"]
    },
    {
      id: "documentar",
      text: "Registrar decisiones y preparar retroalimentación docente.",
      priority: "continuidad",
      completedByDecisionIds: ["pai-inicial", "registro-recursos"]
    }
  ],
  resources: [
    {
      id: "b1",
      name: "B-1 Primera respuesta",
      type: "unidad",
      status: "disponible",
      capabilities: ["agua", "ataque inicial", "busqueda"]
    },
    {
      id: "r1",
      name: "R-1 Rescate",
      type: "unidad",
      status: "disponible",
      capabilities: ["entrada forzada", "ventilacion", "rescate"]
    },
    {
      id: "z2",
      name: "Z-2 Abastecimiento",
      type: "unidad",
      status: "solicitado",
      etaMinutes: 7,
      capabilities: ["agua", "abastecimiento"]
    },
    {
      id: "carabineros",
      name: "Carabineros",
      type: "institucion",
      status: "solicitado",
      etaMinutes: 8,
      capabilities: ["transito", "seguridad publica", "perimetro externo"]
    },
    {
      id: "samur",
      name: "SAMU",
      type: "institucion",
      status: "solicitado",
      etaMinutes: 10,
      capabilities: ["triage", "atencion prehospitalaria"]
    },
    {
      id: "pc",
      name: "Puesto de Comando",
      type: "instalacion",
      status: "disponible",
      capabilities: ["mando", "coordinacion", "registro"]
    }
  ],
  hotspots: [
    {
      id: "foco",
      label: "Foco inicial",
      x: 58,
      y: 42,
      kind: "fuego",
      description: "Bodega posterior con carga combustible mixta."
    },
    {
      id: "exposicion",
      label: "Exposición lateral",
      x: 74,
      y: 41,
      kind: "riesgo",
      description: "Local contiguo con propagación por techumbre."
    },
    {
      id: "victima",
      label: "Persona no ubicada",
      x: 51,
      y: 56,
      kind: "victima",
      description: "Vecinos informan trabajador que no responde teléfono."
    },
    {
      id: "calle",
      label: "Tránsito activo",
      x: 31,
      y: 78,
      kind: "riesgo",
      description: "Vehículos cruzan frente a zona de trabajo."
    },
    {
      id: "pc",
      label: "PC sugerido",
      x: 22,
      y: 28,
      kind: "pc",
      description: "Ubicación segura con visión parcial y acceso a radio."
    }
  ],
  injects: [
    {
      id: "propagacion-techo",
      minute: 8,
      title: "Aumento de propagación por techumbre",
      description: "Se observa fuego corriendo hacia exposición lateral por entretecho.",
      severity: "alta",
      metricImpact: { risk: 12, control: -8, propertyConservation: -10, complexity: 8 },
      expectedResponses: ["sectorizar-operaciones", "linea-exposicion", "solicitar-apoyo"]
    },
    {
      id: "vecinos-presionan",
      minute: 12,
      title: "Vecinos ingresan al perímetro",
      description: "Dos vecinos intentan acercarse para retirar especies y exigir información.",
      severity: "media",
      metricImpact: { risk: 8, lifeSafety: -6, coordination: -4 },
      expectedResponses: ["perimetro-evacuacion", "activar-enlace", "info-publica"]
    },
    {
      id: "bombero-fatiga",
      minute: 18,
      title: "Equipo interior reporta fatiga y baja visibilidad",
      description: "Dotación interior solicita relevo. Hay consumo alto de aire y temperatura elevada.",
      severity: "critica",
      metricImpact: { risk: 14, lifeSafety: -10, complexity: 6 },
      expectedResponses: ["oficial-seguridad", "registro-recursos", "sectorizar-operaciones"]
    },
    {
      id: "cilindros-patio",
      minute: 22,
      title: "Hallazgo de cilindros menores en patio",
      description: "Se reportan cilindros pequeños expuestos a calor radiante en zona posterior.",
      severity: "alta",
      metricImpact: { risk: 10, control: -5, complexity: 8 },
      expectedResponses: ["objetivos-iniciales", "linea-exposicion", "solicitar-apoyo"]
    }
  ],
  decisions: [
    {
      id: "asumir-mando",
      title: "Asumir mando y declarar SCI inicial",
      description: "Informar arribo, asumir CI, nombrar incidente y entregar reporte inicial.",
      category: "mando",
      recommendedFromMinute: 0,
      recommendedUntilMinute: 4,
      metricImpact: { control: 12, coordination: 10, complexity: -4 },
      unlocks: ["objetivos-iniciales", "perimetro-evacuacion", "plan-comunicaciones"],
      penalizedIfRepeated: true,
      doctrineNotes: ["Mando temprano", "Terminología común", "Cadena de mando"]
    },
    {
      id: "objetivos-iniciales",
      title: "Definir objetivos iniciales",
      description: "Priorizar vida, estabilización del incendio, exposición lateral y seguridad pública.",
      category: "objetivos",
      recommendedFromMinute: 1,
      recommendedUntilMinute: 8,
      metricImpact: { control: 10, coordination: 8, propertyConservation: 6 },
      requires: ["asumir-mando"],
      unlocks: ["pai-inicial", "sectorizar-operaciones"],
      doctrineNotes: ["Manejo por objetivos", "Plan de acción del incidente"]
    },
    {
      id: "oficial-seguridad",
      title: "Designar Oficial de Seguridad",
      description: "Asignar evaluación dinámica de riesgos, control de EPP, ingreso y salida de personal.",
      category: "seguridad",
      recommendedFromMinute: 2,
      recommendedUntilMinute: 12,
      metricImpact: { risk: -12, lifeSafety: 12, coordination: 4 },
      unlocks: ["registro-recursos"],
      doctrineNotes: ["Responsabilidad", "Seguridad", "Organización modular"]
    },
    {
      id: "perimetro-evacuacion",
      title: "Definir perímetro y evacuación preventiva",
      description: "Delimitar zona caliente, controlar tránsito y retirar civiles de exposición.",
      category: "seguridad",
      recommendedFromMinute: 2,
      recommendedUntilMinute: 10,
      metricImpact: { risk: -10, lifeSafety: 14, coordination: 4 },
      doctrineNotes: ["Instalaciones y zonas", "Responsabilidad", "Seguridad pública"]
    },
    {
      id: "busqueda-primaria",
      title: "Ordenar búsqueda primaria con control de ingreso",
      description: "Asignar equipo, ruta, comunicación, respaldo y objetivo de búsqueda.",
      category: "operaciones",
      recommendedFromMinute: 4,
      recommendedUntilMinute: 14,
      metricImpact: { lifeSafety: 16, risk: 4, control: 3 },
      requires: ["oficial-seguridad"],
      doctrineNotes: ["Unidad de mando", "Operaciones", "Responsabilidad"]
    },
    {
      id: "linea-exposicion",
      title: "Proteger exposición lateral",
      description: "Asignar línea o recurso táctico específico para cortar propagación.",
      category: "operaciones",
      recommendedFromMinute: 5,
      recommendedUntilMinute: 16,
      metricImpact: { control: 10, propertyConservation: 15, risk: -4 },
      doctrineNotes: ["Manejo por objetivos", "Operaciones", "Prioridades tácticas"]
    },
    {
      id: "plan-comunicaciones",
      title: "Establecer plan de comunicaciones",
      description: "Canal de mando, canal operativo y reportes periódicos de sectores.",
      category: "comunicaciones",
      recommendedFromMinute: 3,
      recommendedUntilMinute: 12,
      metricImpact: { coordination: 14, complexity: -6 },
      requires: ["asumir-mando"],
      doctrineNotes: ["Comunicaciones integradas", "Terminología común"]
    },
    {
      id: "solicitar-apoyo",
      title: "Solicitar recursos adicionales justificados",
      description: "Pedir abastecimiento, control de tránsito y apoyo sanitario con ETA y misión.",
      category: "recursos",
      recommendedFromMinute: 5,
      recommendedUntilMinute: 15,
      metricImpact: { control: 8, coordination: 6, complexity: 3 },
      requires: ["objetivos-iniciales"],
      doctrineNotes: ["Gestión integral de recursos", "Despacho y despliegue"]
    },
    {
      id: "sectorizar-operaciones",
      title: "Sectorizar operaciones",
      description: "Crear sector interior, exposición y seguridad/perímetro con responsables claros.",
      category: "operaciones",
      recommendedFromMinute: 8,
      recommendedUntilMinute: 20,
      metricImpact: { control: 12, coordination: 10, complexity: -8 },
      requires: ["objetivos-iniciales"],
      unlocks: ["pai-inicial"],
      doctrineNotes: ["Organización modular", "Alcance de control", "Unidad de mando"]
    },
    {
      id: "registro-recursos",
      title: "Registrar recursos y control de personal",
      description: "Actualizar estado de unidades, asignaciones, relevos y personal en riesgo.",
      category: "recursos",
      recommendedFromMinute: 8,
      recommendedUntilMinute: 24,
      metricImpact: { lifeSafety: 8, coordination: 8, complexity: -5 },
      doctrineNotes: ["Responsabilidad", "Gestión integral de recursos"]
    },
    {
      id: "activar-enlace",
      title: "Activar enlace con instituciones",
      description: "Coordinar Carabineros, SAMU, municipio u otra institución según necesidades.",
      category: "enlace",
      recommendedFromMinute: 10,
      metricImpact: { coordination: 12, lifeSafety: 4, complexity: -2 },
      doctrineNotes: ["Enlace", "Comando unificado cuando corresponda"]
    },
    {
      id: "info-publica",
      title: "Designar vocería/información pública",
      description: "Canalizar información a vecinos y evitar instrucciones contradictorias.",
      category: "enlace",
      recommendedFromMinute: 12,
      metricImpact: { coordination: 6, lifeSafety: 3, complexity: -3 },
      doctrineNotes: ["Información pública", "Gestión de información"]
    },
    {
      id: "pai-inicial",
      title: "Formalizar PAI inicial",
      description: "Registrar objetivos, estructura, comunicaciones, seguridad y recursos para el periodo inicial.",
      category: "planificacion",
      recommendedFromMinute: 12,
      metricImpact: { control: 10, coordination: 12, complexity: -6 },
      requires: ["objetivos-iniciales", "plan-comunicaciones"],
      doctrineNotes: ["Plan de acción del incidente", "Planificación", "Información e inteligencia"]
    }
  ]
};

export const scenarios: Scenario[] = [structuralFireScenario];
