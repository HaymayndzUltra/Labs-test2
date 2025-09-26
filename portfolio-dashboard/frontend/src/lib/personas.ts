export type PersonaId = 'saas-founder' | 'healthcare-exec' | 'ecommerce-lead' | 'fintech-investor';

export interface PersonaTheme {
  background: string;
  accent: string;
  surface: string;
  radial: string;
}

export interface PersonaDashboardRecommendation {
  id: string;
  title: string;
  description: string;
  kpis: string[];
}

export interface PersonaConfig {
  id: PersonaId;
  label: string;
  headline: string;
  subheadline: string;
  mission: string;
  theme: PersonaTheme;
  recommendedDashboards: PersonaDashboardRecommendation[];
  callToAction: string;
}

export const PERSONA_ORDER: PersonaId[] = [
  'saas-founder',
  'healthcare-exec',
  'ecommerce-lead',
  'fintech-investor',
];

export const personas: Record<PersonaId, PersonaConfig> = {
  'saas-founder': {
    id: 'saas-founder',
    label: 'SaaS Founder',
    headline: 'Accelerate product-market fit with adaptive revenue intelligence.',
    subheadline:
      'Benchmark ARR growth, ship pricing experiments, and auto-generate investor updates from live telemetry.',
    mission: 'Launch faster with predictive monetization loops and full-lifecycle activation insights.',
    theme: {
      background: 'from-slate-950 via-indigo-950 to-slate-900',
      accent: 'indigo',
      surface: 'bg-indigo-950/40',
      radial: 'bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.45),_transparent_60%)]',
    },
    recommendedDashboards: [
      {
        id: 'arr-synthesis',
        title: 'ARR Synthesis Board',
        description:
          'Unify billings, churn trajectories, and cohort upgrades to uncover latent expansion opportunities.',
        kpis: ['Net ARR', 'Expansion MRR', 'Activation-to-PQL'],
      },
      {
        id: 'pricing-sandbox',
        title: 'Pricing Experiment Sandbox',
        description:
          'Model feature packaging shifts and quantify downstream adoption & revenue impacts instantly.',
        kpis: ['Win Rate Delta', 'Trial → Paid Velocity', 'Revenue at Risk'],
      },
    ],
    callToAction: 'Prototype investor-grade metrics in minutes.',
  },
  'healthcare-exec': {
    id: 'healthcare-exec',
    label: 'Healthcare Exec',
    headline: 'Operationalize patient-first analytics across networks and care teams.',
    subheadline:
      'Surface quality signals, staffing readiness, and population risk to keep every facility in sync.',
    mission: 'Deliver proactive care orchestration with compliance-safe automation and digital command centers.',
    theme: {
      background: 'from-teal-950 via-emerald-900 to-slate-950',
      accent: 'emerald',
      surface: 'bg-emerald-950/40',
      radial: 'bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.35),_transparent_60%)]',
    },
    recommendedDashboards: [
      {
        id: 'care-quality',
        title: 'Care Quality Pulse',
        description:
          'Track readmissions, adverse events, and patient experience metrics in one accountability view.',
        kpis: ['Readmission Rate', 'Patient NPS', 'Care Pathway Compliance'],
      },
      {
        id: 'network-load',
        title: 'Network Load Balancer',
        description:
          'Coordinate staffing, bed capacity, and referral routing across blended in-person/virtual ops.',
        kpis: ['Staff Utilization', 'Bed Availability', 'Referral Throughput'],
      },
    ],
    callToAction: 'Activate command center dashboards that keep every clinician informed.',
  },
  'ecommerce-lead': {
    id: 'ecommerce-lead',
    label: 'E-commerce Lead',
    headline: 'Design shoppable intelligence funnels with geospatial merchandising.',
    subheadline:
      'Blend cohort analytics, margin heatmaps, and logistic performance to craft conversion stories.',
    mission: 'Turn omni-channel telemetry into interactive revenue simulations and promo playbooks.',
    theme: {
      background: 'from-amber-950 via-rose-900 to-slate-950',
      accent: 'amber',
      surface: 'bg-rose-950/40',
      radial: 'bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.35),_transparent_60%)]',
    },
    recommendedDashboards: [
      {
        id: 'merchandising',
        title: 'Merchandising Radar',
        description: 'Map SKU demand pockets and margin contribution with location-aware overlays.',
        kpis: ['Conversion Velocity', 'Margin per Region', 'Promo Resonance'],
      },
      {
        id: 'fulfillment',
        title: 'Fulfillment Reliability',
        description: 'Forecast delivery SLAs and detect anomalies before they degrade CX.',
        kpis: ['On-time Rate', 'First Attempt Success', 'Return Ratio'],
      },
    ],
    callToAction: 'Spin up adaptive commerce control towers.',
  },
  'fintech-investor': {
    id: 'fintech-investor',
    label: 'Fintech Investor',
    headline: 'Interrogate risk, liquidity, and portfolio health in real-time.',
    subheadline:
      'Blend macro signals with deal-flow telemetry to narrate growth, compliance, and coverage.',
    mission: 'Deploy co-pilot dashboards that accelerate diligence and LP confidence.',
    theme: {
      background: 'from-slate-950 via-sky-950 to-slate-900',
      accent: 'sky',
      surface: 'bg-sky-950/40',
      radial: 'bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.35),_transparent_60%)]',
    },
    recommendedDashboards: [
      {
        id: 'risk-oracle',
        title: 'Risk Oracle',
        description: 'Monitor exposure, credit events, and stress models in one interactive grid.',
        kpis: ['Value at Risk', 'Default Probability', 'Capital Adequacy'],
      },
      {
        id: 'deal-flow',
        title: 'Deal Flow Storyboard',
        description: 'Track sourcing velocity, diligence status, and post-close ramp across cohorts.',
        kpis: ['Pipeline Velocity', 'Due Diligence Stage Time', 'Post-Close Growth'],
      },
    ],
    callToAction: 'Bring LP communications to life with living financial narratives.',
  },
};

export const defaultPersonaId: PersonaId = 'saas-founder';

export function getPersona(id: PersonaId): PersonaConfig {
  return personas[id];
}
