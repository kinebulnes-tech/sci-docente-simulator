import { describe, expect, it } from "vitest";
import {
  CAMERA_PRESETS,
  getCameraPreset,
  isValidPreset,
} from "./cameraPresets";

describe("CAMERA_PRESETS", () => {
  it("tiene 4 presets", () => {
    expect(CAMERA_PRESETS).toHaveLength(4);
  });

  it("todos los presets tienen position, target y zoom", () => {
    for (const p of CAMERA_PRESETS) {
      expect(p.position).toHaveLength(3);
      expect(p.target).toHaveLength(3);
      expect(p.zoom).toBeGreaterThan(0);
    }
  });

  it("incluye presets: general, incidente, recursos, mando", () => {
    const names = CAMERA_PRESETS.map((p) => p.name);
    expect(names).toContain("general");
    expect(names).toContain("incidente");
    expect(names).toContain("recursos");
    expect(names).toContain("mando");
  });
});

describe("getCameraPreset", () => {
  it("retorna el preset por nombre", () => {
    const p = getCameraPreset("general");
    expect(p.name).toBe("general");
  });

  it("retorna general para nombre desconocido", () => {
    const p = getCameraPreset("inexistente");
    expect(p.name).toBe("general");
  });
});

describe("isValidPreset", () => {
  it("true para presets conocidos", () => {
    expect(isValidPreset("general")).toBe(true);
    expect(isValidPreset("incidente")).toBe(true);
  });

  it("false para nombre desconocido", () => {
    expect(isValidPreset("otro")).toBe(false);
  });
});
