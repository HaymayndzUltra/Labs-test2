export type AnalyticsEventName =
  | 'filter_change'
  | 'export_triggered'
  | 'automation_run'
  | 'automation_simulate'
  | 'drill_down'
  | 'telemetry_recorded';

type AnalyticsPayload = Record<string, unknown> & {
  timestamp?: string;
};

const eventBuffer: Array<{ name: AnalyticsEventName; payload: AnalyticsPayload }> = [];

export function trackAnalyticsEvent(name: AnalyticsEventName, payload: AnalyticsPayload = {}): void {
  const enrichedPayload = {
    ...payload,
    timestamp: new Date().toISOString(),
  };
  eventBuffer.push({ name, payload: enrichedPayload });

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console -- analytics events need to be observable during development
    console.debug(`[analytics] ${name}`, enrichedPayload);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('portfolio-analytics', {
        detail: { name, payload: enrichedPayload },
      })
    );
  }
}

export function getAnalyticsBuffer() {
  return [...eventBuffer];
}
