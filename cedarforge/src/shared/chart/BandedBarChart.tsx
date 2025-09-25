import { scaleBand, scaleLinear } from '@visx/scale';
import { Group } from '@visx/group';
import { useMemo } from 'react';

export type BandedBarDatum = {
  category: string;
  value: number;
  target: number;
};

type Props = {
  data: BandedBarDatum[];
  width?: number;
  height?: number;
  color?: string;
  targetColor?: string;
};

export function BandedBarChart({ data, width = 640, height = 280, color = 'var(--accent-logistics)', targetColor = 'var(--line-strong)' }: Props) {
  const margin = { top: 32, right: 24, bottom: 48, left: 56 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = useMemo(
    () =>
      scaleBand({
        domain: data.map((d) => d.category),
        range: [0, innerWidth],
        padding: 0.24
      }),
    [data, innerWidth]
  );

  const yMax = Math.max(...data.map((d) => Math.max(d.value, d.target)));
  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: [0, yMax * 1.1],
        range: [innerHeight, 0],
        nice: true
      }),
    [innerHeight, yMax]
  );

  return (
    <svg width={width} height={height} role="img" aria-label="Banded bar chart">
      <Group top={margin.top} left={margin.left}>
        {data.map((datum) => {
          const x = xScale(datum.category) ?? 0;
          const barHeight = innerHeight - (yScale(datum.value) ?? 0);
          return (
            <Group key={datum.category}>
              <rect
                x={x}
                y={yScale(datum.target)}
                width={xScale.bandwidth()}
                height={innerHeight - (yScale(datum.target) ?? 0)}
                fill={`${targetColor}22`}
                stroke={targetColor}
                strokeWidth={1.5}
                rx={8}
              />
              <rect
                x={x + xScale.bandwidth() * 0.15}
                y={yScale(datum.value)}
                width={xScale.bandwidth() * 0.7}
                height={barHeight}
                fill={color}
                rx={12}
              />
              <text x={x + xScale.bandwidth() / 2} y={innerHeight + 20} fontSize={12} textAnchor="middle" fill="var(--text-secondary)">
                {datum.category}
              </text>
              <text x={x + xScale.bandwidth() / 2} y={yScale(datum.value) - 8} fontSize={12} textAnchor="middle" fill="var(--text-primary)">
                {datum.value.toLocaleString()}
              </text>
            </Group>
          );
        })}
      </Group>
    </svg>
  );
}
