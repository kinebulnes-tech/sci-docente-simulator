import { describe, expect, it } from "vitest";
import {
  getDifficultyRank,
  groupScenariosByDifficulty,
  sortScenariosByDifficulty,
} from "./scenarioSorting";

const s = (id: string, difficulty: string) => ({ id, difficulty, title: id });

describe("getDifficultyRank", () => {
  it("basico=0, intermedio=1, avanzado=2, experto=3", () => {
    expect(getDifficultyRank("basico")).toBe(0);
    expect(getDifficultyRank("intermedio")).toBe(1);
    expect(getDifficultyRank("avanzado")).toBe(2);
    expect(getDifficultyRank("experto")).toBe(3);
  });

  it("unknown difficulty defaults to intermedio rank (1)", () => {
    expect(getDifficultyRank("desconocido")).toBe(1);
    expect(getDifficultyRank("")).toBe(1);
  });
});

describe("sortScenariosByDifficulty", () => {
  it("ordena basico antes que intermedio", () => {
    const result = sortScenariosByDifficulty([s("b", "intermedio"), s("a", "basico")]);
    expect(result[0].id).toBe("a");
    expect(result[1].id).toBe("b");
  });

  it("ordena intermedio antes que avanzado", () => {
    const result = sortScenariosByDifficulty([s("b", "avanzado"), s("a", "intermedio")]);
    expect(result[0].id).toBe("a");
    expect(result[1].id).toBe("b");
  });

  it("ordena avanzado antes que experto", () => {
    const result = sortScenariosByDifficulty([s("b", "experto"), s("a", "avanzado")]);
    expect(result[0].id).toBe("a");
    expect(result[1].id).toBe("b");
  });

  it("mantiene orden estable dentro de la misma dificultad", () => {
    const input = [s("x1", "intermedio"), s("x2", "intermedio"), s("x3", "intermedio")];
    const result = sortScenariosByDifficulty(input);
    expect(result.map((r) => r.id)).toEqual(["x1", "x2", "x3"]);
  });

  it("ordena completo basico < intermedio < avanzado < experto", () => {
    const input = [
      s("e", "experto"),
      s("a", "avanzado"),
      s("b", "basico"),
      s("i", "intermedio"),
    ];
    const result = sortScenariosByDifficulty(input);
    expect(result.map((r) => r.id)).toEqual(["b", "i", "a", "e"]);
  });

  it("no muta el array original", () => {
    const input = [s("b", "avanzado"), s("a", "basico")];
    const copy = [...input];
    sortScenariosByDifficulty(input);
    expect(input[0].id).toBe(copy[0].id);
  });
});

describe("groupScenariosByDifficulty", () => {
  it("agrupa por dificultad", () => {
    const input = [s("a", "basico"), s("b", "intermedio"), s("c", "basico")];
    const groups = groupScenariosByDifficulty(input);
    expect(groups.get("basico")).toHaveLength(2);
    expect(groups.get("intermedio")).toHaveLength(1);
  });

  it("maneja escenarios sin dificultad como intermedio", () => {
    const input = [{ id: "x", difficulty: undefined as unknown as string, title: "x" }];
    const groups = groupScenariosByDifficulty(input);
    expect(groups.get("intermedio")).toHaveLength(1);
  });
});
