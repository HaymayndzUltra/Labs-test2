'use client';

import { useState, useCallback } from 'react';
import { BreadcrumbNav, type BreadcrumbItem } from './BreadcrumbNav';
import { HeroSubNav, type NavigationMode } from './HeroSubNav';
import { SaveFilterSet, type FilterSet } from './SaveFilterSet';
import { EnhancedSearch, type SearchSuggestion, type SearchFilters } from './EnhancedSearch';

interface NavigationLayoutProps {
  breadcrumbItems?: BreadcrumbItem[];
  activeMode: NavigationMode;
  onModeChange: (mode: NavigationMode) => void;
  currentFilters: FilterSet['filters'];
  onFiltersChange: (filters: FilterSet['filters']) => void;
  onSearch: (query: string, filters?: SearchFilters) => void;
  searchSuggestions?: SearchSuggestion[];
  className?: string;
}

export function NavigationLayout({
  breadcrumbItems,
  activeMode,
  onModeChange,
  currentFilters,
  onFiltersChange,
  onSearch,
  searchSuggestions,
  className = '',
}: NavigationLayoutProps) {
  const [savedFilterSets, setSavedFilterSets] = useState<FilterSet[]>([]);

  const modeMetadata: Record<NavigationMode, { title: string; subtitle: string }> = {
    analytics: {
      title: 'Analytics workspace',
      subtitle: 'Monitor customer performance, revenue trends, and health metrics.',
    },
    catalog: {
      title: 'Product catalog workspace',
      subtitle: 'Merchandise inventory, refine filters, and curate product selections.',
    },
  };

  const activeModeMetadata = modeMetadata[activeMode];

  const handleSaveFilterSet = useCallback((filterSet: FilterSet) => {
    setSavedFilterSets(prev => [...prev, filterSet]);
    // You could also show a toast notification here
    console.log('Filter set saved:', filterSet.name);
  }, []);

  const handleLoadFilterSet = useCallback((filterSet: FilterSet) => {
    onFiltersChange(filterSet.filters);
    // You could also show a toast notification here
    console.log('Filter set loaded:', filterSet.name);
  }, [onFiltersChange]);

  const handleSearch = useCallback((query: string, filters?: SearchFilters) => {
    onSearch(query, filters);
    // You could also update URL parameters or trigger analytics here
    console.log('Search performed:', { query, filters });
  }, [onSearch]);

  return (
    <div className={`navigation-layout space-y-6 ${className}`}>
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav items={breadcrumbItems} />

      {/* Hero Section with Sub-Navigation */}
      <div className="hero-section">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary/90 via-secondary/80 to-primary/60 text-lg font-semibold text-white shadow-soft">
              CX
            </div>
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-primary">Commerce experience</span>
              <h1 className="mt-1 text-2xl font-semibold text-neutral-900 md:text-3xl">
                {activeModeMetadata.title}
              </h1>
              <p className="mt-1 text-sm text-neutral-600">
                {activeModeMetadata.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <SaveFilterSet
              currentFilters={currentFilters}
              onSaveFilterSet={handleSaveFilterSet}
              onLoadFilterSet={handleLoadFilterSet}
            />
          </div>
        </div>

        {/* Hero Sub-Navigation */}
        <div className="mt-6">
          <HeroSubNav activeMode={activeMode} onModeChange={onModeChange} />
        </div>
      </div>

      {/* Enhanced Search Bar */}
      <div className="search-section">
        <EnhancedSearch
          onSearch={handleSearch}
          suggestions={searchSuggestions}
          placeholder="Search products, insights, or analytics..."
        />
      </div>
    </div>
  );
}
