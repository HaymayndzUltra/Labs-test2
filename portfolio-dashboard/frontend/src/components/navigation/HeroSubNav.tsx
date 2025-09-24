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

  return (
    <nav className={`hero-sub-nav ${className}`} aria-label="Workspace mode">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="inline-flex flex-wrap items-center gap-2 rounded-3xl bg-white/80 p-1 shadow-soft ring-1 ring-indigo-100/70">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMode === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleModeChange(item.id)}
                className={`group relative inline-flex items-center gap-3 rounded-2xl px-5 py-3 text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white shadow-soft'
                    : 'bg-transparent text-neutral-600 hover:bg-primary/5 hover:text-primary'
                } ${isTransitioning ? 'opacity-70' : ''}`}
                disabled={isTransitioning}
                aria-pressed={isActive}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`h-5 w-5 transition-transform ${
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                }`} aria-hidden="true" />

                <span className="flex flex-col items-start">
                  <span className="text-sm font-semibold">{item.label}</span>
                  <span className={`text-xs ${
                    isActive ? 'text-white/80' : 'text-neutral-500'
                  }`}>
                    {item.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-dashed border-indigo-200 px-4 py-2 text-sm text-neutral-600">
          <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>Workspace shortcuts</span>
        </div>
      </div>
    </nav>
  );
}
