import { Html } from "@react-three/drei";
import type { VisualResource } from "../../utils/scene3d";

interface ResourceStatusBadge3DProps {
  resource: VisualResource;
}

const STATUS_LABELS: Record<string, string> = {
  disponible:   "DISP",
  asignado:     "ASIG",
  solicitado:   "RUTA",
  fuera_servicio: "F/S",
  desmovilizado: "DEMOB",
};

const STATUS_COLORS: Record<string, string> = {
  disponible:    "#22c55e",
  asignado:      "#3b82f6",
  solicitado:    "#f59e0b",
  fuera_servicio:"#6b7280",
  desmovilizado: "#9ca3af",
};

/** HTML badge rendered above a resource showing its operational status. */
export function ResourceStatusBadge3D({ resource }: ResourceStatusBadge3DProps) {
  const label = STATUS_LABELS[resource.status] ?? resource.status.slice(0, 4).toUpperCase();
  const bg    = STATUS_COLORS[resource.status] ?? "#6b7280";

  return (
    <Html
      position={[resource.position[0], resource.position[1] + 1.3, resource.position[2]]}
      center
    >
      <div className="resource-status-badge-3d" style={{ background: bg }}>
        {label}
      </div>
    </Html>
  );
}
