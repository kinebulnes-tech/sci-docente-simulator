import { useCallback, useState } from "react";
import type { InstructorEvent, InstructorEventType } from "../types/sessionEvents";
import {
  clearInstructorEvents,
  deleteInstructorEvent,
  listInstructorEvents,
  saveInstructorEvent,
} from "../services/instructorEventLocalService";

export function useInstructorEvents(sessionId: string) {
  const [events, setEvents] = useState<InstructorEvent[]>(
    () => listInstructorEvents(sessionId)
  );

  const add = useCallback(
    (
      type: InstructorEventType,
      content: string,
      minute: number,
      visibility: InstructorEvent["visibility"] = "instructor_only"
    ) => {
      const event: InstructorEvent = {
        id: `instr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: Date.now(),
        type,
        content,
        visibility,
        evaluable: false,
        minute,
      };
      saveInstructorEvent(sessionId, event);
      setEvents((prev) => [...prev, event]);
    },
    [sessionId]
  );

  const remove = useCallback(
    (eventId: string) => {
      deleteInstructorEvent(sessionId, eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    },
    [sessionId]
  );

  const clear = useCallback(() => {
    clearInstructorEvents(sessionId);
    setEvents([]);
  }, [sessionId]);

  const notes  = events.filter((e) => e.type === "note");
  const pauses = events.filter((e) => e.type === "teaching_pause");

  return { events, notes, pauses, add, remove, clear };
}
