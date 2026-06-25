import { AlertTriangle } from "lucide-react";

interface SpanOfControlAlertProps {
  exceeded: boolean;
  count: number;
  threshold: number;
  role: "instructor" | "alumno";
}

export function SpanOfControlAlert({ exceeded, count, threshold, role }: SpanOfControlAlertProps) {
  if (!exceeded) return null;

  return (
    <div className="span-alert" role="alert" aria-live="polite">
      <AlertTriangle size={16} />
      {role === "instructor" ? (
        <span>
          Tramo de control excedido: <strong>{count}/{threshold}</strong> subordinados directos. Principio SCI: Alcance de control (máx. 7).
        </span>
      ) : (
        <span>Advertencia de organización: considera sectorizar o delegar antes de continuar.</span>
      )}
    </div>
  );
}
