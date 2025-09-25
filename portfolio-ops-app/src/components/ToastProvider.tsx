import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { nanoid } from 'nanoid';
import { AnimatePresence, motion } from 'framer-motion';

interface Toast {
  id: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastContextValue {
  push: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((toast: Omit<Toast, 'id'>) => {
    const next: Toast = { id: nanoid(), ...toast };
    setToasts((current) => [...current, next]);
    setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== next.id));
    }, 4800);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="assertive"
        className="fixed bottom-6 right-6 z-50 flex max-w-sm flex-col gap-4"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, translateY: 16 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: 16 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="card-surface shadow-elevation border border-strong bg-[var(--surface-1)]"
            >
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-[16px] leading-[24px] text-[var(--color-text-primary)]">
                  {toast.title}
                </p>
                {toast.description ? (
                  <p className="text-[14px] leading-[20px] text-[var(--color-text-secondary)]">
                    {toast.description}
                  </p>
                ) : null}
                {toast.actionLabel ? (
                  <button
                    className="self-start rounded-md border border-[var(--border-strong)] px-3 py-2 text-sm font-semibold text-primary-500 transition-colors duration-200 hover:bg-primary-50 focus-visible:outline"
                    onClick={() => {
                      toast.onAction?.();
                      setToasts((current) => current.filter((item) => item.id !== toast.id));
                    }}
                  >
                    {toast.actionLabel}
                  </button>
                ) : null}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
