import { Group } from '@visx/group';
import { Arc } from '@visx/shape';

interface DonutDatum {
  label: string;
  value: number;
  color?: string;
}

interface DonutChartProps {
  data: DonutDatum[];
  height?: number;
}

const palette = ['#2563eb', '#06b6d4', '#22c55e', '#f97316', '#ef4444', '#7c3aed'];

export const DonutChart = ({ data, height = 240 }: DonutChartProps) => {
  const width = 320;
  const radius = Math.min(width, height) / 2 - 12;
  const total = data.reduce((sum, datum) => sum + datum.value, 0);

  return (
    <svg role="img" width="100%" height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <Group top={height / 2} left={width / 2}>
        <Arc
          data={data}
          innerRadius={radius * 0.55}
          outerRadius={radius}
          cornerRadius={8}
          padAngle={0.02}
        >
          {({ arcs, path }) =>
            arcs.map((arcDatum, index) => {
              const angle = (arcDatum.startAngle + arcDatum.endAngle) / 2;
              const [labelX, labelY] = [
                Math.cos(angle) * (radius + 18),
                Math.sin(angle) * (radius + 18)
              ];
              return (
                <g key={`arc-${arcDatum.data.label}`}>
                  <path
                    d={path(arcDatum) ?? ''}
                    fill={arcDatum.data.color ?? palette[index % palette.length]}
                    stroke="var(--border-subtle)"
                    strokeWidth={1}
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor={labelX > 0 ? 'start' : 'end'}
                    dominantBaseline="middle"
                    fill="var(--color-text-secondary)"
                    fontSize={12}
                  >
                    {`${arcDatum.data.label} — ${((arcDatum.data.value / total) * 100).toFixed(1)}%`}
                  </text>
                </g>
              );
            })
          }
        </Arc>
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          className="font-semibold text-[16px]"
          fill="var(--color-text-primary)"
        >
          {total.toLocaleString()}
        </text>
      </Group>
    </svg>
  );
};
