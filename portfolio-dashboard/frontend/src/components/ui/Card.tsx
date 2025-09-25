import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: 'sm' | 'md' | 'lg';
  as?: keyof JSX.IntrinsicElements;
};

const paddingMap: Record<NonNullable<CardProps['padding']>, string> = {
  sm: 'px-6 py-6',
  md: 'px-8 py-8',
  lg: 'px-10 py-10',
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
        'glass-card relative overflow-hidden transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-2xl',
        paddingMap[padding],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
