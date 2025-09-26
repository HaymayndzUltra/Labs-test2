import { pie, arc } from 'd3-shape';
import { ChartPoint } from '../../data/fixtures';
import { ChartFrame } from './ChartFrame';
import { DataTable } from '../primitives/DataTable';

interface DonutChartProps {
  title: string;
  description: string;
  series: ChartPoint[];
  palette: string[];
  className?: string;
  size?: '200' | '240' | '320' | '380';
}

export function DonutChart({ title, description, series, palette, className, size = '240' }: DonutChartProps) {
  const pieGenerator = pie<ChartPoint>().value((point) => point.value);
  const arcs = pieGenerator(series);
  const arcGenerator = arc<typeof arcs[number]>().innerRadius(60).outerRadius(110).padAngle(0.02);

  return (
    <ChartFrame
      title={title}
      description={description}
      className={className}
      size={size}
      table={
        <DataTable
          columns={['Label', 'Value', 'Share']}
          rows={series.map((point) => [
            point.label,
            point.value.toFixed(1),
            `${((point.value / series.reduce((sum, entry) => sum + entry.value, 0)) * 100).toFixed(1)}%`
          ])}
          numericColumns={[1, 2]}
          variant="chart"
        />
      }
      legend={
        <div className="chart-legend">
          {series.map((point, index) => (
            <span className="chart-legend__item" key={point.label}>
              <span className="chart-legend__swatch" style={{ background: palette[index % palette.length] }} />
              {point.label}
            </span>
          ))}
        </div>
      }
    >
      <svg className="chart-svg" viewBox="0 0 240 240" role="presentation" focusable={false}>
        <g transform="translate(120,120)">
          {arcs.map((segment, index) => (
            <path
              key={segment.data.label}
              d={arcGenerator(segment) ?? undefined}
              fill={palette[index % palette.length]}
              stroke="var(--surface-S1)"
              strokeWidth={2}
            />
          ))}
        </g>
      </svg>
    </ChartFrame>
  );
}
