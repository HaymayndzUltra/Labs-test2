import { lazy } from 'react';

export const moduleMetadata = [
  {
    slug: 'finops',
    title: 'FinOps Treasury',
    accent: 'var(--accent-finops)',
    component: lazy(() => import('../../app/modules/finops/pages/Dashboard'))
  },
  {
    slug: 'logistics',
    title: 'Supply Chain',
    accent: 'var(--accent-logistics)',
    component: lazy(() => import('../../app/modules/logistics/pages/Dashboard'))
  },
  {
    slug: 'energy',
    title: 'Energy Ops',
    accent: 'var(--accent-energy)',
    component: lazy(() => import('../../app/modules/energy/pages/Dashboard'))
  },
  {
    slug: 'people',
    title: 'PeopleOps',
    accent: 'var(--accent-hr)',
    component: lazy(() => import('../../app/modules/people/pages/Dashboard'))
  },
  {
    slug: 'iot',
    title: 'IoT Fleet',
    accent: 'var(--accent-iot)',
    component: lazy(() => import('../../app/modules/iot/pages/Dashboard'))
  },
  {
    slug: 'gaming',
    title: 'Gaming LiveOps',
    accent: 'var(--accent-gaming)',
    component: lazy(() => import('../../app/modules/gaming/pages/Dashboard'))
  },
  {
    slug: 'hospitality',
    title: 'Hospitality',
    accent: 'var(--accent-hospitality)',
    component: lazy(() => import('../../app/modules/hospitality/pages/Dashboard'))
  }
] as const;

export const moduleFilters: Record<string, { id: string; label: string; group?: 'chips' | 'dropdown' }[]> = {
  finops: [
    { id: 'all', label: 'All treasury', group: 'dropdown' },
    { id: 'enterprise', label: 'Enterprise', group: 'dropdown' },
    { id: 'smb', label: 'SMB', group: 'dropdown' },
    { id: 'leakage', label: 'Leakage Focus', group: 'chips' }
  ],
  logistics: [
    { id: 'all', label: 'Network', group: 'dropdown' },
    { id: 'urban', label: 'Urban', group: 'dropdown' },
    { id: 'cold_chain', label: 'Cold Chain', group: 'dropdown' },
    { id: 'exceptions', label: 'Exceptions', group: 'chips' }
  ],
  energy: [
    { id: 'all', label: 'Grid Wide', group: 'dropdown' },
    { id: 'region_north', label: 'North Region', group: 'dropdown' },
    { id: 'der', label: 'DER Sites', group: 'chips' }
  ],
  people: [
    { id: 'all', label: 'All talent', group: 'dropdown' },
    { id: 'tech', label: 'Tech Roles', group: 'dropdown' },
    { id: 'diversity', label: 'Diversity Focus', group: 'chips' }
  ],
  iot: [
    { id: 'all', label: 'Entire fleet', group: 'dropdown' },
    { id: 'emea', label: 'EMEA', group: 'dropdown' },
    { id: 'latency', label: 'Latency watch', group: 'chips' }
  ],
  gaming: [
    { id: 'all', label: 'Global', group: 'dropdown' },
    { id: 'mobile', label: 'Mobile', group: 'dropdown' },
    { id: 'pc', label: 'PC', group: 'dropdown' },
    { id: 'experiments', label: 'Experiments', group: 'chips' }
  ],
  hospitality: [
    { id: 'all', label: 'All brands', group: 'dropdown' },
    { id: 'luxury', label: 'Luxury', group: 'dropdown' },
    { id: 'resorts', label: 'Resorts', group: 'dropdown' },
    { id: 'vip', label: 'VIP focus', group: 'chips' }
  ]
};
