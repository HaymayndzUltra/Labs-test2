import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import { extent } from 'd3-array';

interface SparklineProps {
  values: number[];
  accent?: string;
}

const WIDTH = 120;
const HEIGHT = 48;

export function Sparkline({ values, accent = 'var(--color-primary-500)' }: SparklineProps) {
  if (values.length === 0) {
    return null;
  }

  const xScale = scaleLinear().domain([0, values.length - 1]).range([0, WIDTH]);
  const [min, max] = extent(values) as [number, number];
  const yScale = scaleLinear().domain([min * 0.9, max * 1.1]).range([HEIGHT, 0]);
  const lineGenerator = line<number>()
    .x((_, index) => xScale(index))
    .y((value) => yScale(value));

  return (
    <svg className="sparkline" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="presentation" focusable={false}>
      <path d={lineGenerator(values) ?? ''} fill="none" stroke={accent} strokeWidth={2} strokeLinecap="round" />
      <circle cx={xScale(values.length - 1)} cy={yScale(values[values.length - 1])} r={3} fill={accent} />
    </svg>
  );
}
