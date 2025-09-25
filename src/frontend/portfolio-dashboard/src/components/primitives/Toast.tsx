import { ReactNode, useEffect, useId } from 'react';
import { create } from 'zustand';

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

interface ToastStore {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  dismissToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = crypto.randomUUID();
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    return id;
  },
  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }))
}));

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);
  return (
    <div className="toast-viewport" role="region" aria-live="assertive" aria-label="Notifications">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast" role="status">
          <div>
            <p className="toast__title">{toast.title}</p>
            {toast.description && <p className="toast__description">{toast.description}</p>}
          </div>
          {toast.action}
          <button type="button" className="ghost-button" onClick={() => dismissToast(toast.id)}>
            Close
          </button>
        </div>
      ))}
    </div>
  );
}

interface UseOptimisticActionOptions {
  pendingLabel?: string;
  successLabel?: string;
  errorLabel?: string;
  undoLabel?: string;
  onUndo?: () => void;
}

export function useOptimisticAction<T>(
  action: () => Promise<T>,
  {
    pendingLabel = 'Saving…',
    successLabel = 'Saved',
    errorLabel = 'Something went wrong',
    undoLabel = 'Undo',
    onUndo
  }: UseOptimisticActionOptions
) {
  const addToast = useToastStore((state) => state.addToast);
  const dismissToast = useToastStore((state) => state.dismissToast);
  const toastId = useId();

  useEffect(() => {
    return () => {
      dismissToast(toastId);
    };
  }, [dismissToast, toastId]);

  return async () => {
    addToast({ id: toastId, title: pendingLabel });
    try {
      const result = await action();
      dismissToast(toastId);
      addToast({
        title: successLabel,
        action: onUndo ? (
          <button type="button" className="link-button" onClick={onUndo}>
            {undoLabel}
          </button>
        ) : undefined
      });
      return result;
    } catch (error) {
      dismissToast(toastId);
      addToast({ title: errorLabel });
      throw error;
    }
  };
}
