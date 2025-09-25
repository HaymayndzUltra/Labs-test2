import { useMemo, useState } from "react";
import { scaleBand, scaleLinear, scaleTime, scaleOrdinal } from "d3-scale";
import { extent, max } from "d3-array";
import clsx from "classnames";
import { Download } from "lucide-react";

interface ChartContainerProps<T> {
  title: string;
  description?: string;
  data: T[];
  height?: number;
  exportFilename?: string;
  renderSvg: (options: {
    focusIndex: number | null;
    setFocusIndex: (index: number | null) => void;
    width: number;
    height: number;
  }) => React.ReactNode;
  renderTable: () => React.ReactNode;
}

const outlineColor = "rgba(13, 15, 17, 0.6)";

const defaultPalette = [
  "#0E5D43",
  "#B66A2B",
  "#0B8F62",
  "#1B66D1",
  "#9F6246",
  "#E39B0F",
];

export const ChartContainer = <T,>({
  title,
  description,
  data,
  height = 280,
  exportFilename = "chart",
  renderSvg,
  renderTable,
}: ChartContainerProps<T>) => {
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const width = 640;

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${exportFilename}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <figure className="space-y-3" aria-labelledby={`${title}-heading`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 id={`${title}-heading`} className="text-[16px] leading-6 font-semibold text-text-primary">
            {title}
          </h3>
          {description && <p className="text-sm text-text-muted">{description}</p>}
        </div>
        <button
          onClick={exportJson}
          className="flex h-9 items-center gap-2 rounded-md border border-line-soft bg-background-card px-3 text-xs font-semibold text-text-primary"
        >
          <Download className="h-4 w-4" aria-hidden /> JSON
        </button>
      </div>
      <div
        className="relative overflow-hidden rounded-lg border border-line-strong bg-background-card"
        role="application"
        aria-roledescription="Interactive chart"
        tabIndex={0}
        onKeyDown={(event) => {
          if (!data.length) return;
          if (event.key === "ArrowRight") {
            event.preventDefault();
            setFocusIndex((prev) => {
              if (prev === null) return 0;
              return Math.min(data.length - 1, prev + 1);
            });
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            setFocusIndex((prev) => {
              if (prev === null) return data.length - 1;
              return Math.max(0, prev - 1);
            });
          }
        }}
      >
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="block"
        >
          <rect x={0} y={0} width="100%" height="100%" fill="transparent" stroke="none" />
          {renderSvg({ focusIndex, setFocusIndex, width, height })}
        </svg>
      </div>
      <div className="rounded-lg border border-line-soft bg-background-raised p-3 text-sm text-text-secondary">
        <p className="font-semibold text-text-primary">Data table</p>
        <div className="mt-2 overflow-auto" role="region" aria-live="polite">
          {renderTable()}
        </div>
      </div>
    </figure>
  );
};

interface LineChartProps<T> {
  data: T[];
  xAccessor: (item: T) => Date;
  yAccessor: (item: T) => number;
  color?: string;
  title: string;
  description?: string;
  height?: number;
}

export const LineChart = <T,>({ data, xAccessor, yAccessor, color = defaultPalette[3], title, description, height = 280 }: LineChartProps<T>) => {
  return (
    <ChartContainer
      title={title}
      description={description}
      data={data}
      height={height}
      exportFilename={title.toLowerCase().replace(/\s+/g, "-")}
      renderSvg={({ focusIndex, setFocusIndex, width, height: innerHeight }) => {
        const margin = { top: 24, right: 32, bottom: 32, left: 56 };
        const domain = extent(data, xAccessor) as [Date, Date];
        const xScale = scaleTime().domain(domain).range([margin.left, width - margin.right]);
        const yDomain = [0, max(data, yAccessor) ?? 0];
        const yScale = scaleLinear().domain(yDomain).nice().range([innerHeight - margin.bottom, margin.top]);

        return (
          <g>
            {data.map((point, index) => {
              const cx = xScale(xAccessor(point));
              const cy = yScale(yAccessor(point));
              const nextPoint = data[index + 1];
              if (!nextPoint) return null;
              const nx = xScale(xAccessor(nextPoint));
              const ny = yScale(yAccessor(nextPoint));
              return (
                <line
                  key={index}
                  x1={cx}
                  y1={cy}
                  x2={nx}
                  y2={ny}
                  stroke={color}
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              );
            })}
            {data.map((point, index) => {
              const cx = xScale(xAccessor(point));
              const cy = yScale(yAccessor(point));
              const isFocused = focusIndex === index;
              return (
                <circle
                  key={`pt-${index}`}
                  cx={cx}
                  cy={cy}
                  r={isFocused ? 6 : 4}
                  fill={color}
                  stroke={outlineColor}
                  strokeWidth={1.5}
                  tabIndex={-1}
                  onFocus={() => setFocusIndex(index)}
                  onMouseEnter={() => setFocusIndex(index)}
                  onMouseLeave={() => setFocusIndex(null)}
                />
              );
            })}
          </g>
        );
      }}
      renderTable={() => (
        <table className="min-w-full text-left text-xs">
          <thead>
            <tr>
              <th className="px-3 py-2 font-semibold text-text-secondary">Time</th>
              <th className="px-3 py-2 font-semibold text-text-secondary text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map((point, index) => (
              <tr key={index} className={clsx(index % 2 === 1 && "bg-background-card/60") }>
                <td className="px-3 py-2">
                  {xAccessor(point).toLocaleString()}
                </td>
                <td className="px-3 py-2 text-right font-mono">
                  {yAccessor(point).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    />
  );
};

interface BarChartProps<T> {
  data: T[];
  xAccessor: (item: T) => string;
  yAccessor: (item: T) => number;
  title: string;
  description?: string;
  height?: number;
  color?: string;
}

export const BarChart = <T,>({ data, xAccessor, yAccessor, title, description, height = 280, color = defaultPalette[1] }: BarChartProps<T>) => {
  return (
    <ChartContainer
      title={title}
      description={description}
      data={data}
      height={height}
      exportFilename={title.toLowerCase().replace(/\s+/g, "-")}
      renderSvg={({ focusIndex, setFocusIndex, width, height: innerHeight }) => {
        const margin = { top: 24, right: 24, bottom: 48, left: 64 };
        const xScale = scaleBand()
          .domain(data.map(xAccessor))
          .range([margin.left, width - margin.right])
          .padding(0.24);
        const values = data.map(yAccessor);
        const domainMin = Math.min(0, ...values);
        const domainMax = Math.max(0, ...values);
        const yScale = scaleLinear()
          .domain([domainMin, domainMax])
          .nice()
          .range([innerHeight - margin.bottom, margin.top]);

        return (
          <g>
            {data.map((item, index) => {
              const x = xScale(xAccessor(item));
              if (x === undefined) return null;
              const value = yAccessor(item);
              const zero = yScale(0);
              const y = yScale(Math.max(value, 0));
              return (
                <rect
                  key={index}
                  x={x}
                  y={value >= 0 ? y : zero}
                  width={xScale.bandwidth()}
                  height={Math.abs(zero - yScale(value))}
                  fill={color}
                  stroke={outlineColor}
                  strokeWidth={1}
                  opacity={focusIndex === index || focusIndex === null ? 0.92 : 0.45}
                  onMouseEnter={() => setFocusIndex(index)}
                  onMouseLeave={() => setFocusIndex(null)}
                />
              );
            })}
          </g>
        );
      }}
      renderTable={() => (
        <table className="min-w-full text-left text-xs">
          <thead>
            <tr>
              <th className="px-3 py-2 font-semibold text-text-secondary">Category</th>
              <th className="px-3 py-2 text-right font-semibold text-text-secondary">Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className={clsx(index % 2 === 1 && "bg-background-card/60")}>
                <td className="px-3 py-2">{xAccessor(item)}</td>
                <td className="px-3 py-2 text-right font-mono">{yAccessor(item).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    />
  );
};

interface DonutChartProps<T> {
  data: T[];
  valueAccessor: (item: T) => number;
  labelAccessor: (item: T) => string;
  title: string;
  description?: string;
}

export const DonutChart = <T,>({ data, valueAccessor, labelAccessor, title, description }: DonutChartProps<T>) => {
  const total = useMemo(() => data.reduce((sum, item) => sum + valueAccessor(item), 0), [data, valueAccessor]);
  const angles = useMemo(() => {
    let current = -Math.PI / 2;
    return data.map((item) => {
      const value = valueAccessor(item);
      const angle = (value / total) * Math.PI * 2;
      const start = current;
      const end = current + angle;
      current = end;
      return { start, end };
    });
  }, [data, total, valueAccessor]);
  const radius = 120;
  const innerRadius = 70;
  const colors = scaleOrdinal<string, string>()
    .domain(data.map(labelAccessor))
    .range(defaultPalette);

  return (
    <ChartContainer
      title={title}
      description={description}
      data={data}
      exportFilename={title.toLowerCase().replace(/\s+/g, "-")}
      renderSvg={({ focusIndex, setFocusIndex, width, height }) => (
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {data.map((item, index) => {
            const { start, end } = angles[index];
            const largeArc = end - start > Math.PI ? 1 : 0;
            const startX = Math.cos(start) * radius;
            const startY = Math.sin(start) * radius;
            const endX = Math.cos(end) * radius;
            const endY = Math.sin(end) * radius;
            const pathData = [
              `M ${Math.cos(start) * innerRadius} ${Math.sin(start) * innerRadius}`,
              `L ${startX} ${startY}`,
              `A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`,
              `L ${Math.cos(end) * innerRadius} ${Math.sin(end) * innerRadius}`,
              `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${Math.cos(start) * innerRadius} ${Math.sin(start) * innerRadius}`,
              "Z",
            ].join(" ");
            return (
              <path
                key={index}
                d={pathData}
                fill={colors(labelAccessor(item))}
                stroke={outlineColor}
                strokeWidth={focusIndex === index ? 3 : 1.5}
                opacity={focusIndex === null || focusIndex === index ? 0.95 : 0.4}
                onMouseEnter={() => setFocusIndex(index)}
                onMouseLeave={() => setFocusIndex(null)}
              />
            );
          })}
        </g>
      )}
      renderTable={() => (
        <table className="min-w-full text-left text-xs">
          <thead>
            <tr>
              <th className="px-3 py-2 font-semibold text-text-secondary">Segment</th>
              <th className="px-3 py-2 font-semibold text-text-secondary text-right">Value</th>
              <th className="px-3 py-2 font-semibold text-text-secondary text-right">Share</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const value = valueAccessor(item);
              const share = (value / total) * 100;
              return (
                <tr key={index} className={clsx(index % 2 === 1 && "bg-background-card/60")}>
                  <td className="px-3 py-2">{labelAccessor(item)}</td>
                  <td className="px-3 py-2 text-right font-mono">{value.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right font-mono">{share.toFixed(1)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    />
  );
};

interface BulletChartProps {
  title: string;
  ranges: number[];
  measure: number;
  target: number;
  description?: string;
}

export const BulletChart = ({ title, ranges, measure, target, description }: BulletChartProps) => {
  return (
    <ChartContainer
      title={title}
      description={description}
      data={ranges.map((value) => ({ value }))}
      exportFilename={title.toLowerCase().replace(/\s+/g, "-")}
      height={120}
      renderSvg={({ width, height }) => {
        const margin = { top: 32, right: 40, bottom: 32, left: 120 };
        const maxValue = Math.max(...ranges, measure, target);
        const xScale = scaleLinear().domain([0, maxValue]).range([margin.left, width - margin.right]);
        return (
          <g>
            {ranges
              .slice()
              .sort((a, b) => b - a)
              .map((range, index) => (
                <rect
                  key={index}
                  x={margin.left}
                  y={margin.top + index * 18}
                  height={16}
                  width={xScale(range) - margin.left}
                  fill={defaultPalette[index % defaultPalette.length]}
                  opacity={0.2 + index * 0.2}
                />
              ))}
            <rect
              x={margin.left}
              y={margin.top + 20}
              height={24}
              width={xScale(measure) - margin.left}
              fill={defaultPalette[0]}
            />
            <line
              x1={xScale(target)}
              x2={xScale(target)}
              y1={margin.top}
              y2={height - margin.bottom}
              stroke={outlineColor}
              strokeWidth={3}
            />
          </g>
        );
      }}
      renderTable={() => (
        <table className="min-w-full text-left text-xs">
          <tbody>
            <tr>
              <th className="px-3 py-2 text-text-secondary">Measure</th>
              <td className="px-3 py-2 font-mono">{measure.toLocaleString()}</td>
            </tr>
            <tr>
              <th className="px-3 py-2 text-text-secondary">Target</th>
              <td className="px-3 py-2 font-mono">{target.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      )}
    />
  );
};
