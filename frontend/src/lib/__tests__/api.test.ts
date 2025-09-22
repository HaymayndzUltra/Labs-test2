import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

describe('api interceptors', () => {
  beforeEach(() => {
    (jest.requireMock('next/headers').cookies as jest.Mock).mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const withIsolatedApi = async <T>(
    callback: (module: typeof import('../api')) => Promise<T> | T
  ) => {
    let result: Promise<T> | T | undefined;

    jest.isolateModules(() => {
      const module = require('../api') as typeof import('../api');
      result = callback(module);
    });

    return await result!;
  };

  it('applies an injected token resolver for SSR-safe usage', async () => {
    await withIsolatedApi(async ({ api, setTokenResolver }) => {
      setTokenResolver(() => 'injected-token');

      const requestInterceptor = api.interceptors.request.handlers[0]?.fulfilled;
      expect(requestInterceptor).toBeDefined();

      const config = { headers: {} } as InternalAxiosRequestConfig;
      const updatedConfig = requestInterceptor!(config);

      expect(updatedConfig.headers?.Authorization).toBe('Bearer injected-token');
    });
  });

  it('falls back to cookie tokens when running without window', async () => {
    const cookiesMock = jest.requireMock('next/headers').cookies as jest.Mock;
    const originalWindow = (globalThis as any).window;
    (globalThis as any).window = undefined;

    cookiesMock.mockReturnValue({
      get: (name: string) =>
        name === 'auth_token' ? { value: 'cookie-token' } : undefined,
    });

    try {
      await withIsolatedApi(async ({ api, setTokenResolver }) => {
        setTokenResolver(() => {
          const store = cookiesMock();
          return store?.get('auth_token')?.value ?? null;
        });

        const requestInterceptor = api.interceptors.request.handlers[0]?.fulfilled;
        expect(requestInterceptor).toBeDefined();
        const config = { headers: {} } as InternalAxiosRequestConfig;
        const updatedConfig = requestInterceptor!(config);

        expect(cookiesMock).toHaveBeenCalled();
        expect(updatedConfig.headers?.Authorization).toBe('Bearer cookie-token');
      });
    } finally {
      (globalThis as any).window = originalWindow;
    }
  });

  it('invokes custom unauthorized handler on 401 responses', async () => {
    await withIsolatedApi(async ({ api, setUnauthorizedHandler }) => {
      const handler = jest.fn();
      setUnauthorizedHandler(handler);

      const responseInterceptor = api.interceptors.response.handlers[0]?.rejected;
      expect(responseInterceptor).toBeDefined();

      const error = {
        response: { status: 401 },
      } as AxiosError;

      await expect(responseInterceptor!(error)).rejects.toBe(error);
      expect(handler).toHaveBeenCalledWith(error);
    });
  });
});
