import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

interface AccessibleDonutChartProps<T> {
  data: T[];
  valueKey: keyof T & string;
  nameKey: keyof T & string;
  colors: string[];
}

export function AccessibleDonutChart<T extends Record<string, number | string>>({ data, valueKey, nameKey, colors }: AccessibleDonutChartProps<T>) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart role="img" aria-label="Donut chart with outer labels and focus outlines">
        <Pie
          data={data}
          dataKey={valueKey}
          nameKey={nameKey}
          innerRadius={70}
          outerRadius={110}
          paddingAngle={3}
        >
          {data.map((entry, index) => (
            <Cell
              key={`${String(entry[nameKey])}-${index}`}
              fill={colors[index % colors.length]}
              stroke="var(--surface-s0)"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend layout="vertical" align="right" verticalAlign="middle" />
      </PieChart>
    </ResponsiveContainer>
  );
}
