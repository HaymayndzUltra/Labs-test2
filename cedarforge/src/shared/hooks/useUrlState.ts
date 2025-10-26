import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import qs from 'qs';

export function useUrlState<T extends Record<string, string>>(defaults: T): [T, (next: T) => void] {
  const location = useLocation();
  const navigate = useNavigate();

  const params = qs.parse(location.search, { ignoreQueryPrefix: true }) as Partial<T>;
  const state = { ...defaults, ...params } as T;

  const setState = useCallback(
    (next: T) => {
      const search = qs.stringify(next, { addQueryPrefix: true });
      navigate({ pathname: location.pathname, search }, { replace: true });
    },
    [location.pathname, navigate]
  );

  return [state, setState];
}
