const DIFFICULTY_RANK: Record<string, number> = {
  basico: 0,
  intermedio: 1,
  avanzado: 2,
  experto: 3,
};

export function getDifficultyRank(difficulty: string): number {
  return DIFFICULTY_RANK[difficulty] ?? 1;
}

export function sortScenariosByDifficulty<T extends { difficulty: string }>(
  scenarios: T[]
): T[] {
  return [...scenarios].sort(
    (a, b) => getDifficultyRank(a.difficulty) - getDifficultyRank(b.difficulty)
  );
}

export function groupScenariosByDifficulty<T extends { difficulty: string }>(
  scenarios: T[]
): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const s of scenarios) {
    const d = s.difficulty ?? "intermedio";
    if (!map.has(d)) map.set(d, []);
    map.get(d)!.push(s);
  }
  return map;
}
