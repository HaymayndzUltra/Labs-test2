'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type ToastTone = 'info' | 'success' | 'warning' | 'danger';

export type Toast = {
  id?: string;
  title: string;
  description?: string;
  tone?: ToastTone;
  actionLabel?: string;
  onAction?: () => void;
  durationMs?: number;
};

type ToastContextValue = {
  push: (toast: Toast) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const toneStyles: Record<ToastTone, string> = {
  info: 'border-[var(--info-500)]/40 bg-[var(--info-50)] text-slate-900',
  success: 'border-[var(--success-500)]/40 bg-[var(--success-50)] text-slate-900',
  warning: 'border-[var(--warning-500)]/40 bg-[var(--warning-50)] text-slate-900',
  danger: 'border-[var(--danger-500)]/40 bg-[var(--danger-50)] text-slate-900',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Required<Toast>[]>([]);
  const timers = useRef<Record<string, number>>({});

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    if (timers.current[id]) {
      window.clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const push = useCallback(
    (toast: Toast) => {
      const id = toast.id ?? crypto.randomUUID();
      const merged: Required<Toast> = {
        tone: 'info',
        actionLabel: '',
        onAction: undefined,
        description: '',
        durationMs: 6000,
        ...toast,
        id,
      };
      setToasts((prev) => [...prev, merged]);
      if (merged.durationMs > 0) {
        timers.current[id] = window.setTimeout(() => dismiss(id), merged.durationMs);
      }
    },
    [dismiss]
  );

  useEffect(() => {
    const registry = timers.current;
    return () => {
      Object.values(registry).forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const value = useMemo(() => ({ push, dismiss }), [dismiss, push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-6 right-6 z-[100] flex w-full max-w-sm flex-col gap-3 px-4 sm:px-0"
        role="region"
        aria-live="assertive"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto glass-card border px-5 py-4 shadow-lg transition',
              toneStyles[toast.tone]
            )}
            role="status"
            aria-atomic="true"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
                {toast.description ? (
                  <p className="mt-1 text-xs text-slate-600">{toast.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                className="inline-flex h-11 min-h-[44px] items-center justify-center rounded-full border border-transparent px-4 text-xs font-semibold text-slate-600 transition hover:bg-slate-200/60 focus-visible:focus-ring"
                onClick={() => dismiss(toast.id)}
              >
                Close
              </button>
            </div>
            {toast.actionLabel && toast.onAction ? (
              <button
                type="button"
                className="mt-3 inline-flex h-11 min-h-[44px] items-center justify-center rounded-full border border-[var(--primary-400)]/50 bg-[var(--primary-50)] px-4 text-xs font-semibold text-[var(--primary-600)] transition hover:bg-[var(--primary-100)] focus-visible:focus-ring"
                onClick={() => {
                  toast.onAction?.();
                  dismiss(toast.id);
                }}
              >
                {toast.actionLabel}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
