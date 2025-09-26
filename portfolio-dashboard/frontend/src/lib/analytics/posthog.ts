'use client';

import posthog from 'posthog-js';
import { useEffect } from 'react';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

export const initPosthog = () => {
  if (typeof window === 'undefined' || posthog.has_opted_out_capturing()) {
    return;
  }

  if (!posthog.__loaded && POSTHOG_KEY) {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: true,
      capture_pageleave: true,
    });
  }
};

export const useAnalytics = (eventName: string, payload?: Record<string, unknown>) => {
  useEffect(() => {
    if (!eventName) return;
    initPosthog();
    if (POSTHOG_KEY) {
      posthog.capture(eventName, payload ?? {});
    }
  }, [eventName, payload]);
};

export const captureEvent = (event: string, payload?: Record<string, unknown>) => {
  initPosthog();
  if (POSTHOG_KEY) {
    posthog.capture(event, payload ?? {});
  }
};
