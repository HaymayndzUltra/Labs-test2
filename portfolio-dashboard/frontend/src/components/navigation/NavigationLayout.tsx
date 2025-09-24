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
              <p className="text-lg font-semibold text-neutral-900">Commerce Experience</p>
              <p className="text-sm text-neutral-600">Enterprise analytics workspace</p>
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
