import type { MetricCard } from '../../data/types';
import { KpiCard } from './KpiCard';

export function KpiBand({ metrics }: { metrics: MetricCard[] }) {
  return (
    <section aria-label="Key performance indicators" className="kpi-band">
      {metrics.map((metric) => (
        <KpiCard key={metric.id} metric={metric} />
      ))}
    </section>
  );
}
