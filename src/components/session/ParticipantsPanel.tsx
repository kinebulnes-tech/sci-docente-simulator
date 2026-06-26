import type { SessionParticipant, StudentDecisionDoc } from "../../types/firebaseSession";

interface ParticipantsPanelProps {
  participants: SessionParticipant[];
  studentDecisions: StudentDecisionDoc[];
}

function timeSince(ms: number): string {
  const diff = Date.now() - ms;
  if (diff < 60_000) return "ahora";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
  return `${Math.floor(diff / 3_600_000)}h`;
}

export function ParticipantsPanel({ participants, studentDecisions }: ParticipantsPanelProps) {
  const instructors = participants.filter((p) => p.role === "instructor");
  const students    = participants.filter((p) => p.role === "student");

  return (
    <section className="panel participants-panel">
      <div className="panel-heading">
        <p className="eyebrow">Sesión conectada</p>
        <h2>Participantes</h2>
      </div>

      {participants.length === 0 ? (
        <p className="participants-panel__empty">Sin participantes conectados.</p>
      ) : (
        <ul className="participants-panel__list">
          {instructors.map((p) => (
            <li key={p.uid} className="participants-panel__item participants-panel__item--instructor">
              <span className="participants-panel__name">{p.displayName}</span>
              <span className="participants-panel__role-badge">Instructor</span>
              <span className="participants-panel__seen">{timeSince(p.lastSeenAt)}</span>
            </li>
          ))}
          {students.map((p) => (
            <li key={p.uid} className="participants-panel__item participants-panel__item--student">
              <span className="participants-panel__name">{p.displayName}</span>
              <span className="participants-panel__role-badge">Alumno</span>
              <span className="participants-panel__seen">{timeSince(p.lastSeenAt)}</span>
            </li>
          ))}
        </ul>
      )}

      {studentDecisions.length > 0 && (
        <div className="participants-panel__decisions">
          <p className="participants-panel__decisions-heading">
            Decisiones del alumno ({studentDecisions.length})
          </p>
          <ul className="participants-panel__decisions-list">
            {studentDecisions.map((d) => (
              <li key={d.id} className="participants-panel__decision-item">
                <span className="decision-minute">T+{d.minute}m</span>
                <span className="decision-label">{d.label}</span>
                <span className={`decision-result decision-result--${d.result}`}>{d.result}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
