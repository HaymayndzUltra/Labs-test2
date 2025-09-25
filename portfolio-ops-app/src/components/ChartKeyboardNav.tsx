import { ReactNode, useMemo, useState } from 'react';

interface ChartKeyboardNavProps<T> {
  data: T[];
  tableId: string;
  children: ReactNode;
  onPointFocus?: (datum: T, index: number) => string;
}

export const ChartKeyboardNav = <T,>({ data, tableId, children, onPointFocus }: ChartKeyboardNavProps<T>) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const announcement = useMemo(() => {
    if (!data.length) return 'No data available';
    const datum = data[Math.min(activeIndex, data.length - 1)];
    if (!datum) return 'No data available';
    if (onPointFocus) {
      return onPointFocus(datum, activeIndex);
    }
    return JSON.stringify(datum);
  }, [activeIndex, data, onPointFocus]);

  return (
    <div className="flex flex-col gap-2">
      <div
        role="application"
        aria-roledescription="Interactive chart"
        tabIndex={0}
        className="relative rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-0)] p-4"
        onKeyDown={(event) => {
          if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
            return;
          }
          event.preventDefault();
          const maxIndex = Math.max(0, data.length - 1);
          if (event.key === 'Home') {
            setActiveIndex(0);
            return;
          }
          if (event.key === 'End') {
            setActiveIndex(maxIndex);
            return;
          }
          setActiveIndex((current) => {
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
              return Math.min(maxIndex, current + 1);
            }
            if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
              return Math.max(0, current - 1);
            }
            return current;
          });
        }}
        aria-describedby={`${tableId}-description`}
      >
        <div className="pointer-events-none absolute inset-0 rounded-xl border border-transparent" aria-hidden />
        {children}
      </div>
      <div id={`${tableId}-description`} className="sr-only" aria-live="polite">
        {announcement}
      </div>
    </div>
  );
};
