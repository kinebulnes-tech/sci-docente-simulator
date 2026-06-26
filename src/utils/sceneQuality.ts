export type QualityMode = "high" | "balanced" | "low";

export interface QualityConfig {
  shadows: boolean;
  hemisphereLight: boolean;
  pixelRatio: number;
  animationsDefault: boolean;
  maxGridDivisions: number;
}

export function detectQualityMode(): QualityMode {
  if (typeof window === "undefined") return "balanced";
  const w = window.innerWidth;
  if (w < 640) return "low";
  if (w < 1024) return "balanced";
  return "high";
}

export function qualityConfig(mode: QualityMode): QualityConfig {
  switch (mode) {
    case "high":
      return {
        shadows: true,
        hemisphereLight: true,
        pixelRatio: typeof window !== "undefined" ? Math.min(window.devicePixelRatio ?? 2, 2) : 2,
        animationsDefault: true,
        maxGridDivisions: 22,
      };
    case "balanced":
      return {
        shadows: false,
        hemisphereLight: true,
        pixelRatio: 1.5,
        animationsDefault: true,
        maxGridDivisions: 11,
      };
    case "low":
      return {
        shadows: false,
        hemisphereLight: false,
        pixelRatio: 1,
        animationsDefault: false,
        maxGridDivisions: 0,
      };
  }
}

export function qualityLabel(mode: QualityMode): string {
  return { high: "Alta calidad", balanced: "Balanceado", low: "Bajo rendimiento" }[mode];
}
