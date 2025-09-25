import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface AccessibleLineChartProps<T> {
  data: T[];
  dataKey: keyof T & string;
  lines: { key: keyof T & string; color: string; name: string }[];
}

export function AccessibleLineChart<T extends Record<string, number | string>>({ data, dataKey, lines }: AccessibleLineChartProps<T>) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} role="img" aria-label="Trend line chart with keyboard support">
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
        <XAxis dataKey={dataKey} stroke="var(--text-secondary)" tickLine={false} />
        <YAxis stroke="var(--text-secondary)" tickLine={false} width={64} />
        <Tooltip cursor={{ strokeDasharray: "4 4" }} />
        <Legend />
        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.color}
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name={line.name}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
