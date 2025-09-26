import type { PersonaContext, PersonaId } from '@/state/persona-store';

export const PERSONAS: Record<PersonaId, PersonaContext> = {
  'saas-founder': {
    id: 'saas-founder',
    label: 'SaaS Founder',
    description: 'Prioritise ARR, onboarding, and monetisation experiments.',
    accent: 'from-indigo-500 via-sky-500 to-emerald-400',
    background: 'bg-slate-900/90',
    headline: 'Accelerate product-market fit with go-to-market ready dashboards.',
    valueProposition:
      'Personalised acquisition, retention, and expansion playbooks backed by scenario simulators and investor-ready storytelling.',
    primaryDashboards: ['MRR Pulse', 'Activation Quality', 'Growth Simulator'],
  },
  'healthcare-exec': {
    id: 'healthcare-exec',
    label: 'Healthcare Exec',
    description: 'Monitor care quality, compliance posture, and staffing efficiency.',
    accent: 'from-emerald-400 via-teal-500 to-cyan-500',
    background: 'bg-slate-800/80',
    headline: 'Elevate patient outcomes with clinical and operational intelligence.',
    valueProposition:
      'HIPAA-ready telemetry, risk lenses, and automated follow-ups tuned for provider networks and digital health scale-ups.',
    primaryDashboards: ['Care Continuity Radar', 'Clinical Diagnostics', 'Capacity Optimiser'],
  },
  'ecommerce-lead': {
    id: 'ecommerce-lead',
    label: 'E-commerce Lead',
    description: 'Optimise conversion, inventory, and omnichannel CX.',
    accent: 'from-rose-500 via-orange-400 to-amber-300',
    background: 'bg-slate-900/90',
    headline: 'Deliver immersive merchandising journeys with adaptive automation.',
    valueProposition:
      'Real-time merchandising insights, cohort-aware experiments, and revenue guardrails for omnichannel growth.',
    primaryDashboards: ['Conversion Cohorts', 'Logistics Radar', 'Campaign Lift Studio'],
  },
  'fintech-investor': {
    id: 'fintech-investor',
    label: 'Fintech Investor',
    description: 'Track portfolio health, compliance, and runway scenarios.',
    accent: 'from-purple-500 via-fuchsia-500 to-sky-500',
    background: 'bg-slate-900/90',
    headline: 'Deploy predictive oversight across your fintech portfolio.',
    valueProposition:
      'Anomaly-aware risk insights, treasury oversight, and investment memos generated in minutes.',
    primaryDashboards: ['Risk Command Center', 'Treasury Scenarios', 'Fincrime Diagnostics'],
  },
};
