import { useEffect } from "react";
import { XCircle, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import clsx from "classnames";

export type ToastTone = "success" | "danger" | "warning" | "info";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastProps {
  message: ToastMessage;
  onDismiss: (id: string) => void;
  duration?: number;
}

const toneIcon: Record<ToastTone, React.ReactNode> = {
  success: <CheckCircle2 className="h-5 w-5" aria-hidden />,
  danger: <XCircle className="h-5 w-5" aria-hidden />,
  warning: <AlertTriangle className="h-5 w-5" aria-hidden />,
  info: <Info className="h-5 w-5" aria-hidden />,
};

const toneClasses: Record<ToastTone, string> = {
  success: "border-jade-500",
  danger: "border-carmine-500",
  warning: "border-saffron-500",
  info: "border-cobalt-500",
};

export const Toast = ({ message, onDismiss, duration = 6000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(message.id), duration);
    return () => clearTimeout(timer);
  }, [duration, message.id, onDismiss]);

  return (
    <div
      className={clsx(
        "pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-lg border bg-background-card p-4 shadow-elevation2",
        toneClasses[message.tone]
      )}
      role="status"
      aria-live="assertive"
    >
      <div className="mt-0.5 text-text-primary">{toneIcon[message.tone]}</div>
      <div className="flex-1 text-left">
        <p className="text-sm font-semibold text-text-primary">{message.title}</p>
        {message.description && (
          <p className="mt-1 text-sm text-text-muted">{message.description}</p>
        )}
        {message.actionLabel && message.onAction && (
          <button
            className="mt-2 rounded-md border border-line-soft px-3 py-1 text-xs font-semibold text-text-primary hover:border-accent-energy"
            onClick={message.onAction}
          >
            {message.actionLabel}
          </button>
        )}
      </div>
      <button
        onClick={() => onDismiss(message.id)}
        className="rounded-md border border-line-soft px-2 py-1 text-xs font-semibold text-text-muted hover:text-text-primary"
      >
        Close
      </button>
    </div>
  );
};
