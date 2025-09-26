'use client';

import { ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';

export type SparklinePoint = { label: string; value: number };

type SparklineProps = {
  data: SparklinePoint[];
  color?: string;
  height?: number;
  variant?: 'line' | 'area';
};

export function Sparkline({ data, color = 'var(--primary-500)', height = 36, variant = 'line' }: SparklineProps) {
  if (variant === 'area') {
    return (
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="sparkFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor={String(color)} stopOpacity={0.7} />
                <stop offset="95%" stopColor={String(color)} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke={color} fill="url(#sparkFill)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


