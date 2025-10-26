import { ReactNode, useRef } from 'react';
import { Download } from 'lucide-react';

export type ChartContainerProps = {
  title: string;
  description?: string;
  dataTable: ReactNode;
  onExport: () => void;
  children: ReactNode;
};

export function ChartContainer({ title, description, dataTable, onExport, children }: ChartContainerProps) {
  const regionRef = useRef<HTMLDivElement>(null);

  return (
    <section className="flex h-full flex-col rounded-[16px] border-[1.5px] border-[color:var(--line-soft)] bg-[color:var(--surface-1)] p-6 shadow-[var(--shadow-1)]">
      <header className="mb-3 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[16px] font-semibold leading-[24px] text-[color:var(--text-primary)]">{title}</h3>
          {description && <p className="text-[12px] text-[color:var(--text-secondary)]">{description}</p>}
        </div>
        <button
          type="button"
          onClick={onExport}
          className="flex h-11 items-center gap-2 rounded-[16px] border-[1.5px] border-[color:var(--line-soft)] px-4 text-sm font-semibold text-[color:var(--text-primary)] hover:border-[color:var(--accent-finops)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[color:var(--focus-ring)]"
        >
          <Download size={16} /> Export data
        </button>
      </header>
      <div ref={regionRef} role="group" className="relative flex-1" aria-label={`${title} interactive chart`}>
        {children}
      </div>
      <div className="mt-4 hidden" aria-hidden>
        {dataTable}
      </div>
    </section>
  );
}
