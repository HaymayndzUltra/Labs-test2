import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: 'sm' | 'md' | 'lg';
  as?: keyof JSX.IntrinsicElements;
};

const paddingMap: Record<NonNullable<CardProps['padding']>, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
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
        'glass-card relative overflow-hidden shadow-xl shadow-purple-500/10 transition-all duration-300 hover:-translate-y-0.5',
        paddingMap[padding],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
