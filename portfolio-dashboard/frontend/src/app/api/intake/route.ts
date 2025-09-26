import { NextRequest } from 'next/server';
import { processIntake } from '@/lib/automation/intake';

export async function POST(request: NextRequest) {
  return processIntake(request);
}
