import { useState } from "react";
import { AlertTriangle, CheckCircle2, Plus, XCircle } from "lucide-react";

type NoteType = "good" | "warn" | "critical";

interface Note {
  id: string;
  type: NoteType;
  text: string;
}

const TYPE_ICONS = {
  good:     <CheckCircle2 size={13} />,
  warn:     <AlertTriangle size={13} />,
  critical: <XCircle size={13} />,
};

const TYPE_LABELS: Record<NoteType, string> = {
  good:     "Buena",
  warn:     "Dudosa",
  critical: "Crítica",
};

export function InstructorNotesPanel() {
  const [notes, setNotes]     = useState<Note[]>([]);
  const [input, setInput]     = useState("");
  const [noteType, setNoteType] = useState<NoteType>("good");

  function addNote() {
    if (!input.trim()) return;
    setNotes((prev) => [
      ...prev,
      { id: `${Date.now()}`, type: noteType, text: input.trim() },
    ]);
    setInput("");
  }

  return (
    <div className="instructor-notes-panel">
      <p className="instructor-sub-title">Observaciones rápidas</p>

      <div className="notes-input-row">
        <div className="notes-type-btns">
          {(["good", "warn", "critical"] as NoteType[]).map((t) => (
            <button
              key={t}
              className={`note-type-btn note-type-${t}${noteType === t ? " active" : ""}`}
              onClick={() => setNoteType(t)}
              title={TYPE_LABELS[t]}
            >
              {TYPE_ICONS[t]}
            </button>
          ))}
        </div>
        <input
          className="notes-text-input"
          placeholder="Observación (Enter para agregar)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addNote()}
        />
        <button className="small-button" onClick={addNote} disabled={!input.trim()}>
          <Plus size={13} />
        </button>
      </div>

      {notes.length > 0 && (
        <div className="notes-list">
          {notes.map((n) => (
            <div key={n.id} className={`note-item note-${n.type}`}>
              {TYPE_ICONS[n.type]}
              <span>{n.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
