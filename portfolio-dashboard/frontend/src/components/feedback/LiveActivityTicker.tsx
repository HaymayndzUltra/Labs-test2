import { useDashboardStore } from '../../store/dashboardStore';

export function LiveActivityTicker() {
  const events = useDashboardStore((state) => state.liveEvents.slice(-3).reverse());
  if (events.length === 0) {
    return null;
  }
  return (
    <div
      className="surface-card"
      style={{
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderRadius: '999px',
      }}
      aria-live="polite"
    >
      <span className="badge badge--success">Live</span>
      <ul style={{ display: 'flex', gap: 12, margin: 0, padding: 0, listStyle: 'none', fontSize: 12, color: 'var(--neutral-600)' }}>
        {events.map((event) => (
          <li key={event.id} style={{ whiteSpace: 'nowrap' }}>
            {event.kpi}: {event.delta > 0 ? '+' : ''}
            {event.delta.toFixed(2)}%
          </li>
        ))}
      </ul>
    </div>
  );
}
