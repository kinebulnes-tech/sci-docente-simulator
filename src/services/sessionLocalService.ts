import type { SessionRecord } from "../types/session";

const STORAGE_KEY = "sci-sessions-v1";

function loadAll(): SessionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SessionRecord[]) : [];
  } catch {
    return [];
  }
}

function saveAll(records: SessionRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // storage unavailable or quota exceeded
  }
}

export function saveSessionLocal(record: SessionRecord): void {
  const all = loadAll();
  const idx = all.findIndex((r) => r.id === record.id);
  if (idx >= 0) {
    all[idx] = record;
  } else {
    all.push(record);
  }
  saveAll(all);
}

export function loadSessionLocal(id: string): SessionRecord | null {
  return loadAll().find((r) => r.id === id) ?? null;
}

export function listSessionsLocal(): SessionRecord[] {
  return loadAll().sort((a, b) => b.startedAt - a.startedAt);
}

export function deleteSessionLocal(id: string): void {
  saveAll(loadAll().filter((r) => r.id !== id));
}
