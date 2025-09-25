import type { ReactNode } from "react";
import { useState } from "react";
import { DataTable } from "../DataTable";

interface ChartCardProps<T extends Record<string, unknown>> {
  title: string;
  description?: string;
  children: ReactNode;
  data: T[];
  columns: { key: keyof T & string; label: string }[];
  ariaDescription?: string;
}

export function ChartCard<T extends Record<string, unknown>>({
  title,
  description,
  children,
  data,
  columns,
  ariaDescription
}: ChartCardProps<T>) {
  const [showTable, setShowTable] = useState(false);
  return (
    <section
      style={{
        background: "var(--surface-s1)",
        borderRadius: "16px",
        padding: "24px",
        border: "1px solid var(--border-color)",
        boxShadow: "var(--shadow-elevation)",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}
      aria-label={title}
      aria-describedby={ariaDescription ? `${title}-desc` : undefined}
    >
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>{title}</h3>
          {description && (
            <p id={`${title}-desc`} style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--text-secondary)" }}>
              {description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowTable((value) => !value)}
          className="focus-ring"
          style={{
            borderRadius: "999px",
            padding: "8px 16px",
            border: "1px solid var(--border-color)",
            background: "var(--surface-s1)",
            cursor: "pointer"
          }}
        >
          {showTable ? "Show chart" : "Show data table"}
        </button>
      </header>
      <div role="figure" aria-label={`${title} visualization`} style={{ minHeight: "240px" }}>
        {showTable ? (
          <DataTable id={`${title}-table`} columns={columns} data={data} />
        ) : (
          children
        )}
      </div>
    </section>
  );
}
