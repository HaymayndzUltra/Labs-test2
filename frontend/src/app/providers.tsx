'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/lib/design-system/theme-context';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <ThemeProvider>{children}</ThemeProvider>;
}