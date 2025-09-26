import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getPersonaById, type PersonaId } from '../../../hooks/usePersonaStore';
import { getDashboardVaultData } from '../../dashboard/data';

const IntakeSchema = z.object({
  goals: z.string(),
  budget: z.string(),
  timeline: z.string(),
  dataMaturity: z.string(),
});

function classifyPersona(goals: string): PersonaId {
  const goalLower = goals.toLowerCase();
  if (goalLower.includes('patient') || goalLower.includes('clinical')) {
    return 'healthcare-exec';
  }
  if (goalLower.includes('investor') || goalLower.includes('fund')) {
    return 'fintech-investor';
  }
  if (goalLower.includes('commerce') || goalLower.includes('retail')) {
    return 'ecommerce-lead';
  }
  return 'saas-founder';
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = IntakeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const personaId = classifyPersona(parsed.data.goals);
  const persona = getPersonaById(personaId);
  const dashboardData = await getDashboardVaultData();
  const recommendedPod = dashboardData.pods.find((pod) => pod.personaAlignment.includes(personaId)) ?? dashboardData.pods[0];

  const kpiFocus = recommendedPod.overview.map((metric) => metric.label);

  return NextResponse.json({
    persona,
    pod: recommendedPod,
    recommendedDashboards: [recommendedPod.name],
    kpiFocus,
    summary: `Aligning with ${persona.label} persona unlocks ${recommendedPod.name} to target ${kpiFocus.join(', ')}.`,
  });
}
