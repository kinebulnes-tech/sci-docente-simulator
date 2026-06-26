import { describe, expect, it } from "vitest";
import type { TimelineEntry } from "../types/sci";
import {
  classifyDecision,
  createDecisionLog,
  deduplicateLogs,
  deriveLogsFromTimeline,
  sortLogsByMinute
} from "./decisionLog";

const BASE = {
  timestamp: 0,
  scenarioId: "sc1",
  actionType: "apply_decision" as const,
  label: "Mando",
  source: "student" as const,
  severity: "info" as const
};

describe("decisionLog utilities", () => {
  describe("createDecisionLog", () => {
    it("assigns a unique id per call", () => {
      const a = createDecisionLog({ ...BASE, minute: 1 });
      const b = createDecisionLog({ ...BASE, minute: 1 });
      expect(a.id).not.toBe(b.id);
    });

    it("preserves all provided fields", () => {
      const log = createDecisionLog({ ...BASE, minute: 5 });
      expect(log.minute).toBe(5);
      expect(log.source).toBe("student");
      expect(log.label).toBe("Mando");
    });

    it("optional fields default to undefined", () => {
      const log = createDecisionLog({ ...BASE, minute: 1 });
      expect(log.notes).toBeUndefined();
      expect(log.resourceId).toBeUndefined();
    });
  });

  describe("classifyDecision", () => {
    it("trigger_inject → warning", () => {
      expect(classifyDecision("trigger_inject")).toBe("warning");
    });

    it("apply_decision → info", () => {
      expect(classifyDecision("apply_decision")).toBe("info");
    });

    it("transfer_command → info", () => {
      expect(classifyDecision("transfer_command")).toBe("info");
    });

    it("complete_scenario → info", () => {
      expect(classifyDecision("complete_scenario")).toBe("info");
    });
  });

  describe("sortLogsByMinute", () => {
    it("returns entries in ascending minute order", () => {
      const logs = [
        createDecisionLog({ ...BASE, minute: 10 }),
        createDecisionLog({ ...BASE, minute: 2 }),
        createDecisionLog({ ...BASE, minute: 6 })
      ];
      const sorted = sortLogsByMinute(logs);
      expect(sorted.map((l) => l.minute)).toEqual([2, 6, 10]);
    });

    it("does not mutate the original array", () => {
      const logs = [createDecisionLog({ ...BASE, minute: 5 })];
      const first = logs[0].minute;
      sortLogsByMinute(logs);
      expect(logs[0].minute).toBe(first);
    });
  });

  describe("deduplicateLogs", () => {
    it("removes duplicate minute+label+actionType entries", () => {
      const logs = [
        createDecisionLog({ ...BASE, minute: 5 }),
        createDecisionLog({ ...BASE, minute: 5 })
      ];
      expect(deduplicateLogs(logs)).toHaveLength(1);
    });

    it("keeps entries with different minutes", () => {
      const logs = [
        createDecisionLog({ ...BASE, minute: 5 }),
        createDecisionLog({ ...BASE, minute: 10 })
      ];
      expect(deduplicateLogs(logs)).toHaveLength(2);
    });

    it("keeps entries with different labels", () => {
      const logs = [
        createDecisionLog({ ...BASE, minute: 5, label: "A" }),
        createDecisionLog({ ...BASE, minute: 5, label: "B" })
      ];
      expect(deduplicateLogs(logs)).toHaveLength(2);
    });
  });

  describe("deriveLogsFromTimeline", () => {
    const timeline: TimelineEntry[] = [
      { minute: 2, type: "decision", title: "Asumir mando", detail: "CI OK" },
      { minute: 5, type: "inject",   title: "Viento fuerte", detail: "evento" },
      { minute: 0, type: "system",   title: "Inicio",       detail: "arranque" }
    ];

    it("produces one log per timeline entry", () => {
      expect(deriveLogsFromTimeline(timeline, "sc1")).toHaveLength(3);
    });

    it("assigns instructor source to inject entries", () => {
      const logs = deriveLogsFromTimeline(timeline, "sc1");
      expect(logs[1].source).toBe("instructor");
    });

    it("assigns system source to system entries", () => {
      const logs = deriveLogsFromTimeline(timeline, "sc1");
      expect(logs[2].source).toBe("system");
    });

    it("assigns student source to decision entries", () => {
      const logs = deriveLogsFromTimeline(timeline, "sc1");
      expect(logs[0].source).toBe("student");
    });

    it("returns empty array for empty timeline", () => {
      expect(deriveLogsFromTimeline([], "sc1")).toHaveLength(0);
    });
  });
});
