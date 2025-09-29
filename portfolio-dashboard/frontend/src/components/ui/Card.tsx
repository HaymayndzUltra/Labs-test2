import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type CardMetadata = {
  updatedAt: string;
  source: string;
  scope: string;
};

type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: 'sm' | 'md' | 'lg';
  as?: keyof React.JSX.IntrinsicElements;
  metadata?: CardMetadata;
  footer?: ReactNode;
};

const paddingMap: Record<NonNullable<CardProps['padding']>, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  children,
  className,
  padding = 'md',
  as: Component = 'section',
  metadata,
  footer,
  ...props
}: CardProps) {
  const showLowerBar = Boolean(footer) || Boolean(metadata?.source);

  return (
    <Component
      className={cn('glass-card relative flex flex-col overflow-hidden', paddingMap[padding], className)}
      {...props}
    >
      {metadata ? (
        <div className="mb-4 flex justify-end">
          <div className="text-right text-[11px] font-medium text-slate-500" aria-live="polite">
            <span className="block text-slate-600">Updated {metadata.updatedAt}</span>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
              Scope: {metadata.scope}
            </span>
          </div>
        </div>
      ) : null}
      <div className="flex-1 space-y-4">{children}</div>
      {showLowerBar ? (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-[11px] font-medium text-slate-500">
          {metadata?.source ? <span>Source: {metadata.source}</span> : <span aria-hidden="true" />}
          {footer ? <div className="ml-auto text-right text-xs text-slate-600">{footer}</div> : null}
        </div>
      ) : null}
    </Component>
  );
}
