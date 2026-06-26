interface OperationalZoneProps {
  center: [number, number];
  innerRadius: number;
  outerRadius: number;
  color: string;
  opacity: number;
  yOffset?: number;
}

/** Single semi-transparent ring representing an operational zone. */
export function OperationalZone({
  center,
  innerRadius,
  outerRadius,
  color,
  opacity,
  yOffset = 0,
}: OperationalZoneProps) {
  const [cx, cz] = center;
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0.01 + yOffset, cz]}>
      {innerRadius === 0 ? (
        <circleGeometry args={[outerRadius, 40]} />
      ) : (
        <ringGeometry args={[innerRadius, outerRadius, 40]} />
      )}
      <meshLambertMaterial color={color} transparent opacity={opacity} side={2} />
    </mesh>
  );
}
