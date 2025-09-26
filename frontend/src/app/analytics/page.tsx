'use client';

import { useEffect } from 'react';
import { recordEvent } from '@/lib/analytics/posthog';

export default function AnalyticsPage() {
  useEffect(() => {
    recordEvent('analytics_viewed');
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 text-slate-200">
      <h1 className="text-3xl font-semibold text-white">Analytics Wiring</h1>
      <p className="mt-4 text-sm text-slate-300">
        PostHog captures persona_selected, pod_viewed, intake_submitted, and proposal_generated events. Hotjar/LogRocket
        integration is stubbed with TODO markers; replace placeholders with production keys before launch.
      </p>
      <pre className="mt-6 rounded-3xl border border-white/10 bg-black/50 p-6 text-xs">
{`posthog.capture('persona_selected')
posthog.capture('pod_viewed')
posthog.capture('intake_submitted')
posthog.capture('proposal_generated')
`}
      </pre>
      <p className="mt-6 text-xs text-amber-300">
        TODO: Wire Hotjar/LogRocket once workspace keys are provisioned.
      </p>
    </div>
  );
}
