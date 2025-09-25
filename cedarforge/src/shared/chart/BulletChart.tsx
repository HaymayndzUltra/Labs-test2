import { scaleLinear } from '@visx/scale';

export type BulletDatum = {
  title: string;
  measure: number;
  target: number;
  range: [number, number];
};

type Props = {
  data: BulletDatum[];
  width?: number;
  height?: number;
  color?: string;
};

export function BulletChart({ data, width = 640, height = 200, color = 'var(--accent-finops)' }: Props) {
  const margin = { top: 24, right: 24, bottom: 24, left: 160 };
  const innerWidth = width - margin.left - margin.right;
  const rowHeight = (height - margin.top - margin.bottom) / data.length;

  return (
    <svg width={width} height={height} role="img" aria-label="Bullet chart">
      <g transform={`translate(${margin.left},${margin.top})`}>
        {data.map((datum, index) => {
          const y = index * rowHeight;
          const scale = scaleLinear({ domain: [0, datum.range[1]], range: [0, innerWidth] });
          return (
            <g key={datum.title} transform={`translate(0, ${y})`}>
              <rect x={0} y={rowHeight * 0.25} width={scale(datum.range[1])} height={rowHeight * 0.5} fill="var(--surface-2)" rx={12} />
              <rect
                x={0}
                y={rowHeight * 0.35}
                width={scale(datum.measure)}
                height={rowHeight * 0.3}
                fill={color}
                rx={8}
              />
              <line
                x1={scale(datum.target)}
                x2={scale(datum.target)}
                y1={rowHeight * 0.2}
                y2={rowHeight * 0.8}
                stroke="var(--accent-gaming)"
                strokeWidth={2}
              />
              <text x={-16} y={rowHeight * 0.55} fontSize={14} textAnchor="end" fill="var(--text-primary)">
                {datum.title}
              </text>
              <text x={scale(datum.measure) + 12} y={rowHeight * 0.55} fontSize={12} fill="var(--text-secondary)">
                {datum.measure.toFixed(1)} / {datum.target.toFixed(1)}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
