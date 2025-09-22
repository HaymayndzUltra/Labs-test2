import { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from 'axios';

import { api, apiHelpers } from './api';

describe('api client', () => {
  let originalAdapter: AxiosAdapter | undefined;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    originalAdapter = api.defaults.adapter;
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    api.defaults.adapter = originalAdapter;
    localStorage.clear();
    consoleErrorSpy.mockRestore();
  });

  it('attaches bearer token from localStorage to outgoing requests', async () => {
    const requestSpy = jest.fn(async (config: AxiosRequestConfig) => {
      const mockResponse: AxiosResponse<{ ok: boolean }> = {
        data: { ok: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
      return mockResponse;
    });
    api.defaults.adapter = requestSpy;

    localStorage.setItem('auth_token', 'token-123');

    const response = await apiHelpers.get<{ ok: boolean }>('/resource');

    expect(requestSpy).toHaveBeenCalledTimes(1);
    const config = requestSpy.mock.calls[0][0];
    expect(config.headers?.Authorization).toBe('Bearer token-123');
    expect(response.data.ok).toBe(true);
  });

  it('clears the token and redirects to login on 401 responses', async () => {
    api.defaults.adapter = jest.fn(async () => {
      throw { response: { status: 401 } };
    });

    localStorage.setItem('auth_token', 'token-123');

    await expect(apiHelpers.get('/secure')).rejects.toBeDefined();
    expect(localStorage.getItem('auth_token')).toBeNull();
  });
});
