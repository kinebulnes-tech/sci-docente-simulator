import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Firestore,
  type Unsubscribe,
} from "firebase/firestore";
import type {
  FirebaseSession,
  InstructorEventDoc,
  SessionParticipant,
  StudentDecisionDoc,
} from "../types/firebaseSession";

// ─── Collection helpers ────────────────────────────────────────────────────

const sessions     = (db: Firestore) => collection(db, "sessions");
const sessionDoc   = (db: Firestore, id: string) => doc(db, "sessions", id);
const participants = (db: Firestore, sid: string) => collection(db, "sessions", sid, "participants");
const decisions    = (db: Firestore, sid: string) => collection(db, "sessions", sid, "studentDecisions");
const events       = (db: Firestore, sid: string) => collection(db, "sessions", sid, "instructorEvents");

// ─── Sessions ──────────────────────────────────────────────────────────────

export async function createFirebaseSession(
  db: Firestore,
  data: Omit<FirebaseSession, "updatedAt">
): Promise<FirebaseSession> {
  const ref = sessionDoc(db, data.id);
  const now = Date.now();
  const session: FirebaseSession = { ...data, updatedAt: now };
  await setDoc(ref, { ...session, _serverTs: serverTimestamp() });
  return session;
}

export async function getFirebaseSession(
  db: Firestore,
  sessionId: string
): Promise<FirebaseSession | null> {
  const snap = await getDoc(sessionDoc(db, sessionId));
  if (!snap.exists()) return null;
  return snap.data() as FirebaseSession;
}

export async function findSessionByCode(
  db: Firestore,
  joinCode: string
): Promise<FirebaseSession | null> {
  const q = query(sessions(db), where("joinCode", "==", joinCode.toUpperCase()));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as FirebaseSession;
}

export async function updateFirebaseSessionStatus(
  db: Firestore,
  sessionId: string,
  status: FirebaseSession["status"],
  extra?: Partial<FirebaseSession>
): Promise<void> {
  await updateDoc(sessionDoc(db, sessionId), {
    status,
    updatedAt: Date.now(),
    ...extra,
  });
}

export function subscribeFirebaseSession(
  db: Firestore,
  sessionId: string,
  cb: (session: FirebaseSession | null) => void
): Unsubscribe {
  return onSnapshot(sessionDoc(db, sessionId), (snap) => {
    cb(snap.exists() ? (snap.data() as FirebaseSession) : null);
  });
}

// ─── Participants ──────────────────────────────────────────────────────────

export async function upsertParticipant(
  db: Firestore,
  sessionId: string,
  participant: SessionParticipant
): Promise<void> {
  await setDoc(doc(participants(db, sessionId), participant.uid), participant);
}

export async function updateParticipantLastSeen(
  db: Firestore,
  sessionId: string,
  uid: string
): Promise<void> {
  await updateDoc(doc(participants(db, sessionId), uid), { lastSeenAt: Date.now() });
}

export function subscribeParticipants(
  db: Firestore,
  sessionId: string,
  cb: (parts: SessionParticipant[]) => void
): Unsubscribe {
  return onSnapshot(participants(db, sessionId), (snap) => {
    cb(snap.docs.map((d) => d.data() as SessionParticipant));
  });
}

// ─── Student decisions ─────────────────────────────────────────────────────

export async function pushStudentDecision(
  db: Firestore,
  sessionId: string,
  decision: StudentDecisionDoc
): Promise<void> {
  await setDoc(doc(decisions(db, sessionId), decision.id), decision);
}

export function subscribeStudentDecisions(
  db: Firestore,
  sessionId: string,
  cb: (docs: StudentDecisionDoc[]) => void
): Unsubscribe {
  const q = query(decisions(db, sessionId), orderBy("minute"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => d.data() as StudentDecisionDoc));
  });
}

// ─── Instructor events ─────────────────────────────────────────────────────

export async function pushInstructorEvent(
  db: Firestore,
  sessionId: string,
  event: InstructorEventDoc
): Promise<void> {
  await setDoc(doc(events(db, sessionId), event.id), event);
}

export async function deleteInstructorEventDoc(
  db: Firestore,
  sessionId: string,
  eventId: string
): Promise<void> {
  await deleteDoc(doc(events(db, sessionId), eventId));
}

export function subscribeInstructorEvents(
  db: Firestore,
  sessionId: string,
  cb: (docs: InstructorEventDoc[]) => void
): Unsubscribe {
  const q = query(events(db, sessionId), orderBy("timestamp"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => d.data() as InstructorEventDoc));
  });
}
