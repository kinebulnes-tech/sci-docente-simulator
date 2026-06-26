import { beforeEach, describe, expect, it, vi } from "vitest";

// ─── Firebase modular SDK mock ─────────────────────────────────────────────
// vi.mock is hoisted — factory must be self-contained (no outer variables).

vi.mock("firebase/firestore", () => ({
  collection:      vi.fn((db, ...path: string[]) => ({ db, path })),
  doc:             vi.fn((db, ...path: string[]) => ({ db, path })),
  getDoc:          vi.fn(),
  getDocs:         vi.fn(),
  setDoc:          vi.fn().mockResolvedValue(undefined),
  updateDoc:       vi.fn().mockResolvedValue(undefined),
  deleteDoc:       vi.fn().mockResolvedValue(undefined),
  onSnapshot:      vi.fn(() => () => {}),
  query:           vi.fn((col, ...args: unknown[]) => ({ col, args })),
  where:           vi.fn((f: string, op: string, v: unknown) => ({ f, op, v })),
  orderBy:         vi.fn((f: string) => ({ f })),
  serverTimestamp: vi.fn(() => ({ _serverTimestamp: true })),
}));

import { getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import {
  createFirebaseSession,
  findSessionByCode,
  getFirebaseSession,
  pushStudentDecision,
  updateFirebaseSessionStatus,
} from "./firebaseSessionService";
import type { FirebaseSession } from "../types/firebaseSession";

const mockGetDoc   = vi.mocked(getDoc);
const mockGetDocs  = vi.mocked(getDocs);
const mockSetDoc   = vi.mocked(setDoc);
const mockUpdateDoc = vi.mocked(updateDoc);

const mockDb = {} as import("firebase/firestore").Firestore;

const SESSION: FirebaseSession = {
  id: "sess-001",
  joinCode: "ABC123",
  scenarioId: "incendio_001",
  scenarioName: "Incendio estructural básico",
  mode: "full",
  status: "waiting",
  createdAt: 1000,
  updatedAt: 1000,
  instructorUid: "uid-inst",
  instructorName: "Prof. Soto",
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── createFirebaseSession ─────────────────────────────────────────────────

describe("createFirebaseSession", () => {
  it("llama setDoc con los datos de la sesión", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { updatedAt: _ts, ...input } = SESSION;
    const result = await createFirebaseSession(mockDb, input);

    expect(mockSetDoc).toHaveBeenCalledOnce();
    expect(result.id).toBe("sess-001");
    expect(result.joinCode).toBe("ABC123");
    expect(typeof result.updatedAt).toBe("number");
  });
});

// ─── getFirebaseSession ────────────────────────────────────────────────────

describe("getFirebaseSession", () => {
  it("retorna null si el documento no existe", async () => {
    mockGetDoc.mockResolvedValueOnce({ exists: () => false } as never);
    const result = await getFirebaseSession(mockDb, "no-exist");
    expect(result).toBeNull();
  });

  it("retorna datos del documento si existe", async () => {
    mockGetDoc.mockResolvedValueOnce({ exists: () => true, data: () => SESSION } as never);
    const result = await getFirebaseSession(mockDb, SESSION.id);
    expect(result?.joinCode).toBe("ABC123");
  });
});

// ─── findSessionByCode ─────────────────────────────────────────────────────

describe("findSessionByCode", () => {
  it("retorna null si no hay documentos", async () => {
    mockGetDocs.mockResolvedValueOnce({ empty: true, docs: [] } as never);
    const result = await findSessionByCode(mockDb, "ZZZZZZ");
    expect(result).toBeNull();
  });

  it("retorna primera sesión encontrada", async () => {
    mockGetDocs.mockResolvedValueOnce({
      empty: false,
      docs: [{ data: () => SESSION }],
    } as never);
    const result = await findSessionByCode(mockDb, "ABC123");
    expect(result?.id).toBe("sess-001");
  });
});

// ─── updateFirebaseSessionStatus ──────────────────────────────────────────

describe("updateFirebaseSessionStatus", () => {
  it("llama updateDoc con el nuevo status", async () => {
    await updateFirebaseSessionStatus(mockDb, "sess-001", "completed");
    expect(mockUpdateDoc).toHaveBeenCalledOnce();
    const call = mockUpdateDoc.mock.calls[0] as unknown as [unknown, Record<string, unknown>];
    const payload = call[1];
    expect(payload.status).toBe("completed");
    expect(typeof payload.updatedAt).toBe("number");
  });

  it("incluye campos extra cuando se proporcionan", async () => {
    await updateFirebaseSessionStatus(mockDb, "sess-001", "active", {
      activeStudentUid: "uid-student",
    });
    const call = mockUpdateDoc.mock.calls[0] as unknown as [unknown, Record<string, unknown>];
    const payload = call[1];
    expect(payload.activeStudentUid).toBe("uid-student");
  });
});

// ─── pushStudentDecision ──────────────────────────────────────────────────

describe("pushStudentDecision", () => {
  it("llama setDoc con la decisión del alumno", async () => {
    const decision = {
      id: "dec-001",
      timestamp: Date.now(),
      source: "student" as const,
      evaluable: true as const,
      visibility: "all" as const,
      decisionId: "d-01",
      label: "Establecer perímetro",
      category: "seguridad",
      result: "applied" as const,
      minute: 5,
    };
    await pushStudentDecision(mockDb, "sess-001", decision);
    expect(mockSetDoc).toHaveBeenCalledOnce();
  });
});
