import type { TimelineEntry } from "../types/sci";

export function filterTimelineByType(
  entries: TimelineEntry[],
  types: TimelineEntry["type"][]
): TimelineEntry[] {
  return entries.filter((e) => types.includes(e.type));
}

export function sortTimelineAsc(entries: TimelineEntry[]): TimelineEntry[] {
  return [...entries].sort((a, b) => a.minute - b.minute);
}

export function sortTimelineDesc(entries: TimelineEntry[]): TimelineEntry[] {
  return [...entries].sort((a, b) => b.minute - a.minute);
}

export function getTimelineStats(entries: TimelineEntry[]): {
  decisions: number;
  injects: number;
  totalEntries: number;
} {
  return {
    decisions: entries.filter((e) => e.type === "decision").length,
    injects: entries.filter((e) => e.type === "inject").length,
    totalEntries: entries.length
  };
}

export function formatMinute(minute: number): string {
  const h = Math.floor(minute / 60);
  const m = minute % 60;
  return h > 0 ? `${h}h ${m.toString().padStart(2, "0")}m` : `${m}m`;
}
