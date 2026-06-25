import { useEffect } from "react";
import { AlertTriangle, CheckCircle2, X, XCircle } from "lucide-react";
import type { DecisionFeedback } from "../types/sci";

interface FeedbackToastProps {
  feedback: DecisionFeedback | null;
  onClose: () => void;
}

const AUTO_DISMISS_MS = 4500;

export function FeedbackToast({ feedback, onClose }: FeedbackToastProps) {
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(onClose, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [feedback, onClose]);

  if (!feedback) return null;

  return (
    <div className={`feedback-toast feedback-toast--${feedback.variant}`} role="alert" aria-live="polite">
      <span className="feedback-toast__icon">
        {feedback.variant === "success" && <CheckCircle2 size={18} />}
        {feedback.variant === "warning" && <AlertTriangle size={18} />}
        {feedback.variant === "danger" && <XCircle size={18} />}
      </span>
      <div className="feedback-toast__body">
        <strong>{feedback.title}</strong>
        <p>{feedback.message}</p>
      </div>
      <button className="feedback-toast__close" onClick={onClose} aria-label="Cerrar notificación">
        <X size={14} />
      </button>
    </div>
  );
}
