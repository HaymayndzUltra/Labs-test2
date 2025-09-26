import { KPI, formatKpiValue } from '../../data/fixtures';
import { Sparkline } from '../charts/Sparkline';
import { clsx } from 'clsx';

interface KpiCardProps {
  kpi: KPI;
  trend: number[];
  accent?: string;
}

export function KpiCard({ kpi, trend, accent }: KpiCardProps) {
  const deltaPrefix = kpi.deltaDirection === 'up' ? '+' : '−';
  return (
    <article className="kpi-card" role="group" aria-label={kpi.label}>
      <header className="kpi-card__header">
        <h3 className="kpi-card__title">{kpi.label}</h3>
        <span className="kpi-card__basis">{kpi.basis}</span>
      </header>
      <div className="kpi-card__value-row">
        <p className="kpi-card__value">{formatKpiValue(kpi)}</p>
        <span
          className={clsx(
            'delta-pill',
            kpi.deltaDirection === 'up' ? 'delta-pill--positive' : 'delta-pill--negative'
          )}
        >
          {deltaPrefix}
          {Math.abs(kpi.delta).toFixed(1)}%
        </span>
      </div>
      <Sparkline values={trend} accent={accent} />
    </article>
  );
}
