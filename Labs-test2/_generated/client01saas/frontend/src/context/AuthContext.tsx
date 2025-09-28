'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';

interface AuthContextValue {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('auth_token');
      if (stored) {
        setToken(stored);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const payload = new URLSearchParams();
    payload.append('username', email);
    payload.append('password', password);
    const { data } = await api.post('/auth/login/access-token', payload, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('auth_token', data.access_token);
    }
    setToken(data.access_token);
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('auth_token');
    }
    setToken(null);
  };

  const value = useMemo<AuthContextValue>(() => ({ token, login, logout }), [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
