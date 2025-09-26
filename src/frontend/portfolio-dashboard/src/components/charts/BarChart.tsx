import { scaleBand, scaleLinear } from 'd3-scale';
import { ChartPoint } from '../../data/fixtures';
import { ChartFrame } from './ChartFrame';
import { DataTable } from '../primitives/DataTable';

interface BarChartProps {
  title: string;
  description: string;
  series: ChartPoint[];
  palette: string[];
  className?: string;
  size?: '200' | '240' | '320' | '380';
}

export function BarChart({ title, description, series, palette, className, size = '240' }: BarChartProps) {
  const xScale = scaleBand()
    .domain(series.map((point) => point.label))
    .range([0, 640])
    .padding(0.24);
  const yScale = scaleLinear()
    .domain([0, Math.max(...series.map((point) => point.value)) * 1.2])
    .range([240, 0]);

  return (
    <ChartFrame
      title={title}
      description={description}
      className={className}
      size={size}
      table={
        <DataTable
          columns={['Label', 'Value']}
          rows={series.map((point) => [point.label, point.value.toFixed(1)])}
          numericColumns={[1]}
          variant="chart"
        />
      }
    >
      <svg className="chart-svg" viewBox="0 0 640 240" role="presentation" focusable={false}>
        {series.map((point, index) => (
          <rect
            key={point.label}
            x={xScale(point.label)}
            y={yScale(point.value)}
            width={xScale.bandwidth()}
            height={240 - yScale(point.value)}
            fill={palette[index % palette.length]}
            rx={6}
          />
        ))}
      </svg>
    </ChartFrame>
  );
}
