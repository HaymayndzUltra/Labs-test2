import { NextResponse } from 'next/server';

const modules = ['saas', 'commerce', 'corporate', 'customApp', 'content', 'edtech', 'specialized'] as const;
const metricsByModule: Record<(typeof modules)[number], string[]> = {
  saas: ['mrr', 'active-users', 'api-usage', 'churn'],
  commerce: ['gmv', 'orders', 'aov', 'return-rate'],
  corporate: ['pipeline', 'visitors', 'conversion', 'cycle'],
  customApp: ['throughput', 'ideas', 'workload'],
  content: ['plays', 'watch', 'subscribers', 'engagement'],
  edtech: ['learners', 'completion', 'quiz', 'cert'],
  specialized: ['inventory', 'inquiries', 'response', 'burn', 'roi', 'automation', 'appointments', 'show-rate', 'satisfaction'],
};

function randomMetricValue(metricId: string) {
  switch (metricId) {
    case 'mrr':
      return `$${(240_000 + Math.random() * 10_000).toFixed(0)}`;
    case 'active-users':
      return (8_500 + Math.random() * 500).toFixed(0);
    case 'api-usage':
      return `${(170 + Math.random() * 20).toFixed(0)}M calls`;
    case 'churn':
      return `${(105 + Math.random() * 5).toFixed(1)}%`;
    case 'gmv':
      return `$${(4_500_000 + Math.random() * 250_000).toLocaleString()}`;
    case 'orders':
      return (38_000 + Math.random() * 2_000).toFixed(0);
    case 'aov':
      return `$${(118 + Math.random() * 6).toFixed(2)}`;
    case 'return-rate':
      return `${(4 + Math.random() * 1).toFixed(1)}%`;
    case 'throughput':
      return `${(94 + Math.random() * 4).toFixed(1)}%`;
    case 'ideas':
      return (120 + Math.random() * 12).toFixed(0);
    case 'workload':
      return `${(78 + Math.random() * 6).toFixed(1)}%`;
    case 'plays':
      return `${(2 + Math.random() * 0.4).toFixed(1)}M`;
    case 'watch':
      return `${(7 + Math.random() * 0.4).toFixed(1)}m`;
    case 'subscribers':
      return `+${(68 + Math.random() * 8).toFixed(1)}K`;
    case 'engagement':
      return `${(84 + Math.random() * 4).toFixed(1)}%`;
    case 'learners':
      return (120_000 + Math.random() * 6_000).toFixed(0);
    case 'completion':
      return `${(76 + Math.random() * 4).toFixed(1)}%`;
    case 'quiz':
      return `${(84 + Math.random() * 4).toFixed(1)}%`;
    case 'cert':
      return (5_200 + Math.random() * 600).toFixed(0);
    default:
      return `${(Math.random() * 100).toFixed(1)}%`;
  }
}

export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      function pushEvent() {
        const moduleId = modules[Math.floor(Math.random() * modules.length)];
        const metricList = metricsByModule[moduleId];
        const metricId = metricList[Math.floor(Math.random() * metricList.length)];
        const payload = {
          module: moduleId,
          metricId,
          value: randomMetricValue(metricId),
          change: Number((Math.random() * 4).toFixed(1)),
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      }

      const interval = setInterval(pushEvent, 4000);
      const keepAlive = setInterval(() => controller.enqueue(encoder.encode(': keep-alive\n\n')), 15_000);

      pushEvent();

      return () => {
        clearInterval(interval);
        clearInterval(keepAlive);
      };
    },
    cancel() {},
  });

  return new NextResponse(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    },
  });
}
