import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { QueryState, SimpleQueryClient } from './queryClient';

const QueryContext = createContext<SimpleQueryClient | null>(null);

export function QueryClientProvider({ client, children }: { client: SimpleQueryClient; children: React.ReactNode }) {
  return <QueryContext.Provider value={client}>{children}</QueryContext.Provider>;
}

type UseQueryOptions<T> = {
  queryKey: string[];
  queryFn: () => Promise<T>;
  staleTime?: number;
};

type UseQueryResult<T> = {
  data: T | undefined;
  isPending: boolean;
  isError: boolean;
  error: unknown;
};

export function useQuery<T>({ queryKey, queryFn, staleTime = 5 * 60 * 1000 }: UseQueryOptions<T>): UseQueryResult<T> {
  const client = useContext(QueryContext);
  if (!client) {
    throw new Error('useQuery must be used within QueryClientProvider');
  }

  const cacheKey = useMemo(() => JSON.stringify(queryKey), [queryKey]);
  const [state, setState] = useState<QueryState<T>>(() => {
    const cached = client.get<T>(cacheKey);
    if (cached && Date.now() - cached.updatedAt < staleTime) {
      return cached;
    }
    return { status: 'pending', updatedAt: 0 };
  });

  useEffect(() => {
    let cancelled = false;
    const cached = client.get<T>(cacheKey);
    if (cached && Date.now() - cached.updatedAt < staleTime) {
      setState(cached);
      return () => {
        cancelled = true;
      };
    }

    setState({ status: 'pending', updatedAt: Date.now() });
    queryFn()
      .then((data) => {
        if (cancelled) return;
        const successState: QueryState<T> = { status: 'success', data, updatedAt: Date.now() };
        client.set(cacheKey, successState);
        setState(successState);
      })
      .catch((error) => {
        if (cancelled) return;
        const errorState: QueryState<T> = { status: 'error', error, updatedAt: Date.now() };
        client.set(cacheKey, errorState);
        setState(errorState);
      });

    return () => {
      cancelled = true;
    };
  }, [cacheKey, client, queryFn, staleTime]);

  return {
    data: state.data,
    isPending: state.status === 'pending',
    isError: state.status === 'error',
    error: state.error,
  };
}
