import { NextRequest } from 'next/server';
import { z } from 'zod';
import { captureEvent } from '@/lib/analytics/posthog';
import type { PersonaId } from '@/state/persona-store';

const intakeSchema = z.object({
  persona: z.string().optional(),
  transcript: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant']).default('user'),
    content: z.string(),
  })),
  metadata: z
    .object({
      goal: z.string().optional(),
      budget: z.string().optional(),
      timeline: z.string().optional(),
      dataMaturity: z.string().optional(),
    })
    .optional(),
});

const personaDashboardMap: Record<PersonaId, string[]> = {
  'saas-founder': ['MRR Pulse', 'Activation Diagnostic', 'Scenario Studio'],
  'healthcare-exec': ['Care Continuity Radar', 'Operational Compliance', 'Bed Capacity Simulator'],
  'ecommerce-lead': ['Conversion Lift', 'Supply Velocity', 'Campaign Studio'],
  'fintech-investor': ['Risk Command Center', 'Treasury Insights', 'Compliance Trails'],
};

export type IntakePayload = z.infer<typeof intakeSchema>;

export interface IntakeResponse {
  summary: string;
  recommendedDashboards: string[];
  extracted: {
    goal?: string;
    budget?: string;
    timeline?: string;
    dataMaturity?: string;
  };
}

export async function processIntake(req: NextRequest): Promise<Response> {
  const body = await req.json();
  const parsed = intakeSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.format() }, { status: 400 });
  }

  const { persona = 'saas-founder', transcript, metadata } = parsed.data;
  const latestMessage = transcript.at(-1)?.content ?? '';
  const extracted = {
    goal: metadata?.goal ?? latestMessage.match(/goal:(.*)/i)?.[1]?.trim(),
    budget: metadata?.budget ?? latestMessage.match(/budget:(.*)/i)?.[1]?.trim(),
    timeline: metadata?.timeline ?? latestMessage.match(/timeline:(.*)/i)?.[1]?.trim(),
    dataMaturity: metadata?.dataMaturity ?? latestMessage.match(/maturity:(.*)/i)?.[1]?.trim(),
  };

  const response: IntakeResponse = {
    summary: `Persona ${persona} requests ${extracted.goal ?? 'a tailored dashboard experience'} with timeline ${
      extracted.timeline ?? 'TBD'
    }.`,
    recommendedDashboards: personaDashboardMap[persona as PersonaId] ?? personaDashboardMap['saas-founder'],
    extracted,
  };

  captureEvent('intake_submitted', { persona, ...extracted });

  return Response.json(response);
}
