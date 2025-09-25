import { ReactNode, useEffect } from 'react';
import { designTokens, injectTheme } from '../styles/tokens';

interface DesignSystemProviderProps {
  children: ReactNode;
}

export function DesignSystemProvider({ children }: DesignSystemProviderProps) {
  useEffect(() => {
    injectTheme(designTokens);
  }, []);

  return <>{children}</>;
}
