'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as Plot from 'observable-plot';
import { motion } from 'framer-motion';
import type { TimelineEvent } from '../data';

export function ProfileTimeline({ events }: { events: TimelineEvent[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const plots = useMemo(() => {
    return events.map((event) => ({
      year: event.year,
      values: event.kpi.map((value, index) => ({ month: index + 1, value })),
    }));
  }, [events]);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';
    plots.forEach((plot) => {
      const node = Plot.plot({
        width: containerRef.current?.clientWidth ?? 320,
        height: 80,
        margin: 0,
        x: { tickFormat: () => '' },
        y: { tickFormat: () => '' },
        marks: [
          Plot.areaY(plot.values, {
            x: 'month',
            y: 'value',
            fill: 'rgba(96, 165, 250, 0.5)',
            curve: 'catmull-rom',
          }),
        ],
      });
      containerRef.current?.appendChild(node);
    });
  }, [plots]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80 backdrop-blur">
      <h2 className="text-sm uppercase tracking-[0.3em] text-white/50">Interactive timeline</h2>
      <div className="mt-6 space-y-6">
        {events.map((event, index) => (
          <motion.div key={event.year} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{event.year}</p>
                <p className="text-sm text-white/70">{event.milestone}</p>
              </div>
              <span className="text-xs uppercase tracking-[0.3em] text-emerald-200">
                {Math.round(event.kpi.at(-1) ?? 0)} KPI index
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      <div ref={containerRef} className="mt-6 space-y-4" aria-hidden />
    </div>
  );
}
