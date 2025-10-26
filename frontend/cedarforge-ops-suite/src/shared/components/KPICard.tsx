import clsx from "classnames";
import { formatCurrency, formatPercent } from "@shared/utils/format";

export type KPIFormat = "currency" | "percent" | "number" | "duration";

export interface KPICardProps {
  title: string;
  value: number;
  delta?: number;
  positiveIsGood?: boolean;
  timeframe?: string;
  format?: KPIFormat;
  sparkline?: number[];
  unit?: string;
  accent?: string;
}

const formatValue = (value: number, format: KPIFormat, unit?: string) => {
  switch (format) {
    case "currency":
      return formatCurrency(value, unit);
    case "percent":
      return formatPercent(value > 1 ? value / 100 : value);
    case "duration":
      return unit === "hours" ? `${value.toFixed(1)} h` : `${value.toFixed(0)} m`;
    default:
      return new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
  }
};

export const KPICard = ({
  title,
  value,
  delta,
  timeframe,
  positiveIsGood = true,
  format = "number",
  sparkline,
  unit,
  accent,
}: KPICardProps) => {
  const isPositive = delta ? delta >= 0 : undefined;
  const trendColor =
    isPositive === undefined
      ? "text-text-muted"
      : isPositive === positiveIsGood
      ? "text-emerald-500"
      : "text-carmine-500";

  const path = sparkline
    ? sparkline
        .map((point, index) => `${index === 0 ? "M" : "L"}${index} ${100 - point}`)
        .join(" ")
    : null;

  return (
    <article
      className="flex flex-col gap-4 rounded-lg border border-line-strong bg-background-card p-6 shadow-elevation1"
      aria-label={title}
    >
      <header className="flex items-center justify-between text-sm font-semibold text-text-secondary">
        <span>{title}</span>
        {timeframe && <span className="text-text-muted">{timeframe}</span>}
      </header>
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-[34px] leading-[40px] font-[750] text-text-primary">
            {formatValue(value, format, unit)}
          </div>
          {typeof delta === "number" && (
            <div
              className={clsx(
                "flex items-center gap-2 text-xs font-semibold",
                trendColor
              )}
            >
              <span>{delta > 0 ? "▲" : delta < 0 ? "▼" : "■"}</span>
              <span>{formatPercent(Math.abs(delta))}</span>
              <span className="text-text-muted font-medium">vs previous</span>
            </div>
          )}
        </div>
        {path && (
          <svg
            className="h-16 w-32"
            viewBox={`0 0 ${sparkline?.length ?? 0} 100`}
            role="img"
            aria-label={`${title} trend`}
          >
            <title>{`${title} sparkline`}</title>
            <polyline
              fill="none"
              stroke={accent ?? "var(--accent-finops)"}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              points={sparkline?.map((point, index) => `${index},${100 - point}`).join(" ")}
            />
          </svg>
        )}
      </div>
    </article>
  );
};
