import { clsx } from "clsx";

export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

interface StatusChipProps {
  label: string;
  tone?: StatusTone;
  subtle?: boolean;
}

export const StatusChip: React.FC<StatusChipProps> = ({ label, tone = "neutral", subtle }) => {
  const background = subtle ? `var(--${tone}-100)` : `var(--${tone}-200)`;
  const color = subtle ? `var(--${tone}-700)` : `var(--${tone}-800)`;
  return (
    <span
      className={clsx("status-chip", tone)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 12px",
        borderRadius: "999px",
        background,
        color,
        fontSize: "12px",
        fontWeight: 600,
        border: `1px solid var(--${tone}-300)`
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: `var(--${tone}-500)`, boxShadow: `0 0 0 1px var(--${tone}-50)` }} aria-hidden="true" />
      {label}
    </span>
  );
};

export default StatusChip;
