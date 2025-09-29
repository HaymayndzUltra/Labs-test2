import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const moduleId = url.searchParams.get('module') ?? 'saas';
  const context = url.searchParams.get('context') ?? 'Global scope';
  const trigger = url.searchParams.get('trigger') ?? 'manual';
  const dateRange = url.searchParams.get('dateRange');
  const segment = url.searchParams.get('segment');
  const channel = url.searchParams.get('channel');

  let timezone = 'UTC';
  try {
    const formatter = new Intl.DateTimeFormat();
    timezone = formatter.resolvedOptions().timeZone ?? 'UTC';
  } catch (error) {
    timezone = 'UTC';
  }

  const now = new Date();
  const payload = {
    generatedAt: now.toISOString(),
    acknowledgedAt: now.toISOString(),
    timezone,
    module: moduleId,
    trigger,
    context,
    filters: {
      dateRange,
      segment,
      channel,
    },
  };

  return NextResponse.json(payload, {
    headers: {
      'cache-control': 'no-store',
    },
  });
}
