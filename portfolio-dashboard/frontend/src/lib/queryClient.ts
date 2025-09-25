export type QueryStatus = 'idle' | 'pending' | 'success' | 'error';

export type QueryState<T> = {
  status: QueryStatus;
  data?: T;
  error?: unknown;
  updatedAt: number;
};

export class SimpleQueryClient {
  private cache = new Map<string, QueryState<unknown>>();

  get<T>(key: string): QueryState<T> | undefined {
    return this.cache.get(key) as QueryState<T> | undefined;
  }

  set<T>(key: string, state: QueryState<T>) {
    this.cache.set(key, state);
  }
}

export function createQueryClient() {
  return new SimpleQueryClient();
}
