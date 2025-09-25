const gradient = ['#ede9fe', '#ddd6fe', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed'];

interface HeatmapStripProps {
  data: { label: string; value: number }[];
}

export const HeatmapStrip = ({ data }: HeatmapStripProps) => {
  const max = Math.max(...data.map((datum) => datum.value));
  return (
    <div className="flex gap-2" role="list">
      {data.map((datum) => {
        const intensity = Math.min(gradient.length - 1, Math.round((datum.value / max) * (gradient.length - 1)));
        return (
          <div key={datum.label} className="flex flex-col items-center gap-1" role="listitem">
            <span
              className="flex h-16 w-10 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[12px] font-semibold text-white"
              style={{ backgroundColor: gradient[intensity] }}
            >
              {datum.value}
            </span>
            <span className="text-[12px] font-semibold text-[var(--color-text-muted)]">{datum.label}</span>
          </div>
        );
      })}
    </div>
  );
};
