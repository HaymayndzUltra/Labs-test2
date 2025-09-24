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
    <div className={`hero-sub-nav ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMode === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleModeChange(item.id)}
                className={`group relative flex items-center space-x-3 rounded-2xl px-6 py-4 transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white shadow-soft'
                    : 'text-neutral-600 hover:bg-white/80 hover:text-primary hover:shadow-soft'
                } ${isTransitioning ? 'opacity-70' : ''}`}
                disabled={isTransitioning}
              >
                <Icon className={`h-5 w-5 transition-transform ${
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                }`} />
                
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold">{item.label}</span>
                  <span className={`text-xs ${
                    isActive ? 'text-white/80' : 'text-neutral-500'
                  }`}>
                    {item.description}
                  </span>
                </div>
                
                {isActive && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-secondary to-primary opacity-20 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            type="button"
            className="inline-flex items-center space-x-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-sm font-medium text-neutral-600 transition hover:border-primary/40 hover:text-primary hover:shadow-soft"
          >
            <Sparkles className="h-4 w-4" />
            <span>Quick Actions</span>
          </button>
        </div>
      </div>
    </div>
  );
}
