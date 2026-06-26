import { beforeEach, describe, expect, it, vi } from "vitest";
import { localSessionAdapter } from "./sessionAdapter";
import type { FirebaseSession } from "../types/firebaseSession";

// ─── Local storage mock ────────────────────────────────────────────────────

const store: Record<string, string> = {};

beforeEach(() => {
  vi.clearAllMocks();
  for (const k of Object.keys(store)) delete store[k];
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v; },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { for (const k of Object.keys(store)) delete store[k]; },
  });
});

// ─── Helpers ───────────────────────────────────────────────────────────────

function makeInput(id = "sess-001") {
  return {
    sessionId: id,
    scenarioId: "incendio_001",
    scenarioName: "Incendio estructural básico",
    mode: "full" as const,
    instructorUid: "uid-instructor",
    instructorName: "Prof. Soto",
  };
}

// ─── localSessionAdapter.createSession ────────────────────────────────────

describe("localSessionAdapter.createSession", () => {
  it("retorna una sesión con joinCode de 6 chars", async () => {
    const session = await localSessionAdapter.createSession(makeInput());
    expect(session.joinCode).toHaveLength(6);
    expect(/^[A-Z0-9]+$/.test(session.joinCode)).toBe(true);
  });

  it("persiste la sesión en localStorage", async () => {
    await localSessionAdapter.createSession(makeInput("sess-abc"));
    const loaded = await localSessionAdapter.getSession("sess-abc");
    expect(loaded).not.toBeNull();
    expect(loaded?.scenarioId).toBe("incendio_001");
  });

  it("status inicial es waiting", async () => {
    const session = await localSessionAdapter.createSession(makeInput());
    expect(session.status).toBe("waiting");
  });

  it("preserva instructorName y instructorUid", async () => {
    const session = await localSessionAdapter.createSession(makeInput());
    expect(session.instructorName).toBe("Prof. Soto");
    expect(session.instructorUid).toBe("uid-instructor");
  });
});

// ─── localSessionAdapter.getSession ───────────────────────────────────────

describe("localSessionAdapter.getSession", () => {
  it("retorna null para sesión inexistente", async () => {
    expect(await localSessionAdapter.getSession("no-existe")).toBeNull();
  });

  it("recupera sesión creada previamente", async () => {
    const created = await localSessionAdapter.createSession(makeInput("sess-xyz"));
    const loaded  = await localSessionAdapter.getSession("sess-xyz");
    expect(loaded?.id).toBe(created.id);
    expect(loaded?.joinCode).toBe(created.joinCode);
  });
});

// ─── localSessionAdapter.joinSession ──────────────────────────────────────

describe("localSessionAdapter.joinSession", () => {
  it("permite unirse con el código correcto", async () => {
    const created = await localSessionAdapter.createSession(makeInput("join-test"));
    const joined  = await localSessionAdapter.joinSession(
      created.joinCode, "uid-alumno", "student", "Alumno García"
    );
    expect(joined.activeStudentUid).toBe("uid-alumno");
    expect(joined.activeStudentName).toBe("Alumno García");
  });

  it("lanza error con código incorrecto", async () => {
    await expect(
      localSessionAdapter.joinSession("ZZZZZZ", "uid-x", "student", "X")
    ).rejects.toThrow("ZZZZZZ");
  });

  it("acepta unión del instructor (no cambia activeStudentUid)", async () => {
    const created = await localSessionAdapter.createSession(makeInput("instr-join"));
    const joined  = await localSessionAdapter.joinSession(
      created.joinCode, "uid-instructor", "instructor", "Prof. Soto"
    );
    expect(joined.activeStudentUid).toBeUndefined();
  });
});

// ─── localSessionAdapter.updateStatus ─────────────────────────────────────

describe("localSessionAdapter.updateStatus", () => {
  it("actualiza el status de la sesión", async () => {
    await localSessionAdapter.createSession(makeInput("upd-test"));
    await localSessionAdapter.updateStatus("upd-test", "completed");
    const loaded = await localSessionAdapter.getSession("upd-test");
    expect(loaded?.status).toBe("completed");
  });

  it("no falla si la sesión no existe", async () => {
    await expect(localSessionAdapter.updateStatus("no-existe", "closed")).resolves.toBeUndefined();
  });
});

// ─── localSessionAdapter subscriptions ────────────────────────────────────

describe("localSessionAdapter subscriptions", () => {
  it("subscribeSession llama al callback con la sesión actual", async () => {
    const created = await localSessionAdapter.createSession(makeInput("sub-test"));
    let received: FirebaseSession | null = null;
    const unsub = localSessionAdapter.subscribeSession("sub-test", (s) => { received = s; });
    // received is FirebaseSession | null — narrow before accessing joinCode
    expect(received !== null && (received as FirebaseSession).joinCode).toBe(created.joinCode);
    unsub();
  });

  it("subscribeStudentDecisions llama al callback con array vacío", () => {
    const results: unknown[] = [];
    const unsub = localSessionAdapter.subscribeStudentDecisions("any", (d) => results.push(d));
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual([]);
    unsub();
  });

  it("subscribeInstructorEvents llama al callback con array vacío", () => {
    const results: unknown[] = [];
    const unsub = localSessionAdapter.subscribeInstructorEvents("any", (e) => results.push(e));
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual([]);
    unsub();
  });

  it("la función de unsubscribe no lanza error", () => {
    const unsub = localSessionAdapter.subscribeSession("any", () => {});
    expect(() => unsub()).not.toThrow();
  });
});

// ─── localSessionAdapter write stubs ──────────────────────────────────────

describe("localSessionAdapter write stubs", () => {
  it("pushStudentDecision resuelve sin error", async () => {
    await expect(
      localSessionAdapter.pushStudentDecision("sid", {
        id: "d1", timestamp: 0, source: "student", evaluable: true,
        visibility: "all", decisionId: "dec-01", label: "Test", category: "mando",
        result: "applied", minute: 5,
      })
    ).resolves.toBeUndefined();
  });

  it("pushInstructorEvent resuelve sin error", async () => {
    await expect(
      localSessionAdapter.pushInstructorEvent("sid", {
        id: "e1", timestamp: 0, source: "instructor", evaluable: false,
        visibility: "instructor_only", type: "note", content: "Nota de prueba",
      })
    ).resolves.toBeUndefined();
  });
});
