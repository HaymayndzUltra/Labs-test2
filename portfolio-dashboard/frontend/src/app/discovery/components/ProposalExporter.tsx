'use client';

import { useState } from 'react';
import { generateProposalArtifacts } from '../../../lib/proposal';
import { buildPrompt } from '../../../lib/langchain';
import type { PersonaDefinition } from '../../../hooks/usePersonaStore';
import type { PodData } from '../../dashboard/data';
import { trackEvent } from '../../../lib/analytics';

export function ProposalExporter({
  persona,
  pod,
  summary,
}: {
  persona: PersonaDefinition;
  pod: PodData;
  summary: string;
}) {
  const [exportState, setExportState] = useState<{ pdf?: string; notion?: string; loading: boolean }>(
    { loading: false },
  );

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80 backdrop-blur">
      <h2 className="text-sm uppercase tracking-[0.3em] text-white/50">Proposal exporter</h2>
      <p className="mt-2 text-sm text-white/70">
        Generates PDF + Notion markdown snapshot. Integrate with OpenAI + LangChain pipelines for live demos.
      </p>
      <button
        type="button"
        onClick={async () => {
          setExportState({ loading: true });
          await buildPrompt(persona.label, pod.name, pod.overview.map((metric) => metric.label));
          const artifacts = await generateProposalArtifacts({ persona, pod, summary });
          trackEvent('proposal_generated', { persona: persona.id, pod: pod.id });
          setExportState({ loading: false, pdf: artifacts.pdfBase64, notion: artifacts.notionMarkdown });
        }}
        className="mt-4 rounded-full bg-emerald-500/80 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-emerald-500"
      >
        {exportState.loading ? 'Generating…' : 'Generate proposal bundle'}
      </button>
      {exportState.pdf ? (
        <div className="mt-4 space-y-2 text-xs text-white/70">
          <p>
            PDF ready (<a href={`data:application/pdf;base64,${exportState.pdf}`} download="proposal.pdf" className="underline">
              download
            </a>
            )
          </p>
          <details className="rounded-2xl border border-white/10 bg-slate-900/60 p-3">
            <summary className="cursor-pointer text-xs uppercase tracking-[0.3em] text-white/50">Notion snapshot</summary>
            <pre className="mt-2 whitespace-pre-wrap text-[10px] text-emerald-200">{exportState.notion}</pre>
          </details>
        </div>
      ) : null}
    </div>
  );
}
