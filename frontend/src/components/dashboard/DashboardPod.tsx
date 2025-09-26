'use client';

import { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, Tooltip, XAxis, YAxis, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, Legend } from 'recharts';
import { DeckGL } from '@deck.gl/react';
import { HexagonLayer } from '@deck.gl/layers';
import type { DashboardDataset } from '@/data/syntheticDatasets';
import { motion } from 'framer-motion';
import { recordEvent } from '@/lib/analytics/posthog';

type DashboardPodProps = {
  title: string;
  accent: string;
  dataset: DashboardDataset;
  geospatialSeed?: number;
};

export function DashboardPod({ title, accent, dataset, geospatialSeed = 37 }: DashboardPodProps) {
  const hexData = useMemo(() => {
    return Array.from({ length: 120 }).map((_, index) => ({
      position: [
        -74 + Math.sin(index + geospatialSeed) * 0.3,
        40.7 + Math.cos(index + geospatialSeed) * 0.3,
      ],
      value: dataset.timeSeries[index % dataset.timeSeries.length]?.value ?? 0,
    }));
  }, [dataset.timeSeries, geospatialSeed]);

  const layers = useMemo(
    () => [
      new HexagonLayer({
        id: `${title}-hex-layer`,
        data: hexData,
        radius: 800,
        elevationScale: 4,
        extruded: true,
        getPosition: (d) => (d as { position: [number, number] }).position,
        getElevation: (d) => (d as { value: number }).value / 100,
        getFillColor: [255, 255, 255, 160],
      }),
    ],
    [hexData, title]
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6 rounded-3xl border border-slate-800/50 bg-slate-900/70 p-6 backdrop-blur"
    >
      <header>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Industry Pod</p>
        <h3 className="text-2xl font-semibold text-white">{title}</h3>
        <div className={`mt-3 h-1 w-16 rounded-full bg-gradient-to-r ${accent}`} />
      </header>
      <section>
        <h4 className="text-sm font-semibold text-slate-200">Overview KPIs</h4>
        <div className="grid gap-4 pt-3 sm:grid-cols-3">
          {dataset.kpis.map((kpi) => (
            <div key={kpi.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
              <p className="text-xs uppercase tracking-wide text-slate-300">{kpi.label}</p>
              <p className="mt-2 text-2xl font-semibold">{Intl.NumberFormat('en-US').format(kpi.value)}</p>
              <p className={`text-xs ${kpi.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {kpi.delta >= 0 ? '+' : ''}
                {kpi.delta.toFixed(1)}% vs last cycle
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
          <h4 className="text-sm font-semibold text-slate-200">Growth Trajectory</h4>
          <div className="h-64 pt-2">
            <ResponsiveContainer>
              <AreaChart data={dataset.timeSeries} onMouseLeave={() => recordEvent('vault_timeseries_hover_end', { title })}>
                <defs>
                  <linearGradient id={`area-${title}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="date" hide />
                <YAxis stroke="#475569" tickFormatter={(value) => Intl.NumberFormat('en', { notation: 'compact' }).format(value)} />
                <Tooltip formatter={(value: number) => Intl.NumberFormat('en-US').format(value)} labelFormatter={(label) => new Date(label).toLocaleDateString()} />
                <Area type="monotone" dataKey="value" stroke="#38bdf8" fill={`url(#area-${title})`} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
          <h4 className="text-sm font-semibold text-slate-200">Risk Radar</h4>
          <div className="h-64 pt-2">
            <ResponsiveContainer>
              <RadarChart data={dataset.scenarios} outerRadius="80%">
                <PolarGrid stroke="#1f2937" />
                <PolarAngleAxis dataKey="label" stroke="#475569" />
                <PolarRadiusAxis angle={30} stroke="#334155" />
                <Radar name="Scenario" dataKey="value" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
          <h4 className="text-sm font-semibold text-slate-200">Diagnostic Anomalies</h4>
          <div className="h-64 pt-2">
            <ResponsiveContainer>
              <BarChart data={dataset.anomalies}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="label" stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis stroke="#475569" tickFormatter={(value) => Intl.NumberFormat('en', { notation: 'compact' }).format(value)} />
                <Tooltip formatter={(value: number) => Intl.NumberFormat('en-US').format(value)} />
                <Legend />
                <Bar dataKey="value" fill="#38bdf8" name="Impact" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/40 p-0 overflow-hidden">
          <DeckGL
            controller={{ dragPan: false, scrollZoom: false }}
            initialViewState={{ longitude: -74, latitude: 40.7, zoom: 10, pitch: 30 }}
            layers={layers}
            style={{ height: '100%', width: '100%' }}
            onViewStateChange={() => recordEvent('pod_viewed', { title })}
          />
        </div>
      </section>
    </motion.article>
  );
}
