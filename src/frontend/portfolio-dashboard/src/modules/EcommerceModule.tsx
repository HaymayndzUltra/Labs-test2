import { useMemo } from 'react';
import { ecommerceKpis, generateTimeSeries } from '../data/fixtures';
import { useLiveKpis } from '../hooks/useLiveKpis';
import { KpiCard } from '../components/primitives/KpiCard';
import { LineChart } from '../components/charts/LineChart';
import { DataTable } from '../components/primitives/DataTable';
import { AutomationWorkbench } from '../components/automation/AutomationWorkbench';

const topProducts = [
  { name: 'Trail runner', revenue: 182000, conversion: 0.056, orders: 1240 },
  { name: 'All-weather parka', revenue: 164000, conversion: 0.064, orders: 820 },
  { name: 'Everyday tee', revenue: 128400, conversion: 0.032, orders: 2430 },
  { name: 'Studio legging', revenue: 94200, conversion: 0.046, orders: 560 },
  { name: 'Travel duffle', revenue: 88400, conversion: 0.041, orders: 420 }
];

const monthlyBreakdown = [
  { month: 'Jan', revenue: '$2.1M', orders: '14.2k', growth: '+6.2%' },
  { month: 'Feb', revenue: '$2.4M', orders: '15.8k', growth: '+8.1%' },
  { month: 'Mar', revenue: '$2.6M', orders: '16.5k', growth: '+3.5%' },
  { month: 'Apr', revenue: '$2.3M', orders: '15.1k', growth: '−4.6%' },
  { month: 'May', revenue: '$2.5M', orders: '15.9k', growth: '+2.1%' },
  { month: 'Jun', revenue: '$2.7M', orders: '16.8k', growth: '+4.4%' }
];

const inventoryAlerts = [
  { sku: 'ORBIT-001', issue: 'Low stock < 2 weeks', tone: 'warning' },
  { sku: 'CAMP-442', issue: 'Return spike +18%', tone: 'danger' },
  { sku: 'CITY-128', issue: 'Restock arriving Friday', tone: 'info' }
];

const formatter = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

export function EcommerceModule() {
  const kpis = useLiveKpis(ecommerceKpis);
  const kpiTrends = useMemo(
    () => ecommerceKpis.map((kpi) => generateTimeSeries(20, kpi.value, 0.07).map((point) => point.value)),
    []
  );
  const salesTrends = useMemo(() => generateTimeSeries(16, 420, 0.12), []);

  return (
    <section aria-labelledby="mof-title" className="module-layout" data-accent="commerce">
      <h2 id="mof-title" className="visually-hidden">
        Merchandising, orders, and fulfillment
      </h2>
      <section className="kpi-band" aria-label="Commerce KPIs">
        {kpis.map((kpi, index) => (
          <KpiCard key={kpi.label} kpi={kpi} trend={kpiTrends[index]} accent="var(--vertical-commerce)" />
        ))}
      </section>

      <div className="dashboard-grid">
        <div className="dashboard-grid__main">
          <div className="card card--240 span-4" role="region" aria-labelledby="top-products-title">
            <div className="card__header">
              <h3 id="top-products-title" className="card__title">
                Top products purchased
              </h3>
            </div>
            <DataTable
              columns={["Product", "Revenue", "Conversion", "Orders"]}
              rows={topProducts.map((product) => [
                product.name,
                `$${formatter.format(product.revenue)}`,
                `${(product.conversion * 100).toFixed(1)}%`,
                formatter.format(product.orders)
              ])}
              numericColumns={[1, 2, 3]}
              footer={[`View full catalog`, '', '', '→']}
            />
          </div>

          <LineChart
            className="span-4"
            title="Sales trends"
            description="Week-over-week merchandise revenue performance."
            series={salesTrends}
            tone="vertical"
            verticalAccent="var(--vertical-commerce)"
          />

          <div className="card card--200 span-4" role="region" aria-labelledby="monthly-breakdown-title">
            <div className="card__header">
              <h3 id="monthly-breakdown-title" className="card__title">
                Monthly breakdown
              </h3>
            </div>
            <ul className="automation-list automation-list--stacked">
              {monthlyBreakdown.map((month) => (
                <li key={month.month}>
                  <div>
                    <p className="automation-list__title">{month.month}</p>
                    <span className="automation-list__meta">{month.orders} orders</span>
                  </div>
                  <span className="automation-delta">{month.revenue} · {month.growth}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card card--240 span-4" role="region" aria-labelledby="inventory-alerts-title">
            <div className="card__header">
              <h3 id="inventory-alerts-title" className="card__title">
                Returns & inventory alerts
              </h3>
            </div>
            <ul className="automation-list automation-list--stacked">
              {inventoryAlerts.map((alert) => (
                <li key={alert.sku}>
                  <div>
                    <p className="automation-list__title">{alert.issue}</p>
                    <span className="automation-list__meta">SKU {alert.sku}</span>
                  </div>
                  <span className="status-chip" data-tone={alert.tone}>
                    {alert.tone === 'danger' ? 'Investigate' : alert.tone === 'warning' ? 'Action needed' : 'Info'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="dashboard-grid__rail">
          <AutomationWorkbench
            builder={{
              summary: 'Protect margin and fulfillment SLAs with proactive automation.',
              trigger: 'Inventory days of cover < 10 or return spike > 15%',
              conditions: 'Exclude items already in supplier escalation.',
              actions: 'Auto-create PO → adjust merchandising placements → alert CX for outreach.',
              metrics: [
                { label: 'SLA adherence', value: '96%' },
                { label: 'Inventory health', value: 'Top 150 SKUs' }
              ]
            }}
            backlog={{
              items: [
                { title: 'Carrier performance scoring', status: 'Data modeling', tone: 'info' },
                { title: 'Dynamic bundling engine', status: 'Build scheduled', tone: 'warning' },
                { title: 'Returns triage automation', status: 'Pilot live', tone: 'success' }
              ],
              footer: 'Ops stand-up in 40 minutes'
            }}
            efficiency={{
              items: [
                { title: 'Smart replenishment', impact: 'Cuts stockouts by 23%', delta: '↑ $180K saved' },
                { title: 'Promise date accuracy', impact: 'Reduces late orders', delta: '+4.2 pts CSAT' }
              ]
            }}
          />
        </aside>
      </div>
    </section>
  );
}
