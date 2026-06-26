import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { InstructorEvent } from "../types/sessionEvents";
import {
  clearInstructorEvents,
  deleteInstructorEvent,
  listInstructorEvents,
  saveInstructorEvent,
} from "./instructorEventLocalService";

const store: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (k: string) => store[k] ?? null,
  setItem: (k: string, v: string) => {
    store[k] = v;
  },
  removeItem: (k: string) => {
    delete store[k];
  },
  clear: () => {
    Object.keys(store).forEach((k) => delete store[k]);
  },
};

beforeEach(() => {
  vi.stubGlobal("localStorage", mockLocalStorage);
  mockLocalStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function makeNote(id: string, minute = 5): InstructorEvent {
  return {
    id,
    timestamp: Date.now(),
    type: "note",
    content: `Observación ${id}`,
    visibility: "instructor_only",
    evaluable: false,
    minute,
  };
}

function makePause(id: string, minute = 10): InstructorEvent {
  return {
    id,
    timestamp: Date.now(),
    type: "teaching_pause",
    content: `Pausa ${id}`,
    visibility: "instructor_only",
    evaluable: false,
    minute,
  };
}

const SESSION = "sc1";

describe("instructorEventLocalService", () => {
  describe("listInstructorEvents / saveInstructorEvent", () => {
    it("retorna array vacío si no hay eventos guardados", () => {
      expect(listInstructorEvents(SESSION)).toHaveLength(0);
    });

    it("guarda un evento y lo recupera", () => {
      const note = makeNote("n1");
      saveInstructorEvent(SESSION, note);
      const list = listInstructorEvents(SESSION);
      expect(list).toHaveLength(1);
      expect(list[0].id).toBe("n1");
    });

    it("guarda múltiples eventos", () => {
      saveInstructorEvent(SESSION, makeNote("n1"));
      saveInstructorEvent(SESSION, makePause("p1"));
      expect(listInstructorEvents(SESSION)).toHaveLength(2);
    });

    it("actualiza evento existente al guardar con mismo id", () => {
      const note = makeNote("n1");
      saveInstructorEvent(SESSION, note);
      saveInstructorEvent(SESSION, { ...note, content: "Actualizado" });
      const list = listInstructorEvents(SESSION);
      expect(list).toHaveLength(1);
      expect(list[0].content).toBe("Actualizado");
    });

    it("mantiene evaluable:false en todos los eventos", () => {
      saveInstructorEvent(SESSION, makeNote("n1"));
      saveInstructorEvent(SESSION, makePause("p1"));
      const list = listInstructorEvents(SESSION);
      list.forEach((e) => expect(e.evaluable).toBe(false));
    });

    it("eventos de sesiones distintas no se mezclan", () => {
      saveInstructorEvent("sc1", makeNote("n1"));
      saveInstructorEvent("sc2", makePause("p1"));
      expect(listInstructorEvents("sc1")).toHaveLength(1);
      expect(listInstructorEvents("sc2")).toHaveLength(1);
      expect(listInstructorEvents("sc1")[0].type).toBe("note");
      expect(listInstructorEvents("sc2")[0].type).toBe("teaching_pause");
    });
  });

  describe("deleteInstructorEvent", () => {
    it("elimina el evento con el id indicado", () => {
      saveInstructorEvent(SESSION, makeNote("n1"));
      saveInstructorEvent(SESSION, makeNote("n2"));
      deleteInstructorEvent(SESSION, "n1");
      const list = listInstructorEvents(SESSION);
      expect(list).toHaveLength(1);
      expect(list[0].id).toBe("n2");
    });

    it("no falla si el id no existe", () => {
      saveInstructorEvent(SESSION, makeNote("n1"));
      expect(() => deleteInstructorEvent(SESSION, "ghost")).not.toThrow();
      expect(listInstructorEvents(SESSION)).toHaveLength(1);
    });
  });

  describe("clearInstructorEvents", () => {
    it("elimina todos los eventos de la sesión", () => {
      saveInstructorEvent(SESSION, makeNote("n1"));
      saveInstructorEvent(SESSION, makePause("p1"));
      clearInstructorEvents(SESSION);
      expect(listInstructorEvents(SESSION)).toHaveLength(0);
    });

    it("no afecta eventos de otras sesiones", () => {
      saveInstructorEvent("sc1", makeNote("n1"));
      saveInstructorEvent("sc2", makePause("p1"));
      clearInstructorEvents("sc1");
      expect(listInstructorEvents("sc2")).toHaveLength(1);
    });

    it("no falla si la sesión no tiene eventos", () => {
      expect(() => clearInstructorEvents("empty")).not.toThrow();
    });
  });

  describe("manejo de localStorage inválido", () => {
    it("retorna array vacío si el valor en storage no es JSON válido", () => {
      store["sci-instr-events-v1-bad"] = "{ not json";
      expect(listInstructorEvents("bad")).toHaveLength(0);
    });

    it("retorna array vacío si el valor en storage no es un array", () => {
      store["sci-instr-events-v1-bad"] = JSON.stringify({ id: "x" });
      expect(listInstructorEvents("bad")).toHaveLength(0);
    });
  });
});
