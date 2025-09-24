'use client';

import { Search, Sparkles, X, Filter, TrendingUp } from 'lucide-react';
import { useState, useCallback, useRef, useEffect } from 'react';

export interface SearchSuggestion {
  id: string;
  type: 'product' | 'category' | 'brand' | 'insight';
  label: string;
  description?: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface EnhancedSearchProps {
  onSearch: (query: string, filters?: SearchFilters) => void;
  suggestions?: SearchSuggestion[];
  placeholder?: string;
  className?: string;
}

export interface SearchFilters {
  category?: string;
  priceRange?: [number, number];
  brands?: string[];
  sortBy?: string;
}

export function EnhancedSearch({ 
  onSearch, 
  suggestions = [], 
  placeholder = "Search products, insights, or analytics...",
  className = '' 
}: EnhancedSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio-dashboard-recent-searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio-dashboard-recent-searches', JSON.stringify(updated));
    }
  }, [recentSearches]);

  const handleSearch = useCallback((searchQuery: string = query) => {
    if (!searchQuery.trim()) return;
    
    saveRecentSearch(searchQuery);
    onSearch(searchQuery, filters);
    setIsOpen(false);
  }, [query, filters, onSearch, saveRecentSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, [handleSearch]);

  const handleSuggestionClick = useCallback((suggestion: SearchSuggestion) => {
    setQuery(suggestion.label);
    handleSearch(suggestion.label);
  }, [handleSearch]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setFilters({});
    inputRef.current?.focus();
  }, []);

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.label.toLowerCase().includes(query.toLowerCase())
  );

  const hasActiveFilters = Object.values(filters).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && value !== '';
  });

  return (
    <div className={`enhanced-search relative ${className}`}>
      <div className="relative">
        <div className="flex items-center rounded-full border border-indigo-100 bg-white/80 shadow-soft backdrop-blur">
          <div className="flex items-center px-4 py-2">
            <Search className="h-4 w-4 text-neutral-500" />
          </div>
          
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="flex-1 border-0 bg-transparent text-sm text-neutral-600 placeholder:text-neutral-500 focus:outline-none"
            aria-label="Enhanced search"
          />
          
          <div className="flex items-center space-x-2 px-2">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20"
                title="Search filters"
              >
                <Filter className="h-4 w-4" />
              </button>
            )}
            
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:text-neutral-600"
                title="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            
            <button
              type="button"
              onClick={() => handleSearch()}
              className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow-soft transition hover:shadow-glow"
            >
              <Sparkles className="h-3 w-3" />
              Search
            </button>
          </div>
        </div>

        {/* Search Dropdown */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 z-50 mt-2 rounded-2xl border border-indigo-100/70 bg-white shadow-soft"
          >
            <div className="p-4">
              {/* Recent Searches */}
              {recentSearches.length > 0 && !query && (
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-neutral-700 mb-2">Recent searches</h4>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick({ id: `recent-${index}`, type: 'product', label: search })}
                        className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-50"
                      >
                        <Search className="h-4 w-4 text-neutral-400" />
                        <span>{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {query && (
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-neutral-700 mb-2">Suggestions</h4>
                  <div className="space-y-1">
                    {filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((suggestion) => {
                        const Icon = suggestion.icon || Search;
                        return (
                          <button
                            key={suggestion.id}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-neutral-50"
                          >
                            <Icon className="h-4 w-4 text-neutral-400" />
                            <div className="flex-1">
                              <div className="font-medium text-neutral-900">{suggestion.label}</div>
                              {suggestion.description && (
                                <div className="text-xs text-neutral-500">{suggestion.description}</div>
                              )}
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="text-center py-4">
                        <Search className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                        <p className="text-sm text-neutral-500">No suggestions found</p>
                        <p className="text-xs text-neutral-400">Try a different search term</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="border-t border-neutral-100 pt-4">
                <h4 className="text-xs font-medium text-neutral-700 mb-2">Quick actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick({ 
                      id: 'trending', 
                      type: 'insight', 
                      label: 'Trending Products',
                      description: 'See what\'s popular right now',
                      icon: TrendingUp
                    })}
                    className="flex items-center space-x-2 rounded-lg border border-indigo-100 px-3 py-2 text-sm text-neutral-600 hover:bg-indigo-50"
                  >
                    <TrendingUp className="h-4 w-4" />
                    <span>Trending</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick({ 
                      id: 'analytics', 
                      type: 'insight', 
                      label: 'Analytics Dashboard',
                      description: 'View performance metrics'
                    })}
                    className="flex items-center space-x-2 rounded-lg border border-indigo-100 px-3 py-2 text-sm text-neutral-600 hover:bg-indigo-50"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Analytics</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Filters Panel */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 z-40 mt-2 rounded-2xl border border-indigo-100/70 bg-white p-4 shadow-soft">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-neutral-900">Search Filters</h4>
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:text-neutral-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Category</label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value || undefined }))}
                  className="w-full rounded-lg border border-indigo-100 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">All Categories</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="home">Home & Garden</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Sort By</label>
                <select
                  value={filters.sortBy || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value || undefined }))}
                  className="w-full rounded-lg border border-indigo-100 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popularity">Most Popular</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    setFilters({});
                    setShowFilters(false);
                  }}
                  className="w-full rounded-lg border border-indigo-100 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
