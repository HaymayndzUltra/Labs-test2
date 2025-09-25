import KpiCard from "./KpiCard";

interface KpiBandProps {
  accent: string;
  kpis: {
    id: string;
    label: string;
    value: number;
    type: "currency" | "number" | "percent" | "duration";
    delta: number;
    deltaLabel: string;
    timeBasis: string;
  }[];
}

export const KpiBand: React.FC<KpiBandProps> = ({ accent, kpis }) => {
  return (
    <div
      className="kpi-band"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "24px",
        scrollSnapType: "x mandatory",
        overflowX: "auto",
        paddingBottom: "8px"
      }}
    >
      {kpis.map((kpi) => (
        <div key={kpi.id} style={{ scrollSnapAlign: "start" }}>
          <KpiCard
            title={kpi.label}
            value={kpi.value}
            valueType={kpi.type}
            delta={kpi.delta}
            deltaLabel={kpi.deltaLabel}
            timeBasis={kpi.timeBasis}
            accent={accent}
          />
        </div>
      ))}
    </div>
  );
};

export default KpiBand;
