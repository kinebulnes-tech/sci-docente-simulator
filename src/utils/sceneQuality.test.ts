import { describe, expect, it } from "vitest";
import { qualityConfig, qualityLabel } from "./sceneQuality";

describe("qualityConfig", () => {
  it("high: shadows=true, hemisphereLight=true, animationsDefault=true", () => {
    const c = qualityConfig("high");
    expect(c.shadows).toBe(true);
    expect(c.hemisphereLight).toBe(true);
    expect(c.animationsDefault).toBe(true);
  });

  it("balanced: shadows=false, hemisphereLight=true, animationsDefault=true", () => {
    const c = qualityConfig("balanced");
    expect(c.shadows).toBe(false);
    expect(c.hemisphereLight).toBe(true);
    expect(c.animationsDefault).toBe(true);
  });

  it("low: shadows=false, hemisphereLight=false, animationsDefault=false", () => {
    const c = qualityConfig("low");
    expect(c.shadows).toBe(false);
    expect(c.hemisphereLight).toBe(false);
    expect(c.animationsDefault).toBe(false);
  });

  it("pixelRatio baja de high a low", () => {
    expect(qualityConfig("high").pixelRatio).toBeGreaterThanOrEqual(qualityConfig("balanced").pixelRatio);
    expect(qualityConfig("balanced").pixelRatio).toBeGreaterThan(qualityConfig("low").pixelRatio);
  });
});

describe("qualityLabel", () => {
  it("retorna etiqueta en español", () => {
    expect(qualityLabel("high")).toBe("Alta calidad");
    expect(qualityLabel("balanced")).toBe("Balanceado");
    expect(qualityLabel("low")).toBe("Bajo rendimiento");
  });
});
