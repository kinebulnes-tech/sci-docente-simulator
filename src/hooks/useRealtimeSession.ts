import { useEffect, useRef, useState } from "react";
import type {
  FirebaseSession,
  InstructorEventDoc,
  SessionParticipant,
  StudentDecisionDoc,
} from "../types/firebaseSession";
import type { SessionPersistenceAdapter } from "../services/sessionAdapter";

export interface RealtimeSessionState {
  session: FirebaseSession | null;
  participants: SessionParticipant[];
  studentDecisions: StudentDecisionDoc[];
  instructorEvents: InstructorEventDoc[];
  connected: boolean;
}

const INITIAL: RealtimeSessionState = {
  session: null,
  participants: [],
  studentDecisions: [],
  instructorEvents: [],
  connected: false,
};

/**
 * Subscribes to all real-time subcollections for the given session.
 * Cleans up listeners on unmount or sessionId change.
 */
export function useRealtimeSession(
  adapter: SessionPersistenceAdapter | null,
  sessionId: string | null
): RealtimeSessionState {
  const [state, setState] = useState<RealtimeSessionState>(INITIAL);
  // Stable ref to avoid stale closure in effect cleanup
  const adapterRef = useRef(adapter);
  adapterRef.current = adapter;

  useEffect(() => {
    if (!adapter || !sessionId) {
      setState(INITIAL);
      return;
    }

    setState((s) => ({ ...s, connected: false }));

    const unsubSession = adapter.subscribeSession(sessionId, (session) => {
      setState((s) => ({ ...s, session, connected: true }));
    });

    const unsubParticipants = adapter.subscribeParticipants(sessionId, (participants) => {
      setState((s) => ({ ...s, participants }));
    });

    const unsubDecisions = adapter.subscribeStudentDecisions(sessionId, (studentDecisions) => {
      setState((s) => ({ ...s, studentDecisions }));
    });

    const unsubEvents = adapter.subscribeInstructorEvents(sessionId, (instructorEvents) => {
      setState((s) => ({ ...s, instructorEvents }));
    });

    return () => {
      unsubSession();
      unsubParticipants();
      unsubDecisions();
      unsubEvents();
    };
  }, [adapter, sessionId]);

  return state;
}

/**
 * Syncs local decision logs to the remote adapter as they accumulate.
 * Only writes NEW entries — tracks last synced count via ref.
 */
export function useFirebaseDecisionSync(
  adapter: SessionPersistenceAdapter | null,
  sessionId: string | null,
  decisionLogs: ReadonlyArray<{
    id: string;
    timestamp: number;
    minute: number;
    label: string;
    actionType: string;
    source: string;
    severity: string;
    scenarioId: string;
  }>
): void {
  const lastSyncedCountRef = useRef(0);

  useEffect(() => {
    if (!adapter || !sessionId || adapter.mode === "local") return;
    const newLogs = decisionLogs.slice(lastSyncedCountRef.current);
    if (newLogs.length === 0) return;

    lastSyncedCountRef.current = decisionLogs.length;

    for (const log of newLogs) {
      if (log.source !== "student") continue;
      adapter
        .pushStudentDecision(sessionId, {
          id: log.id,
          timestamp: log.timestamp,
          source: "student",
          evaluable: true,
          visibility: "all",
          decisionId: log.actionType,
          label: log.label,
          category: log.severity,
          result: "applied",
          minute: log.minute,
        })
        .catch(() => {});
    }
  }, [adapter, sessionId, decisionLogs]);
}
