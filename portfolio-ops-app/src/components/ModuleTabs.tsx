import clsx from 'clsx';

interface ModuleTab {
  id: string;
  label: string;
  description: string;
}

interface ModuleTabsProps {
  modules: ModuleTab[];
  activeId: string;
  onSelect: (moduleId: string) => void;
}

export const ModuleTabs = ({ modules, activeId, onSelect }: ModuleTabsProps) => {
  return (
    <div className="card-surface flex flex-col gap-4">
      <div
        className="flex gap-3 overflow-x-auto"
        role="tablist"
        aria-label="Portfolio modules"
      >
        {modules.map((module) => (
          <button
            key={module.id}
            role="tab"
            aria-selected={module.id === activeId}
            aria-controls={`${module.id}-panel`}
            id={`${module.id}-tab`}
            onClick={() => onSelect(module.id)}
            className={clsx(
              'min-w-[160px] rounded-full px-5 py-2 text-[14px] font-semibold transition-colors duration-200',
              module.id === activeId
                ? 'bg-primary-500 text-white shadow-elevation'
                : 'border border-[var(--border-subtle)] bg-[var(--surface-0)] text-[var(--color-text-secondary)] hover:border-primary-300'
            )}
          >
            {module.label}
          </button>
        ))}
      </div>
      <p className="text-[14px] leading-[20px] text-[var(--color-text-muted)]">
        {modules.find((module) => module.id === activeId)?.description}
      </p>
    </div>
  );
};
