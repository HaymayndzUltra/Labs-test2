'use client';

import { useMemo } from 'react';
import * as d3 from 'd3';
import type { MetricPoint } from '@/data/syntheticDatasets';

export function TimelineSparkline({ points }: { points: MetricPoint[] }) {
  const path = useMemo(() => {
    if (!points.length) return '';
    const width = 240;
    const height = 60;
    const x = d3
      .scaleLinear()
      .domain([0, points.length - 1])
      .range([0, width]);
    const y = d3
      .scaleLinear()
      .domain(d3.extent(points, (p) => p.value) as [number, number])
      .range([height, 0]);
    const line = d3
      .line<MetricPoint>()
      .x((_, index) => x(index))
      .y((point) => y(point.value))
      .curve(d3.curveCatmullRom.alpha(0.6));
    return line(points);
  }, [points]);

  return (
    <svg viewBox="0 0 240 60" className="h-16 w-full text-sky-400">
      <path d={path ?? ''} fill="none" stroke="currentColor" strokeWidth={2} />
      <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.4} />
        <stop offset="100%" stopColor="#0f172a" stopOpacity={0} />
      </linearGradient>
    </svg>
  );
}
