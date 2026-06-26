import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { OrthographicCamera } from "three";
import { getCameraPreset } from "../../utils/cameraPresets";
import { recommendedZoom } from "../../utils/scene3d";

interface CameraControllerProps {
  resetSignal: number;
  preset?: string;
}

/**
 * Manages OrbitControls + responsive zoom + camera presets.
 * Must live inside <Canvas> to access useThree().
 */
export function CameraController({ resetSignal, preset = "general" }: CameraControllerProps) {
  const { camera, size } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    const ortho = camera as OrthographicCamera;
    ortho.zoom = recommendedZoom(size.width, size.height);
    ortho.updateProjectionMatrix();
  }, [size.width, size.height, camera]);

  useEffect(() => {
    const p = getCameraPreset(preset);
    const ortho = camera as OrthographicCamera;
    camera.position.set(...p.position);
    controlsRef.current?.target.set(...p.target);
    ortho.zoom = recommendedZoom(size.width, size.height);
    ortho.updateProjectionMatrix();
    controlsRef.current?.update();
  }, [preset, camera, size.width, size.height]);

  useEffect(() => {
    if (resetSignal <= 0) return;
    const p = getCameraPreset("general");
    const ortho = camera as OrthographicCamera;
    camera.position.set(...p.position);
    ortho.zoom = recommendedZoom(size.width, size.height);
    ortho.updateProjectionMatrix();
    controlsRef.current?.reset();
  }, [resetSignal, camera, size.width, size.height]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.5}
      minZoom={14}
      maxZoom={80}
      target={[0, 0, 0]}
    />
  );
}
