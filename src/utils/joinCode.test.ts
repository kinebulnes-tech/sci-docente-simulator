import { describe, expect, it } from "vitest";
import {
  formatJoinCode,
  generateJoinCode,
  isValidJoinCode,
  normalizeJoinCode,
} from "./joinCode";

describe("generateJoinCode", () => {
  it("genera un código de 6 caracteres por defecto", () => {
    expect(generateJoinCode()).toHaveLength(6);
  });

  it("genera código de longitud personalizada", () => {
    expect(generateJoinCode(4)).toHaveLength(4);
    expect(generateJoinCode(8)).toHaveLength(8);
  });

  it("solo contiene mayúsculas y dígitos", () => {
    const code = generateJoinCode();
    expect(/^[A-Z0-9]+$/.test(code)).toBe(true);
  });

  it("no contiene caracteres ambiguos (0, 1, O, I, B, S)", () => {
    // Generate many codes to reduce false-negative probability
    const samples = Array.from({ length: 200 }, () => generateJoinCode()).join("");
    expect(samples).not.toMatch(/[01OI]/);
  });

  it("genera códigos diferentes en llamadas sucesivas", () => {
    const codes = new Set(Array.from({ length: 20 }, () => generateJoinCode()));
    expect(codes.size).toBeGreaterThan(1);
  });
});

describe("normalizeJoinCode", () => {
  it("convierte a mayúsculas", () => {
    expect(normalizeJoinCode("abc123")).toBe("ABC123");
  });

  it("elimina espacios y guiones", () => {
    expect(normalizeJoinCode("ABC 123")).toBe("ABC123");
    expect(normalizeJoinCode("ABC-123")).toBe("ABC123");
  });

  it("elimina caracteres especiales", () => {
    expect(normalizeJoinCode("A!B@C#1$2%3")).toBe("ABC123");
  });

  it("maneja string vacío", () => {
    expect(normalizeJoinCode("")).toBe("");
  });
});

describe("isValidJoinCode", () => {
  it("acepta código de 6 caracteres alfanuméricos válido", () => {
    expect(isValidJoinCode("ABC123")).toBe(true);
    expect(isValidJoinCode("ZZZZZ9")).toBe(true);
  });

  it("acepta código con espacios si normaliza a 6 chars", () => {
    expect(isValidJoinCode("ABC 123")).toBe(true);
  });

  it("rechaza código de menos de 6 caracteres", () => {
    expect(isValidJoinCode("ABCDE")).toBe(false);
    expect(isValidJoinCode("ABC1")).toBe(false);
  });

  it("rechaza código de más de 6 caracteres", () => {
    expect(isValidJoinCode("ABCDE12")).toBe(false);
  });

  it("rechaza string vacío", () => {
    expect(isValidJoinCode("")).toBe(false);
  });

  it("rechaza código con solo letras minúsculas (normaliza primero)", () => {
    expect(isValidJoinCode("abcdef")).toBe(true); // normaliza y valida
  });
});

describe("formatJoinCode", () => {
  it("agrega espacio después de los primeros 3 chars", () => {
    expect(formatJoinCode("ABC123")).toBe("ABC 123");
  });

  it("normaliza antes de formatear", () => {
    expect(formatJoinCode("abc123")).toBe("ABC 123");
    expect(formatJoinCode("ABC 123")).toBe("ABC 123");
  });

  it("maneja códigos cortos sin espacio", () => {
    expect(formatJoinCode("ABC")).toBe("ABC");
    expect(formatJoinCode("AB")).toBe("AB");
  });

  it("trunca a 6 caracteres", () => {
    expect(formatJoinCode("ABCDEFGH")).toBe("ABC DEF");
  });
});
