import { Suspense, useMemo } from "react";
import { useUIStore } from "@shared/state/uiStore";
import { FilterBar } from "@shared/components/FilterBar";
import { modules, getModuleDefinition } from "./modules/moduleRegistry";
import { useUrlSync } from "@shared/hooks/useUrlSync";
import { Toast, ToastMessage } from "@shared/components/Toast";
import { useState } from "react";

const LoadingState = () => (
  <div className="space-y-4" role="status" aria-live="polite">
    <div className="h-36 animate-pulse rounded-lg bg-background-raised" />
    <div className="h-36 animate-pulse rounded-lg bg-background-raised" />
    <div className="h-36 animate-pulse rounded-lg bg-background-raised" />
  </div>
);

export default function App() {
  const filters = useUIStore((state) => state.filters);
  useUrlSync();
  const moduleDefinition = useMemo(() => getModuleDefinition(filters.module), [filters.module]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = (toast: ToastMessage) => {
    setToasts((messages) => [...messages, toast]);
  };

  return (
    <div className="min-h-screen bg-background-base text-text-primary">
      <header className="border-b border-line-strong bg-background-base/90 backdrop-blur px-8 py-6">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">CedarForge Ops Suite</p>
              <h1 className="text-[34px] leading-[40px] font-[750] text-text-primary">
                {moduleDefinition.name}
              </h1>
              <p className="text-sm text-text-secondary">{moduleDefinition.description}</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm text-text-muted">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: moduleDefinition.accentToken }} aria-hidden />
              Multi-tenant · Warm Neo-Industrial
            </div>
          </div>
          <FilterBar />
        </div>
      </header>
      <main className="mx-auto flex max-w-[1440px] flex-col gap-6 px-8 py-8">
        <Suspense fallback={<LoadingState />}>
          <moduleDefinition.component onToast={pushToast} />
        </Suspense>
      </main>
      <aside className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast} onDismiss={(id) => setToasts((list) => list.filter((item) => item.id !== id))} />
        ))}
      </aside>
      <footer className="mt-16 border-t border-line-soft bg-background-base/80 px-8 py-6 text-sm text-text-muted">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3">
          <p>
            CedarForge Ops Suite · WCAG 2.2 AA · Localized & secure by design.
          </p>
          <nav className="flex items-center gap-4">
            {modules.map((module) => (
              <a key={module.key} href={`?module=${module.key}`} className="text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary hover:text-text-primary">
                {module.name.split(" ")[0]}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
