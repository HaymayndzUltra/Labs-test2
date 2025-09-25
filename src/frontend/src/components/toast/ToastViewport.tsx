import { useToast } from "./ToastContext";

export const ToastViewport: React.FC = () => {
  const { toasts, removeToast } = useToast();
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      role="region"
      aria-label="Notifications"
      style={{
        position: "fixed",
        right: "24px",
        bottom: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        zIndex: 1000,
        maxWidth: "320px"
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          style={{
            background: "var(--surface-s1)",
            border: `1px solid var(--${toast.tone ?? "info"}-300)` ,
            borderRadius: "16px",
            padding: "16px",
            boxShadow: "var(--shadow-elevation)",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>{toast.title}</p>
              {toast.description && (
                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>{toast.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              style={{ border: "none", background: "transparent", color: "var(--text-secondary)", cursor: "pointer" }}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
          {toast.actionLabel && toast.onAction && (
            <button
              type="button"
              onClick={() => {
                toast.onAction?.();
                removeToast(toast.id);
              }}
              style={{
                alignSelf: "flex-start",
                borderRadius: "999px",
                padding: "8px 16px",
                border: "none",
                background: `var(--${toast.tone ?? "info"}-500)`,
                color: "#fff",
                cursor: "pointer"
              }}
            >
              {toast.actionLabel}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
