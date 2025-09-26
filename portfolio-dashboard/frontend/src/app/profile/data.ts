import { faker } from '@faker-js/faker';

export type TimelineEvent = {
  year: number;
  milestone: string;
  description: string;
  kpi: number[];
};

export type Testimonial = {
  persona: string;
  quote: string;
  metric: string;
  value: string;
};

export type SkillSignal = {
  name: string;
  value: number;
};

export function generateTimeline(): TimelineEvent[] {
  return Array.from({ length: 6 }).map((_, index) => {
    const baseYear = 2018 + index;
    const kpi = Array.from({ length: 12 }).map(() => faker.number.int({ min: 65, max: 120 }));
    return {
      year: baseYear,
      milestone: faker.company.catchPhrase(),
      description: faker.lorem.sentence(),
      kpi,
    };
  });
}

export function getTestimonials(): Testimonial[] {
  return [
    {
      persona: 'Fintech COO',
      quote: 'Dashboard vault gave us investor-grade clarity in a 45 minute working session.',
      metric: 'Time-to-Proposal',
      value: '3m 42s',
    },
    {
      persona: 'Healthcare Transformation Lead',
      quote: 'Scenario simulator exposed the exact staffing levers to protect patient experience.',
      metric: 'NPS Impact',
      value: '+18',
    },
    {
      persona: 'E-commerce VP',
      quote: 'Landing constellation sold the story before the first slide loaded.',
      metric: 'Close Rate',
      value: '+32%',
    },
    {
      persona: 'SaaS Founder',
      quote: 'Proposal exporter pumped a Notion deck ready for our board in seconds.',
      metric: 'Deck Prep Time',
      value: '-6 hrs',
    },
  ];
}

export function getSkillSignals(): SkillSignal[] {
  return [
    { name: 'Data Storytelling', value: 96 },
    { name: 'Automation Architecture', value: 92 },
    { name: 'UX Strategy', value: 94 },
    { name: '3D/Interactive', value: 88 },
    { name: 'Analytics Ops', value: 91 },
  ];
}
