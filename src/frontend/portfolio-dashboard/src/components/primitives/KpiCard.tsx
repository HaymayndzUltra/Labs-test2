import { KPI, formatKpiValue } from '../../data/fixtures';

interface KpiCardProps {
  kpi: KPI;
}

export function KpiCard({ kpi }: KpiCardProps) {
  return (
    <article className="kpi-card" role="group" aria-label={kpi.label}>
      <h3 className="kpi-card__title">{kpi.label}</h3>
      <p className="kpi-card__value">{formatKpiValue(kpi)}</p>
      <div className="kpi-card__meta">
        <span className={kpi.deltaDirection === 'up' ? 'delta-positive' : 'delta-negative'}>
          {kpi.deltaDirection === 'up' ? '▲' : '▼'} {kpi.delta.toFixed(1)}%
        </span>
        <span>{kpi.basis}</span>
      </div>
    </article>
  );
}
