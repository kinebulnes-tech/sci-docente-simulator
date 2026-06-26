import { describe, expect, it } from "vitest";
import type { TimelineEntry } from "../types/sci";
import {
  filterEvaluableTimelineEntries,
  filterTimelineForStudent,
  getTimelineVisibility,
  inferTimelineSource,
  isTimelineEntryEvaluable,
  normalizeTimelineEntries,
  normalizeTimelineEntry,
} from "./timelineMetadata";

// ─── Fixtures ──────────────────────────────────────────────────────────────

const studentDecision: TimelineEntry = {
  minute: 5,
  type: "decision",
  title: "Establecer perímetro de seguridad",
  detail: "Perímetro definido.",
};

const transferEntry: TimelineEntry = {
  minute: 10,
  type: "decision",
  title: "Transferencia de mando: CI → Cap. García",
  detail: "Transferencia formal.",
};

const unifiedEntry: TimelineEntry = {
  minute: 15,
  type: "decision",
  title: "Mando unificado activado",
  detail: "Agencias unificadas.",
};

const injectEntry: TimelineEntry = {
  minute: 8,
  type: "inject",
  title: "Explosión secundaria",
  detail: "Evento inesperado.",
};

const systemEntry: TimelineEntry = {
  minute: 0,
  type: "system",
  title: "Inicio del ejercicio",
  detail: "Briefing inicial.",
};

const entryWithExplicitSource: TimelineEntry = {
  minute: 3,
  type: "decision",
  title: "Cualquier decisión",
  detail: "...",
  source: "instructor",
  evaluable: false,
  visibility: "all",
};

const instructorOnlyEntry: TimelineEntry = {
  minute: 2,
  type: "system",
  title: "Decisión bloqueada",
  detail: "Prerequisito faltante.",
  source: "system",
  evaluable: false,
  visibility: "instructor",
};

// ─── inferTimelineSource ───────────────────────────────────────────────────

describe("inferTimelineSource", () => {
  it("retorna fuente explícita si ya está definida", () => {
    expect(inferTimelineSource(entryWithExplicitSource)).toBe("instructor");
  });

  it("infiere student para decisión normal", () => {
    expect(inferTimelineSource(studentDecision)).toBe("student");
  });

  it("infiere instructor para TRANSFER_COMMAND por título", () => {
    expect(inferTimelineSource(transferEntry)).toBe("instructor");
  });

  it("infiere instructor para ACTIVATE_UNIFIED_COMMAND por título", () => {
    expect(inferTimelineSource(unifiedEntry)).toBe("instructor");
  });

  it("infiere instructor para inject manual", () => {
    expect(inferTimelineSource(injectEntry)).toBe("instructor");
  });

  it("infiere system para entradas de tipo system", () => {
    expect(inferTimelineSource(systemEntry)).toBe("system");
  });
});

// ─── isTimelineEntryEvaluable ──────────────────────────────────────────────

describe("isTimelineEntryEvaluable", () => {
  it("decisión del alumno es evaluable", () => {
    expect(isTimelineEntryEvaluable(studentDecision)).toBe(true);
  });

  it("TRANSFER_COMMAND no es evaluable", () => {
    expect(isTimelineEntryEvaluable(transferEntry)).toBe(false);
  });

  it("ACTIVATE_UNIFIED_COMMAND no es evaluable", () => {
    expect(isTimelineEntryEvaluable(unifiedEntry)).toBe(false);
  });

  it("inject no es evaluable", () => {
    expect(isTimelineEntryEvaluable(injectEntry)).toBe(false);
  });

  it("entrada de sistema no es evaluable", () => {
    expect(isTimelineEntryEvaluable(systemEntry)).toBe(false);
  });

  it("respeta campo evaluable explícito false", () => {
    expect(isTimelineEntryEvaluable(entryWithExplicitSource)).toBe(false);
  });

  it("respeta campo evaluable explícito true", () => {
    const explicit: TimelineEntry = { ...studentDecision, evaluable: true };
    expect(isTimelineEntryEvaluable(explicit)).toBe(true);
  });
});

// ─── getTimelineVisibility ─────────────────────────────────────────────────

describe("getTimelineVisibility", () => {
  it("retorna visibility explícita si está definida", () => {
    expect(getTimelineVisibility(instructorOnlyEntry)).toBe("instructor");
  });

  it("retorna all como fallback para entradas sin visibility", () => {
    expect(getTimelineVisibility(studentDecision)).toBe("all");
  });
});

// ─── normalizeTimelineEntry ────────────────────────────────────────────────

describe("normalizeTimelineEntry", () => {
  it("completa los tres campos faltantes", () => {
    const n = normalizeTimelineEntry(studentDecision);
    expect(n.source).toBe("student");
    expect(n.evaluable).toBe(true);
    expect(n.visibility).toBe("all");
  });

  it("no muta la entrada original", () => {
    normalizeTimelineEntry(studentDecision);
    expect(studentDecision.source).toBeUndefined();
  });

  it("preserva todos los campos originales", () => {
    const n = normalizeTimelineEntry(studentDecision);
    expect(n.minute).toBe(5);
    expect(n.type).toBe("decision");
    expect(n.title).toBe("Establecer perímetro de seguridad");
  });

  it("respeta metadata explícita en entrada ya normalizada", () => {
    const n = normalizeTimelineEntry(entryWithExplicitSource);
    expect(n.source).toBe("instructor");
    expect(n.evaluable).toBe(false);
    expect(n.visibility).toBe("all");
  });
});

// ─── normalizeTimelineEntries ──────────────────────────────────────────────

describe("normalizeTimelineEntries", () => {
  it("normaliza un array completo", () => {
    const entries = [studentDecision, transferEntry, systemEntry];
    const normalized = normalizeTimelineEntries(entries);
    expect(normalized).toHaveLength(3);
    expect(normalized[0].source).toBe("student");
    expect(normalized[1].source).toBe("instructor");
    expect(normalized[2].source).toBe("system");
  });

  it("retorna array vacío para input vacío", () => {
    expect(normalizeTimelineEntries([])).toHaveLength(0);
  });

  it("sesiones antiguas sin metadata no rompen", () => {
    const oldEntry: TimelineEntry = { minute: 1, type: "decision", title: "Asumir mando", detail: "ok" };
    expect(() => normalizeTimelineEntry(oldEntry)).not.toThrow();
    expect(normalizeTimelineEntry(oldEntry).source).toBe("student");
  });
});

// ─── filterTimelineForStudent ──────────────────────────────────────────────

describe("filterTimelineForStudent", () => {
  it("excluye entradas con visibility:instructor", () => {
    const entries = normalizeTimelineEntries([studentDecision, instructorOnlyEntry, injectEntry]);
    const filtered = filterTimelineForStudent(entries);
    expect(filtered.some((e) => e.visibility === "instructor")).toBe(false);
  });

  it("incluye entradas all y student", () => {
    const entries = normalizeTimelineEntries([studentDecision, transferEntry]);
    expect(filterTimelineForStudent(entries)).toHaveLength(2);
  });
});

// ─── filterEvaluableTimelineEntries ───────────────────────────────────────

describe("filterEvaluableTimelineEntries", () => {
  it("retorna solo entradas evaluable:true", () => {
    const entries = normalizeTimelineEntries([studentDecision, transferEntry, systemEntry, injectEntry]);
    const evaluable = filterEvaluableTimelineEntries(entries);
    expect(evaluable).toHaveLength(1);
    expect(evaluable[0].title).toBe("Establecer perímetro de seguridad");
  });

  it("instructor no tiene entradas evaluables", () => {
    const entries = normalizeTimelineEntries([transferEntry, unifiedEntry, injectEntry]);
    expect(filterEvaluableTimelineEntries(entries)).toHaveLength(0);
  });
});
