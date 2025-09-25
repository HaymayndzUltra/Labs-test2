import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface AccessibleBarChartProps<T> {
  data: T[];
  dataKey: keyof T & string;
  bars: { key: keyof T & string; color: string; name: string }[];
  stacked?: boolean;
}

export function AccessibleBarChart<T extends Record<string, number | string>>({ data, dataKey, bars, stacked }: AccessibleBarChartProps<T>) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} role="img" aria-label="Bar chart with accessible focus">
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
        <XAxis dataKey={dataKey} stroke="var(--text-secondary)" tickLine={false} interval={0} angle={0} height={48} />
        <YAxis stroke="var(--text-secondary)" tickLine={false} width={64} />
        <Tooltip />
        <Legend />
        {bars.map((bar) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            name={bar.name}
            stackId={stacked ? "stack" : undefined}
            fill={bar.color}
            radius={[8, 8, 0, 0]}
            barSize={32}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
