import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { nanoid } from 'nanoid';

type ToastLevel = 'info' | 'success' | 'warning' | 'danger';

type ToastPayload = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  level?: ToastLevel;
};

type Toast = ToastPayload & { id: string };

type ToastContextValue = {
  toasts: Toast[];
  pushToast: (payload: ToastPayload) => void;
  dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = useCallback((payload: ToastPayload) => {
    setToasts((current) => [
      ...current,
      {
        id: nanoid(),
        level: 'info',
        ...payload,
      },
    ]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const value = useMemo(() => ({ toasts, pushToast, dismissToast }), [toasts, pushToast, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-region" role="region" aria-live="assertive" aria-label="Notifications">
        {toasts.map((toast) => (
          <article
            key={toast.id}
            className="toast"
            aria-label={toast.title}
            data-level={toast.level}
            role="status"
          >
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
              <div>
                <p style={{ fontWeight: 600, margin: 0 }}>{toast.title}</p>
                {toast.description ? (
                  <p style={{ marginTop: 4, marginBottom: 0, color: 'var(--neutral-600)', fontSize: 13 }}>{toast.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
                style={{
                  background: 'transparent',
                  borderRadius: '999px',
                  padding: '4px 8px',
                  color: 'var(--neutral-500)',
                }}
              >
                ✕
              </button>
            </header>
            {toast.actionLabel && toast.onAction ? (
              <button
                type="button"
                onClick={() => {
                  toast.onAction?.();
                  dismissToast(toast.id);
                }}
                style={{
                  marginTop: 12,
                  padding: '8px 12px',
                  borderRadius: '999px',
                  background: 'var(--primary-500)',
                  color: '#fff',
                  fontWeight: 600,
                }}
              >
                {toast.actionLabel}
              </button>
            ) : null}
          </article>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) {
    throw new Error('useToast must be used inside ToastProvider');
  }
  return value;
}
