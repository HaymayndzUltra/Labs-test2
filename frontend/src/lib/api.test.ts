import { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from 'axios';

import * as apiModule from './api';

const { api, apiHelpers } = apiModule;

describe('api client', () => {
  let originalAdapter: AxiosAdapter | undefined;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    originalAdapter = api.defaults.adapter;
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
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

  it('attaches tenant context header when available', async () => {
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

    localStorage.setItem('active_tenant_id', 'tenant-42');

    await apiHelpers.get('/resource');

    const config = requestSpy.mock.calls[0][0];
    expect(config.headers?.['X-Tenant-ID']).toBe('tenant-42');
  });

  it('clears session storage and redirects to login on 401 responses', async () => {
    api.defaults.adapter = jest.fn(async () => {
      throw { response: { status: 401 } };
    });

    localStorage.setItem('auth_token', 'token-123');
    localStorage.setItem('active_tenant_id', 'tenant-42');
    localStorage.setItem('tenant_role', 'admin');

    await expect(apiHelpers.get('/secure')).rejects.toBeDefined();
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('active_tenant_id')).toBeNull();
    expect(localStorage.getItem('tenant_role')).toBeNull();
  });

  it('hydrates session storage from login responses', async () => {
    api.defaults.adapter = jest.fn(async (config: AxiosRequestConfig) => {
      const mockResponse: AxiosResponse<{ access_token: string; tenant_id: number; tenant_role: string }> = {
        data: { access_token: 'abc', tenant_id: 77, tenant_role: 'member' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
      return mockResponse;
    });

    await apiHelpers.post('/login/access-token', { username: 'user', password: 'pass' });

    expect(localStorage.getItem('auth_token')).toBe('abc');
    expect(localStorage.getItem('active_tenant_id')).toBe('77');
    expect(localStorage.getItem('tenant_role')).toBe('member');
  });
});
