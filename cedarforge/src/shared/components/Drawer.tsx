import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

export type DrawerProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export function Drawer({ open, title, children, onClose }: DrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <div className="relative h-full w-full max-w-xl border-l-[1.5px] border-[color:var(--line-strong)] bg-[color:var(--surface-2)] p-6 shadow-[var(--shadow-3)] transition-transform duration-200 ease-cedar">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-[22px] font-semibold leading-[28px] text-[color:var(--text-primary)]">{title}</h2>
            <p className="text-[12px] text-[color:var(--text-secondary)]">Side panel drawer with focus trap</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-[16px] border-[1.5px] border-[color:var(--line-soft)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[color:var(--focus-ring)]"
            aria-label="Close drawer"
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4 overflow-y-auto pr-2" role="dialog" aria-modal="true">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
