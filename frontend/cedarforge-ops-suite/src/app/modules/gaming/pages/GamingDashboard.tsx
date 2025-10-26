import { KPICard } from "@shared/components/KPICard";
import { Card } from "@shared/components/Card";
import { BarChart, DonutChart } from "@shared/chart/ChartPrimitives";
import { ModuleViewProps } from "../../moduleRegistry";
import { cohortRetention, offerExperiments, crashHeat, eventStream } from "../fixtures";
import { useSseMock } from "@shared/hooks/useSseMock";
import { formatPercent } from "@shared/utils/format";

const GamingDashboard = ({ onToast }: ModuleViewProps) => {
  const dau = useSseMock(2_480_000);
  return (
    <div className="space-y-6">
      <section data-grid="12">
        <div className="col-span-3">
          <KPICard title="DAU" value={dau} delta={0.05} timeframe="Live" format="number" />
        </div>
        <div className="col-span-3">
          <KPICard title="ARPDAU" value={4.82} delta={0.07} timeframe="USD" format="currency" />
        </div>
        <div className="col-span-3">
          <KPICard title="Retention D1" value={36} delta={0.02} timeframe="%" format="percent" />
        </div>
        <div className="col-span-3">
          <KPICard title="Crash rate" value={1.8} delta={-0.03} timeframe="per 1k" format="percent" positiveIsGood={false} />
        </div>
      </section>

      <section data-grid="12">
        <div className="col-span-7">
          <Card title="Cohort retention" subtitle="D1/D7" padding="lg">
            <BarChart
              title="Retention"
              data={cohortRetention.map((cohort) => ({ label: cohort.cohort, value: Math.round(cohort.d1 * 100) }))}
              xAccessor={(item) => item.label}
              yAccessor={(item) => item.value}
            />
          </Card>
        </div>
        <div className="col-span-5 space-y-6">
          <Card title="Offer experiments" subtitle="Uplift" padding="lg">
            <DonutChart
              title="Experiments"
              data={offerExperiments.map((variant) => ({ label: variant.variant, value: variant.uplift }))}
              valueAccessor={(item) => item.value}
              labelAccessor={(item) => item.label}
            />
          </Card>
          <Card title="Crash heat" subtitle="Device x time" padding="lg">
            <ul className="space-y-2 text-sm text-text-secondary">
              {crashHeat.map((row) => (
                <li key={row.slot} className="flex items-center justify-between rounded-md border border-line-soft px-3 py-2">
                  <span>{row.slot}</span>
                  <span className="font-mono">{row.crashes}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <Card title="Event stream" subtitle="Last 10" padding="lg">
        <ul className="space-y-2 text-sm text-text-secondary">
          {eventStream.map((event) => (
            <li key={event.id} className="flex items-center justify-between rounded-md border border-line-soft px-3 py-2">
              <span className="font-semibold text-text-primary">{event.type}</span>
              <span className="text-text-muted">{event.message}</span>
              <span className="font-mono">{event.timestamp}</span>
            </li>
          ))}
        </ul>
        <button
          className="mt-4 rounded-md border border-line-strong bg-background-card px-4 py-2 text-sm font-semibold text-text-primary"
          onClick={() =>
            onToast({
              id: `gaming-${Date.now()}`,
              title: "Promo sent",
              description: "Live segmentation promo rolled to cohort B.",
              tone: "success",
            })
          }
        >
          Trigger promo
        </button>
      </Card>
    </div>
  );
};

export default GamingDashboard;
