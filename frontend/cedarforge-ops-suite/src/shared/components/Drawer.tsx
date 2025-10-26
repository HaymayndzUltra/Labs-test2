import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import clsx from "classnames";

interface DrawerProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: "sm" | "md" | "lg";
}

export const Drawer = ({
  title,
  description,
  isOpen,
  onClose,
  children,
  width = "md",
}: DrawerProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusable = panelRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-[color:var(--overlay)]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      <div
        ref={panelRef}
        className={clsx(
          "h-full bg-background-card shadow-elevation3 border-l border-line-strong p-6 overflow-y-auto",
          width === "sm" && "w-full max-w-md",
          width === "md" && "w-full max-w-xl",
          width === "lg" && "w-full max-w-2xl"
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line-soft pb-4">
          <div>
            <h2 id="drawer-title" className="text-xl font-semibold text-text-primary">
              {title}
            </h2>
            {description && <p className="text-sm text-text-muted">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-line-soft text-text-muted hover:text-text-primary"
          >
            <span className="sr-only">Close panel</span>
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="mt-4 space-y-6 text-sm leading-6 text-text-secondary">{children}</div>
      </div>
    </div>
  );
};
