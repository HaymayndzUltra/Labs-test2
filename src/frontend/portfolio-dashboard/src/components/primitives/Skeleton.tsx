import { clsx } from 'clsx';

interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: boolean;
}

export function Skeleton({ width = '100%', height = '1rem', rounded = true }: SkeletonProps) {
  return (
    <div
      className={clsx('skeleton', rounded && 'skeleton--rounded')}
      style={{ width, height }}
      role="status"
      aria-label="Loading"
    />
  );
}
