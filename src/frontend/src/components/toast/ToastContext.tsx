import { createContext, useCallback, useContext, useMemo, useReducer } from "react";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  tone?: "success" | "info" | "warning" | "danger";
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
}

const ToastContext = createContext<{
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
} | null>(null);

const reducer = (state: ToastState, action: { type: "ADD"; toast: Toast } | { type: "REMOVE"; id: string }): ToastState => {
  switch (action.type) {
    case "ADD":
      return { toasts: [...state.toasts, action.toast] };
    case "REMOVE":
      return { toasts: state.toasts.filter((toast) => toast.id !== action.id) };
    default:
      return state;
  }
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { toasts: [] });

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    dispatch({ type: "ADD", toast: { ...toast, id } });
    const duration = toast.duration ?? 6000;
    if (duration > 0) {
      window.setTimeout(() => dispatch({ type: "REMOVE", id }), duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => dispatch({ type: "REMOVE", id }), []);

  const value = useMemo(() => ({ toasts: state.toasts, addToast, removeToast }), [addToast, removeToast, state.toasts]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
