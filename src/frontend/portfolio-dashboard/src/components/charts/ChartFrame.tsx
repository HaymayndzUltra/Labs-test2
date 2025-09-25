import { ReactNode } from 'react';

interface ChartFrameProps {
  title: string;
  description: string;
  legend?: ReactNode;
  table: ReactNode;
  children: ReactNode;
}

export function ChartFrame({ title, description, legend, table, children }: ChartFrameProps) {
  return (
    <figure className="card chart-container" role="group" aria-label={title} tabIndex={0}>
      <div className="card__header">
        <div>
          <h3 className="card__title">{title}</h3>
          <p className="card__subtitle">{description}</p>
        </div>
        {legend}
      </div>
      <div className="chart-svg" role="img" aria-label={description}>
        {children}
      </div>
      {table}
    </figure>
  );
}
