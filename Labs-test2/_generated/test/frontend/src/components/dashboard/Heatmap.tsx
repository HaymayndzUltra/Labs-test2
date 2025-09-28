'use client';

interface HeatmapPoint {
  building: string;
  activity_index: number;
}

interface HeatmapProps {
  points: HeatmapPoint[];
}

function intensityClass(value: number): string {
  if (value >= 0.75) return 'bg-emerald-500';
  if (value >= 0.5) return 'bg-emerald-400';
  if (value >= 0.25) return 'bg-emerald-300';
  return 'bg-emerald-200';
}

export function Heatmap({ points }: HeatmapProps) {
  return (
    <div className="rounded-lg border bg-white shadow-sm p-4">
      <h3 className="text-sm font-semibold text-gray-600 mb-3">Resident Activity Index</h3>
      <div className="grid gap-2">
        {points.map((point) => (
          <div key={point.building} className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{point.building}</span>
            <div className="flex items-center gap-2">
              <div className={`h-3 w-16 rounded ${intensityClass(point.activity_index)}`} />
              <span className="font-medium text-gray-700">{Math.round(point.activity_index * 100)}%</span>
            </div>
          </div>
        ))}
        {!points.length && <p className="text-xs text-gray-400">No activity data available.</p>}
      </div>
    </div>
  );
}
