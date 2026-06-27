import { useEffect, useRef, useState } from "react";
import type { IncidentMetric, IncidentStatus } from "../../types/sci";

interface SceneHUDProps {
  metrics: IncidentMetric;
  status: IncidentStatus;
  minute: number;
  triggeredInjects: string[];
}

// ─── helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<IncidentStatus, string> = {
  estable:     "ESTABLE",
  dinamico:    "DINÁMICO",
  critico:     "CRÍTICO",
  controlado:  "CONTROLADO",
};

const STATUS_COLOR: Record<IncidentStatus, string> = {
  estable:    "#22c55e",
  dinamico:   "#f59e0b",
  critico:    "#ef4444",
  controlado: "#3b82f6",
};

type MetricKind = "risk" | "control" | "life";

function metricColor(value: number, kind: MetricKind): string {
  if (kind === "risk")
    return value >= 75 ? "#f87171" : value >= 50 ? "#fbbf24" : "#4ade80";
  if (kind === "control")
    return value >= 75 ? "#4ade80" : value >= 40 ? "#fbbf24" : "#f87171";
  // lifeSafety
  return value > 60 ? "#4ade80" : value >= 35 ? "#fbbf24" : "#f87171";
}

/** Thin color bar representing 0–100 metric value. */
function MiniBar({ value, kind }: { value: number; kind: MetricKind }) {
  const color = metricColor(value, kind);
  const pct   = Math.max(0, Math.min(100, value));
  return (
    <div
      className="hud-bar-track"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="hud-bar-fill"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

// ─── component ────────────────────────────────────────────────────────────────

/**
 * Transparent HUD overlay for the 3D scene.
 * Positioned absolute inside `.scene3d-canvas` (pointer-events: none).
 * Shows risk / control / lifeSafety bars, incident status, minute,
 * and contextual alerts for threshold crossings or new injects.
 */
export function SceneHUD({ metrics, status, minute, triggeredInjects }: SceneHUDProps) {
  const [pulsing, setPulsing]       = useState(false);
  const [injectAlert, setInjectAlert] = useState<string | null>(null);
  const prevMetricsRef  = useRef<IncidentMetric>(metrics);
  const prevInjectsRef  = useRef<Set<string>>(new Set(triggeredInjects));

  // Pulse animation when any tracked metric changes by > 4 points
  useEffect(() => {
    const p = prevMetricsRef.current;
    const changed =
      Math.abs(p.risk       - metrics.risk)       > 4 ||
      Math.abs(p.control    - metrics.control)    > 4 ||
      Math.abs(p.lifeSafety - metrics.lifeSafety) > 4;
    prevMetricsRef.current = metrics;

    if (!changed) return;
    setPulsing(true);
    const t = setTimeout(() => setPulsing(false), 700);
    return () => clearTimeout(t);
  }, [metrics]);

  // Brief inject alert (clears after 4 s)
  useEffect(() => {
    const prev = prevInjectsRef.current;
    const newOnes = triggeredInjects.filter((id) => !prev.has(id));
    prevInjectsRef.current = new Set(triggeredInjects);

    if (newOnes.length === 0) return;
    setInjectAlert("⚡ INJECT ACTIVO");
    const t = setTimeout(() => setInjectAlert(null), 4000);
    return () => clearTimeout(t);
  }, [triggeredInjects]);

  // Persistent threshold alerts (prioritized, one at a time)
  const thresholdAlert =
    metrics.risk       >= 75 ? "⚠ RIESGO CRÍTICO"          :
    metrics.lifeSafety <= 35 ? "⚠ SEGURIDAD COMPROMETIDA"  :
    metrics.control    >= 75 ? "✓ CONTROL ALTO"             :
    null;

  // Inject alert takes priority over threshold alert
  const activeAlert = injectAlert ?? thresholdAlert;
  const alertIsPositive = activeAlert?.startsWith("✓");

  return (
    <div className="scene-hud" aria-label="Estado del incidente">
      <div className={`hud-body${pulsing ? " hud-pulsing" : ""}`}>

        {/* ── Metric rows ──────────────────────────────────────────── */}
        <div className="hud-rows">
          <div className="hud-row">
            <span className="hud-label">Riesgo</span>
            <MiniBar value={metrics.risk} kind="risk" />
            <span
              className="hud-value"
              style={{ color: metricColor(metrics.risk, "risk") }}
            >
              {metrics.risk}
            </span>
          </div>

          <div className="hud-row">
            <span className="hud-label">Control</span>
            <MiniBar value={metrics.control} kind="control" />
            <span
              className="hud-value"
              style={{ color: metricColor(metrics.control, "control") }}
            >
              {metrics.control}
            </span>
          </div>

          <div className="hud-row">
            <span className="hud-label">Seg. Vida</span>
            <MiniBar value={metrics.lifeSafety} kind="life" />
            <span
              className="hud-value"
              style={{ color: metricColor(metrics.lifeSafety, "life") }}
            >
              {metrics.lifeSafety}
            </span>
          </div>
        </div>

        {/* ── Status + minute ──────────────────────────────────────── */}
        <div className="hud-status-row">
          <span
            className="hud-dot"
            style={{ background: STATUS_COLOR[status] }}
            aria-hidden="true"
          />
          <span className="hud-status-text">{STATUS_LABEL[status]}</span>
          <span className="hud-minute">
            Min&nbsp;<strong>{minute}</strong>
          </span>
        </div>

        {/* ── Alert strip ──────────────────────────────────────────── */}
        {activeAlert && (
          <div
            key={activeAlert}
            className={`hud-alert ${alertIsPositive ? "hud-alert-ok" : "hud-alert-warn"}`}
            role="alert"
          >
            {activeAlert}
          </div>
        )}
      </div>
    </div>
  );
}
