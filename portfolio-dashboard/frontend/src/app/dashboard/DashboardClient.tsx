'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, Tooltip, XAxis, YAxis, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { DeckProps } from 'deck.gl';
import type { DashboardVaultData, PodData, Scenario } from './data';
import { usePersonaStore } from '../../hooks/usePersonaStore';
import { trackEvent } from '../../lib/analytics';

const GeoIntensityMap = dynamic(() => import('./components/GeoIntensityMap'), { ssr: false });

function formatValue(value: number) {
  return `${value.toFixed(1)}%`;
}

type DashboardClientProps = {
  initialData: DashboardVaultData;
};

type ScenarioState = Record<string, number>;

function computeScenarioScore(scenarios: Scenario[], values: ScenarioState) {
  const total = scenarios.reduce((sum, scenario) => sum + (values[scenario.id] ?? scenario.defaultValue), 0);
  return Math.round((total / (scenarios.length * 100)) * 100);
}

function TrendTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const [{ value, payload: item }] = payload;
  return (
    <div className="rounded-lg border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-800 shadow-lg">
      <p className="font-semibold">{item.label}</p>
      <p>Value: {value.toFixed(1)}</p>
      <p>Benchmark: {item.benchmark.toFixed(1)}</p>
      {item.anomaly ? <p className="text-rose-500">Anomaly flagged</p> : null}
    </div>
  );
}

export function DashboardClient({ initialData }: DashboardClientProps) {
  const params = useSearchParams();
  const personaParam = params.get('persona');
  const { activePersona } = usePersonaStore();
  const [selectedPodId, setSelectedPodId] = useState<PodData['id']>(
    (params.get('pod') as PodData['id']) ?? 'fintech',
  );
  const [scenarioState, setScenarioState] = useState<ScenarioState>(() => {
    const defaultPod = initialData.pods.find((pod) => pod.id === selectedPodId) ?? initialData.pods[0];
    return Object.fromEntries(defaultPod.simulator.map((scenario) => [scenario.id, scenario.defaultValue]));
  });

  const activePod = useMemo(
    () => initialData.pods.find((pod) => pod.id === selectedPodId) ?? initialData.pods[0],
    [initialData.pods, selectedPodId],
  );

  const scenarioScore = useMemo(() => computeScenarioScore(activePod.simulator, scenarioState), [activePod, scenarioState]);

  const deckConfig: DeckProps = useMemo(() => ({
    initialViewState: {
      longitude: -20,
      latitude: 25,
      zoom: 2,
      bearing: 0,
      pitch: 45,
    },
    controller: true,
  }), []);

  return (
    <div className="min-h-screen bg-slate-950 pb-20 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 pt-16">
        <header className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Dashboard Vault</p>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-semibold text-white">
                {activePod.name}{' '}
                <span className="text-sm uppercase tracking-[0.4em] text-white/40">({personaParam ?? activePersona.label})</span>
              </h1>
              <p className="mt-2 max-w-2xl text-base text-white/70">{activePod.summary}</p>
            </div>
            <p className="text-sm text-white/50">Last refreshed {new Date(initialData.generatedAt).toLocaleTimeString()}</p>
          </div>
        </header>

        <nav className="flex flex-wrap gap-3">
          {initialData.pods.map((pod) => {
            const isActive = pod.id === selectedPodId;
            return (
              <button
                key={pod.id}
                type="button"
                onClick={() => {
                  setSelectedPodId(pod.id);
                  setScenarioState(Object.fromEntries(pod.simulator.map((scenario) => [scenario.id, scenario.defaultValue])));
                  trackEvent('pod_viewed', { pod: pod.id, persona: personaParam ?? activePersona.id });
                }}
                className={`rounded-full border px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] transition ${
                  isActive ? 'border-white bg-white text-slate-900' : 'border-white/40 text-white/80 hover:border-white/70'
                }`}
              >
                {pod.name}
              </button>
            );
          })}
        </nav>

        <section className="grid gap-6 md:grid-cols-[1.4fr,1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-sm uppercase tracking-[0.3em] text-white/50">Overview KPIs</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {activePod.overview.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40">{metric.label}</p>
                  <p className="mt-3 text-3xl font-semibold">{metric.value.toFixed(1)}</p>
                  <p className={`text-sm ${metric.delta >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {metric.delta >= 0 ? '+' : ''}
                    {metric.delta.toFixed(1)}% vs target
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-sm uppercase tracking-[0.3em] text-white/50">Persona Alignment</h2>
            <ul className="mt-4 space-y-3 text-white/80">
              {activePod.personaAlignment.map((persona) => (
                <li key={persona} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-xs uppercase tracking-[0.3em]">
                  {persona}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center justify-between">
              <h2 className="text-sm uppercase tracking-[0.3em] text-white/50">Diagnostic Trends</h2>
              <span className="rounded-full border border-amber-400/60 bg-amber-400/20 px-3 py-1 text-xs uppercase text-amber-200">
                Anomaly tagging
              </span>
            </div>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activePod.diagnostic}>
                  <defs>
                    <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="label" stroke="rgba(255,255,255,0.5)" tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.5)" tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                  <Tooltip content={<TrendTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#60a5fa" fillOpacity={1} fill="url(#valueGradient)" />
                  <Area type="monotone" dataKey="benchmark" stroke="#34d399" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-rose-300">
              {activePod.diagnostic.filter((trend) => trend.anomaly).map((trend) => (
                <span key={trend.label} className="rounded-full border border-rose-400/60 bg-rose-400/10 px-3 py-1 uppercase">
                  {trend.label} anomaly
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-sm uppercase tracking-[0.3em] text-white/50">Geo Coverage</h2>
            <div className="mt-4 h-64 overflow-hidden rounded-2xl">
              <GeoIntensityMap points={activePod.geoPoints} deckConfig={deckConfig} />
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-[1.2fr,1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-sm uppercase tracking-[0.3em] text-white/50">Scenario Simulator</h2>
            <div className="mt-4 grid gap-4">
              {activePod.simulator.map((scenario) => (
                <div key={scenario.id} className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50">{scenario.label}</p>
                      <p className="text-sm text-white/70">{scenario.description}</p>
                    </div>
                    <span className="text-lg font-semibold text-emerald-300">
                      {formatValue(scenarioState[scenario.id] ?? scenario.defaultValue)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={scenario.min}
                    max={scenario.max}
                    step={scenario.step}
                    value={scenarioState[scenario.id] ?? scenario.defaultValue}
                    onChange={(event) => {
                      const nextValue = Number(event.target.value);
                      setScenarioState((state) => ({ ...state, [scenario.id]: nextValue }));
                    }}
                    className="mt-4 w-full accent-emerald-400"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-emerald-500/10 p-4 text-emerald-200">
              <p className="text-xs uppercase tracking-[0.3em]">Projected win probability</p>
              <p className="text-3xl font-semibold">{scenarioScore}%</p>
              <p className="text-sm text-emerald-100/80">Based on scenario slider positions.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-sm uppercase tracking-[0.3em] text-white/50">Signal Radar</h2>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={activePod.simulator.map((scenario) => ({
                  scenario: scenario.label,
                  value: scenarioState[scenario.id] ?? scenario.defaultValue,
                }))} outerRadius="80%">
                  <PolarGrid stroke="rgba(255,255,255,0.2)" />
                  <PolarAngleAxis dataKey="scenario" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                  <Radar
                    name="Scenario"
                    dataKey="value"
                    stroke="#34d399"
                    fill="#34d399"
                    fillOpacity={0.4}
                    animationDuration={800}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
