import type { SciPrinciple, SciRole } from "../types/sci";

export const sciPrinciples: SciPrinciple[] = [
  {
    id: "terminologia-comun",
    title: "Terminología común",
    description: "Uso de nombres, funciones, instalaciones y recursos comprensibles para todas las instituciones.",
    simulatorRule: "Las decisiones que ordenan recursos o sectores deben usar objetivos claros y denominaciones consistentes."
  },
  {
    id: "mando",
    title: "Establecer y transferir mando",
    description: "El mando debe ser asumido tempranamente y transferido formalmente cuando corresponda.",
    simulatorRule: "No establecer mando en fase inicial reduce control y coordinación."
  },
  {
    id: "unidad-mando",
    title: "Cadena y unidad de mando",
    description: "Cada recurso responde a un solo supervisor dentro de una cadena conocida.",
    simulatorRule: "Asignaciones sin supervisor aumentan complejidad."
  },
  {
    id: "comando-unificado",
    title: "Comando unificado",
    description: "Instituciones con competencia comparten objetivos y estrategia sin perder autoridad propia.",
    simulatorRule: "En incidentes multiagencia, activar enlace o comando unificado mejora coordinación."
  },
  {
    id: "objetivos",
    title: "Manejo por objetivos",
    description: "La respuesta se organiza en objetivos medibles, estrategias y tácticas.",
    simulatorRule: "Pedir recursos sin declarar objetivos aporta poco puntaje y puede aumentar sobrecarga."
  },
  {
    id: "pai",
    title: "Plan de acción del incidente",
    description: "El PAI resume objetivos, organización, comunicaciones y seguridad para el periodo operacional.",
    simulatorRule: "Formalizar PAI mejora coordinación y control en escenarios dinámicos."
  },
  {
    id: "organizacion-modular",
    title: "Organización modular",
    description: "La estructura crece o se reduce según tamaño, complejidad y riesgos del incidente.",
    simulatorRule: "Expandir funciones cuando crece el incidente mejora respuesta; expandir antes de tiempo penaliza complejidad."
  },
  {
    id: "alcance-control",
    title: "Alcance de control",
    description: "Supervisores mantienen un número manejable de recursos o subordinados directos.",
    simulatorRule: "Sectorizar operaciones reduce complejidad cuando hay múltiples frentes."
  },
  {
    id: "instalaciones",
    title: "Instalaciones del incidente",
    description: "Puesto de comando, áreas de espera, zonas de trabajo y perímetros deben ser definidos.",
    simulatorRule: "Ubicar PC y perímetro temprano aumenta seguridad y coordinación."
  },
  {
    id: "recursos",
    title: "Gestión integral de recursos",
    description: "Los recursos se solicitan, registran, asignan, supervisan y desmovilizan.",
    simulatorRule: "Solicitar recursos adecuados a objetivos mejora control; solicitudes tardías elevan riesgo."
  },
  {
    id: "comunicaciones",
    title: "Comunicaciones integradas",
    description: "Canales, reportes y coordinación deben ser interoperables y conocidos.",
    simulatorRule: "Establecer plan de comunicaciones mejora coordinación y reduce retrasos."
  },
  {
    id: "informacion",
    title: "Gestión de información e inteligencia",
    description: "La información crítica se captura, verifica y usa para anticipar necesidades.",
    simulatorRule: "Reevaluar el incidente y registrar cambios mejora puntaje de planificación."
  },
  {
    id: "responsabilidad",
    title: "Responsabilidad",
    description: "Debe existir control de personal, reportes, seguridad y seguimiento de recursos.",
    simulatorRule: "Control de personal y seguridad aumentan vida/seguridad y disminuyen riesgo."
  },
  {
    id: "despacho",
    title: "Despacho y despliegue",
    description: "Los recursos se movilizan por solicitud o despacho autorizado.",
    simulatorRule: "Activar recursos justificados por condiciones del escenario mejora eficiencia."
  }
];

export const sciRoles: SciRole[] = [
  {
    id: "ci",
    title: "Comandante del Incidente",
    function: "mando",
    description: "Responsable general del incidente, objetivos, estrategia y seguridad global.",
    activeByDefault: true
  },
  {
    id: "seguridad",
    title: "Oficial de Seguridad",
    function: "seguridad",
    description: "Asesora al CI en riesgos, control de personal y condiciones inseguras.",
    activeByDefault: false
  },
  {
    id: "enlace",
    title: "Oficial de Enlace",
    function: "enlace",
    description: "Coordina con instituciones cooperadoras y representantes externos.",
    activeByDefault: false
  },
  {
    id: "info-publica",
    title: "Oficial de Información Pública",
    function: "informacionPublica",
    description: "Gestiona información pública y coordinación comunicacional autorizada.",
    activeByDefault: false
  },
  {
    id: "jefe-operaciones",
    title: "Jefe de Operaciones",
    function: "operaciones",
    description: "Dirige tácticas, sectores, recursos operativos y control del incidente.",
    activeByDefault: false
  },
  {
    id: "jefe-planificacion",
    title: "Jefe de Planificación",
    function: "planificacion",
    description: "Consolida información, proyección, documentación y PAI.",
    activeByDefault: false
  },
  {
    id: "jefe-logistica",
    title: "Jefe de Logística",
    function: "logistica",
    description: "Provee comunicaciones, alimentación, apoyo, equipos y servicios.",
    activeByDefault: false
  },
  {
    id: "jefe-admin",
    title: "Jefe Administración/Finanzas",
    function: "administracion",
    description: "Registra costos, tiempos, contratos, apoyo administrativo y compensaciones.",
    activeByDefault: false
  }
];
