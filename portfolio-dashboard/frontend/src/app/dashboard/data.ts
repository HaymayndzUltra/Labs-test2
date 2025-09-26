import { faker } from '@faker-js/faker';
import { cache } from 'react';
import type { PersonaId } from '../../hooks/usePersonaStore';

type Metric = {
  label: string;
  value: number;
  delta: number;
};

type TrendPoint = {
  label: string;
  value: number;
  benchmark: number;
  anomaly?: boolean;
};

type Scenario = {
  id: string;
  label: string;
  description: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
};

type PodData = {
  id: 'fintech' | 'healthcare';
  name: string;
  summary: string;
  overview: Metric[];
  diagnostic: TrendPoint[];
  geoPoints: Array<{ lat: number; lng: number; intensity: number }>;
  simulator: Scenario[];
  personaAlignment: PersonaId[];
};

function createMetric(label: string): Metric {
  const value = faker.number.float({ min: 25, max: 96, precision: 0.1 });
  const delta = faker.number.float({ min: -18, max: 32, precision: 0.1 });
  return { label, value, delta };
}

function createTrendPoints(): TrendPoint[] {
  return Array.from({ length: 12 }).map((_, month) => {
    const value = faker.number.float({ min: 45, max: 140, precision: 0.1 });
    const benchmark = value * faker.number.float({ min: 0.7, max: 1.1, precision: 0.01 });
    const anomaly = Math.random() > 0.84;
    return { label: `M${month + 1}`, value, benchmark, anomaly };
  });
}

function createGeoPoints(): Array<{ lat: number; lng: number; intensity: number }> {
  const baseCities = [
    { lat: 37.7749, lng: -122.4194 },
    { lat: 40.7128, lng: -74.006 },
    { lat: 51.5074, lng: -0.1278 },
    { lat: 1.3521, lng: 103.8198 },
    { lat: 52.52, lng: 13.405 },
  ];

  return baseCities.map((city) => ({
    lat: city.lat + faker.number.float({ min: -0.5, max: 0.5, precision: 0.0001 }),
    lng: city.lng + faker.number.float({ min: -0.5, max: 0.5, precision: 0.0001 }),
    intensity: faker.number.float({ min: 0.2, max: 1, precision: 0.01 }),
  }));
}

function generatePod(id: PodData['id']): PodData {
  if (id === 'fintech') {
    return {
      id,
      name: 'Fintech Command Center',
      summary:
        'Monitor revenue velocity, compliance health, and product-market fit across digital banking initiatives with live anomaly tagging.',
      overview: [
        createMetric('Net Revenue Retention %'),
        createMetric('AML Alerts Cleared %'),
        createMetric('Unit Economics Index'),
      ],
      diagnostic: createTrendPoints(),
      geoPoints: createGeoPoints(),
      simulator: [
        {
          id: 'growth',
          label: 'Monthly Active Accounts Growth %',
          description: 'Project account growth sensitivity to conversion and KYC approval rates.',
          min: -10,
          max: 35,
          step: 1,
          defaultValue: 8,
        },
        {
          id: 'conversion',
          label: 'Conversion Rate %',
          description: 'Impact of onboarding optimizations on verified conversions.',
          min: 1,
          max: 25,
          step: 1,
          defaultValue: 14,
        },
        {
          id: 'compliance',
          label: 'Compliance Automation %',
          description: 'Automation coverage for AML/KYC workflows.',
          min: 0,
          max: 100,
          step: 5,
          defaultValue: 56,
        },
      ],
      personaAlignment: ['saas-founder', 'ecommerce-lead', 'fintech-investor'],
    };
  }

  return {
    id,
    name: 'Healthcare Continuity Lab',
    summary:
      'Track patient throughput, outcome quality, and reimbursement optimization with HIPAA-safe automation hooks.',
    overview: [
      createMetric('Patient Pathway Completion %'),
      createMetric('Readmission Rate %'),
      createMetric('Revenue per Encounter'),
    ],
    diagnostic: createTrendPoints(),
    geoPoints: createGeoPoints(),
    simulator: [
      {
        id: 'telehealth',
        label: 'Telehealth Adoption %',
        description: 'Model telehealth coverage impact on capacity relief.',
        min: 5,
        max: 65,
        step: 1,
        defaultValue: 28,
      },
      {
        id: 'staffing',
        label: 'Staffing Optimization %',
        description: 'Optimize staffing levels and float pool allocation.',
        min: -20,
        max: 20,
        step: 1,
        defaultValue: 6,
      },
      {
        id: 'quality',
        label: 'Quality Compliance Score',
        description: 'Monitor adherence to clinical quality protocols.',
        min: 60,
        max: 100,
        step: 1,
        defaultValue: 88,
      },
    ],
    personaAlignment: ['healthcare-exec'],
  };
}

export type DashboardVaultData = {
  pods: PodData[];
  generatedAt: string;
};

export const getDashboardVaultData = cache(async function getDashboardVaultData(): Promise<DashboardVaultData> {
  const pods: PodData[] = ['fintech', 'healthcare'].map((id) => generatePod(id));
  return { pods, generatedAt: new Date().toISOString() };
});

export type { Metric, TrendPoint, Scenario, PodData };
