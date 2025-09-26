import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ log: ['warn', 'error'] });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export const fetchSyntheticProfiles = async () => {
  return [
    { id: 'fintech', name: 'Fintech Pod', focus: 'Risk + Growth' },
    { id: 'healthcare', name: 'Healthcare Pod', focus: 'Clinical Quality' },
  ];
};
