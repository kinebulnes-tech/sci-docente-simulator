export type SessionMode = "full" | "teaching" | "evaluation" | "projector";

export type VisibilityLevel = "instructor_only" | "student_visible" | "projector_visible";

export type InstructorEventType =
  | "note"
  | "teaching_pause"
  | "guided_question"
  | "highlight"
  | "observation";

/** Docent event created by the instructor — never contributes to student evaluation. */
export interface InstructorEvent {
  id: string;
  timestamp: number;
  type: InstructorEventType;
  content: string;
  visibility: VisibilityLevel;
  evaluable: false;
  minute?: number;
}

/** Student-originated decision — the only events that count toward evaluation. */
export interface StudentDecision {
  id: string;
  timestamp: number;
  decisionId: string;
  label: string;
  category: string;
  result: "applied" | "blocked" | "repeated";
  evaluable: true;
}

/** Unified typed event shape for future timeline entries. */
export type SessionEvent =
  | (InstructorEvent & { source: "instructor" })
  | (StudentDecision & { source: "student" });
