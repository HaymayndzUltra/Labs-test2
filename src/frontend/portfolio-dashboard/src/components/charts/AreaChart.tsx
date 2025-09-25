import { area } from 'd3-shape';
import { scaleLinear, scalePoint } from 'd3-scale';
import { extent } from 'd3-array';
import { ChartFrame } from './ChartFrame';
import { ChartPoint } from '../../data/fixtures';
import { DataTable } from '../primitives/DataTable';

interface AreaChartProps {
  title: string;
  description: string;
  series: ChartPoint[];
  gradientId: string;
  verticalAccent?: string;
}

export function AreaChart({ title, description, series, gradientId, verticalAccent }: AreaChartProps) {
  const xScale = scalePoint()
    .domain(series.map((point) => point.label))
    .range([0, 600]);
  const yExtent = extent(series.map((point) => point.value)) as [number, number];
  const yScale = scaleLinear().domain([0, (yExtent?.[1] ?? 0) * 1.2]).range([200, 0]);
  const areaGenerator = area<ChartPoint>()
    .x((point) => xScale(point.label) ?? 0)
    .y0(200)
    .y1((point) => yScale(point.value));

  return (
    <ChartFrame
      title={title}
      description={description}
      table={<DataTable columns={['Label', 'Value']} rows={series.map((point) => [point.label, point.value.toFixed(1)])} />}
    >
      <svg className="chart-svg" viewBox="0 0 640 240" role="presentation" focusable={false}>
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={verticalAccent ?? 'var(--color-info-500)'} stopOpacity={0.4} />
            <stop offset="100%" stopColor={verticalAccent ?? 'var(--color-info-500)'} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <path d={areaGenerator(series) ?? ''} fill={`url(#${gradientId})`} stroke={verticalAccent ?? 'var(--color-info-500)'} strokeWidth={2} />
      </svg>
    </ChartFrame>
  );
}
