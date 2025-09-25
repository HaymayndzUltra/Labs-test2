const palette = ['#2563eb', '#0ea5e9', '#22c55e', '#f59e0b', '#ec4899', '#8b5cf6'];

interface StackedBarChartProps {
  data: { label: string; value: number }[];
}

export const StackedBarChart = ({ data }: StackedBarChartProps) => {
  const total = data.reduce((sum, datum) => sum + datum.value, 0);

  return (
    <div className="flex h-12 w-full overflow-hidden rounded-full border border-[var(--border-subtle)]">
      {data.map((datum, index) => (
        <div
          key={datum.label}
          style={{
            width: `${(datum.value / total) * 100}%`,
            backgroundColor: palette[index % palette.length]
          }}
          className="flex items-center justify-center text-[12px] font-semibold text-white"
          aria-hidden
        >
          {`${datum.value}%`}
        </div>
      ))}
    </div>
  );
};
