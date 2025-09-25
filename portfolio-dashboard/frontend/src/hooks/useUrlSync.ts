import { useEffect } from 'react';
import { useDashboardStore } from '../store/dashboardStore';

export function useUrlSync() {
  const { filters, setFiltersFromUrl } = useDashboardStore((state) => ({
    filters: state.filters,
    setFiltersFromUrl: state.setFiltersFromUrl,
  }));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFiltersFromUrl({
      dateRange: params.get('dateRange') ?? undefined,
      segment: params.get('segment') ?? undefined,
      channel: params.get('channel') ?? undefined,
      tab: (params.get('tab') as typeof filters.vertical | null) ?? undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('dateRange', filters.dateRange);
    params.set('segment', filters.segment);
    params.set('channel', filters.channel);
    params.set('tab', filters.vertical);

    const next = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', next);
  }, [filters]);
}
