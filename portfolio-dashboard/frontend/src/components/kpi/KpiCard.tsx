import { ArrowDownRight, ArrowUpRight, Dot } from 'lucide-react';
import type { MetricCard } from '../../data/types';
import { formatChange } from '../../lib/formatting';

function DeltaBadge({ change, trend }: { change?: number; trend?: MetricCard['trend'] }) {
  if (change == null || trend == null) return null;
  const isPositive = trend === 'up';
  const isNegative = trend === 'down';
  const Icon = isPositive ? ArrowUpRight : isNegative ? ArrowDownRight : Dot;
  const background = isPositive ? 'var(--success-100)' : isNegative ? 'var(--danger-100)' : 'var(--neutral-200)';
  const color = isPositive ? 'var(--success-700)' : isNegative ? 'var(--danger-700)' : 'var(--neutral-600)';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 8px',
        borderRadius: 999,
        background,
        color,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      <Icon size={14} />
      {formatChange(change)}
    </span>
  );
}

export function KpiCard({ metric }: { metric: MetricCard }) {
  return (
    <article className="kpi-card" aria-live="polite">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <p className="kpi-card__title">{metric.label}</p>
        <DeltaBadge change={metric.change} trend={metric.trend} />
      </header>
      <strong className="kpi-card__value">{metric.value}</strong>
      {metric.description ? (
        <p style={{ margin: 0, fontSize: 12, color: 'var(--neutral-500)' }}>{metric.description}</p>
      ) : null}
    </article>
  );
}
