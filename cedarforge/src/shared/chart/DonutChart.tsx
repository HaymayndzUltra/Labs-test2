import { pie, arc } from 'd3-shape';
import { useMemo } from 'react';

export type DonutDatum = {
  label: string;
  value: number;
  color: string;
};

type Props = {
  data: DonutDatum[];
  size?: number;
};

export function DonutChart({ data, size = 240 }: Props) {
  const radius = size / 2;
  const pieGenerator = useMemo(() => pie<DonutDatum>().value((d) => d.value).sort(null), [data]);
  const arcs = pieGenerator(data);
  const arcGenerator = useMemo(() => arc<any>().innerRadius(radius * 0.55).outerRadius(radius), [radius]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Donut chart">
      <g transform={`translate(${radius},${radius})`}>
        {arcs.map((segment) => (
          <g key={segment.data.label}>
            <path d={arcGenerator(segment) ?? ''} fill={segment.data.color} stroke="#0D0F11" strokeWidth={1.5} />
            <text
              transform={`translate(${arcGenerator.centroid(segment)})`}
              dy="0.35em"
              fontSize={12}
              textAnchor="middle"
              fill="var(--text-primary)"
            >
              {Math.round((segment.data.value / data.reduce((sum, item) => sum + item.value, 0)) * 100)}%
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
