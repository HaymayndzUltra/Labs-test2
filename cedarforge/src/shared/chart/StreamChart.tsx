import { AreaStack, AreaClosed } from '@visx/shape';
import { scaleLinear, scaleTime } from '@visx/scale';
import { stack, stackOffsetWiggle, stackOrderInsideOut } from 'd3-shape';
import { useMemo } from 'react';

export type StreamDatum = {
  date: Date;
  [key: string]: number | Date;
};

type Props = {
  data: StreamDatum[];
  keys: string[];
  palette: string[];
  height?: number;
  width?: number;
};

export function StreamChart({ data, keys, palette, height = 240, width = 640 }: Props) {
  const margin = { top: 32, right: 24, bottom: 36, left: 56 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const stackData = useMemo(() => stack<StreamDatum>().keys(keys).order(stackOrderInsideOut).offset(stackOffsetWiggle)(data), [
    data,
    keys
  ]);

  const xScale = useMemo(
    () =>
      scaleTime({
        domain: [data[0]?.date ?? new Date(), data[data.length - 1]?.date ?? new Date()],
        range: [0, innerWidth]
      }),
    [data, innerWidth]
  );

  const yMax = Math.max(
    ...stackData.flatMap((layer) => layer.map((point) => Math.max(point[0] ?? 0, point[1] ?? 0)))
  );
  const yMin = Math.min(
    ...stackData.flatMap((layer) => layer.map((point) => Math.min(point[0] ?? 0, point[1] ?? 0)))
  );

  const yScale = useMemo(
    () => scaleLinear({ domain: [yMin, yMax], range: [innerHeight, 0] }),
    [innerHeight, yMax, yMin]
  );

  return (
    <svg width={width} height={height} role="img" aria-label="Stream chart">
      <g transform={`translate(${margin.left},${margin.top})`}>
        <AreaStack
          keys={keys}
          data={data}
          x={(d) => xScale(d.date) ?? 0}
          y0={(d) => yScale(d[0]) ?? 0}
          y1={(d) => yScale(d[1]) ?? 0}
          curve={undefined}
        >
          {({ stacks }) =>
            stacks.map((stackLayer, index) => (
              <AreaClosed
                key={stackLayer.key}
                data={stackLayer}
                x={(d) => xScale(d.data.date) ?? 0}
                y0={(d) => yScale(d[0]) ?? 0}
                y1={(d) => yScale(d[1]) ?? 0}
                fill={`${palette[index % palette.length]}99`}
                stroke={palette[index % palette.length]}
                strokeWidth={1.5}
              />
            ))
          }
        </AreaStack>
      </g>
    </svg>
  );
}
