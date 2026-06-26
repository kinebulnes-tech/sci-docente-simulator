import type { Firestore, Unsubscribe } from "firebase/firestore";
import type {
  FirebaseSession,
  InstructorEventDoc,
  SessionParticipant,
  StudentDecisionDoc,
} from "../types/firebaseSession";
import type { SessionMode } from "../types/sessionEvents";
import {
  createFirebaseSession,
  findSessionByCode,
  getFirebaseSession,
  pushInstructorEvent,
  pushStudentDecision,
  subscribeFirebaseSession,
  subscribeInstructorEvents,
  subscribeParticipants,
  subscribeStudentDecisions,
  updateFirebaseSessionStatus,
  updateParticipantLastSeen,
  upsertParticipant,
} from "./firebaseSessionService";
import { generateJoinCode } from "../utils/joinCode";

// ─── Adapter interface ─────────────────────────────────────────────────────

export type AdapterMode = "local" | "firebase";

export interface CreateSessionInput {
  sessionId: string;
  scenarioId: string;
  scenarioName: string;
  mode: SessionMode;
  instructorUid: string;
  instructorName: string;
}

export interface SessionPersistenceAdapter {
  readonly mode: AdapterMode;

  createSession(input: CreateSessionInput): Promise<FirebaseSession>;
  joinSession(
    joinCode: string,
    uid: string,
    role: "instructor" | "student",
    displayName: string
  ): Promise<FirebaseSession>;
  getSession(sessionId: string): Promise<FirebaseSession | null>;
  updateStatus(sessionId: string, status: FirebaseSession["status"]): Promise<void>;

  subscribeSession(sessionId: string, cb: (s: FirebaseSession | null) => void): Unsubscribe;
  subscribeParticipants(sessionId: string, cb: (p: SessionParticipant[]) => void): Unsubscribe;
  subscribeStudentDecisions(sessionId: string, cb: (d: StudentDecisionDoc[]) => void): Unsubscribe;
  subscribeInstructorEvents(sessionId: string, cb: (e: InstructorEventDoc[]) => void): Unsubscribe;

  pushStudentDecision(sessionId: string, decision: StudentDecisionDoc): Promise<void>;
  pushInstructorEvent(sessionId: string, event: InstructorEventDoc): Promise<void>;
  updateParticipantLastSeen(sessionId: string, uid: string): Promise<void>;
}

// ─── Local adapter (single-device, localStorage-backed) ───────────────────

const LOCAL_SESSIONS_KEY = "sci-firebase-sessions-local-v1";

function loadLocalSessions(): Record<string, FirebaseSession> {
  try {
    const raw = localStorage.getItem(LOCAL_SESSIONS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, FirebaseSession>) : {};
  } catch {
    return {};
  }
}

function saveLocalSession(session: FirebaseSession): void {
  try {
    const all = loadLocalSessions();
    all[session.id] = session;
    localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(all));
  } catch {
    // storage unavailable
  }
}

export const localSessionAdapter: SessionPersistenceAdapter = {
  mode: "local",

  async createSession(input) {
    const session: FirebaseSession = {
      id: input.sessionId,
      joinCode: generateJoinCode(),
      scenarioId: input.scenarioId,
      scenarioName: input.scenarioName,
      mode: input.mode,
      status: "waiting",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      instructorUid: input.instructorUid,
      instructorName: input.instructorName,
    };
    saveLocalSession(session);
    return session;
  },

  async joinSession(joinCode, uid, role, displayName) {
    const all = loadLocalSessions();
    const session = Object.values(all).find(
      (s) => s.joinCode === joinCode.toUpperCase()
    );
    if (!session) throw new Error(`Código de sesión no encontrado: ${joinCode}`);
    if (role === "student") {
      const updated: FirebaseSession = {
        ...session,
        activeStudentUid: uid,
        activeStudentName: displayName,
        updatedAt: Date.now(),
      };
      saveLocalSession(updated);
      return updated;
    }
    return session;
  },

  async getSession(sessionId) {
    return loadLocalSessions()[sessionId] ?? null;
  },

  async updateStatus(sessionId, status) {
    const all = loadLocalSessions();
    if (all[sessionId]) {
      all[sessionId] = { ...all[sessionId], status, updatedAt: Date.now() };
      localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(all));
    }
  },

  subscribeSession(sessionId, cb) {
    const session = loadLocalSessions()[sessionId] ?? null;
    cb(session);
    return () => {};
  },

  subscribeParticipants(_sessionId, cb) {
    cb([]);
    return () => {};
  },

  subscribeStudentDecisions(_sessionId, cb) {
    cb([]);
    return () => {};
  },

  subscribeInstructorEvents(_sessionId, cb) {
    cb([]);
    return () => {};
  },

  async pushStudentDecision() {},
  async pushInstructorEvent() {},
  async updateParticipantLastSeen() {},
};

// ─── Firebase adapter ──────────────────────────────────────────────────────

export function createFirebaseAdapter(db: Firestore): SessionPersistenceAdapter {
  return {
    mode: "firebase",

    async createSession(input) {
      const session: Omit<FirebaseSession, "updatedAt"> = {
        id: input.sessionId,
        joinCode: generateJoinCode(),
        scenarioId: input.scenarioId,
        scenarioName: input.scenarioName,
        mode: input.mode,
        status: "waiting",
        createdAt: Date.now(),
        instructorUid: input.instructorUid,
        instructorName: input.instructorName,
      };
      const created = await createFirebaseSession(db, session);
      await upsertParticipant(db, input.sessionId, {
        uid: input.instructorUid,
        role: "instructor",
        displayName: input.instructorName,
        joinedAt: Date.now(),
        lastSeenAt: Date.now(),
      });
      return created;
    },

    async joinSession(joinCode, uid, role, displayName) {
      const session = await findSessionByCode(db, joinCode);
      if (!session) throw new Error(`Código de sesión no encontrado: ${joinCode}`);
      await upsertParticipant(db, session.id, {
        uid,
        role,
        displayName,
        joinedAt: Date.now(),
        lastSeenAt: Date.now(),
      });
      if (role === "student") {
        await updateFirebaseSessionStatus(db, session.id, "active", {
          activeStudentUid: uid,
          activeStudentName: displayName,
        });
        return { ...session, activeStudentUid: uid, activeStudentName: displayName, status: "active" };
      }
      return session;
    },

    async getSession(sessionId) {
      return getFirebaseSession(db, sessionId);
    },

    async updateStatus(sessionId, status) {
      await updateFirebaseSessionStatus(db, sessionId, status);
    },

    subscribeSession: (sessionId, cb) => subscribeFirebaseSession(db, sessionId, cb),
    subscribeParticipants: (sessionId, cb) => subscribeParticipants(db, sessionId, cb),
    subscribeStudentDecisions: (sessionId, cb) => subscribeStudentDecisions(db, sessionId, cb),
    subscribeInstructorEvents: (sessionId, cb) => subscribeInstructorEvents(db, sessionId, cb),

    async pushStudentDecision(sessionId, decision) {
      await pushStudentDecision(db, sessionId, decision);
    },
    async pushInstructorEvent(sessionId, event) {
      await pushInstructorEvent(db, sessionId, event);
    },
    async updateParticipantLastSeen(sessionId, uid) {
      await updateParticipantLastSeen(db, sessionId, uid);
    },
  };
}

// ─── Factory ───────────────────────────────────────────────────────────────

export function getAdapter(db: Firestore | null): SessionPersistenceAdapter {
  return db ? createFirebaseAdapter(db) : localSessionAdapter;
}
