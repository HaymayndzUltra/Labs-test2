import { AreaClosed, LinePath } from '@visx/shape';
import { scaleLinear, scalePoint } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridRows } from '@visx/grid';

interface LineSeriesChartProps {
  data: { date: string; value: number; comparison?: number }[];
  height?: number;
}

export const LineSeriesChart = ({ data, height = 240 }: LineSeriesChartProps) => {
  const width = 640;
  const margin = { top: 12, right: 12, bottom: 32, left: 56 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const xScale = scalePoint({
    range: [0, xMax],
    domain: data.map((point) => point.date)
  });

  const maxValue = Math.max(...data.map((point) => Math.max(point.value, point.comparison ?? point.value)));

  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [0, maxValue * 1.1]
  });

  return (
    <svg role="img" width="100%" height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <GridRows
          scale={yScale}
          width={xMax}
          stroke="rgba(148, 163, 184, 0.24)"
          pointerEvents="none"
        />
        <AreaClosed
          data={data}
          x={(d) => (xScale(d.date) ?? 0)}
          y={(d) => yScale(d.value)}
          yScale={yScale}
          stroke="none"
          fill="url(#primary-gradient)"
        />
        <LinePath
          data={data}
          x={(d) => (xScale(d.date) ?? 0)}
          y={(d) => yScale(d.value)}
          stroke="var(--color-primary-500)"
          strokeWidth={3}
        />
        {data.some((point) => point.comparison) ? (
          <LinePath
            data={data}
            x={(d) => (xScale(d.date) ?? 0)}
            y={(d) => yScale(d.comparison ?? 0)}
            stroke="var(--color-info-500)"
            strokeDasharray="6 4"
            strokeWidth={2}
          />
        ) : null}
        <AxisLeft
          scale={yScale}
          stroke="var(--color-text-muted)"
          tickStroke="var(--color-text-muted)"
          tickLabelProps={() => ({
            fill: 'var(--color-text-muted)',
            fontSize: 12,
            fontFamily: 'Roboto Mono, monospace',
            dy: '0.33em'
          })}
        />
        <AxisBottom
          top={yMax}
          scale={xScale}
          stroke="var(--color-text-muted)"
          tickStroke="var(--color-text-muted)"
          tickLabelProps={() => ({
            fill: 'var(--color-text-muted)',
            fontSize: 12,
            fontFamily: 'Roboto Mono, monospace',
            dy: '0.25em'
          })}
        />
      </g>
      <defs>
        <linearGradient id="primary-gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--color-primary-400)" stopOpacity={0.32} />
          <stop offset="100%" stopColor="var(--color-primary-100)" stopOpacity={0} />
        </linearGradient>
      </defs>
    </svg>
  );
};
