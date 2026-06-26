import { BookOpen, GraduationCap, Monitor, Presentation } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type InstructorMode = "full" | "teaching" | "evaluation" | "projector";

interface ModeDef {
  id: InstructorMode;
  label: string;
  desc: string;
  icon: LucideIcon;
}

const MODES: ModeDef[] = [
  { id: "full",       label: "Instructor",  desc: "Control total del simulador",         icon: Monitor      },
  { id: "teaching",   label: "Enseñanza",   desc: "Preguntas guiadas y pausas activas",  icon: BookOpen     },
  { id: "evaluation", label: "Evaluación",  desc: "Vista limpia para el alumno",         icon: GraduationCap },
  { id: "projector",  label: "Proyector",   desc: "Vista optimizada para sala",          icon: Presentation },
];

const MODE_HINTS: Record<InstructorMode, string> = {
  full:       "Control completo — injects, mando, períodos, recursos y notas.",
  teaching:   "Modo guiado activo — preguntas docentes y pausas de discusión disponibles.",
  evaluation: "Vista de evaluación — rúbrica visible, herramientas docentes ocultas.",
  projector:  "Modo proyección — fuente grande, sin distractores de UI.",
};

interface InstructorModePanelProps {
  mode: InstructorMode;
  onModeChange: (mode: InstructorMode) => void;
}

export function InstructorModePanel({ mode, onModeChange }: InstructorModePanelProps) {
  return (
    <section className="panel instructor-mode-panel">
      <div className="panel-heading">
        <p className="eyebrow">Modo de sesión</p>
        <h2>Vista activa</h2>
      </div>
      <div className="instructor-modes">
        {MODES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`instructor-mode-btn${mode === id ? " active" : ""}`}
            onClick={() => onModeChange(id)}
            title={MODES.find((m) => m.id === id)?.desc}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>
      <p className="instructor-mode-hint">{MODE_HINTS[mode]}</p>
    </section>
  );
}
