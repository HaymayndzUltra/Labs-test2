'use client';

import { Bookmark, Check, Plus, X } from 'lucide-react';
import { useState, useCallback } from 'react';

export interface FilterSet {
  id: string;
  name: string;
  filters: {
    category?: string;
    brands?: string[];
    priceRange?: [number, number];
    delivery?: string;
    sort?: string;
  };
  createdAt: Date;
}

interface SaveFilterSetProps {
  currentFilters: FilterSet['filters'];
  onSaveFilterSet: (filterSet: FilterSet) => void;
  onLoadFilterSet: (filterSet: FilterSet) => void;
  className?: string;
}

export function SaveFilterSet({ 
  currentFilters, 
  onSaveFilterSet, 
  onLoadFilterSet,
  className = '' 
}: SaveFilterSetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [savedFilterSets, setSavedFilterSets] = useState<FilterSet[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio-dashboard-filter-sets');
      return saved ? JSON.parse(saved).map((set: any) => ({
        ...set,
        createdAt: new Date(set.createdAt)
      })) : [];
    }
    return [];
  });

  const handleSave = useCallback(() => {
    if (!filterName.trim()) return;

    const newFilterSet: FilterSet = {
      id: `filter-set-${Date.now()}`,
      name: filterName.trim(),
      filters: { ...currentFilters },
      createdAt: new Date(),
    };

    const updatedSets = [...savedFilterSets, newFilterSet];
    setSavedFilterSets(updatedSets);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio-dashboard-filter-sets', JSON.stringify(updatedSets));
    }

    onSaveFilterSet(newFilterSet);
    setFilterName('');
    setIsOpen(false);
  }, [filterName, currentFilters, savedFilterSets, onSaveFilterSet]);

  const handleLoad = useCallback((filterSet: FilterSet) => {
    onLoadFilterSet(filterSet);
    setIsOpen(false);
  }, [onLoadFilterSet]);

  const handleDelete = useCallback((id: string) => {
    const updatedSets = savedFilterSets.filter(set => set.id !== id);
    setSavedFilterSets(updatedSets);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio-dashboard-filter-sets', JSON.stringify(updatedSets));
    }
  }, [savedFilterSets]);

  const hasActiveFilters = Object.values(currentFilters).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && value !== '';
  });

  return (
    <div className={`save-filter-set relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center space-x-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
          hasActiveFilters
            ? 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/15'
            : 'border-indigo-100 bg-white/80 text-neutral-600 hover:border-primary/40 hover:text-primary'
        } hover:shadow-soft`}
        disabled={!hasActiveFilters}
      >
        <Bookmark className="h-4 w-4" />
        <span>Save Filter Set</span>
        {hasActiveFilters && (
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
            !
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-indigo-100/70 bg-white shadow-soft">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-neutral-900">Saved Filter Sets</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:text-neutral-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Save new filter set */}
            <div className="mb-4 space-y-3">
              <div>
                <label htmlFor="filter-name" className="block text-xs font-medium text-neutral-700 mb-1">
                  Save current filters as:
                </label>
                <input
                  id="filter-name"
                  type="text"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  placeholder="Enter filter set name..."
                  className="w-full rounded-lg border border-indigo-100 px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSave();
                    }
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleSave}
                disabled={!filterName.trim()}
                className="inline-flex w-full items-center justify-center space-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
                <span>Save Filter Set</span>
              </button>
            </div>

            {/* Load saved filter sets */}
            {savedFilterSets.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-neutral-700">Load saved sets:</h4>
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {savedFilterSets.map((filterSet) => (
                    <div
                      key={filterSet.id}
                      className="flex items-center justify-between rounded-lg border border-indigo-100/70 bg-white/80 p-3"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-neutral-900">
                          {filterSet.name}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {filterSet.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleLoad(filterSet)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20"
                          title="Load filter set"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(filterSet.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:text-red-500"
                          title="Delete filter set"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {savedFilterSets.length === 0 && (
              <div className="text-center py-4">
                <Bookmark className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-sm text-neutral-500">No saved filter sets yet</p>
                <p className="text-xs text-neutral-400">Save your current filters to get started</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
