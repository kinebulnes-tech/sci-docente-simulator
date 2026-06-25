import { describe, expect, it } from "vitest";
import type { DecisionLog } from "../types/decisionLog";
import { buildCSVString } from "./exportSession";

const logs: DecisionLog[] = [
  { id: "l1", timestamp: 1000, minute: 5,  scenarioId: "sc1", actionType: "apply_decision",  label: "Asumir mando",      source: "student",    severity: "info"    },
  { id: "l2", timestamp: 2000, minute: 10, scenarioId: "sc1", actionType: "trigger_inject",  label: "Evento inesperado", source: "instructor", severity: "warning" }
];

describe("exportSession — buildCSVString", () => {
  it("starts with a header row", () => {
    expect(buildCSVString(logs).startsWith("id,minute")).toBe(true);
  });

  it("produces header + one row per log", () => {
    const rows = buildCSVString(logs).split("\n");
    expect(rows).toHaveLength(3); // 1 header + 2 data
  });

  it("includes the log label in the output", () => {
    expect(buildCSVString(logs)).toContain("Asumir mando");
  });

  it("handles empty log array (header only)", () => {
    const rows = buildCSVString([]).split("\n");
    expect(rows).toHaveLength(1);
    expect(rows[0]).toBe("id,minute,actionType,label,source,severity");
  });

  it("escapes double quotes in labels by replacing with single quote", () => {
    const logWithQuote: DecisionLog[] = [{
      id: "x", timestamp: 0, minute: 1, scenarioId: "s",
      actionType: "apply_decision", label: `She said "hello"`,
      source: "student", severity: "info"
    }];
    expect(buildCSVString(logWithQuote)).not.toContain('""');
  });
});
