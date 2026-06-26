import { Download } from "lucide-react";
import type { SimulationState } from "../types/sci";
import type { DecisionLog } from "../types/decisionLog";
import type { EvaluationSummary } from "../types/evaluation";
import type { InstructorEvent } from "../types/sessionEvents";
import type { DebriefingData } from "../utils/debriefing";
import { exportDecisionsCSV, exportDebriefingMarkdown, exportSessionJSON } from "../utils/exportSession";

interface ExportPanelProps {
  state: SimulationState;
  evaluation: EvaluationSummary;
  debriefing: DebriefingData;
  logs: DecisionLog[];
  instructorNotes: string;
  instructorEvents?: InstructorEvent[];
}

export function ExportPanel({ state, evaluation, debriefing, logs, instructorNotes, instructorEvents = [] }: ExportPanelProps) {
  return (
    <section className="panel export-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Exportar</p>
          <h2>Evidencia de sesión</h2>
        </div>
      </div>
      <div className="export-buttons">
        <button
          className="secondary-button"
          onClick={() => exportSessionJSON(state, evaluation, logs, instructorEvents)}
          title="Exportar sesión completa como JSON"
        >
          <Download size={16} />
          JSON (sesión)
        </button>
        <button
          className="secondary-button"
          onClick={() => exportDecisionsCSV(logs)}
          title="Exportar decisiones como CSV"
        >
          <Download size={16} />
          CSV (decisiones)
        </button>
        <button
          className="secondary-button"
          onClick={() => exportDebriefingMarkdown(debriefing, instructorNotes, logs)}
          title="Exportar debriefing como Markdown"
        >
          <Download size={16} />
          Markdown (debriefing)
        </button>
      </div>
      <p className="export-note">
        Los archivos se descargan localmente. No se envía información a ningún servidor.
      </p>
    </section>
  );
}
