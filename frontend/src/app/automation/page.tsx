'use client';

import { useEffect } from 'react';
import { recordEvent } from '@/lib/analytics/posthog';

const workflowDiagram = `Intake Bot → LangChain Summary → Proposal Exporter → n8n CRM Sync → Email Automation`;

export default function AutomationPage() {
  useEffect(() => {
    recordEvent('automation_viewed');
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 text-slate-200">
      <h1 className="text-3xl font-semibold text-white">Automation & Personalization</h1>
      <p className="mt-4 text-sm text-slate-300">
        Workflow stubs are wired for n8n. Each persona triggers dynamic rules: Healthcare personas load compliance pods,
        while Fintech investors highlight anomaly tagging. Replace placeholders with live webhooks.
      </p>
      <div className="mt-6 rounded-3xl border border-white/10 bg-black/40 p-6 text-xs">
        <p className="font-semibold text-white">Workflow Diagram</p>
        <pre className="mt-2 whitespace-pre-wrap">{workflowDiagram}</pre>
      </div>
      <div className="mt-6 rounded-3xl border border-white/10 bg-black/40 p-6 text-xs text-amber-300">
        TODO: Add API keys for OpenAI, Supabase, Calendly before production deployment.
      </div>
    </div>
  );
}
