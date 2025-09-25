interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <div className={`animate-pulse rounded-lg bg-[var(--color-primary-100)] ${className ?? ''}`} aria-hidden />
);
