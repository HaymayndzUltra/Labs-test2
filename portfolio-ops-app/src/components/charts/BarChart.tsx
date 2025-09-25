import { scaleBand, scaleLinear } from '@visx/scale';

interface BarChartProps {
  data: { label: string; value: number }[];
  height?: number;
}

export const BarChart = ({ data, height = 240 }: BarChartProps) => {
  const width = 640;
  const margin = { top: 16, right: 24, bottom: 16, left: 140 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const yScale = scaleBand({
    range: [0, yMax],
    domain: data.map((d) => d.label),
    padding: 0.2
  });
  const xScale = scaleLinear({
    range: [0, xMax],
    domain: [0, Math.max(...data.map((d) => d.value)) * 1.2]
  });

  return (
    <svg role="img" width="100%" height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {data.map((datum) => {
          const yPoint = yScale(datum.label) ?? 0;
          const barWidth = xScale(datum.value);
          return (
            <g key={datum.label}>
              <rect
                x={0}
                y={yPoint}
                width={barWidth}
                height={yScale.bandwidth()}
                rx={8}
                fill="var(--color-primary-500)"
              />
              <text
                x={-16}
                y={yPoint + yScale.bandwidth() / 2}
                textAnchor="end"
                dominantBaseline="middle"
                fill="var(--color-text-secondary)"
                fontSize={12}
              >
                {datum.label}
              </text>
              <text
                x={barWidth + 8}
                y={yPoint + yScale.bandwidth() / 2}
                textAnchor="start"
                dominantBaseline="middle"
                fill="var(--color-text-muted)"
                fontSize={12}
                className="font-mono"
              >
                {datum.value.toLocaleString()}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};
