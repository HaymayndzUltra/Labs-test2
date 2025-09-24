'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  currency: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard: {
    defaultView: 'analytics' | 'catalog';
    itemsPerPage: number;
    showInsights: boolean;
    autoRefresh: boolean;
    refreshInterval: number; // in minutes
  };
  filters: {
    defaultCategory: string;
    defaultBrands: string[];
    defaultPriceRange: [number, number];
    defaultSort: string;
  };
  analytics: {
    showAdvancedMetrics: boolean;
    chartType: 'line' | 'bar' | 'pie';
    dateRange: '7d' | '30d' | '90d' | '1y';
  };
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  language: 'en',
  currency: 'USD',
  timezone: 'UTC',
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
  dashboard: {
    defaultView: 'catalog',
    itemsPerPage: 20,
    showInsights: true,
    autoRefresh: false,
    refreshInterval: 5,
  },
  filters: {
    defaultCategory: 'all',
    defaultBrands: [],
    defaultPriceRange: [0, 1000],
    defaultSort: 'featured',
  },
  analytics: {
    showAdvancedMetrics: false,
    chartType: 'line',
    dateRange: '30d',
  },
};

const STORAGE_KEY = 'portfolio-dashboard-user-preferences';

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
        }
      }
    } catch (err) {
      setError('Failed to load user preferences');
      console.error('Error loading user preferences:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    try {
      const updated = { ...preferences, ...newPreferences };
      setPreferences(updated);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to save user preferences');
      console.error('Error saving user preferences:', err);
    }
  }, [preferences]);

  // Update specific preference section
  const updatePreferences = useCallback((
    section: keyof UserPreferences,
    updates: Partial<UserPreferences[keyof UserPreferences]>
  ) => {
    savePreferences({
      [section]: { ...preferences[section], ...updates }
    });
  }, [preferences, savePreferences]);

  // Reset to default preferences
  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Export preferences
  const exportPreferences = useCallback(() => {
    const dataStr = JSON.stringify(preferences, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'user-preferences.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [preferences]);

  // Import preferences
  const importPreferences = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (typeof imported === 'object' && imported !== null) {
          savePreferences(imported);
        } else {
          throw new Error('Invalid preferences format');
        }
      } catch (err) {
        setError('Failed to import preferences: Invalid file format');
      }
    };
    reader.readAsText(file);
  }, [savePreferences]);

  return {
    preferences,
    isLoading,
    error,
    savePreferences,
    updatePreferences,
    resetPreferences,
    exportPreferences,
    importPreferences,
  };
}
