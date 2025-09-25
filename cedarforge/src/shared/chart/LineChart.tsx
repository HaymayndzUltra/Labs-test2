import { useMemo, useState } from 'react';
import { scaleLinear, scaleTime } from '@visx/scale';
import { LinePath, AreaClosed, Bar } from '@visx/shape';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { localPoint } from '@visx/event';
import { bisector } from 'd3-array';
import { format } from 'date-fns';

export type LineChartPoint = {
  date: Date;
  value: number;
};

type LineChartProps = {
  data: LineChartPoint[];
  height?: number;
  color?: string;
  onFocus?: (point: LineChartPoint) => void;
};

const bisectDate = bisector<LineChartPoint, Date>((d) => d.date).left;

export function LineChart({ data, height = 240, color = 'var(--accent-finops)', onFocus }: LineChartProps) {
  const [focusedIndex, setFocusedIndex] = useState(data.length - 1);
  const width = 640;
  const margin = { top: 24, right: 24, bottom: 36, left: 56 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = useMemo(
    () =>
      scaleTime({
        domain: [data[0]?.date ?? new Date(), data[data.length - 1]?.date ?? new Date()],
        range: [0, innerWidth]
      }),
    [data, innerWidth]
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: [0, Math.max(...data.map((d) => d.value)) * 1.1],
        nice: true,
        range: [innerHeight, 0]
      }),
    [data, innerHeight]
  );

  const handlePointer = (event: React.PointerEvent<SVGRectElement>) => {
    const point = localPoint(event);
    if (!point) return;
    const x0 = xScale.invert(point.x - margin.left);
    const index = bisectDate(data, x0, 1);
    const clampedIndex = Math.min(Math.max(index, 0), data.length - 1);
    setFocusedIndex(clampedIndex);
    onFocus?.(data[clampedIndex]);
  };

  return (
    <svg
      width={width}
      height={height}
      role="application"
      aria-label="Line chart"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') {
          setFocusedIndex((index) => Math.min(index + 1, data.length - 1));
        }
        if (event.key === 'ArrowLeft') {
          setFocusedIndex((index) => Math.max(index - 1, 0));
        }
        onFocus?.(data[focusedIndex]);
      }}
    >
      <g transform={`translate(${margin.left},${margin.top})`}>
        <AreaClosed
          data={data}
          x={(d) => xScale(d.date) ?? 0}
          y={(d) => yScale(d.value) ?? 0}
          yScale={yScale}
          fill={`${color}22`}
          stroke="none"
        />
        <LinePath
          data={data}
          x={(d) => xScale(d.date) ?? 0}
          y={(d) => yScale(d.value) ?? 0}
          stroke={color}
          strokeWidth={2}
        />
        <AxisBottom top={innerHeight} scale={xScale} numTicks={4} tickFormat={(value) => format(value as Date, 'MMM d')} />
        <AxisLeft scale={yScale} numTicks={4} />
        <Bar
          x={0}
          y={0}
          width={innerWidth}
          height={innerHeight}
          fill="transparent"
          onPointerMove={handlePointer}
          onPointerDown={handlePointer}
          onPointerUp={() => undefined}
        />
        {data[focusedIndex] && (
          <g transform={`translate(${xScale(data[focusedIndex].date)},${yScale(data[focusedIndex].value)})`}>
            <circle r={6} fill={color} stroke="#0D0F11" strokeWidth={1.5} />
            <rect
              x={8}
              y={-28}
              width={160}
              height={48}
              rx={8}
              ry={8}
              fill="var(--surface-2)"
              stroke="var(--line-strong)"
            />
            <text x={16} y={-8} fontSize={12} fill="var(--text-primary)">
              {format(data[focusedIndex].date, 'MMM d, yyyy')}
            </text>
            <text x={16} y={8} fontSize={12} fill="var(--text-secondary)">
              {data[focusedIndex].value.toLocaleString()}
            </text>
          </g>
        )}
      </g>
    </svg>
  );
}
