import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TableColumn, TableRow, DataTable } from '../table/DataTable';
import type { ChartPoint } from '../../data/types';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export type ChartSeries = {
  key: keyof ChartPoint;
  label: string;
  color?: string;
  type?: 'line' | 'bar' | 'area';
};

export type ChartCardProps = {
  id: string;
  title: string;
  description?: string;
  type: 'line' | 'area' | 'bar' | 'donut';
  data: ChartPoint[];
  height?: number;
  series?: ChartSeries[];
  table?: {
    columns: TableColumn[];
    rows: TableRow[];
  };
};

const palette = [
  'var(--chart-palette-1)',
  'var(--chart-palette-2)',
  'var(--chart-palette-3)',
  'var(--chart-palette-4)',
  'var(--chart-palette-5)',
  'var(--chart-palette-6)',
  'var(--chart-palette-7)',
  'var(--chart-palette-8)',
];

export function ChartCard({ id, title, description, type, data, series, height = 260, table }: ChartCardProps) {
  const [showTable, setShowTable] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const resolvedSeries = useMemo(() => {
    if (series && series.length > 0) {
      return series.map((s, index) => ({ color: palette[index % palette.length], type: s.type ?? type, ...s }));
    }
    if (type === 'donut') {
      return data.map((point, index) => ({
        key: 'value' as const,
        label: point.label,
        color: palette[index % palette.length],
        type: 'area' as const,
      }));
    }
    return [
      {
        key: 'value' as const,
        label: title,
        color: palette[0],
        type,
      },
    ];
  }, [data, series, title, type]);

  const accessibleTable = useMemo(() => {
    if (table) return table;
    const columns: TableColumn[] = [
      { key: 'label', label: 'Label' },
      { key: 'value', label: 'Primary', numeric: true },
    ];
    if (data.some((point) => point.secondary != null)) {
      columns.push({ key: 'secondary', label: 'Secondary', numeric: true });
    }
    if (data.some((point) => point.tertiary != null)) {
      columns.push({ key: 'tertiary', label: 'Tertiary', numeric: true });
    }
    return {
      columns,
      rows: data.map<TableRow>((point) => ({
        label: point.label,
        value: point.value,
        secondary: point.secondary ?? '',
        tertiary: point.tertiary ?? '',
      })),
    };
  }, [data, table]);

  const mobileData = useMemo(() => {
    if (type !== 'donut' || !isMobile) return data;
    return [...data].sort((a, b) => b.value - a.value);
  }, [data, isMobile, type]);

  const chartBody = useMemo(() => {
    if (type === 'line') {
      return (
        <LineChart data={data} margin={{ top: 16, right: 16, left: 16, bottom: 0 }}>
          <CartesianGrid stroke="var(--surface-border)" strokeDasharray="4 4" />
          <XAxis dataKey="label" stroke="var(--neutral-400)" />
          <YAxis stroke="var(--neutral-400)" />
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--surface-border)', fontSize: 12 }} />
          <Legend />
          {resolvedSeries.map((serie) => (
            <Line
              key={String(serie.key)}
              type="monotone"
              dataKey={serie.key as string}
              name={serie.label}
              stroke={serie.color}
              strokeWidth={3}
              dot={false}
              isAnimationActive
            />
          ))}
        </LineChart>
      );
    }

    if (type === 'area') {
      return (
        <AreaChart data={data} margin={{ top: 16, right: 16, left: 16, bottom: 0 }}>
          <defs>
            {resolvedSeries.map((serie) => (
              <linearGradient key={String(serie.key)} id={`${id}-${String(serie.key)}-fill`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={serie.color} stopOpacity={0.7} />
                <stop offset="95%" stopColor={serie.color} stopOpacity={0.1} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid stroke="var(--surface-border)" strokeDasharray="4 4" />
          <XAxis dataKey="label" stroke="var(--neutral-400)" />
          <YAxis stroke="var(--neutral-400)" />
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--surface-border)', fontSize: 12 }} />
          <Legend />
          {resolvedSeries.map((serie) => (
            <Area
              key={String(serie.key)}
              type="monotone"
              dataKey={serie.key as string}
              name={serie.label}
              stroke={serie.color}
              fill={`url(#${id}-${String(serie.key)}-fill)`}
              fillOpacity={1}
              isAnimationActive
            />
          ))}
        </AreaChart>
      );
    }

    if (type === 'bar' || (type === 'donut' && isMobile)) {
      return (
        <BarChart data={mobileData} margin={{ top: 16, right: 16, left: 16, bottom: 0 }}>
          <CartesianGrid stroke="var(--surface-border)" strokeDasharray="4 4" />
          <XAxis dataKey="label" stroke="var(--neutral-400)" />
          <YAxis stroke="var(--neutral-400)" />
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--surface-border)', fontSize: 12 }} />
          <Legend />
          {resolvedSeries.map((serie) => (
            <Bar key={String(serie.key)} dataKey={serie.key as string} name={serie.label} fill={serie.color} radius={8} />
          ))}
        </BarChart>
      );
    }

    return (
      <PieChart>
        <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius="55%" outerRadius="80%" paddingAngle={4}>
          {data.map((entry, index) => (
            <Cell key={entry.label} fill={palette[index % palette.length]} stroke="var(--surface-s0)" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--surface-border)', fontSize: 12 }} />
      </PieChart>
    );
  }, [data, id, isMobile, mobileData, resolvedSeries, type]);

  return (
    <section
      className="surface-card chart-card"
      role="group"
      aria-labelledby={`${id}-title`}
      id={`${id}-chart`}
      style={{ gap: 'var(--space-2)' }}
    >
      <header className="chart-card__header">
        <div>
          <h3 id={`${id}-title`} style={{ margin: 0, fontSize: 'var(--font-h3-size)', fontWeight: 'var(--font-h3-weight)' }}>
            {title}
          </h3>
          {description ? <p style={{ margin: 0, color: 'var(--neutral-500)', fontSize: 13 }}>{description}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => setShowTable((prev) => !prev)}
          aria-expanded={showTable}
          aria-controls={`${id}-table`}
          style={{
            borderRadius: 999,
            padding: '8px 14px',
            border: '1px solid var(--surface-border)',
            background: 'var(--surface-s1)',
            fontWeight: 600,
          }}
        >
          {showTable ? 'Hide data table' : 'Show data table'}
        </button>
      </header>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>{chartBody}</ResponsiveContainer>
      </div>
      {showTable ? (
        <div id={`${id}-table`}>
          <DataTable id={`${id}-datatable`} caption={`${title} data table`} columns={accessibleTable.columns} rows={accessibleTable.rows} />
        </div>
      ) : null}
    </section>
  );
}
