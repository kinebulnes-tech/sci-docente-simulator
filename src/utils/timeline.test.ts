import { describe, expect, it } from "vitest";
import type { TimelineEntry } from "../types/sci";
import { filterTimelineByType, formatMinute, getTimelineStats, sortTimelineAsc, sortTimelineDesc } from "./timeline";

const entries: TimelineEntry[] = [
  { minute: 5, type: "decision", title: "Asumir mando",   detail: "CI establecido" },
  { minute: 2, type: "inject",   title: "Viento aumenta", detail: "condición cambia" },
  { minute: 8, type: "decision", title: "Perimetro",      detail: "establecido" },
  { minute: 0, type: "system",   title: "Inicio",         detail: "caso iniciado" }
];

describe("timeline utilities", () => {
  describe("filterTimelineByType", () => {
    it("returns only decision entries", () => {
      const result = filterTimelineByType(entries, ["decision"]);
      expect(result).toHaveLength(2);
      expect(result.every((e) => e.type === "decision")).toBe(true);
    });

    it("returns entries matching multiple types", () => {
      expect(filterTimelineByType(entries, ["decision", "inject"])).toHaveLength(3);
    });

    it("returns empty array when no match", () => {
      expect(filterTimelineByType(entries, ["score"])).toHaveLength(0);
    });

    it("does not mutate the original array", () => {
      const original = [...entries];
      filterTimelineByType(entries, ["decision"]);
      expect(entries).toEqual(original);
    });
  });

  describe("sortTimelineAsc", () => {
    it("sorts from earliest to latest minute", () => {
      const sorted = sortTimelineAsc(entries);
      expect(sorted[0].minute).toBe(0);
      expect(sorted[sorted.length - 1].minute).toBe(8);
    });

    it("does not mutate original", () => {
      const first = entries[0].minute;
      sortTimelineAsc(entries);
      expect(entries[0].minute).toBe(first);
    });
  });

  describe("sortTimelineDesc", () => {
    it("sorts from latest to earliest minute", () => {
      const sorted = sortTimelineDesc(entries);
      expect(sorted[0].minute).toBe(8);
      expect(sorted[sorted.length - 1].minute).toBe(0);
    });
  });

  describe("getTimelineStats", () => {
    it("counts decisions and injects correctly", () => {
      const stats = getTimelineStats(entries);
      expect(stats.decisions).toBe(2);
      expect(stats.injects).toBe(1);
      expect(stats.totalEntries).toBe(4);
    });

    it("returns zeros for empty array", () => {
      const stats = getTimelineStats([]);
      expect(stats.decisions).toBe(0);
      expect(stats.injects).toBe(0);
      expect(stats.totalEntries).toBe(0);
    });
  });

  describe("formatMinute", () => {
    it("formats under 60 as Nm", () => {
      expect(formatMinute(0)).toBe("0m");
      expect(formatMinute(5)).toBe("5m");
      expect(formatMinute(59)).toBe("59m");
    });

    it("formats 60+ minutes with hours", () => {
      expect(formatMinute(60)).toBe("1h 00m");
      expect(formatMinute(75)).toBe("1h 15m");
      expect(formatMinute(125)).toBe("2h 05m");
    });
  });
});
