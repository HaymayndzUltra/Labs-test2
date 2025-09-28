'use client';

interface KPICardProps {
  label: string;
  value: number | string;
  description?: string;
}

export function KPICard({ label, value, description }: KPICardProps) {
  return (
    <div className="rounded-lg border bg-white shadow-sm p-4">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-3xl font-semibold text-gray-900 mt-2">{value}</p>
      {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
    </div>
  );
}
