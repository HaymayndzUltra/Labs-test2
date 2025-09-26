'use client';

import { useMemo, useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Area, AreaChart, CartesianGrid, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import type { DashboardMetric, DashboardPod } from '@/lib/data/datasets';
import { generateDashboardPod } from '@/lib/data/datasets';
import { usePersonaStore } from '@/state/persona-store';
import { Panel } from '@/components/ui/panel';
import { SectionHeader } from '@/components/ui/section-header';
import { formatDelta, formatValue } from '@/lib/utils/format';
import { captureEvent } from '@/lib/analytics/posthog';

const MetricCard = ({ metric }: { metric: DashboardMetric }) => (
  <Panel className="p-5">
    <div className="flex items-baseline justify-between">
      <p className="text-sm font-medium text-slate-500">{metric.label}</p>
      <span className={`text-xs font-semibold ${metric.delta >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
        {formatDelta(metric.delta)}
      </span>
    </div>
    <p className="mt-4 text-2xl font-semibold text-slate-900">{formatValue(metric.value, metric.format)}</p>
    <div className="mt-3 h-20">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={metric.trend}>
          <defs>
            <linearGradient id={`trend-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
          <XAxis dataKey="date" hide />
          <YAxis hide />
          <Tooltip cursor={false} formatter={(value: number) => formatValue(value, metric.format)} labelFormatter={() => ''} />
          <Area type="monotone" dataKey="value" stroke="#6366f1" fill={`url(#trend-${metric.id})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </Panel>
);

const ScenarioSimulator = ({ scenarios }: { scenarios: DashboardPod['scenarios'] }) => {
  const [state, setState] = useState(() =>
    scenarios.reduce<Record<string, number>>((acc, scenario) => {
      acc[scenario.metric] = scenario.current;
      return acc;
    }, {}),
  );

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {scenarios.map((scenario) => (
        <Panel key={scenario.metric} className="space-y-4 p-5">
          <div>
            <p className="text-sm font-semibold text-slate-500">{scenario.metric}</p>
            <p className="text-2xl font-semibold text-indigo-600">{state[scenario.metric].toFixed(2)}x</p>
          </div>
          <input
            className="w-full"
            type="range"
            min={scenario.sliderMin}
            max={scenario.sliderMax}
            step={0.01}
            value={state[scenario.metric]}
            onChange={(event) =>
              setState((prev) => ({ ...prev, [scenario.metric]: Number(event.target.value) }))
            }
          />
          <div className="h-20">
            <ResponsiveContainer>
              <AreaChart data={scenario.projection.map((value, idx) => ({ idx, value: value * state[scenario.metric] }))}>
                <Area type="monotone" dataKey="value" stroke="#22d3ee" fill="#22d3ee33" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      ))}
    </div>
  );
};

const DiagnosticsRadar = ({ metrics }: { metrics: DashboardMetric[] }) => (
  <Panel className="p-6">
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <RadarChart data={metrics.map((metric) => ({ ...metric, average: metric.value }))} outerRadius="70%">
          <PolarGrid />
          <PolarAngleAxis dataKey="label" />
          <Radar name="Performance" dataKey="average" stroke="#34d399" fill="#34d399" fillOpacity={0.4} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  </Panel>
);

const podDeckData = [
  { position: [-74.006, 40.7128], intensity: 0.9 },
  { position: [-122.4194, 37.7749], intensity: 0.7 },
  { position: [-0.1276, 51.5074], intensity: 0.6 },
  { position: [151.2093, -33.8688], intensity: 0.4 },
];

const DeckPreview = () => (
  <Panel className="relative h-72 overflow-hidden">
    <DeckGL
      initialViewState={{ longitude: -30, latitude: 20, zoom: 0.6, pitch: 30, bearing: 10 }}
      controller={false}
      layers={[
        new ScatterplotLayer({
          id: 'market-signal-layer',
          data: podDeckData,
          getPosition: (d) => d.position as [number, number],
          getRadius: (d) => d.intensity * 250000,
          getFillColor: (d) => [99, 102, 241, 180 * d.intensity],
        }),
      ]}
    />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />
    <div className="absolute bottom-4 left-4 text-xs font-semibold text-white">Deck.gl Geospatial Signal Map</div>
  </Panel>
);

export const DashboardVault = () => {
  const { persona } = usePersonaStore();
  const fintech = useMemo(() => generateDashboardPod(persona.id, 'fintech'), [persona.id]);
  const healthcare = useMemo(() => generateDashboardPod(persona.id, 'healthcare'), [persona.id]);

  const handleTabChange = (value: string) => {
    captureEvent('pod_viewed', { pod: value, persona: persona.id });
  };

  return (
    <section id="dashboard-vault" className="space-y-12">
      <SectionHeader
        eyebrow="Dashboard Vault"
        title="Industry Pods built for instant storytelling"
        description="Switch between Fintech and Healthcare pods to explore overview telemetry, diagnostic insights, and scenario simulators backed by synthetic datasets."
      />
      <Tabs.Root defaultValue="fintech" onValueChange={handleTabChange} className="space-y-6">
        <Tabs.List className="flex gap-3">
          <Tabs.Trigger value="fintech" className="rounded-full border border-slate-200/80 px-4 py-2 text-sm font-semibold data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
            Fintech Pod
          </Tabs.Trigger>
          <Tabs.Trigger value="healthcare" className="rounded-full border border-slate-200/80 px-4 py-2 text-sm font-semibold data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            Healthcare Pod
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="fintech" className="space-y-10">
          <VaultPod pod={fintech} />
        </Tabs.Content>
        <Tabs.Content value="healthcare" className="space-y-10">
          <VaultPod pod={healthcare} accent="emerald" />
        </Tabs.Content>
      </Tabs.Root>
    </section>
  );
};

const VaultPod = ({ pod, accent = 'indigo' }: { pod: DashboardPod; accent?: 'indigo' | 'emerald' }) => (
  <div className="space-y-8">
    <Panel className={`p-6 ${accent === 'emerald' ? 'border-emerald-200/50 bg-emerald-50/50' : 'border-indigo-200/50 bg-indigo-50/50'}`}>
      <h3 className="text-2xl font-semibold text-slate-900">{pod.title}</h3>
      <p className="mt-2 text-sm text-slate-600">{pod.summary}</p>
    </Panel>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {pod.overview.map((metric) => (
        <MetricCard key={metric.id} metric={metric} />
      ))}
    </div>
    <div className="grid gap-6 lg:grid-cols-[3fr,2fr]">
      <DiagnosticsRadar metrics={pod.diagnostics} />
      <DeckPreview />
    </div>
    <ScenarioSimulator scenarios={pod.scenarios} />
  </div>
);
