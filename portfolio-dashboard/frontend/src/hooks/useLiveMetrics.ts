'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { PortfolioDashboardResponse } from '@/app/dashboard/data';

type LivePayload = {
  module: keyof Pick<PortfolioDashboardResponse, 'saas' | 'commerce' | 'corporate' | 'customApp' | 'content' | 'edtech' | 'specialized'>;
  metricId: string;
  value: string;
  change?: number;
};

export function useLiveMetrics() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const source = new EventSource('/api/live');

    source.onmessage = (event) => {
      try {
        const payload: LivePayload = JSON.parse(event.data);
        queryClient.setQueryData<PortfolioDashboardResponse | undefined>(['portfolio-dashboard'], (current) => {
          if (!current) return current;

          if (payload.module === 'specialized') {
            const updated = { ...current.specialized };
            const updateMetrics = (section: 'realEstate' | 'finance' | 'healthcare') => {
              updated[section] = {
                ...updated[section],
                metrics: updated[section].metrics.map((metric) =>
                  metric.id === payload.metricId
                    ? { ...metric, value: payload.value, change: payload.change ?? metric.change }
                    : metric
                ),
              };
            };
            if (['inventory', 'inquiries', 'response'].includes(payload.metricId)) {
              updateMetrics('realEstate');
            } else if (['burn', 'roi', 'automation'].includes(payload.metricId)) {
              updateMetrics('finance');
            } else if (['appointments', 'show-rate', 'satisfaction'].includes(payload.metricId)) {
              updateMetrics('healthcare');
            }
            return { ...current, specialized: updated };
          }

          const targetSection = current[payload.module];
          if (!targetSection || !('metrics' in targetSection)) {
            return current;
          }
          const metrics = targetSection.metrics?.map((metric) =>
            metric.id === payload.metricId
              ? {
                  ...metric,
                  value: payload.value,
                  change: payload.change ?? metric.change,
                }
              : metric
          );
          return {
            ...current,
            [payload.module]: {
              ...targetSection,
              metrics,
            },
          } as PortfolioDashboardResponse;
        });
      } catch (error) {
        console.error('Failed to apply live payload', error);
      }
    };

    source.onerror = () => {
      source.close();
    };

    return () => {
      source.close();
    };
  }, [queryClient]);
}
