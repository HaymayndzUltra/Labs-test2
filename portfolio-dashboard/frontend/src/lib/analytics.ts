'use client';

import posthog from 'posthog-js';

export type AnalyticsEvent =
  | 'persona_selected'
  | 'pod_viewed'
  | 'intake_submitted'
  | 'proposal_generated'
  | 'animation_previewed';

type AnalyticsPayload = Record<string, unknown>;

function canCapture() {
  return typeof window !== 'undefined' && !!posthog;
}

export function track(event: AnalyticsEvent, payload?: AnalyticsPayload) {
  if (!canCapture()) {
    return;
  }

  posthog.capture(event, payload);
}
