import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { filterToQuery, queryToFilter, useFilterStore } from '../state/filterStore';

export const useFilterSync = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, hydrate } = useFilterStore((state) => ({
    filters: state.filters,
    hydrate: state.hydrate
  }));

  useEffect(() => {
    const params = queryToFilter(searchParams);
    hydrate(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const next = filterToQuery(filters);
    setSearchParams(next, { replace: true });
  }, [filters, setSearchParams]);
};
