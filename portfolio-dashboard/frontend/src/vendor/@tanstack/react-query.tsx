'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

type QueryKey = readonly unknown[];

type Listener = (value: unknown) => void;

type SubscribeFn = (listener: Listener) => () => void;

type Updater<T> = T | ((previous: T | undefined) => T);

export type QueryFunction<T> = () => Promise<T>;

export type UseQueryOptions<T> = {
  queryKey: QueryKey;
  queryFn: QueryFunction<T>;
  initialData?: T;
};

export type UseQueryResult<T> = {
  data: T | undefined;
  isLoading: boolean;
  error: unknown;
};

export class QueryClient {
  private cache = new Map<string, unknown>();
  private listeners = new Map<string, Set<Listener>>();

  private serialize(key: QueryKey) {
    return JSON.stringify(key);
  }

  getQueryData<T>(queryKey: QueryKey): T | undefined {
    return this.cache.get(this.serialize(queryKey)) as T | undefined;
  }

  setQueryData<T>(queryKey: QueryKey, value: Updater<T>): T {
    const key = this.serialize(queryKey);
    const previous = this.cache.get(key) as T | undefined;
    const next = typeof value === 'function' ? (value as (arg: T | undefined) => T)(previous) : value;
    this.cache.set(key, next);
    const listeners = this.listeners.get(key);
    if (listeners) {
      listeners.forEach((listener) => listener(next));
    }
    return next;
  }

  subscribe(queryKey: QueryKey, listener: Listener): () => void {
    const key = this.serialize(queryKey);
    let listeners = this.listeners.get(key);
    if (!listeners) {
      listeners = new Set();
      this.listeners.set(key, listeners);
    }
    listeners.add(listener);
    return () => {
      listeners?.delete(listener);
      if (listeners && listeners.size === 0) {
        this.listeners.delete(key);
      }
    };
  }
}

const QueryClientContext = createContext<QueryClient | null>(null);

export function QueryClientProvider({ client, children }: { client: QueryClient; children: React.ReactNode }) {
  const value = useMemo(() => client, [client]);
  return <QueryClientContext.Provider value={value}>{children}</QueryClientContext.Provider>;
}

export function useQueryClient() {
  const context = useContext(QueryClientContext);
  if (!context) {
    throw new Error('useQueryClient must be used within QueryClientProvider');
  }
  return context;
}

export function useQuery<T>({ queryKey, queryFn, initialData }: UseQueryOptions<T>): UseQueryResult<T> {
  const client = useQueryClient();
  const keyRef = useRef<QueryKey>(queryKey);
  keyRef.current = queryKey;

  const [state, setState] = useState<{ data: T | undefined; error: unknown; isLoading: boolean }>(() => {
    const cached = client.getQueryData<T>(queryKey);
    if (cached !== undefined) {
      return { data: cached, error: null, isLoading: false };
    }
    if (initialData !== undefined) {
      client.setQueryData(queryKey, initialData);
      return { data: initialData, error: null, isLoading: false };
    }
    return { data: undefined, error: null, isLoading: true };
  });

  useEffect(() => {
    const unsubscribe = client.subscribe(queryKey, (value) => {
      setState({ data: value as T, error: null, isLoading: false });
    });

    let cancelled = false;
    const run = async () => {
      try {
        const result = await queryFn();
        if (cancelled) return;
        client.setQueryData(queryKey, result);
        setState({ data: result, error: null, isLoading: false });
      } catch (error) {
        if (cancelled) return;
        setState((prev) => ({ ...prev, error, isLoading: false }));
      }
    };

    if (state.isLoading) {
      run();
    }

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [client, queryFn, queryKey, state.isLoading]);

  return state;
}
