import { ReactNode } from 'react';
import clsx from 'clsx';

export type CardProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  accent?: string;
  className?: string;
};

export function Card({ title, action, children, accent, className }: CardProps) {
  return (
    <section
      className={clsx(
        'flex h-full flex-col rounded-[16px] border-[1.5px] border-[color:var(--line-soft)] bg-[color:var(--surface-1)] p-6 shadow-[var(--shadow-1)] transition-shadow duration-200 ease-cedar hover:shadow-[var(--shadow-2)]',
        className
      )}
    >
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2
            className="text-[22px] font-semibold leading-[28px]"
            style={accent ? { color: accent } : undefined}
          >
            {title}
          </h2>
        </div>
        {action && <div className="flex items-center gap-3 text-sm text-[color:var(--text-secondary)]">{action}</div>}
      </header>
      <div className="flex-1 text-sm text-[color:var(--text-secondary)]">{children}</div>
    </section>
  );
}
