import type { RubricItem } from "../types/sci";

export const structuralFireRubric: RubricItem[] = [
  {
    id: "r-mando",
    title: "Establece mando y estructura inicial",
    category: "mando",
    maxPoints: 15,
    evidenceDecisionIds: ["asumir-mando", "objetivos-iniciales"],
    failCondition: "No asumir mando durante la fase inicial."
  },
  {
    id: "r-seguridad",
    title: "Gestiona seguridad de respondedores y civiles",
    category: "seguridad",
    maxPoints: 20,
    evidenceDecisionIds: ["oficial-seguridad", "perimetro-evacuacion", "registro-recursos"]
  },
  {
    id: "r-operaciones",
    title: "Define tácticas coherentes con prioridades",
    category: "operaciones",
    maxPoints: 20,
    evidenceDecisionIds: ["busqueda-primaria", "linea-exposicion", "sectorizar-operaciones"]
  },
  {
    id: "r-comunicaciones",
    title: "Ordena comunicaciones y coordinación",
    category: "comunicaciones",
    maxPoints: 15,
    evidenceDecisionIds: ["plan-comunicaciones", "activar-enlace", "info-publica"]
  },
  {
    id: "r-recursos",
    title: "Solicita, asigna y registra recursos",
    category: "recursos",
    maxPoints: 15,
    evidenceDecisionIds: ["solicitar-apoyo", "registro-recursos"]
  },
  {
    id: "r-planificacion",
    title: "Formaliza objetivos y PAI",
    category: "planificacion",
    maxPoints: 15,
    evidenceDecisionIds: ["pai-inicial", "objetivos-iniciales"]
  }
];
