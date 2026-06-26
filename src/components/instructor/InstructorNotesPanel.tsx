import { useState } from "react";
import { AlertTriangle, CheckCircle2, Trash2, Plus, XCircle } from "lucide-react";
import type { InstructorEvent } from "../../types/sessionEvents";

type NoteType = "good" | "warn" | "critical";

const NOTE_TYPE_TO_VISIBILITY: Record<NoteType, InstructorEvent["visibility"]> = {
  good: "instructor_only",
  warn: "instructor_only",
  critical: "instructor_only",
};

const TYPE_ICONS = {
  good: <CheckCircle2 size={13} />,
  warn: <AlertTriangle size={13} />,
  critical: <XCircle size={13} />,
};

const TYPE_LABELS: Record<NoteType, string> = {
  good: "Buena",
  warn: "Dudosa",
  critical: "Crítica",
};

function iconForEvent(e: InstructorEvent): React.ReactNode {
  if (e.content.startsWith("[warn]")) return TYPE_ICONS.warn;
  if (e.content.startsWith("[critical]")) return TYPE_ICONS.critical;
  return TYPE_ICONS.good;
}

function cssClassForEvent(e: InstructorEvent): string {
  if (e.content.startsWith("[warn]")) return "note-item note-warn";
  if (e.content.startsWith("[critical]")) return "note-item note-critical";
  return "note-item note-good";
}

function displayText(e: InstructorEvent): string {
  return e.content.replace(/^\[(good|warn|critical)\]\s*/, "");
}

interface InstructorNotesPanelProps {
  notes: InstructorEvent[];
  minute: number;
  onAdd: (type: InstructorEvent["type"], content: string, minute: number, visibility: InstructorEvent["visibility"]) => void;
  onRemove: (id: string) => void;
}

export function InstructorNotesPanel({ notes, minute, onAdd, onRemove }: InstructorNotesPanelProps) {
  const [input, setInput]       = useState("");
  const [noteType, setNoteType] = useState<NoteType>("good");

  function addNote() {
    const trimmed = input.trim();
    if (!trimmed) return;
    const tagged = `[${noteType}] ${trimmed}`;
    onAdd("note", tagged, minute, NOTE_TYPE_TO_VISIBILITY[noteType]);
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
            <div key={n.id} className={cssClassForEvent(n)}>
              {iconForEvent(n)}
              <span>{displayText(n)}</span>
              <span className="note-minute">T+{n.minute}m</span>
              <button
                className="note-delete-btn"
                onClick={() => onRemove(n.id)}
                title="Eliminar nota"
              >
                <Trash2 size={11} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
