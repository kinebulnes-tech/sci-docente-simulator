import type { InstructorEvent } from "../types/sessionEvents";

const KEY_PREFIX = "sci-instr-events-v1-";

function storageKey(sessionId: string): string {
  return `${KEY_PREFIX}${sessionId}`;
}

function loadAll(sessionId: string): InstructorEvent[] {
  try {
    const raw = localStorage.getItem(storageKey(sessionId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as InstructorEvent[]) : [];
  } catch {
    return [];
  }
}

function saveAll(sessionId: string, events: InstructorEvent[]): void {
  try {
    localStorage.setItem(storageKey(sessionId), JSON.stringify(events));
  } catch {
    // storage unavailable or quota exceeded
  }
}

export function saveInstructorEvent(sessionId: string, event: InstructorEvent): void {
  const events = loadAll(sessionId);
  const idx = events.findIndex((e) => e.id === event.id);
  if (idx >= 0) {
    events[idx] = event;
  } else {
    events.push(event);
  }
  saveAll(sessionId, events);
}

export function listInstructorEvents(sessionId: string): InstructorEvent[] {
  return loadAll(sessionId);
}

export function deleteInstructorEvent(sessionId: string, eventId: string): void {
  saveAll(sessionId, loadAll(sessionId).filter((e) => e.id !== eventId));
}

export function clearInstructorEvents(sessionId: string): void {
  try {
    localStorage.removeItem(storageKey(sessionId));
  } catch {
    // ignore
  }
}
