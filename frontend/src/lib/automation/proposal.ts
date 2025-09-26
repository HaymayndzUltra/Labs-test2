import { z } from 'zod';

export const intakeSchema = z.object({
  goals: z.string().min(10),
  budget: z.string(),
  timeline: z.string(),
  dataMaturity: z.string(),
});

export type IntakePayload = z.infer<typeof intakeSchema>;

export type ProposalArtifact = {
  markdown: string;
  pdfBase64: string;
};

const encodeBase64 = (value: string) => {
  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    return window.btoa(value);
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Buffer } = require('buffer');
  return Buffer.from(value).toString('base64');
};

export const synthesizeProposal = async (payload: IntakePayload): Promise<ProposalArtifact> => {
  const { goals, budget, timeline, dataMaturity } = intakeSchema.parse(payload);

  const markdown = `# Proposal Blueprint\n\n## Goals\n${goals}\n\n## Budget\n${budget}\n\n## Timeline\n${timeline}\n\n## Data Maturity\n${dataMaturity}\n\n## Recommended Dashboards\n- Fintech Command Center\n- Healthcare Resilience Hub\n`;

  return {
    markdown,
    pdfBase64: encodeBase64(`PDF PLACEHOLDER\n${markdown}`),
  };
};
