import { describe, expect, it } from "vitest";
import type { DecisionLog } from "../types/decisionLog";
import type { InstructorEvent } from "../types/sessionEvents";
import {
  filterEvaluableLogs,
  filterEvaluableEvents,
  filterEventsForInstructor,
  filterEventsForProjector,
  filterEventsForStudent,
  filterLogsForInstructor,
  filterLogsForStudent,
  isEvaluable,
  isInstructorOnly,
  isProjectorSafe,
  isProjectorVisible,
  isStudentVisible,
  shouldShowDecisionHints,
  shouldShowInstructorTools,
  shouldShowLiveScore,
  shouldShowRubric,
  shouldShowTeachingTools,
} from "./sessionVisibility";

function makeEvent(
  id: string,
  visibility: InstructorEvent["visibility"] = "instructor_only",
  type: InstructorEvent["type"] = "note"
): InstructorEvent {
  return {
    id,
    timestamp: 0,
    type,
    content: `Event ${id}`,
    visibility,
    evaluable: false,
  };
}

function makeLog(
  source: DecisionLog["source"],
  label = "Test"
): DecisionLog {
  return {
    id: `${Math.random()}`,
    timestamp: 0,
    minute: 5,
    scenarioId: "s1",
    actionType: "apply_decision",
    label,
    source,
    severity: "info",
  };
}

const studentLog   = makeLog("student",    "Decisión alumno");
const instructorLog = makeLog("instructor", "Transferencia mando");
const systemLog    = makeLog("system",     "Recurso llegó");

describe("filterEvaluableLogs", () => {
  it("retorna solo logs de source student", () => {
    const result = filterEvaluableLogs([studentLog, instructorLog, systemLog]);
    expect(result).toHaveLength(1);
    expect(result[0].source).toBe("student");
  });

  it("excluye completamente eventos del instructor de la evaluación", () => {
    const result = filterEvaluableLogs([instructorLog, systemLog]);
    expect(result).toHaveLength(0);
  });

  it("mantiene múltiples decisiones del alumno", () => {
    const d1 = makeLog("student", "D1");
    const d2 = makeLog("student", "D2");
    expect(filterEvaluableLogs([d1, instructorLog, d2])).toHaveLength(2);
  });

  it("retorna array vacío si no hay logs evaluables", () => {
    expect(filterEvaluableLogs([instructorLog, systemLog])).toHaveLength(0);
  });
});

describe("filterLogsForStudent", () => {
  it("incluye decisiones del alumno y eventos de sistema", () => {
    const result = filterLogsForStudent([studentLog, instructorLog, systemLog]);
    expect(result).toHaveLength(2);
    expect(result.map((l) => l.source)).not.toContain("instructor");
  });

  it("excluye eventos del instructor", () => {
    const result = filterLogsForStudent([instructorLog]);
    expect(result).toHaveLength(0);
  });
});

describe("filterLogsForInstructor", () => {
  it("retorna todos los logs sin filtrar", () => {
    const all = [studentLog, instructorLog, systemLog];
    expect(filterLogsForInstructor(all)).toHaveLength(3);
  });
});

describe("isEvaluable", () => {
  it("true solo para source student", () => {
    expect(isEvaluable(studentLog)).toBe(true);
  });

  it("false para source instructor", () => {
    expect(isEvaluable(instructorLog)).toBe(false);
  });

  it("false para source system", () => {
    expect(isEvaluable(systemLog)).toBe(false);
  });
});

describe("shouldShowLiveScore", () => {
  it("instructor siempre ve el score", () => {
    expect(shouldShowLiveScore("instructor", false)).toBe(true);
    expect(shouldShowLiveScore("instructor", true)).toBe(true);
  });

  it("alumno no ve score durante la simulación", () => {
    expect(shouldShowLiveScore("alumno", false)).toBe(false);
  });

  it("alumno ve score cuando el ejercicio está completado", () => {
    expect(shouldShowLiveScore("alumno", true)).toBe(true);
  });
});

describe("shouldShowDecisionHints", () => {
  it("instructor ve pistas de timing", () => {
    expect(shouldShowDecisionHints("instructor")).toBe(true);
  });

  it("alumno no ve pistas — modo evaluación limpio", () => {
    expect(shouldShowDecisionHints("alumno")).toBe(false);
  });
});

describe("shouldShowInstructorTools", () => {
  it("visible en modo full", () => {
    expect(shouldShowInstructorTools("full")).toBe(true);
  });

  it("visible en modo teaching", () => {
    expect(shouldShowInstructorTools("teaching")).toBe(true);
  });

  it("oculto en modo projector", () => {
    expect(shouldShowInstructorTools("projector")).toBe(false);
  });

  it("visible en modo evaluation (solo para instructor)", () => {
    expect(shouldShowInstructorTools("evaluation")).toBe(true);
  });
});

describe("shouldShowTeachingTools", () => {
  it("visible para instructor en modo teaching", () => {
    expect(shouldShowTeachingTools("teaching", "instructor")).toBe(true);
  });

  it("oculto para instructor en modo full", () => {
    expect(shouldShowTeachingTools("full", "instructor")).toBe(false);
  });

  it("nunca visible para alumno", () => {
    expect(shouldShowTeachingTools("teaching", "alumno")).toBe(false);
  });
});

describe("shouldShowRubric", () => {
  it("instructor siempre ve la rúbrica", () => {
    expect(shouldShowRubric("instructor", false)).toBe(true);
  });

  it("alumno no ve rúbrica durante ejercicio", () => {
    expect(shouldShowRubric("alumno", false)).toBe(false);
  });

  it("alumno ve rúbrica al completar el ejercicio", () => {
    expect(shouldShowRubric("alumno", true)).toBe(true);
  });
});

describe("isProjectorSafe", () => {
  it("projector y evaluation son proyector-safe", () => {
    expect(isProjectorSafe("projector")).toBe(true);
    expect(isProjectorSafe("evaluation")).toBe(true);
  });

  it("full y teaching no son proyector-safe", () => {
    expect(isProjectorSafe("full")).toBe(false);
    expect(isProjectorSafe("teaching")).toBe(false);
  });
});

// ─── InstructorEvent visibility ────────────────────────────────────────────

describe("isInstructorOnly", () => {
  it("true para instructor_only", () => {
    expect(isInstructorOnly(makeEvent("e1", "instructor_only"))).toBe(true);
  });

  it("false para student_visible", () => {
    expect(isInstructorOnly(makeEvent("e2", "student_visible"))).toBe(false);
  });

  it("false para projector_visible", () => {
    expect(isInstructorOnly(makeEvent("e3", "projector_visible"))).toBe(false);
  });
});

describe("isStudentVisible", () => {
  it("true para student_visible", () => {
    expect(isStudentVisible(makeEvent("e1", "student_visible"))).toBe(true);
  });

  it("true para projector_visible", () => {
    expect(isStudentVisible(makeEvent("e2", "projector_visible"))).toBe(true);
  });

  it("false para instructor_only", () => {
    expect(isStudentVisible(makeEvent("e3", "instructor_only"))).toBe(false);
  });
});

describe("isProjectorVisible", () => {
  it("true solo para projector_visible", () => {
    expect(isProjectorVisible(makeEvent("e1", "projector_visible"))).toBe(true);
  });

  it("false para student_visible", () => {
    expect(isProjectorVisible(makeEvent("e2", "student_visible"))).toBe(false);
  });

  it("false para instructor_only", () => {
    expect(isProjectorVisible(makeEvent("e3", "instructor_only"))).toBe(false);
  });
});

describe("filterEvaluableEvents", () => {
  it("InstructorEvent nunca es evaluable — retorna array vacío", () => {
    const events = [
      makeEvent("e1", "instructor_only"),
      makeEvent("e2", "student_visible"),
    ];
    expect(filterEvaluableEvents(events)).toHaveLength(0);
  });
});

describe("filterEventsForStudent", () => {
  it("alumno no ve eventos instructor_only", () => {
    const events = [
      makeEvent("e1", "instructor_only"),
      makeEvent("e2", "student_visible"),
      makeEvent("e3", "projector_visible"),
    ];
    const visible = filterEventsForStudent(events);
    expect(visible).toHaveLength(2);
    expect(visible.every((e) => e.visibility !== "instructor_only")).toBe(true);
  });
});

describe("filterEventsForInstructor", () => {
  it("instructor ve todos los eventos sin filtro", () => {
    const events = [
      makeEvent("e1", "instructor_only"),
      makeEvent("e2", "student_visible"),
      makeEvent("e3", "projector_visible"),
    ];
    expect(filterEventsForInstructor(events)).toHaveLength(3);
  });
});

describe("filterEventsForProjector", () => {
  it("proyector solo ve projector_visible", () => {
    const events = [
      makeEvent("e1", "instructor_only"),
      makeEvent("e2", "student_visible"),
      makeEvent("e3", "projector_visible"),
    ];
    const visible = filterEventsForProjector(events);
    expect(visible).toHaveLength(1);
    expect(visible[0].id).toBe("e3");
  });
});
