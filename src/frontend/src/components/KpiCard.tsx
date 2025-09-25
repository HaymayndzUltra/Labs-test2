import { formatCurrency, formatDuration, formatNumber, formatPercent, formatTrend } from "../utils/formatters";
import { clsx } from "clsx";

export interface KpiCardProps {
  title: string;
  value: number;
  valueType?: "currency" | "number" | "percent" | "duration";
  delta?: number;
  deltaLabel?: string;
  timeBasis?: string;
  accent?: string;
  loading?: boolean;
}

const formatValue = (value: number, type: KpiCardProps["valueType"]) => {
  switch (type) {
    case "currency":
      return formatCurrency(value);
    case "duration":
      return formatDuration(value);
    case "percent":
      return formatPercent(value);
    default:
      return formatNumber(value);
  }
};

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  valueType = "number",
  delta,
  deltaLabel,
  timeBasis,
  accent,
  loading
}) => {
  const formattedValue = loading ? "" : formatValue(value, valueType);
  const showDelta = typeof delta === "number";
  const isPositive = (delta ?? 0) >= 0;

  return (
    <article
      className="kpi-card"
      style={{
        background: "var(--surface-s1)",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "var(--shadow-elevation)",
        border: "1px solid var(--border-color)",
        minHeight: "140px",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, color: "var(--text-secondary)", fontSize: "14px", fontWeight: 600 }}>{title}</h3>
        {accent && <span style={{ width: 12, height: 12, borderRadius: "50%", background: accent }} aria-hidden="true" />}
      </div>
      {loading ? (
        <div role="status" aria-live="polite" aria-label={`Loading ${title}`} className="skeleton" />
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "12px",
            fontFeatureSettings: "'tnum' 1, 'lnum' 1"
          }}
        >
          <span style={{ fontSize: "32px", lineHeight: "36px", fontWeight: 700 }}>{formattedValue}</span>
          {showDelta && (
            <span
              className={clsx("delta", isPositive ? "positive" : "negative")}
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: isPositive ? "var(--success-500)" : "var(--danger-500)"
              }}
              aria-label={deltaLabel}
            >
              {formatTrend(delta!)}
            </span>
          )}
        </div>
      )}
      {timeBasis && (
        <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "12px" }}>{timeBasis}</p>
      )}
    </article>
  );
};

export default KpiCard;
