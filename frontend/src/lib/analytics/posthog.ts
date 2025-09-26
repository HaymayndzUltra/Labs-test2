'use client';

import posthog from 'posthog-js';
import { useEffect } from 'react';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_demo_token';
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

let initialized = false;

export const initPosthog = () => {
  if (initialized) return;
  if (typeof window === 'undefined') return;
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: true,
    persistence: 'memory',
  });
  initialized = true;
};

export const recordEvent = (event: string, payload?: Record<string, unknown>) => {
  if (!initialized && typeof window !== 'undefined') {
    initPosthog();
  }
  posthog.capture(event, payload);
};

export const usePosthogIdentity = (persona: string) => {
  useEffect(() => {
    if (!initialized) {
      initPosthog();
    }
    posthog.group('persona', persona);
    recordEvent('persona_selected', { persona });
  }, [persona]);
};
