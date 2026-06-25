import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { OrthographicCamera } from "three";
import { recommendedZoom } from "../../utils/scene3d";

interface CameraControllerProps {
  resetSignal: number;
}

const INITIAL_POS: [number, number, number] = [12, 10, 12];

/**
 * Manages OrbitControls + responsive zoom.
 * Must live inside <Canvas> to access useThree().
 * resetSignal increment triggers camera reset to initial isometric position.
 */
export function CameraController({ resetSignal }: CameraControllerProps) {
  const { camera, size } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    const ortho = camera as OrthographicCamera;
    ortho.zoom = recommendedZoom(size.width, size.height);
    ortho.updateProjectionMatrix();
  }, [size.width, size.height, camera]);

  useEffect(() => {
    if (resetSignal <= 0) return;
    const ortho = camera as OrthographicCamera;
    camera.position.set(...INITIAL_POS);
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
