'use client';

import { BarChart3, Package, Sparkles } from 'lucide-react';
import { useState } from 'react';

export type NavigationMode = 'analytics' | 'catalog';

interface HeroSubNavProps {
  activeMode: NavigationMode;
  onModeChange: (mode: NavigationMode) => void;
  className?: string;
}

export function HeroSubNav({ activeMode, onModeChange, className = '' }: HeroSubNavProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleModeChange = (mode: NavigationMode) => {
    if (mode === activeMode) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      onModeChange(mode);
      setIsTransitioning(false);
    }, 150);
  };

  const navItems = [
    {
      id: 'analytics' as NavigationMode,
      label: 'Analytics',
      description: 'Performance insights and metrics',
      icon: BarChart3,
      href: '/dashboard/analytics',
    },
    {
      id: 'catalog' as NavigationMode,
      label: 'Product Catalog',
      description: 'Browse and manage products',
      icon: Package,
      href: '/dashboard/catalog',
    },
  ];

  const activeItem = navItems.find((item) => item.id === activeMode);

  return (
    <div className={`hero-sub-nav ${className}`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <nav
          className="flex flex-wrap items-center gap-2"
          aria-label="Workspace navigation"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMode === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleModeChange(item.id)}
                className={`group relative flex items-center gap-3 rounded-xl border px-5 py-3 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60 ${
                  isActive
                    ? 'border-primary bg-primary text-white shadow-soft'
                    : 'border-indigo-100/70 bg-white/90 text-neutral-600 hover:border-primary/40 hover:text-primary'
                } ${isTransitioning ? 'opacity-70' : ''}`}
                disabled={isTransitioning}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="relative z-[1] flex items-center gap-3">
                  <Icon
                    className={`h-5 w-5 transition-transform ${
                      isActive ? 'scale-110' : 'group-hover:scale-105'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold">{item.label}</span>
                    <span
                      className={`text-xs ${
                        isActive ? 'text-white/80' : 'text-neutral-500'
                      }`}
                    >
                      {item.description}
                    </span>
                  </span>
                </span>
                {isActive && (
                  <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-primary via-secondary to-primary opacity-20" />
                )}
              </button>
            );
          })}
        </nav>

        {activeItem ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100/80 bg-white px-4 py-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>Currently viewing • {activeItem.label}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
