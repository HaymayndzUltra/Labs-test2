import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface ChartFrameProps {
  title: string;
  description: string;
  legend?: ReactNode;
  table?: ReactNode;
  children: ReactNode;
  className?: string;
  size?: '200' | '240' | '320' | '380';
}

export function ChartFrame({ title, description, legend, table, children, className, size = '240' }: ChartFrameProps) {
  return (
    <figure
      className={clsx('card', 'chart-container', `card--${size}`, className)}
      role="group"
      aria-label={title}
      tabIndex={0}
    >
      <div className="card__header">
        <div>
          <h3 className="card__title">{title}</h3>
          <p className="card__subtitle">{description}</p>
        </div>
        {legend}
      </div>
      <div className="chart-container__visual" role="img" aria-label={description}>
        {children}
      </div>
      {table && <div className="chart-container__table">{table}</div>}
    </figure>
  );
}
