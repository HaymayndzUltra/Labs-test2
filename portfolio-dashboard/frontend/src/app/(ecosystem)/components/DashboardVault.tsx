'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { DeckGL } from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import * as Plot from '@observablehq/plot';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { track } from '@/lib/analytics';
import { usePersonaStore } from '@/hooks/usePersonaStore';
import { buildPodData, type PodDataBundle } from '@/lib/data/synthetic';
import { cn } from '@/lib/utils';

const pods = {
  fintech: {
    id: 'fintech',
    label: 'Fintech Intelligence Pod',
    description:
      'Detect credit risk, orchestrate AML reviews, and model liquidity guardrails across portfolios.',
    seed: 88,
    theme: 'from-slate-900/80 via-sky-900/70 to-black/80',
  },
  healthcare: {
    id: 'healthcare',
    label: 'Healthcare Continuum Pod',
    description:
      'Command clinical operations, quality benchmarks, and staffing readiness across multi-site networks.',
    seed: 120,
    theme: 'from-slate-900/80 via-emerald-900/70 to-black/80',
  },
} satisfies Record<string, { id: string; label: string; description: string; seed: number; theme: string }>;

type PodKey = keyof typeof pods;

interface DiagnosticPlotProps {
  data: PodDataBundle['diagnostics'];
}

function DiagnosticPlot({ data }: DiagnosticPlotProps) {
  const plotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!plotRef.current) {
      return;
    }

    const plot = Plot.plot({
      height: 240,
      marginLeft: 40,
      marginRight: 10,
      color: {
        type: 'categorical',
        legend: true,
      },
      marks: [
        Plot.barY(data, {
          x: 'metric',
          y: 'value',
          fill: 'status',
          tip: true,
        }),
        Plot.ruleY([80]),
      ],
    });

    plotRef.current.replaceChildren(plot);

    return () => {
      plot.remove();
    };
  }, [data]);

  return (
    <div ref={plotRef} className="h-[240px] w-full" aria-label="Anomaly detection chart" />
  );
}

interface ScenarioSimulatorProps {
  data: PodDataBundle['scenarios'];
}

function ScenarioSimulator({ data }: ScenarioSimulatorProps) {
  const [growthMultiplier, setGrowthMultiplier] = useState(1.0);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-inner">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-lg font-semibold">Scenario Simulator</h4>
          <p className="text-xs uppercase tracking-[0.25em] text-white/50">Growth Multiplier</p>
        </div>
        <div className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold">
          {(growthMultiplier * 100).toFixed(0)}%
        </div>
      </div>
      <input
        type="range"
        min={0.6}
        max={1.6}
        step={0.05}
        value={growthMultiplier}
        onChange={(event) => setGrowthMultiplier(Number.parseFloat(event.target.value))}
        className="mt-6 w-full"
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {data.map((scenario) => {
          const baseline = scenario.baseline * growthMultiplier;
          return (
            <motion.div
              key={scenario.name}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-white/15 bg-black/30 p-4"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">{scenario.name}</p>
              <h5 className="mt-2 text-2xl font-semibold text-white">{baseline.toFixed(2)}</h5>
              <div className="mt-3 space-y-1 text-xs text-white/70">
                <p>Optimistic: {(scenario.optimistic * growthMultiplier).toFixed(2)}</p>
                <p>Conservative: {(scenario.conservative * growthMultiplier).toFixed(2)}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

interface GeospatialDeckProps {
  data: PodDataBundle['geospatial'];
}

function GeospatialDeck({ data }: GeospatialDeckProps) {
  const layers = useMemo(
    () => [
      new ScatterplotLayer({
        id: 'geospatial-layer',
        data,
        getPosition: (point: { longitude: number; latitude: number }) => [point.longitude, point.latitude],
        getFillColor: (point: { metric: number }) => [80, 180 + point.metric * 40, 220, 180],
        getRadius: (point: { metric: number }) => point.metric * 14_000,
        pickable: true,
      }),
    ],
    [data],
  );

  return (
    <div className="h-[280px] overflow-hidden rounded-3xl border border-white/10">
      <DeckGL
        controller
        initialViewState={{ longitude: -96, latitude: 37.5, zoom: 3.4, pitch: 25 }}
        layers={layers}
      >
        <div className="flex h-full items-end justify-end p-4 text-xs text-white">
          <span className="rounded-full bg-black/60 px-3 py-1">Geo coverage intensity</span>
        </div>
      </DeckGL>
    </div>
  );
}

export function DashboardVault() {
  const [activePod, setActivePod] = useState<PodKey>('fintech');
  const { persona } = usePersonaStore();

  const podDataset = useMemo(() => {
    const selected = pods[activePod];
    return buildPodData(selected.seed);
  }, [activePod]);

  const overviewCard = useMemo(
    () => (
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={podDataset.overview} margin={{ top: 20, right: 12, left: 12, bottom: 0 }}>
          <defs>
            <linearGradient id="overviewGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip
            contentStyle={{
              background: '#020617',
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'white',
            }}
          />
          <Area type="monotone" dataKey="value" stroke="#6366F1" fill="url(#overviewGradient)" strokeWidth={2.5} />
        </AreaChart>
      </ResponsiveContainer>
    ),
    [podDataset.overview],
  );

  useEffect(() => {
    track('pod_viewed', { pod: activePod });
  }, [activePod]);

  return (
    <section className="relative mt-16 rounded-[3rem] border border-slate-900/40 bg-slate-950/70 p-10 text-white shadow-2xl">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-300">Dashboard Vault</p>
          <h2 className="mt-2 text-3xl font-semibold">
            {persona.label.split(' ')[0]} Playbooks ready to prototype
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Synthetic data streams auto-refresh via Prisma seeds and Supabase/Firebase stubs. Toggle pods to
            explore Fintech and Healthcare blueprints.
          </p>
        </div>
        <span className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em]">
          Pods online • 2 / 4
        </span>
      </div>
      <Tabs.Root value={activePod} onValueChange={(value) => setActivePod(value as PodKey)} className="mt-10">
        <Tabs.List className="flex flex-wrap gap-4">
          {(Object.keys(pods) as PodKey[]).map((podKey) => (
            <Tabs.Trigger
              key={podKey}
              value={podKey}
              className={cn(
                'rounded-2xl border px-4 py-2 text-sm transition',
                podKey === activePod
                  ? 'border-white/40 bg-white/10 shadow-lg'
                  : 'border-white/10 bg-white/5 hover:border-white/30',
              )}
            >
              <div className="flex flex-col text-left">
                <span className="text-xs uppercase tracking-[0.3em] text-white/60">{pods[podKey].label}</span>
                <span className="text-sm text-white/80">{pods[podKey].description}</span>
              </div>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <Tabs.Content value={activePod} className="mt-10 space-y-8">
          <div
            className={cn(
              'grid gap-6 rounded-3xl border border-white/10 bg-gradient-to-br p-6 shadow-inner backdrop-blur',
              pods[activePod].theme,
              'md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]',
            )}
          >
            <div className="rounded-3xl bg-black/30 p-4 shadow-lg">{overviewCard}</div>
            <ScenarioSimulator data={podDataset.scenarios} />
          </div>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-inner">
              <h3 className="text-lg font-semibold">Diagnostics &amp; anomaly tagging</h3>
              <p className="mt-1 text-sm text-white/70">
                Click any bar to review anomaly notes inside the command center. Threshold line auto adjusts to
                persona risk tolerance.
              </p>
              <DiagnosticPlot data={podDataset.diagnostics} />
            </div>
            <GeospatialDeck data={podDataset.geospatial} />
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </section>
  );
}
