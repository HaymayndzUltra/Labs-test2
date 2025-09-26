'use client';

import posthog from 'posthog-js';
import { hotjar } from 'hotjar-js';

type AnalyticsConfig = {
  posthogApiKey?: string;
  posthogHost?: string;
  hotjarId?: string;
};

const POSTHOG_ENABLED_EVENTS = [
  'persona_selected',
  'pod_viewed',
  'intake_submitted',
  'proposal_generated',
  'animation_preset_previewed',
];

export function initializeAnalytics({ posthogApiKey, posthogHost, hotjarId }: AnalyticsConfig) {
  if (posthogApiKey && !(posthog as any).__loaded) {
    posthog.init(posthogApiKey, {
      api_host: posthogHost ?? 'https://app.posthog.com',
      autocapture: true,
      capture_pageview: true,
    });
  }

  if (hotjarId && !hotjar.isReady()) {
    hotjar.init(parseInt(hotjarId, 10), 6);
  }
}

export function trackEvent(event: (typeof POSTHOG_ENABLED_EVENTS)[number], payload?: Record<string, unknown>) {
  if (!POSTHOG_ENABLED_EVENTS.includes(event)) {
    return;
  }

  posthog.capture(event, payload);
}

export function optOutAnalytics() {
  posthog.opt_out_capturing();
}
