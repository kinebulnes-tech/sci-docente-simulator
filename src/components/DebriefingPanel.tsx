import { useState, useCallback } from "react";
import {
  CheckCircle,
  Copy,
  RefreshCw,
  X,
  XCircle,
  ClipboardList,
  GraduationCap,
} from "lucide-react";
import type { SessionRole, SimulationState } from "../types/sci";
import type { EvaluationSummary } from "../types/evaluation";
import type { InstructorEvent } from "../types/sessionEvents";
import type { DecisionLog } from "../types/decisionLog";
import type { DebriefingData } from "../utils/debriefing";
import { buildDebriefingMarkdown } from "../utils/debriefing";
import {
  buildAar,
  buildAarMarkdown,
  buildInstructorSummary,
  buildStudentFeedback,
} from "../utils/debriefingEnhancer";
import { EvaluationSummaryPanel } from "./EvaluationSummaryPanel";
import { ExportPanel } from "./ExportPanel";

type DebriefTab = "resumen" | "aar" | "timeline";

interface DebriefingPanelProps {
  state: SimulationState;
  evaluation: EvaluationSummary;
  debriefing: DebriefingData;
  logs: DecisionLog[];
  role: SessionRole;
  instructorEvents?: InstructorEvent[];
  onRestart: () => void;
  onExit: () => void;
}

function useCopy(getText: () => string) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(getText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }, [getText]);
  return { copied, copy };
}

export function DebriefingPanel({
  state,
  evaluation,
  debriefing,
  logs,
  role,
  instructorEvents = [],
  onRestart,
  onExit,
}: DebriefingPanelProps) {
  const isInstructor = role === "instructor";
  const [notes, setNotes] = useState("");
  const [tab, setTab]     = useState<DebriefTab>("resumen");

  const aar = buildAar(debriefing, logs, state.timeline);

  const copyMd        = useCopy(() => buildDebriefingMarkdown(debriefing, notes, logs));
  const copyAar       = useCopy(() => buildAarMarkdown(aar));
  const copyInstructor = useCopy(() => buildInstructorSummary(aar, debriefing));
  const copyStudent   = useCopy(() => buildStudentFeedback(aar, debriefing));

  const TAB_LABELS: Record<DebriefTab, string> = {
    resumen:  "Evaluación",
    aar:      "Análisis AAR",
    timeline: "Línea de tiempo",
  };

  return (
    <div className="debriefing-overlay">
      <div className="debriefing-container">
        <div className="debriefing-header">
          <div>
            <p className="eyebrow">Cierre de caso</p>
            <h1>{state.scenario.title}</h1>
            <p className="debriefing-meta">
              Duración: {debriefing.durationMinutes} min ·{" "}
              {debriefing.decisionsCount} decisiones ·{" "}
              {debriefing.injectsCount} eventos activados
            </p>
          </div>
          <div
            className={`verdict-badge large ${
              debriefing.passed ? "verdict-pass" : "verdict-fail"
            }`}
          >
            {debriefing.passed ? (
              <CheckCircle size={22} />
            ) : (
              <XCircle size={22} />
            )}
            {debriefing.passed ? "APROBADO" : "NO APROBADO"}
          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────── */}
        <div className="debrief-tab-bar">
          {(Object.keys(TAB_LABELS) as DebriefTab[]).map((t) => (
            <button
              key={t}
              className={`debrief-tab-btn${tab === t ? " active" : ""}`}
              onClick={() => setTab(t)}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        {/* ── Tab: Evaluación ───────────────────────────────────────── */}
        {tab === "resumen" && (
          <>
            <EvaluationSummaryPanel summary={evaluation} />

            {isInstructor && (
              <section className="panel debriefing-notes-section">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">Instructor</p>
                    <h2>Observaciones finales</h2>
                  </div>
                </div>
                <textarea
                  className="instructor-notes-input"
                  placeholder="Escribe tus observaciones y recomendaciones para el alumno…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </section>
            )}

            <ExportPanel
              state={state}
              evaluation={evaluation}
              debriefing={debriefing}
              logs={logs}
              instructorNotes={notes}
              instructorEvents={isInstructor ? instructorEvents : []}
            />
          </>
        )}

        {/* ── Tab: AAR ──────────────────────────────────────────────── */}
        {tab === "aar" && (
          <section className="panel aar-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Análisis post-acción</p>
                <h2>After Action Review (AAR)</h2>
              </div>
              <div className="aar-copy-btns">
                {isInstructor && (
                  <button
                    className="icon-button"
                    onClick={copyInstructor.copy}
                    title="Copiar resumen para el instructor"
                  >
                    <ClipboardList size={15} />
                    {copyInstructor.copied ? "¡Copiado!" : "Resumen docente"}
                  </button>
                )}
                <button
                  className="icon-button"
                  onClick={copyStudent.copy}
                  title="Copiar mi retroalimentación"
                >
                  <GraduationCap size={15} />
                  {copyStudent.copied ? "¡Copiado!" : "Mi feedback"}
                </button>
                <button
                  className="icon-button"
                  onClick={copyAar.copy}
                  title="Copiar AAR completo en Markdown"
                >
                  <Copy size={15} />
                  {copyAar.copied ? "¡Copiado!" : "Copiar AAR"}
                </button>
              </div>
            </div>

            <div className="aar-sections">
              {[
                aar.happened,
                aar.decided,
                aar.wentWell,
                aar.couldImprove,
                aar.criticalErrors,
                aar.teachingRecommendations,
              ].map((section) => (
                <div key={section.title} className="aar-section">
                  <h3 className="aar-section-title">{section.title}</h3>
                  <ul className="aar-section-list">
                    {section.points.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}

              {isInstructor && instructorEvents.length > 0 && (
                <div className="aar-section aar-section--instructor">
                  <h3 className="aar-section-title">7. Observaciones docentes</h3>
                  <ul className="aar-section-list">
                    {instructorEvents.map((e) => (
                      <li key={e.id}>
                        <span className="aar-event-type">[{e.type}]</span>{" "}
                        T+{e.minute ?? "?"}m — {e.content.replace(/^\[(good|warn|critical)\]\s*/, "")}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Tab: Timeline ─────────────────────────────────────────── */}
        {tab === "timeline" && (
          <section className="panel debriefing-timeline-section">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Evidencia</p>
                <h2>Línea de tiempo</h2>
              </div>
            </div>
            <div className="timeline debriefing-timeline">
              {state.timeline
                .slice()
                .reverse()
                .map((entry, i) => (
                  <article key={i} className={`timeline-entry type-${entry.type}`}>
                    <span>Min {entry.minute}</span>
                    <strong>{entry.title}</strong>
                    <p>{entry.detail}</p>
                  </article>
                ))}
            </div>
          </section>
        )}

        {/* ── Actions ───────────────────────────────────────────────── */}
        <div className="debriefing-actions">
          <button className="icon-button" onClick={copyMd.copy} title="Copiar resumen Markdown">
            <Copy size={18} />
            {copyMd.copied ? "¡Copiado!" : "Copiar Markdown"}
          </button>
          <button className="secondary-button" onClick={onRestart}>
            <RefreshCw size={16} />
            Reiniciar caso
          </button>
          <button className="icon-button danger-btn" onClick={onExit} title="Cerrar caso">
            <X size={18} />
            Cerrar caso
          </button>
        </div>
      </div>
    </div>
  );
}
