import type { Scenario } from "../../types/sci";

export const evacuationGasScenario: Scenario = {
  id: "evacuacion-fuga-gas-residencial",
  title: "Evacuación preventiva por fuga de gas domiciliario en sector residencial",
  type: "evacuacion",
  difficulty: "basico",
  summary: "Fuga de gas natural en manzana residencial detectada por empresa distribuidora, 3 edificios de departamentos (120 personas), olor fuerte, 1 persona con náuseas.",
  briefing: "Técnico de empresa distribuidora de gas detecta fuga en red domiciliaria que afecta al menos dos cuadras del sector residencial. El olor a gas es intenso en toda la zona. La ubicación exacta de la fuga es incierta. Tres edificios de departamentos con 120 residentes estimados deben ser evaluados para evacuación. Una residente del tercer piso reporta náuseas. Vecinos muestran resistencia a abandonar sus hogares. Una adulta mayor de 82 años en el cuarto piso del Edificio B requiere asistencia para evacuar. El técnico de la empresa reporta que no han podido cerrar la llave de paso principal aún.",
  learningObjectives: [
    "Determinar radio de evacuación adecuado para fuga de gas en zona residencial",
    "Decidir entre evacuación total y confinamiento según condiciones del evento",
    "Coordinar con empresa distribuidora de gas para control de la emergencia",
    "Gestionar asistencia a personas con movilidad reducida durante la evacuación"
  ],
  doctrinalForms: ["ICS 201", "ICS 202", "ICS 205"],
  criticalErrors: ["controlar-fuentes-ignicion", "evacuar-persona-vulnerble"],
  initialMetrics: {
    risk: 48, control: 38, coordination: 30,
    lifeSafety: 42, propertyConservation: 55, complexity: 35
  },
  objectives: [
    {
      id: "vida-evacuacion",
      text: "Proteger la vida de residentes mediante evacuación o confinamiento oportuno.",
      priority: "vida",
      completedByDecisionIds: ["asumir-mando-gas", "definir-radio-evacuacion", "evacuar-persona-vulnerble", "confinamiento-vs-evacuacion"]
    },
    {
      id: "control-fuentes-ignicion",
      text: "Eliminar fuentes de ignición en el radio de peligro.",
      priority: "estabilizacion",
      completedByDecisionIds: ["controlar-fuentes-ignicion", "perimetro-seguridad-gas", "coordinar-empresa-gas"]
    },
    {
      id: "coordinacion-empresa",
      text: "Coordinar con empresa distribuidora para localizar y cerrar fuga.",
      priority: "estabilizacion",
      completedByDecisionIds: ["coordinar-empresa-gas", "activar-enlace-municipio", "plan-comunicaciones-gas"]
    },
    {
      id: "poblacion-vulnerable",
      text: "Identificar y asistir a personas con movilidad reducida en el área afectada.",
      priority: "vida",
      completedByDecisionIds: ["evacuar-persona-vulnerble", "registro-personas-gas", "solicitar-apoyo-gas"]
    }
  ],
  resources: [
    { id: "carro-gas", name: "Carro de Ataque Bombers", type: "unidad", status: "disponible", capabilities: ["control perimetro", "evacuacion", "ventilacion", "deteccion gas"] },
    { id: "empresa-gas", name: "Empresa Distribuidora MetroGas", type: "institucion", status: "disponible", etaMinutes: 0, capabilities: ["cierre de llave", "deteccion fuga", "reparacion red"] },
    { id: "carabineros-gas", name: "Carabineros", type: "institucion", status: "solicitado", etaMinutes: 6, capabilities: ["transito", "seguridad publica", "perimetro externo", "evacuacion civil"] },
    { id: "samu-gas", name: "SAMU", type: "institucion", status: "solicitado", etaMinutes: 8, capabilities: ["triage", "atencion prehospitalaria", "traslado pacientes"] },
    { id: "municipio-gas", name: "Municipio / Departamento Social", type: "institucion", status: "solicitado", etaMinutes: 20, capabilities: ["albergue temporal", "atencion personas vulnerables", "informacion a la comunidad"] },
    { id: "detector-gas", name: "Equipo Detector de Gas (Explosímetro)", type: "equipo", status: "disponible", capabilities: ["medicion concentracion gas", "deteccion zona fuga"] },
    { id: "pc-gas", name: "Puesto de Comando", type: "instalacion", status: "disponible", capabilities: ["mando", "coordinacion", "registro"] }
  ],
  hotspots: [
    { id: "fuga-principal", label: "Zona de fuga", x: 50, y: 50, kind: "riesgo", description: "Área con mayor concentración de olor a gas. Fuga en red subterránea." },
    { id: "edificio-a", label: "Edificio A", x: 38, y: 42, kind: "victima", description: "40 departamentos, estimado 50 residentes. Olor fuerte en pasillos." },
    { id: "edificio-b", label: "Edificio B", x: 52, y: 38, kind: "victima", description: "Adulta mayor en piso 4 requiere asistencia. 35 departamentos." },
    { id: "edificio-c", label: "Edificio C", x: 62, y: 55, kind: "victima", description: "Residente con náuseas en piso 3. 35 departamentos." },
    { id: "pc-ubicacion", label: "PC sugerido", x: 22, y: 25, kind: "pc", description: "Zona a barlovento, fuera del radio de riesgo inmediato." }
  ],
  injects: [
    {
      id: "olor-aumenta",
      minute: 7,
      title: "Intensificación del olor a gas",
      description: "El técnico de MetroGas informa que la concentración de gas aumentó. El explosímetro registra 15% del LEL en pasillo del Edificio B. El cierre de la llave principal aún no se logra.",
      severity: "alta",
      metricImpact: { risk: 15, control: -10, lifeSafety: -8, complexity: 10 },
      expectedResponses: ["controlar-fuentes-ignicion", "definir-radio-evacuacion", "coordinar-empresa-gas"]
    },
    {
      id: "vecino-rechaza",
      minute: 12,
      title: "Residente se niega a evacuar",
      description: "Propietario del departamento 302, Edificio A, rechaza categóricamente abandonar su hogar. Tiene mascotas y objetos de valor. Genera tensión y otros vecinos empiezan a dudar.",
      severity: "media",
      metricImpact: { risk: 6, lifeSafety: -8, coordination: -5, complexity: 6 },
      expectedResponses: ["confinamiento-vs-evacuacion", "activar-enlace-municipio", "plan-comunicaciones-gas"]
    },
    {
      id: "empresa-ubica-fuga",
      minute: 18,
      title: "MetroGas localiza fuga principal",
      description: "Técnicos de la empresa ubican la fuga principal bajo la acera entre Edificio A y B. Requieren corte de suministro total al sector, estimado 30 minutos para reparar. Proponen mantener evacuación al menos 1 hora.",
      severity: "media",
      metricImpact: { risk: -8, control: 12, coordination: 8, complexity: -5 },
      expectedResponses: ["coordinar-empresa-gas", "definir-radio-evacuacion", "registro-personas-gas"]
    }
  ],
  decisions: [
    {
      id: "asumir-mando-gas",
      title: "Asumir mando y declarar SCI",
      description: "Informar arribo, asumir CI, nombrar incidente y entregar reporte inicial al despachador.",
      category: "mando",
      recommendedFromMinute: 0,
      recommendedUntilMinute: 4,
      metricImpact: { control: 12, coordination: 10, complexity: -4 },
      unlocks: ["definir-radio-evacuacion", "plan-comunicaciones-gas", "perimetro-seguridad-gas"],
      penalizedIfRepeated: true,
      doctrineNotes: ["Mando temprano", "Terminología común", "Cadena de mando"]
    },
    {
      id: "perimetro-seguridad-gas",
      title: "Establecer perímetro de seguridad",
      description: "Delimitar zona de exclusión al menos 100 metros de la fuga estimada. Detener tráfico vehicular y peatonal en el sector.",
      category: "seguridad",
      recommendedFromMinute: 1,
      recommendedUntilMinute: 8,
      metricImpact: { risk: -10, lifeSafety: 10, coordination: 6 },
      requires: ["asumir-mando-gas"],
      unlocks: ["controlar-fuentes-ignicion"],
      doctrineNotes: ["Seguridad", "Instalaciones y zonas", "Responsabilidad"]
    },
    {
      id: "controlar-fuentes-ignicion",
      title: "Controlar y eliminar fuentes de ignición",
      description: "Ordenar apagado de motores, prohibir uso de celulares, fumar o encender luces en zona de riesgo. Solicitar corte eléctrico a distribuidora si concentración supera 10% LEL.",
      category: "seguridad",
      recommendedFromMinute: 2,
      recommendedUntilMinute: 10,
      metricImpact: { risk: -18, lifeSafety: 14, propertyConservation: 10 },
      requires: ["perimetro-seguridad-gas"],
      doctrineNotes: ["Seguridad", "Responsabilidad", "Manejo por objetivos"]
    },
    {
      id: "confinamiento-vs-evacuacion",
      title: "Decidir evacuación vs. confinamiento",
      description: "Evaluar condiciones del gas (concentración, dirección viento, fuentes ignición) para determinar si se evacúa o se confina en interiores con ventanas cerradas.",
      category: "planificacion",
      recommendedFromMinute: 3,
      recommendedUntilMinute: 10,
      metricImpact: { control: 8, lifeSafety: 10, coordination: 5, complexity: -5 },
      requires: ["asumir-mando-gas"],
      unlocks: ["definir-radio-evacuacion", "evacuar-persona-vulnerble"],
      doctrineNotes: ["Manejo por objetivos", "Plan de acción del incidente", "Responsabilidad"]
    },
    {
      id: "definir-radio-evacuacion",
      title: "Definir radio y zonas de evacuación",
      description: "Determinar perímetro de evacuación obligatoria por edificio o cuadra completa. Establecer punto de encuentro seguro a barlovento.",
      category: "operaciones",
      recommendedFromMinute: 3,
      recommendedUntilMinute: 12,
      metricImpact: { lifeSafety: 14, coordination: 8, risk: -8 },
      requires: ["confinamiento-vs-evacuacion"],
      unlocks: ["evacuar-persona-vulnerble", "registro-personas-gas"],
      doctrineNotes: ["Manejo por objetivos", "Operaciones", "Instalaciones y zonas"]
    },
    {
      id: "coordinar-empresa-gas",
      title: "Coordinar con empresa distribuidora de gas",
      description: "Integrar técnico de MetroGas al PC como enlace. Establecer comunicación directa, tiempos de cierre de llave y criterios de seguridad para reingreso.",
      category: "enlace",
      recommendedFromMinute: 4,
      recommendedUntilMinute: 15,
      metricImpact: { control: 10, coordination: 14, complexity: -6, risk: -5 },
      requires: ["asumir-mando-gas"],
      doctrineNotes: ["Enlace", "Comando unificado cuando corresponda", "Comunicaciones integradas"]
    },
    {
      id: "evacuar-persona-vulnerble",
      title: "Organizar asistencia a persona con movilidad reducida",
      description: "Enviar equipo específico a asistir adulta mayor del Edificio B piso 4. Coordinar con SAMU si requiere atención médica durante traslado.",
      category: "operaciones",
      recommendedFromMinute: 5,
      recommendedUntilMinute: 15,
      metricImpact: { lifeSafety: 18, coordination: 6, risk: -4 },
      requires: ["definir-radio-evacuacion"],
      doctrineNotes: ["Responsabilidad", "Operaciones", "Manejo por objetivos"]
    },
    {
      id: "plan-comunicaciones-gas",
      title: "Establecer plan de comunicaciones",
      description: "Definir canal de mando, canal operativo, y frecuencia de reportes. Incluir empresa gas y Carabineros en el plan.",
      category: "comunicaciones",
      recommendedFromMinute: 3,
      recommendedUntilMinute: 12,
      metricImpact: { coordination: 14, complexity: -6 },
      requires: ["asumir-mando-gas"],
      doctrineNotes: ["Comunicaciones integradas", "Terminología común"]
    },
    {
      id: "solicitar-apoyo-gas",
      title: "Solicitar recursos adicionales",
      description: "Solicitar SAMU para atención de persona con náuseas y apoyo a adulta mayor. Solicitar municipio para albergue temporal.",
      category: "recursos",
      recommendedFromMinute: 4,
      recommendedUntilMinute: 14,
      metricImpact: { coordination: 8, lifeSafety: 8, control: 5 },
      requires: ["confinamiento-vs-evacuacion"],
      doctrineNotes: ["Gestión integral de recursos", "Despacho y despliegue"]
    },
    {
      id: "registro-personas-gas",
      title: "Registrar personas evacuadas y punto de encuentro",
      description: "Establecer control de personas en punto de encuentro. Identificar residentes no evacuados y personas vulnerables adicionales.",
      category: "recursos",
      recommendedFromMinute: 8,
      recommendedUntilMinute: 25,
      metricImpact: { lifeSafety: 10, coordination: 8, complexity: -4 },
      requires: ["definir-radio-evacuacion"],
      doctrineNotes: ["Responsabilidad", "Gestión integral de recursos"]
    },
    {
      id: "activar-enlace-municipio",
      title: "Activar enlace con municipio y SENAPRED",
      description: "Notificar a municipio para activar albergue temporal. Informar a SENAPRED si la emergencia requiere recursos adicionales.",
      category: "enlace",
      recommendedFromMinute: 10,
      recommendedUntilMinute: 25,
      metricImpact: { coordination: 10, lifeSafety: 6, complexity: -3 },
      doctrineNotes: ["Enlace", "Multiagencia", "Comunicaciones integradas"]
    },
    {
      id: "pai-gas",
      title: "Formalizar PAI inicial",
      description: "Registrar objetivos, estructura de mando, comunicaciones, seguridad y estado de recursos para el periodo operacional.",
      category: "planificacion",
      recommendedFromMinute: 12,
      metricImpact: { control: 10, coordination: 12, complexity: -6 },
      requires: ["confinamiento-vs-evacuacion", "plan-comunicaciones-gas"],
      doctrineNotes: ["Plan de acción del incidente", "Planificación"]
    }
  ],
  rubric: [
    { id: "r-mando-gas", title: "Establece mando y estructura inicial", category: "mando", maxPoints: 15, evidenceDecisionIds: ["asumir-mando-gas", "confinamiento-vs-evacuacion"] },
    { id: "r-seguridad-gas", title: "Controla fuentes de ignición y establece perímetro", category: "seguridad", maxPoints: 25, evidenceDecisionIds: ["controlar-fuentes-ignicion", "perimetro-seguridad-gas", "registro-personas-gas"], failCondition: "No se controlan fuentes de ignición dentro de los primeros 10 minutos" },
    { id: "r-operaciones-gas", title: "Ejecuta evacuación ordenada con asistencia a vulnerables", category: "operaciones", maxPoints: 25, evidenceDecisionIds: ["definir-radio-evacuacion", "evacuar-persona-vulnerble", "solicitar-apoyo-gas"], failCondition: "No se asiste a la persona con movilidad reducida" },
    { id: "r-comunicaciones-gas", title: "Coordina comunicaciones y enlace interinstitucional", category: "comunicaciones", maxPoints: 15, evidenceDecisionIds: ["plan-comunicaciones-gas", "coordinar-empresa-gas", "activar-enlace-municipio"] },
    { id: "r-planificacion-gas", title: "Planifica y registra decisiones operacionales", category: "planificacion", maxPoints: 20, evidenceDecisionIds: ["pai-gas", "registro-personas-gas"] }
  ]
};
