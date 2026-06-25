import type { VisualResource } from "../../utils/scene3d";

interface ResourceModel3DProps {
  resource: VisualResource;
  scale?: [number, number, number];
}

/** Procedural 3D model per resource type — simple geometry, no external assets. */
export function ResourceModel3D({ resource, scale = [1, 1, 1] }: ResourceModel3DProps) {
  const { color, opacity, name } = resource;
  const mat = <meshLambertMaterial color={color} transparent opacity={opacity} />;

  const nameLower = name.toLowerCase();

  if (nameLower.includes("bomba") || nameLower.includes("carro") || nameLower.includes("b-")) {
    return (
      <group scale={scale}>
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[0.8, 0.44, 0.5]} />
          {mat}
        </mesh>
        <mesh position={[0, 0.52, 0.05]}>
          <boxGeometry args={[0.5, 0.26, 0.42]} />
          {mat}
        </mesh>
      </group>
    );
  }

  if (nameLower.includes("samu") || nameLower.includes("ambulancia")) {
    return (
      <group scale={scale}>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.8, 0.5, 0.55]} />
          <meshLambertMaterial color="#ffffff" transparent opacity={opacity} />
        </mesh>
        <mesh position={[0.28, 0.25, 0]}>
          <boxGeometry args={[0.04, 0.28, 0.04]} />
          <meshLambertMaterial color="#ef4444" transparent opacity={opacity} />
        </mesh>
        <mesh position={[0.28, 0.25, 0]}>
          <boxGeometry args={[0.28, 0.04, 0.04]} />
          <meshLambertMaterial color="#ef4444" transparent opacity={opacity} />
        </mesh>
      </group>
    );
  }

  if (nameLower.includes("rescate") || nameLower.includes("r-")) {
    return (
      <group scale={scale}>
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[0.7, 0.44, 0.5]} />
          <meshLambertMaterial color="#f97316" transparent opacity={opacity} />
        </mesh>
      </group>
    );
  }

  if (nameLower.includes("puesto") || nameLower.includes("pc") || nameLower.includes("mando")) {
    return (
      <group scale={scale}>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.3, 0.35, 0.6, 6]} />
          <meshLambertMaterial color="#06b6d4" transparent opacity={opacity} />
        </mesh>
        <mesh position={[0, 0.7, 0]}>
          <coneGeometry args={[0.32, 0.3, 6]} />
          <meshLambertMaterial color="#0891b2" transparent opacity={opacity} />
        </mesh>
      </group>
    );
  }

  // Default: tapered cylinder (unidad genérica)
  return (
    <mesh position={[0, 0.35, 0]} scale={scale}>
      <cylinderGeometry args={[0.28, 0.35, 0.7, 8]} />
      {mat}
    </mesh>
  );
}
