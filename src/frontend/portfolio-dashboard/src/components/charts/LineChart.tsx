import { line } from 'd3-shape';
import { scaleLinear, scalePoint } from 'd3-scale';
import { extent } from 'd3-array';
import { ChartFrame } from './ChartFrame';
import { ChartPoint } from '../../data/fixtures';
import { DataTable } from '../primitives/DataTable';

interface LineChartProps {
  title: string;
  description: string;
  series: ChartPoint[];
  tone?: 'primary' | 'vertical';
  verticalAccent?: string;
}

export function LineChart({ title, description, series, tone = 'primary', verticalAccent }: LineChartProps) {
  const xScale = scalePoint()
    .domain(series.map((point) => point.label))
    .range([0, 600]);
  const yExtent = extent(series.map((point) => point.value)) as [number, number];
  const yScale = scaleLinear().domain([0, (yExtent?.[1] ?? 0) * 1.2]).range([200, 0]);
  const pathGenerator = line<ChartPoint>()
    .x((point) => xScale(point.label) ?? 0)
    .y((point) => yScale(point.value));

  const stroke = tone === 'vertical' && verticalAccent ? verticalAccent : 'var(--color-primary-500)';

  return (
    <ChartFrame
      title={title}
      description={description}
      table={<DataTable columns={['Label', 'Value']} rows={series.map((point) => [point.label, point.value.toFixed(1)])} />}
    >
      <svg className="chart-svg" viewBox="0 0 640 240" role="presentation" focusable={false}>
        <path d={pathGenerator(series) ?? ''} fill="none" stroke={stroke} strokeWidth={3} strokeLinecap="round" />
        {series.map((point) => (
          <circle key={point.label} cx={xScale(point.label) ?? 0} cy={yScale(point.value)} r={5} fill={stroke} />
        ))}
      </svg>
    </ChartFrame>
  );
}
