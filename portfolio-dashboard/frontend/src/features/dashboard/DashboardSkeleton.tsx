export function DashboardSkeleton() {
  return (
    <div className="grid-12">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="surface-card"
          style={{ height: 220, animation: 'pulse 1.5s ease-in-out infinite', opacity: 0.6 }}
        />
      ))}
    </div>
  );
}
