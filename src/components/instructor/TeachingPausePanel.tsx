import { useState } from "react";
import { MessageSquare, PauseCircle, PlayCircle } from "lucide-react";

interface TeachingPause {
  id: string;
  minute: number;
  topic: string;
}

interface TeachingPausePanelProps {
  minute: number;
}

export function TeachingPausePanel({ minute }: TeachingPausePanelProps) {
  const [pauses, setPauses]   = useState<TeachingPause[]>([]);
  const [topic, setTopic]     = useState("");
  const [isPaused, setIsPaused] = useState(false);

  function registerPause() {
    if (!topic.trim()) return;
    setPauses((prev) => [
      ...prev,
      { id: `${Date.now()}`, minute, topic: topic.trim() },
    ]);
    setTopic("");
    setIsPaused(true);
  }

  function resume() {
    setIsPaused(false);
  }

  return (
    <div className="teaching-pause-panel">
      <p className="instructor-sub-title">
        <PauseCircle size={14} />
        Pausas docentes
      </p>

      {isPaused ? (
        <div className="pause-active">
          <p className="pause-active-label">⏸ Discusión en curso — simulación pausada</p>
          <button className="small-button" onClick={resume}>
            <PlayCircle size={13} />
            Reanudar simulación
          </button>
        </div>
      ) : (
        <div className="pause-form">
          <input
            className="notes-text-input"
            placeholder="Tema de discusión (ej: ¿Por qué establecer mando primero?)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && registerPause()}
          />
          <button
            className="small-button"
            onClick={registerPause}
            disabled={!topic.trim()}
          >
            <PauseCircle size={13} />
            Pausar
          </button>
        </div>
      )}

      {pauses.length > 0 && (
        <div className="pause-history">
          {pauses.map((p) => (
            <div key={p.id} className="pause-entry">
              <MessageSquare size={12} />
              <span className="log-minute">T+{p.minute}</span>
              <span>{p.topic}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
