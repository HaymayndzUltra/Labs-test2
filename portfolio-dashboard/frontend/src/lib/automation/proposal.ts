import { NextRequest } from 'next/server';
import { z } from 'zod';
import { captureEvent } from '@/lib/analytics/posthog';

const proposalSchema = z.object({
  persona: z.string(),
  summary: z.string(),
  recommendedDashboards: z.array(z.string()),
  investmentNotes: z.string().optional(),
});

export type ProposalPayload = z.infer<typeof proposalSchema>;

const buildMarkdown = ({ persona, summary, recommendedDashboards, investmentNotes }: ProposalPayload) => `# Proposal Snapshot

**Persona:** ${persona}

**Executive Summary**

${summary}

**Dashboard Stack**
${recommendedDashboards.map((item) => `- ${item}`).join('\n')}

**Automation Notes**
${investmentNotes ?? 'TODO: Inject automation opportunities once CRM integration keys are available.'}
`;

const buildPdfPlaceholder = (markdown: string) => {
  const content = `PORTFOLIO DASHBOARD PROPOSAL\n-----------------------------\n${markdown}`;
  return Buffer.from(content, 'utf-8').toString('base64');
};

export async function processProposal(req: NextRequest): Promise<Response> {
  const payload = await req.json();
  const parsed = proposalSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const markdown = buildMarkdown(parsed.data);
  const pdf = buildPdfPlaceholder(markdown);

  captureEvent('proposal_generated', { persona: parsed.data.persona });

  return Response.json({ markdown, pdf });
}
