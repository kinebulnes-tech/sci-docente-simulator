import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { deleteSessionLocal, listSessionsLocal, loadSessionLocal, saveSessionLocal } from "./sessionLocalService";
import type { SessionRecord } from "../types/session";

const store: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (k: string) => store[k] ?? null,
  setItem: (k: string, v: string) => { store[k] = v; },
  removeItem: (k: string) => { delete store[k]; },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]); }
};

beforeEach(() => {
  vi.stubGlobal("localStorage", mockLocalStorage);
  mockLocalStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function makeRecord(id: string, startedAt = Date.now()): SessionRecord {
  return {
    id,
    scenarioId: "sc1",
    startedAt,
    decisionLogs: [],
    instructorNotes: ""
  };
}

describe("sessionLocalService", () => {
  describe("saveSessionLocal / loadSessionLocal", () => {
    it("saves and retrieves a session by id", () => {
      const rec = makeRecord("s1");
      saveSessionLocal(rec);
      expect(loadSessionLocal("s1")).toEqual(rec);
    });

    it("returns null for unknown id", () => {
      expect(loadSessionLocal("unknown")).toBeNull();
    });

    it("updates existing session when saving with same id", () => {
      const rec = makeRecord("s1");
      saveSessionLocal(rec);
      saveSessionLocal({ ...rec, instructorNotes: "Actualizado" });
      expect(loadSessionLocal("s1")?.instructorNotes).toBe("Actualizado");
    });
  });

  describe("listSessionsLocal", () => {
    it("returns sessions sorted by startedAt descending", () => {
      saveSessionLocal(makeRecord("old", 1000));
      saveSessionLocal(makeRecord("new", 9000));
      const list = listSessionsLocal();
      expect(list[0].id).toBe("new");
      expect(list[1].id).toBe("old");
    });

    it("returns empty array when no sessions saved", () => {
      expect(listSessionsLocal()).toHaveLength(0);
    });
  });

  describe("deleteSessionLocal", () => {
    it("removes the session with the given id", () => {
      saveSessionLocal(makeRecord("s1"));
      deleteSessionLocal("s1");
      expect(loadSessionLocal("s1")).toBeNull();
    });

    it("does not affect other sessions", () => {
      saveSessionLocal(makeRecord("s1"));
      saveSessionLocal(makeRecord("s2"));
      deleteSessionLocal("s1");
      expect(loadSessionLocal("s2")).not.toBeNull();
    });

    it("is a no-op for non-existent id", () => {
      saveSessionLocal(makeRecord("s1"));
      deleteSessionLocal("ghost");
      expect(listSessionsLocal()).toHaveLength(1);
    });
  });
});
