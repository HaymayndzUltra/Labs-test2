import { NextRequest } from 'next/server';
import { processProposal } from '@/lib/automation/proposal';

export async function POST(request: NextRequest) {
  return processProposal(request);
}
