import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { X } from 'lucide-react';

export type ToastMessage = {
  id: string;
  title: string;
  description?: string;
};

type ToastStore = {
  toasts: ToastMessage[];
  push: (toast: Omit<ToastMessage, 'id'>) => void;
  dismiss: (id: string) => void;
};

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (toast) => set((state) => ({ toasts: [...state.toasts, { id: nanoid(), ...toast }] })),
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }))
}));

export function ToastRegion() {
  const { toasts, dismiss } = useToastStore();
  return (
    <div aria-live="assertive" className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="w-72 rounded-[16px] border-[1.5px] border-[color:var(--line-strong)] bg-[color:var(--surface-1)] p-4 shadow-[var(--shadow-2)]"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-[color:var(--text-primary)]">{toast.title}</p>
              {toast.description && <p className="text-xs text-[color:var(--text-secondary)]">{toast.description}</p>}
            </div>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="flex h-9 w-9 items-center justify-center rounded-[12px] border-[1.5px] border-[color:var(--line-soft)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[color:var(--focus-ring)]"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
