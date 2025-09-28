'use client';

import useSWR from 'swr';
import { KPICard } from '../../components/dashboard/KPICard';
import { TrendChart } from '../../components/dashboard/TrendChart';
import { Heatmap } from '../../components/dashboard/Heatmap';
import { AutomationPanel } from '../../components/dashboard/AutomationPanel';
import { fetcher } from '../../lib/api';

interface KPIResponse {
  total_tenants: number;
  occupied_units: number;
  overdue_payments: number;
  open_tickets: number;
}

interface TrendPoint {
  period: string;
  value: number;
}

interface RatePoint {
  period: string;
  rate: number;
}

interface DashboardTrends {
  rent_collection: TrendPoint[];
  ticket_closure_rate: RatePoint[];
}

interface HeatmapPoint {
  building: string;
  activity_index: number;
}

interface AutomationData {
  overdue_payments: number;
  pending_tickets: number;
  recommendations: string[];
}

const KPIS_ENDPOINT = '/dashboard/kpis';
const TRENDS_ENDPOINT = '/dashboard/trends';
const HEATMAP_ENDPOINT = '/dashboard/student-activity';
const AUTOMATION_ENDPOINT = '/dashboard/automation';

export default function DashboardPage() {
  const { data: kpis } = useSWR<KPIResponse>(KPIS_ENDPOINT, fetcher);
  const { data: trends } = useSWR<DashboardTrends>(TRENDS_ENDPOINT, fetcher);
  const { data: heatmap } = useSWR<{ points: HeatmapPoint[] }>(HEATMAP_ENDPOINT, fetcher);
  const { data: automation } = useSWR<AutomationData>(AUTOMATION_ENDPOINT, fetcher);

  const loading = !kpis || !trends || !heatmap || !automation;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Portfolio dashboard</h2>
        <p className="text-sm text-gray-500 mt-2">
          Monitor tenant health, rent collections, and automation opportunities across each organization.
        </p>
      </header>

      {loading ? (
        <div className="rounded-lg border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
          Loading dashboard metrics…
        </div>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KPICard label="Total tenants" value={kpis.total_tenants} />
            <KPICard label="Occupied units" value={kpis.occupied_units} />
            <KPICard label="Overdue payments" value={kpis.overdue_payments} description="Requires follow-up" />
            <KPICard label="Open tickets" value={kpis.open_tickets} />
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <TrendChart title="Rent collection trend" points={trends.rent_collection} />
            <TrendChart
              title="Ticket closure rate"
              points={trends.ticket_closure_rate.map((p) => ({ period: p.period, value: p.rate * 100 }))}
              color="#16a34a"
            />
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <Heatmap points={heatmap.points} />
            <AutomationPanel
              overduePayments={automation.overdue_payments}
              pendingTickets={automation.pending_tickets}
              recommendations={automation.recommendations}
            />
          </section>
        </>
      )}
    </div>
  );
}
