import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface AccessibleAreaChartProps<T> {
  data: T[];
  dataKey: keyof T & string;
  areas: { key: keyof T & string; color: string; name: string; opacity?: number }[];
}

export function AccessibleAreaChart<T extends Record<string, number | string>>({ data, dataKey, areas }: AccessibleAreaChartProps<T>) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} role="img" aria-label="Area chart with saturation cues">
        <defs>
          {areas.map((area) => (
            <linearGradient key={area.key} id={`${area.key}-gradient`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={area.color} stopOpacity={area.opacity ?? 0.6} />
              <stop offset="100%" stopColor={area.color} stopOpacity={0.05} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
        <XAxis dataKey={dataKey} stroke="var(--text-secondary)" tickLine={false} />
        <YAxis stroke="var(--text-secondary)" tickLine={false} width={64} />
        <Tooltip />
        <Legend />
        {areas.map((area) => (
          <Area
            key={area.key}
            type="monotone"
            dataKey={area.key}
            stroke={area.color}
            strokeWidth={3}
            fill={`url(#${area.key}-gradient)`}
            name={area.name}
            activeDot={{ r: 6 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
