export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

export function scoreLabel(value: number): string {
  if (value >= 85) return "Excelente";
  if (value >= 70) return "Competente";
  if (value >= 55) return "En desarrollo";
  return "Crítico";
}
