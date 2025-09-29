import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: 'sm' | 'md' | 'lg';
  as?: keyof React.JSX.IntrinsicElements;
};

const paddingMap: Record<NonNullable<CardProps['padding']>, string> = {
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export function Card({
  children,
  className,
  padding = 'md',
  as: Component = 'section',
  ...props
}: CardProps) {
  return (
    <Component
      className={cn(
        'glass-card relative overflow-hidden bg-[var(--surface-s1)] motion-safe:animate-section-scale',
        paddingMap[padding],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
