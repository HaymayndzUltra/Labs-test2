'use client';

import { useCallback } from 'react';

type AnalyticsEvent =
  | 'filter_change'
  | 'export_triggered'
  | 'automation_run'
  | 'automation_simulate'
  | 'drill_down'
  | 'telemetry_observed'
  | 'visual_regression_snapshot';

type AnalyticsPayload = Record<string, unknown>;

type Tracker = {
  track: (event: AnalyticsEvent, payload?: AnalyticsPayload) => void;
};

function dispatchAnalytics(event: AnalyticsEvent, payload: AnalyticsPayload = {}) {
  if (typeof window === 'undefined') {
    return;
  }

  if (!window.dataLayer) {
    window.dataLayer = [] as Array<Record<string, unknown>>;
  }

  window.dataLayer.push({
    event,
    timestamp: new Date().toISOString(),
    ...payload,
  });

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', event, payload);
  }
}

export function useAnalytics(): Tracker {
  const track = useCallback((event: AnalyticsEvent, payload: AnalyticsPayload = {}) => {
    dispatchAnalytics(event, payload);
  }, []);

  return { track };
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}
