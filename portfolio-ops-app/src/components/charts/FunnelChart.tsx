interface FunnelChartProps {
  data: { label: string; value: number }[];
  height?: number;
}

export const FunnelChart = ({ data, height = 320 }: FunnelChartProps) => {
  const width = 320;
  const maxValue = Math.max(...data.map((datum) => datum.value));
  const segmentHeight = height / data.length;

  return (
    <svg role="img" width="100%" height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      {data.map((datum, index) => {
        const topWidth = (datum.value / maxValue) * width;
        const bottomWidth = index < data.length - 1 ? (data[index + 1].value / maxValue) * width : topWidth * 0.6;
        const xOffsetTop = (width - topWidth) / 2;
        const xOffsetBottom = (width - bottomWidth) / 2;
        const yStart = index * segmentHeight;
        const points = [
          `${xOffsetTop},${yStart}`,
          `${xOffsetTop + topWidth},${yStart}`,
          `${xOffsetBottom + bottomWidth},${yStart + segmentHeight}`,
          `${xOffsetBottom},${yStart + segmentHeight}`
        ].join(' ');
        return (
          <g key={datum.label}>
            <polygon points={points} fill={`url(#funnel-${index})`} stroke="var(--border-subtle)" strokeWidth={1} />
            <text
              x={width / 2}
              y={yStart + segmentHeight / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--color-text-primary)"
              fontSize={12}
            >
              {`${datum.label} — ${datum.value.toLocaleString()}`}
            </text>
            <defs>
              <linearGradient id={`funnel-${index}`} x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="var(--color-primary-400)" stopOpacity={0.32} />
                <stop offset="100%" stopColor="var(--color-primary-600)" stopOpacity={0.82} />
              </linearGradient>
            </defs>
          </g>
        );
      })}
    </svg>
  );
};
