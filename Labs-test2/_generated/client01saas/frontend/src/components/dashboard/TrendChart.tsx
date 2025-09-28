'use client';

interface Point {
  period: string;
  value: number;
}

interface TrendChartProps {
  title: string;
  points: Point[];
  color?: string;
}

export function TrendChart({ title, points, color = '#2563eb' }: TrendChartProps) {
  const safePoints = points?.length ? points : [];
  const values = safePoints.map((p) => p.value);
  const max = values.length ? Math.max(...values) : 1;
  const min = values.length ? Math.min(...values) : 0;
  const normalized = safePoints.map((point, idx) => ({
    x: (idx / Math.max(safePoints.length - 1, 1)) * 100,
    y: 100 - ((point.value - min) / Math.max(max - min || 1, 1)) * 100,
    label: new Date(point.period).toLocaleString(undefined, {
      month: 'short',
      year: 'numeric',
    }),
    value: point.value,
  }));

  return (
    <div className="rounded-lg border bg-white shadow-sm p-4">
      <h3 className="text-sm font-semibold text-gray-600 mb-3">{title}</h3>
      <div className="h-48">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <polyline
            fill="none"
            stroke={color}
            strokeWidth={2}
            points={normalized.map((p) => `${p.x},${p.y}`).join(' ')}
          />
        </svg>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500">
        {normalized.map((point) => (
          <div key={point.label} className="flex justify-between">
            <span>{point.label}</span>
            <span className="font-medium text-gray-700">{point.value.toFixed(0)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
