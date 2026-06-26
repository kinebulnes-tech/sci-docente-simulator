import type { SessionMode } from "./sessionEvents";

export type SessionStatus = "waiting" | "active" | "completed" | "closed";

export type ParticipantRole = "instructor" | "student";

/** Firestore document: sessions/{sessionId} */
export interface FirebaseSession {
  id: string;
  joinCode: string;
  scenarioId: string;
  scenarioName: string;
  mode: SessionMode;
  status: SessionStatus;
  createdAt: number;
  updatedAt: number;
  instructorUid: string;
  instructorName: string;
  activeStudentUid?: string;
  activeStudentName?: string;
}

/** Firestore document: sessions/{sessionId}/participants/{uid} */
export interface SessionParticipant {
  uid: string;
  role: ParticipantRole;
  displayName: string;
  joinedAt: number;
  lastSeenAt: number;
}

/** Firestore document: sessions/{sessionId}/studentDecisions/{id} */
export interface StudentDecisionDoc {
  id: string;
  timestamp: number;
  source: "student";
  evaluable: true;
  visibility: "all";
  decisionId: string;
  label: string;
  category: string;
  result: "applied" | "blocked" | "repeated";
  minute: number;
}

/** Firestore document: sessions/{sessionId}/instructorEvents/{id} */
export interface InstructorEventDoc {
  id: string;
  timestamp: number;
  source: "instructor";
  evaluable: false;
  visibility: "instructor_only" | "student_visible" | "projector_visible";
  type: "note" | "teaching_pause" | "guided_question" | "observation" | "highlight";
  content: string;
  minute?: number;
}

/** Firestore document: sessions/{sessionId}/timeline/{id} */
export interface TimelineEntryDoc {
  id: string;
  minute: number;
  title: string;
  detail: string;
  type: "decision" | "inject" | "system" | "score";
  source: "student" | "instructor" | "system";
  evaluable: boolean;
  visibility: "student" | "instructor" | "all";
  timestamp: number;
}
