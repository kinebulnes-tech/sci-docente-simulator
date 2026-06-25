export interface CameraPreset {
  name: string;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
  zoom: number;
}

export const CAMERA_PRESETS: CameraPreset[] = [
  {
    name: "general",
    label: "General",
    position: [12, 10, 12],
    target: [0, 0, 0],
    zoom: 28,
  },
  {
    name: "incidente",
    label: "Incidente",
    position: [6, 7, 6],
    target: [2, 0, -1],
    zoom: 40,
  },
  {
    name: "recursos",
    label: "Recursos",
    position: [0, 9, 14],
    target: [-3, 0, 7],
    zoom: 34,
  },
  {
    name: "mando",
    label: "Mando",
    position: [-2, 7, 9],
    target: [-3, 0, 3],
    zoom: 48,
  },
];

export function getCameraPreset(name: string): CameraPreset {
  return CAMERA_PRESETS.find((p) => p.name === name) ?? CAMERA_PRESETS[0];
}

export function isValidPreset(name: string): boolean {
  return CAMERA_PRESETS.some((p) => p.name === name);
}
