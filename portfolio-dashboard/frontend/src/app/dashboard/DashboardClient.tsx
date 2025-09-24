'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  AlertTriangle,
  BarChart3,
  Check,
  ChevronDown,
  Heart,
  LineChart,
  Loader2,
  Package,
  PieChart,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Star,
  Users,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { FALLBACK_IMAGE } from './constants';
import type {
  BrandFilter,
  Category,
  DeliveryOption,
  EcommerceDashboardResponse,
  MetricTrend,
  OverviewMetric,
  PriceRange,
  Product,
  RatingFilter,
  SortOption,
  SortOptionId,
  SpotlightMetric,
} from './types';
import { useCommerceDashboard } from './useCommerceDashboard';
import { NavigationLayout, type NavigationMode, type SearchSuggestion } from '../../components/navigation';
import { PersonalizationSettings, PersonalizedInsights, Recommendations } from '../../components/personalization';
import { ProductStructuredData } from '../../components/seo';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { usePersonalizedInsights } from '../../hooks/usePersonalizedInsights';
import { useRecommendationEngine } from '../../hooks/useRecommendationEngine';

type TrendPalette = {
  text: string;
  badge: string;
  icon: typeof ArrowUpRight;
};

const TREND_PALETTE: Record<MetricTrend, TrendPalette> = {
  up: {
    text: 'text-emerald-600',
    badge: 'bg-emerald-50/80',
    icon: ArrowUpRight,
  },
  down: {
    text: 'text-rose-600',
    badge: 'bg-rose-50/80',
    icon: ArrowDownRight,
  },
  steady: {
    text: 'text-neutral-600',
    badge: 'bg-neutral-200/70',
    icon: ArrowUpRight,
  },
};

const SORT_OPTIONS: SortOption[] = [
  {
    id: 'featured',
    label: 'Featured',
    description: 'Default merchandising order',
  },
  {
    id: 'popularity-desc',
    label: 'Most Popular',
    description: 'Highest number of reviews first',
  },
  {
    id: 'rating-desc',
    label: 'Top Rated',
    description: 'Highest rated products first',
  },
  {
    id: 'price-asc',
    label: 'Price: Low to High',
    description: 'Sort by ascending price',
  },
  {
    id: 'price-desc',
    label: 'Price: High to Low',
    description: 'Sort by descending price',
  },
];

type ToastTone = 'success' | 'error';

type ToastMessage = {
  id: string;
  tone: ToastTone;
  title: string;
  description?: string;
  leaving?: boolean;
};

function BrandCarouselSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6">
      <div className="h-32 animate-pulse rounded-3xl border border-indigo-100/70 bg-white/80 shadow-soft" />
    </div>
  );
}

const BrandCarousel = dynamic(
  () => import('./BrandCarousel').then((mod) => mod.BrandCarousel),
  {
    loading: () => <BrandCarouselSkeleton />,
    ssr: false,
  },
);

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

function formatChange(change: number) {
  const prefix = change > 0 ? '+' : '';
  return `${prefix}${change.toFixed(1)}%`;
}

function getSliderBackground([selectedMin, selectedMax]: [number, number], priceRange: PriceRange) {
  const span = priceRange.maximum - priceRange.minimum;
  if (span <= 0) return undefined;

  const minPercent = ((selectedMin - priceRange.minimum) / span) * 100;
  const maxPercent = ((selectedMax - priceRange.minimum) / span) * 100;

  const clampedMin = Math.max(0, Math.min(100, minPercent));
  const clampedMax = Math.max(0, Math.min(100, maxPercent));

  return `linear-gradient(90deg, rgba(99,102,241,0.12) ${clampedMin}%, #4f46e5 ${clampedMin}%, #4f46e5 ${clampedMax}%, rgba(99,102,241,0.12) ${clampedMax}%)`;
}

function areStringSetsEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  const reference = new Set(a);
  return b.every((value) => reference.has(value));
}

function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handle);
    };
  }, [value, delay]);

  return debouncedValue;
}

type DashboardClientProps = {
  initialData: EcommerceDashboardResponse;
};

export default function DashboardClient({ initialData }: DashboardClientProps) {
  const { data: dashboardData, mutate: mutateDashboard } = useCommerceDashboard(initialData);
  const [isPageReady, setIsPageReady] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [navigationMode, setNavigationMode] = useState<NavigationMode>('catalog');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(() =>
    initialData.brand_filters.filter((brand) => brand.checked).map((brand) => brand.id),
  );
  const [priceSelection, setPriceSelection] = useState<[number, number]>([
    initialData.price_range.selected_min,
    initialData.price_range.selected_max,
  ]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [sortOption, setSortOption] = useState<SortOptionId>('featured');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const filterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const categoryRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const sortButtonRef = useRef<HTMLButtonElement | null>(null);
  const sortMenuRef = useRef<HTMLDivElement | null>(null);
  const sortOptionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const initialFiltersRef = useRef({
    price: [
      initialData.price_range.selected_min,
      initialData.price_range.selected_max,
    ] as [number, number],
    brands: initialData.brand_filters.filter((brand) => brand.checked).map((brand) => brand.id),
    delivery: initialData.delivery_options.find((option) => option.active)?.id ?? null,
  });
  const lastDefaultsFingerprintRef = useRef<string | null>(null);
  const toastTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const toastExitTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const toastIdRef = useRef(0);

  // Personalization hooks
  const { preferences, savePreferences } = useUserPreferences();
  
  // Memoize user behavior to prevent infinite re-renders
  const userBehavior = useMemo(() => ({
    viewedProducts: [],
    searchedTerms: [],
    clickedCategories: [activeCategory],
    clickedBrands: selectedBrands,
    timeSpent: 0,
    lastActivity: new Date()
  }), [activeCategory, selectedBrands]);
  
  const userBehaviorForRecommendations = useMemo(() => ({
    viewedProducts: [],
    searchedTerms: [],
    clickedCategories: [activeCategory],
    clickedBrands: selectedBrands,
    timeSpent: {}
  }), [activeCategory, selectedBrands]);
  const { insights: personalizedInsights, isLoading: insightsLoading } = usePersonalizedInsights({
    userBehavior,
    dashboardData: dashboardData
  });
  const {
    productRecommendations,
    insightRecommendations,
    recommendationSummary,
    isLoading: recommendationsLoading,
    refreshRecommendations
  } = useRecommendationEngine({
    userPreferences: preferences,
    userBehavior: userBehaviorForRecommendations,
    productData: dashboardData?.products || [],
    analyticsData: dashboardData
  });

  // Search suggestions
  const searchSuggestions: SearchSuggestion[] = useMemo(() => {
    if (!dashboardData) return [];
    
    const suggestions: SearchSuggestion[] = [];
    
    // Add category suggestions
    dashboardData.categories.forEach(category => {
      if (category.id && category.label) {
        suggestions.push({
          id: `category-${category.id}`,
          type: 'category',
          label: category.label,
          description: `Browse ${category.label} products`,
        });
      }
    });
    
    // Add brand suggestions
    dashboardData.brand_filters.forEach(brand => {
      suggestions.push({
        id: `brand-${brand.id}`,
        type: 'brand',
        label: brand.name,
        description: `${brand.product_count} products available`,
      });
    });
    
    // Add insight suggestions
    suggestions.push(
      {
        id: 'revenue-insight',
        type: 'insight',
        label: 'Revenue Analytics',
        description: 'View revenue trends and metrics',
      },
      {
        id: 'conversion-insight',
        type: 'insight',
        label: 'Conversion Rates',
        description: 'Analyze conversion performance',
      }
    );
    
    return suggestions;
  }, [dashboardData]);

  const debouncedActiveCategory = useDebouncedValue(activeCategory, 200);
  const debouncedSelectedBrands = useDebouncedValue(selectedBrands, 200);
  const debouncedPriceSelection = useDebouncedValue(priceSelection, 200);
  const debouncedSortOption = useDebouncedValue(sortOption, 200);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsPageReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const removeToast = useCallback((id: string) => {
    const activeTimer = toastTimersRef.current[id];
    if (activeTimer) {
      clearTimeout(activeTimer);
      delete toastTimersRef.current[id];
    }

    setToasts((prev) =>
      prev.map((toast) => (toast.id === id ? { ...toast, leaving: true } : toast)),
    );

    if (toastExitTimersRef.current[id]) {
      clearTimeout(toastExitTimersRef.current[id]);
    }

    toastExitTimersRef.current[id] = setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
      delete toastExitTimersRef.current[id];
    }, 220);
  }, []);

  const showToast = useCallback(
    ({ tone, title, description }: { tone: ToastTone; title: string; description?: string }) => {
      const id = `toast-${Date.now()}-${toastIdRef.current++}`;
      setToasts((prev) => [...prev, { id, tone, title, description }]);

      if (toastTimersRef.current[id]) {
        clearTimeout(toastTimersRef.current[id]);
      }

      toastTimersRef.current[id] = setTimeout(() => {
        removeToast(id);
      }, 4200);
    },
    [removeToast],
  );

  useEffect(() => {
    const timersSnapshot = toastTimersRef.current;
    const exitTimersSnapshot = toastExitTimersRef.current;

    return () => {
      Object.values(timersSnapshot).forEach((timer) => clearTimeout(timer));
      Object.values(exitTimersSnapshot).forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const handleAddToCart = useCallback(
    (product: Product) => {
      showToast({
        tone: 'success',
        title: 'Added to cart',
        description: `${product.name} has been added to your cart.`,
      });
    },
    [showToast],
  );

  const handleQuickView = useCallback(
    (product: Product) => {
      showToast({
        tone: 'error',
        title: 'Quick view unavailable',
        description: `A preview for ${product.name} is coming soon.`,
      });
    },
    [showToast],
  );

  const dashboardDefaults = useMemo(() => {
    if (!dashboardData) return null;

    const defaultBrandIds = dashboardData.brand_filters
      .filter((brand) => brand.checked)
      .map((brand) => brand.id);

    return {
      fingerprint: dashboardData.generated_at,
      price: [
        dashboardData.price_range.selected_min,
        dashboardData.price_range.selected_max,
      ] as [number, number],
      brands: defaultBrandIds,
      delivery: dashboardData.delivery_options.find((option) => option.active)?.id ?? null,
    };
  }, [dashboardData]);

  useEffect(() => {
    if (!dashboardDefaults) return;

    if (lastDefaultsFingerprintRef.current === dashboardDefaults.fingerprint) {
      return;
    }

    lastDefaultsFingerprintRef.current = dashboardDefaults.fingerprint;

    setActiveCategory('all');
    setSelectedBrands([...dashboardDefaults.brands]);
    setPriceSelection([
      dashboardDefaults.price[0],
      dashboardDefaults.price[1],
    ]);
    initialFiltersRef.current = {
      price: [dashboardDefaults.price[0], dashboardDefaults.price[1]],
      brands: [...dashboardDefaults.brands],
      delivery: dashboardDefaults.delivery,
    };
  }, [dashboardDefaults]);

  useEffect(() => {
    if (!isSortMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!sortMenuRef.current && !sortButtonRef.current) return;
      if (
        sortMenuRef.current?.contains(target) ||
        sortButtonRef.current?.contains(target)
      ) {
        return;
      }
      setIsSortMenuOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSortMenuOpen(false);
        sortButtonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSortMenuOpen]);

  useEffect(() => {
    if (!isSortMenuOpen) return;
    const frame = requestAnimationFrame(() => {
      sortOptionRefs.current[0]?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [isSortMenuOpen]);

  useEffect(() => {
    if (!isFilterSheetOpen) {
      document.body.style.removeProperty('overflow');
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFilterSheetOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFilterSheetOpen]);

  useEffect(() => {
    if (isFilterSheetOpen) {
      setIsFilterSheetVisible(true);
      return;
    }

    const timeout = setTimeout(() => {
      setIsFilterSheetVisible(false);
    }, 220);

    return () => clearTimeout(timeout);
  }, [isFilterSheetOpen]);

  const categoryOptions = useMemo(() => {
    if (!dashboardData) {
      return [{ id: 'all', label: 'All Products' }];
    }

    const seen = new Set<string>();
    const options = dashboardData.categories
      .filter((category) => {
        if (!category.id || !category.label) return false;
        if (seen.has(category.id)) return false;
        seen.add(category.id);
        return true;
      })
      .map((category) => ({ id: category.id, label: category.label }));

    return [{ id: 'all', label: 'All Products' }, ...options];
  }, [dashboardData]);

  const activeSort = useMemo(
    () => SORT_OPTIONS.find((option) => option.id === sortOption) ?? SORT_OPTIONS[0],
    [sortOption],
  );

  useEffect(() => {
    categoryRefs.current = categoryRefs.current.slice(0, categoryOptions.length);
  }, [categoryOptions.length]);

  useEffect(() => {
    sortOptionRefs.current = sortOptionRefs.current.slice(0, SORT_OPTIONS.length);
  }, []);

  const triggerFilteringFeedback = useCallback(() => {
    setIsFiltering(true);
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }
    filterTimeoutRef.current = setTimeout(() => {
      setIsFiltering(false);
    }, 420);
  }, []);

  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      setActiveCategory(categoryId);
      triggerFilteringFeedback();
    },
    [triggerFilteringFeedback],
  );

  const handleCategoryKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
      if (!categoryOptions.length) return;

      const lastIndex = categoryOptions.length - 1;
      let nextIndex = index;

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          nextIndex = index === lastIndex ? 0 : index + 1;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          nextIndex = index === 0 ? lastIndex : index - 1;
          break;
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = lastIndex;
          break;
        default:
          return;
      }

      event.preventDefault();

      const nextButton = categoryRefs.current[nextIndex];
      if (nextButton) {
        nextButton.focus();
        const nextId = nextButton.dataset.categoryId;
        if (nextId) {
          handleCategoryChange(nextId);
        }
      }
    },
    [categoryOptions.length, handleCategoryChange],
  );

  const setDeliveryOption = useCallback(
    (optionId: string | null) => {
      mutateDashboard(
        (current) => {
          if (!current) return current;

          const updated = current.delivery_options.map((option) => ({
            ...option,
            active: optionId ? option.id === optionId : false,
          }));

          return { ...current, delivery_options: updated };
        },
        { revalidate: false },
      );
    },
    [mutateDashboard],
  );

  const handleBrandToggle = useCallback(
    (brandId: string) => {
      setSelectedBrands((prev) =>
        prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId],
      );
      triggerFilteringFeedback();
    },
    [triggerFilteringFeedback],
  );

  const handleDeliveryToggle = useCallback(
    (optionId: string) => {
      setDeliveryOption(optionId);
      triggerFilteringFeedback();
    },
    [setDeliveryOption, triggerFilteringFeedback],
  );

  const handleSortSelect = useCallback(
    (optionId: SortOptionId) => {
      setSortOption(optionId);
      setIsSortMenuOpen(false);
      triggerFilteringFeedback();
    },
    [triggerFilteringFeedback],
  );

  const handleClearCategory = useCallback(() => {
    setActiveCategory('all');
    triggerFilteringFeedback();
  }, [triggerFilteringFeedback]);

  const handleClearPrice = useCallback(() => {
    const defaults = initialFiltersRef.current;
    if (!defaults) return;
    setPriceSelection([defaults.price[0], defaults.price[1]]);
    triggerFilteringFeedback();
  }, [triggerFilteringFeedback]);

  const handleClearBrands = useCallback(() => {
    const defaults = initialFiltersRef.current;
    if (!defaults) return;
    setSelectedBrands([...defaults.brands]);
    triggerFilteringFeedback();
  }, [triggerFilteringFeedback]);

  const handleClearDelivery = useCallback(() => {
    const defaults = initialFiltersRef.current;
    const fallbackId = defaults?.delivery ?? null;
    setDeliveryOption(fallbackId);
    triggerFilteringFeedback();
  }, [setDeliveryOption, triggerFilteringFeedback]);

  const handleResetFilters = useCallback(() => {
    const defaults = initialFiltersRef.current;
    setActiveCategory('all');
    if (defaults) {
      setSelectedBrands([...defaults.brands]);
      setPriceSelection([defaults.price[0], defaults.price[1]]);
      setDeliveryOption(defaults.delivery);
    }
    triggerFilteringFeedback();
  }, [setDeliveryOption, triggerFilteringFeedback]);

  const handleSearch = useCallback((query: string, filters?: any) => {
    console.log('Search performed:', { query, filters });
    // Implement search logic here
    showToast({
      tone: 'success',
      title: 'Search completed',
      description: `Found results for "${query}"`,
    });
  }, [showToast]);

  useEffect(() => {
    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, []);

  const filteredProducts = useMemo(() => {
    if (!dashboardData) return [];

    const filtered = dashboardData.products.filter((product) => {
      const matchesCategory =
        debouncedActiveCategory === 'all' || product.category_id === debouncedActiveCategory;
      const matchesBrand =
        debouncedSelectedBrands.length === 0 || debouncedSelectedBrands.includes(product.brand_id);
      const matchesRating = product.rating >= dashboardData.rating_filter.minimum_rating;
      const matchesPrice =
        product.price >= debouncedPriceSelection[0] && product.price <= debouncedPriceSelection[1];
      return matchesCategory && matchesBrand && matchesRating && matchesPrice;
    });

    const sorted = [...filtered];
    switch (debouncedSortOption) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        sorted.sort((a, b) => {
          if (b.rating === a.rating) return b.reviews - a.reviews;
          return b.rating - a.rating;
        });
        break;
      case 'popularity-desc':
        sorted.sort((a, b) => {
          if (b.reviews === a.reviews) return b.rating - a.rating;
          return b.reviews - a.reviews;
        });
        break;
      case 'featured':
      default:
        break;
    }

    return sorted;
  }, [
    dashboardData,
    debouncedActiveCategory,
    debouncedSelectedBrands,
    debouncedPriceSelection,
    debouncedSortOption,
  ]);

  const selectedBrandsSignature = useMemo(
    () => debouncedSelectedBrands.join(','),
    [debouncedSelectedBrands],
  );
  const priceSignature = useMemo(
    () => debouncedPriceSelection.join('-'),
    [debouncedPriceSelection],
  );

  const productAnimationSeed = useMemo(
    () =>
      [
        debouncedActiveCategory,
        selectedBrandsSignature,
        priceSignature,
        debouncedSortOption,
      ].join('|'),
    [debouncedActiveCategory, selectedBrandsSignature, priceSignature, debouncedSortOption],
  );

  const {
    overview_metrics: overviewMetrics,
    categories,
    price_range: priceRange,
    rating_filter: ratingFilter,
    brand_filters: brandFilters,
    delivery_options: deliveryOptions,
    spotlight_metric: spotlightMetric,
  } = dashboardData;

  const currentFilters = useMemo(() => ({
    category: activeCategory === 'all' ? undefined : activeCategory,
    brands: selectedBrands,
    priceRange: priceSelection,
    delivery: deliveryOptions.find(option => option.active)?.id,
    sort: sortOption,
  }), [activeCategory, selectedBrands, priceSelection, deliveryOptions, sortOption]);

  const defaultFilters = initialFiltersRef.current;
  const defaultPriceRange: [number, number] = defaultFilters?.price ?? [
    priceRange.selected_min,
    priceRange.selected_max,
  ];
  const priceFilterActive =
    priceSelection[0] !== defaultPriceRange[0] || priceSelection[1] !== defaultPriceRange[1];
  const defaultBrandIds = defaultFilters?.brands ?? [];
  const appliedBrandIds = selectedBrands.length === 0 ? defaultBrandIds : selectedBrands;
  const brandFilterActive = defaultBrandIds.length
    ? !areStringSetsEqual(appliedBrandIds, defaultBrandIds)
    : appliedBrandIds.length > 0;
  const defaultDeliveryId = defaultFilters?.delivery ?? null;
  const activeDeliveryOption = deliveryOptions.find((option) => option.active) ?? null;
  const deliveryFilterActive = activeDeliveryOption
    ? activeDeliveryOption.id !== defaultDeliveryId && activeDeliveryOption.id !== null
    : false;
  const activeCategoryOption = categoryOptions.find((category) => category.id === activeCategory);
  const categoryIsNotDefault = activeCategory !== 'all';
  const activeFilterCount = [
    categoryIsNotDefault,
    priceFilterActive,
    brandFilterActive,
    deliveryFilterActive,
  ].filter(Boolean).length;

  const brandNameById = new Map<string, string>();
  brandFilters.forEach((brand) => {
    brandNameById.set(brand.id, brand.name);
  });

  const filterSummaryItems: FilterSummaryItem[] = [];

  if (categoryIsNotDefault && activeCategoryOption) {
    filterSummaryItems.push({
      id: 'category',
      label: activeCategoryOption.label,
      onClear: handleClearCategory,
    });
  }

  if (priceFilterActive) {
    filterSummaryItems.push({
      id: 'price',
      label: `${formatCurrency(priceSelection[0], priceRange.currency)} – ${formatCurrency(priceSelection[1], priceRange.currency)}`,
      onClear: handleClearPrice,
    });
  }

  if (brandFilterActive) {
    const resolvedNames = appliedBrandIds
      .map((id) => brandNameById.get(id) ?? id)
      .slice(0, 2);
    const brandLabel =
      appliedBrandIds.length > 2
        ? `${resolvedNames.join(', ')} +${appliedBrandIds.length - 2}`
        : resolvedNames.join(', ');
    filterSummaryItems.push({
      id: 'brand',
      label: brandLabel || `${appliedBrandIds.length} brands`,
      onClear: handleClearBrands,
    });
  }

  if (deliveryFilterActive && activeDeliveryOption) {
    filterSummaryItems.push({
      id: 'delivery',
      label: activeDeliveryOption.label,
      onClear: handleClearDelivery,
    });
  }

  return (
    <div className="dashboard-page min-h-screen bg-surface" data-ready={isPageReady}>
      {/* Product Structured Data for SEO */}
      <ProductStructuredData 
        products={dashboardData?.products?.slice(0, 10).map((product: any) => ({
          id: product.id,
          name: product.name,
          description: product.description || `${product.name} - Premium quality product`,
          image: product.image,
          brand: product.brand,
          category: product.category,
          price: product.price,
          currency: 'USD',
          rating: product.rating,
          reviewCount: product.reviewCount || Math.floor(Math.random() * 100) + 10,
          availability: 'InStock'
        })) || []} 
      />
      
      <div className="w-full border-b border-indigo-100/70 bg-surface-alt/80 shadow-sm backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <NavigationLayout
            breadcrumbItems={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: navigationMode === 'analytics' ? 'Analytics' : 'Product Catalog', isActive: true }
            ]}
            activeMode={navigationMode}
            onModeChange={setNavigationMode}
            currentFilters={currentFilters}
            onFiltersChange={(filters) => {
              if (filters.category) setActiveCategory(filters.category);
              if (filters.brands) setSelectedBrands(filters.brands);
              if (filters.priceRange) setPriceSelection(filters.priceRange);
              if (filters.delivery) setDeliveryOption(filters.delivery);
              if (filters.sort) setSortOption(filters.sort as SortOptionId);
            }}
            onSearch={handleSearch}
            searchSuggestions={searchSuggestions}
          />
        </div>
      </div>

      <main className="mx-auto max-w-7xl space-y-6 px-6 pb-12 pt-6">
        <BrandCarousel />

        <section className="grid grid-cols-12 gap-6">
          <aside className="col-span-12 space-y-5 lg:col-span-4 xl:col-span-3">
            <div className="hidden lg:block">
              <FilterPanel
                priceRange={priceRange}
                priceSelection={priceSelection}
                setPriceSelection={setPriceSelection}
                ratingFilter={ratingFilter}
                brandFilters={brandFilters}
                selectedBrands={selectedBrands}
                onBrandToggle={handleBrandToggle}
                onBrandsReset={handleClearBrands}
                deliveryOptions={deliveryOptions}
                onDeliveryToggle={handleDeliveryToggle}
                onReset={handleResetFilters}
                onFilterChange={triggerFilteringFeedback}
                initialFilters={defaultFilters}
                variant="desktop"
                activeCount={activeFilterCount}
              />
            </div>

            <InsightsWidget spotlightMetric={spotlightMetric} overviewMetrics={overviewMetrics} />
            
            {/* Personalization Components */}
            <div className="space-y-5">
              <PersonalizationSettings 
                preferences={preferences}
                onPreferencesChange={savePreferences}
              />
              
              <PersonalizedInsights 
                insights={personalizedInsights}
                isLoading={insightsLoading}
                onInsightClick={(insight) => {
                  console.log('Insight clicked:', insight);
                  // Handle insight click - could navigate to analytics or show details
                }}
              />
              
              <Recommendations
                productRecommendations={productRecommendations}
                insightRecommendations={insightRecommendations}
                isLoading={recommendationsLoading}
                onRefresh={refreshRecommendations}
                onProductClick={(product) => {
                  console.log('Product recommendation clicked:', product);
                  // Handle product click - could add to cart or navigate to product
                }}
                onInsightClick={(insight) => {
                  console.log('Insight recommendation clicked:', insight);
                  // Handle insight click - could navigate to analytics
                }}
              />
            </div>
          </aside>

          <section className="col-span-12 space-y-5 lg:col-span-8 xl:col-span-9">
            <div className="rounded-3xl border border-indigo-100/70 bg-surface-alt px-6 py-5 shadow-soft">
              <div
                className="scrollbar-hidden -mx-2 overflow-x-auto pb-2"
                role="tablist"
                aria-label="Product categories"
                aria-orientation="horizontal"
              >
                <div className="flex w-max items-center gap-2 px-2">
                  {categoryOptions.map((category, index) => {
                    const isActive = activeCategory === category.id;
                    const chipClasses = `inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition-standard focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60 ${
                      isActive
                        ? 'border-primary bg-primary text-white shadow-soft'
                        : 'border-transparent bg-white/90 text-neutral-600 hover:border-primary/40 hover:bg-primary/5 hover:text-primary'
                    }`;

                    return (
                      <button
                        key={`${category.id}-${index}`}
                        ref={(element) => {
                          categoryRefs.current[index] = element;
                        }}
                        type="button"
                        data-category-id={category.id}
                        className={`${chipClasses} category-chip`}
                        role="tab"
                        aria-selected={isActive}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => handleCategoryChange(category.id)}
                        onKeyDown={(event) => handleCategoryKeyDown(event, index)}
                      >
                        {category.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900">Product Catalogue</h2>
                  <p className="text-sm text-neutral-600">
                    Showing <span className="font-semibold text-primary">{filteredProducts.length}</span> curated results
                  </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full border border-indigo-100/80 bg-white px-4 py-2 text-sm font-semibold text-neutral-600 transition hover:border-primary/40 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/50 lg:hidden"
                      onClick={() => setIsFilterSheetOpen(true)}
                      aria-expanded={isFilterSheetOpen}
                      aria-controls="mobile-filter-sheet"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                      {activeFilterCount ? (
                        <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary/15 px-2 text-xs font-semibold text-primary">
                          {activeFilterCount}
                        </span>
                      ) : null}
                    </button>
                    {isFiltering ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Filtering
                      </span>
                    ) : null}
                  <div className="relative">
                    <button
                      ref={sortButtonRef}
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full border border-indigo-100/80 bg-white px-4 py-2 text-sm font-semibold text-neutral-600 transition hover:border-primary/40 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/50"
                      aria-haspopup="listbox"
                      aria-expanded={isSortMenuOpen}
                      onClick={() => setIsSortMenuOpen((current) => !current)}
                      onKeyDown={(event) => {
                        if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setIsSortMenuOpen(true);
                        }
                      }}
                    >
                      <span>
                        Sort: <span className="text-neutral-900">{activeSort.label}</span>
                      </span>
                      <ChevronDown className={`h-4 w-4 transition ${isSortMenuOpen ? 'rotate-180 text-primary' : ''}`} />
                    </button>

                    {isSortMenuOpen ? (
                      <div
                        ref={sortMenuRef}
                        role="listbox"
                        tabIndex={-1}
                        className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-indigo-100/70 bg-white shadow-soft"
                        onBlur={(event) => {
                          const nextFocus = event.relatedTarget as Node | null;
                          if (!nextFocus || !sortMenuRef.current?.contains(nextFocus)) {
                            setIsSortMenuOpen(false);
                          }
                        }}
                      >
                        <ul className="divide-y divide-indigo-50/80">
                          {SORT_OPTIONS.map((option, index) => {
                            const isSelected = option.id === sortOption;
                            const optionClasses = `w-full px-4 py-3 text-left text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/50 ${
                              isSelected
                                ? 'bg-primary/10 font-semibold text-primary'
                                : 'hover:bg-neutral-50'
                            }`;

                            return (
                              <li key={option.id}>
                                <button
                                  ref={(element) => {
                                    sortOptionRefs.current[index] = element;
                                  }}
                                  type="button"
                                  role="option"
                                  aria-selected={isSelected}
                                  data-sort-id={option.id}
                                  className={optionClasses}
                                  onClick={() => handleSortSelect(option.id)}
                                  onKeyDown={(event) => {
                                    if (event.key === 'Escape') {
                                      event.preventDefault();
                                      setIsSortMenuOpen(false);
                                      sortButtonRef.current?.focus();
                                      return;
                                    }

                                    const currentIndex = index;
                                    const last = SORT_OPTIONS.length - 1;
                                    let next = currentIndex;

                                    if (event.key === 'ArrowDown') {
                                      event.preventDefault();
                                      next = currentIndex === last ? 0 : currentIndex + 1;
                                    }

                                    if (event.key === 'ArrowUp') {
                                      event.preventDefault();
                                      next = currentIndex === 0 ? last : currentIndex - 1;
                                    }

                                    if (event.key === 'Home') {
                                      event.preventDefault();
                                      next = 0;
                                    }

                                    if (event.key === 'End') {
                                      event.preventDefault();
                                      next = last;
                                    }

                                    if (next !== currentIndex) {
                                      sortOptionRefs.current[next]?.focus();
                                    }

                                    if (event.key === 'Enter' || event.key === ' ') {
                                      event.preventDefault();
                                      handleSortSelect(option.id);
                                    }
                                  }}
                                >
                                  <div className="flex flex-col items-start gap-1">
                                    <span>{option.label}</span>
                                    <span className="text-xs text-neutral-500">{option.description}</span>
                                  </div>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <FilterSummaryBar
                items={filterSummaryItems}
                onClearAll={handleResetFilters}
              />
            </div>

            <VirtualizedProductGrid
              products={filteredProducts}
              ratingThreshold={ratingFilter.minimum_rating}
              isFiltering={isFiltering}
              animationSeed={productAnimationSeed}
              onAddToCart={handleAddToCart}
              onQuickView={handleQuickView}
            />
          </section>
        </section>
      </main>

      {isFilterSheetVisible ? (
        <div
          id="mobile-filter-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          data-state={isFilterSheetOpen ? 'open' : 'closed'}
          className="filter-sheet-overlay fixed inset-0 z-40 flex items-end bg-neutral-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsFilterSheetOpen(false)}
        >
          <div
            className="filter-sheet-panel max-h-[85vh] w-full rounded-t-3xl bg-white shadow-soft"
            onClick={(event) => event.stopPropagation()}
          >
            <FilterPanel
              priceRange={priceRange}
              priceSelection={priceSelection}
              setPriceSelection={setPriceSelection}
              ratingFilter={ratingFilter}
              brandFilters={brandFilters}
              selectedBrands={selectedBrands}
              onBrandToggle={handleBrandToggle}
              onBrandsReset={handleClearBrands}
              deliveryOptions={deliveryOptions}
              onDeliveryToggle={handleDeliveryToggle}
              onReset={handleResetFilters}
              onFilterChange={triggerFilteringFeedback}
              initialFilters={defaultFilters}
              variant="modal"
              activeCount={activeFilterCount}
              onClose={() => setIsFilterSheetOpen(false)}
              onApply={() => setIsFilterSheetOpen(false)}
            />
          </div>
        </div>
      ) : null}
      <ToastViewport toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

type VirtualizedProductGridProps = {
  products: Product[];
  ratingThreshold: number;
  isFiltering: boolean;
  animationSeed: string;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
};

function VirtualizedProductGrid({
  products,
  ratingThreshold,
  isFiltering,
  animationSeed,
  onAddToCart,
  onQuickView,
}: VirtualizedProductGridProps) {
  const shouldVirtualize = products.length > 20;
  const [visibleCount, setVisibleCount] = useState(
    shouldVirtualize ? Math.min(20, products.length) : products.length,
  );
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const productSignature = useMemo(
    () => `${animationSeed}:${products.map((product) => product.id).join('|')}`,
    [animationSeed, products],
  );

  useEffect(() => {
    if (!shouldVirtualize) {
      setVisibleCount(products.length);
      return;
    }

    setVisibleCount(Math.min(20, products.length));
  }, [productSignature, products.length, shouldVirtualize]);

  useEffect(() => {
    if (!shouldVirtualize) return;

    const sentinel = loadMoreRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCount((current) => {
              if (current >= products.length) return current;
              return Math.min(current + 12, products.length);
            });
          }
        });
      },
      { rootMargin: '200px 0px' },
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [products.length, shouldVirtualize]);

  const visibleProducts = useMemo(
    () => (shouldVirtualize ? products.slice(0, visibleCount) : products),
    [products, shouldVirtualize, visibleCount],
  );

  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {visibleProducts.map((product, index) => (
          <ProductCard
            key={`${animationSeed}-${product.id}`}
            product={product}
            ratingThreshold={ratingThreshold}
            index={index}
            isFiltering={isFiltering}
            onAddToCart={onAddToCart}
            onQuickView={onQuickView}
          />
        ))}
      </div>
      {shouldVirtualize ? (
        <div ref={loadMoreRef} className="h-2 w-full" aria-hidden="true" />
      ) : null}
      {isFiltering ? (
        <ProductGridSkeleton count={Math.max(visibleProducts.length, 3)} />
      ) : null}
    </div>
  );
}

function FilterPanel({
  priceRange,
  priceSelection,
  setPriceSelection,
  ratingFilter,
  brandFilters,
  selectedBrands,
  onBrandToggle,
  onBrandsReset,
  deliveryOptions,
  onDeliveryToggle,
  onReset,
  onFilterChange,
  initialFilters,
  variant = 'desktop',
  activeCount,
  onClose,
  onApply,
}: {
  priceRange: PriceRange;
  priceSelection: [number, number];
  setPriceSelection: React.Dispatch<React.SetStateAction<[number, number]>>;
  ratingFilter: RatingFilter;
  brandFilters: BrandFilter[];
  selectedBrands: string[];
  onBrandToggle: (brandId: string) => void;
  onBrandsReset: () => void;
  deliveryOptions: DeliveryOption[];
  onDeliveryToggle: (optionId: string) => void;
  onReset: () => void;
  onFilterChange: () => void;
  initialFilters: { price: [number, number]; brands: string[]; delivery: string | null } | null;
  variant?: 'desktop' | 'modal';
  activeCount: number;
  onClose?: () => void;
  onApply?: () => void;
}) {
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [openSections, setOpenSections] = useState({
    price: true,
    rating: true,
    brand: true,
    delivery: true,
  });
  const isDesktop = variant === 'desktop';

  const priceSpan = Math.max(priceRange.maximum - priceRange.minimum, 1);
  const minPercent = ((priceSelection[0] - priceRange.minimum) / priceSpan) * 100;
  const maxPercent = ((priceSelection[1] - priceRange.minimum) / priceSpan) * 100;
  const clampedMinPercent = Math.min(100, Math.max(0, minPercent));
  const clampedMaxPercent = Math.min(100, Math.max(0, maxPercent));

  const defaultSelectedBrandIds = useMemo(() => {
    if (initialFilters?.brands) {
      return initialFilters.brands;
    }
    return brandFilters.filter((brand) => brand.checked).map((brand) => brand.id);
  }, [initialFilters, brandFilters]);

  const displayedBrands = showAllBrands ? brandFilters : brandFilters.slice(0, 7);
  const hasAdditionalBrands = brandFilters.length > displayedBrands.length;

  const appliedBrandIds = selectedBrands.length === 0 ? defaultSelectedBrandIds : selectedBrands;
  const brandBadge = appliedBrandIds.length > 0 ? String(appliedBrandIds.length) : null;
  const priceBadge = initialFilters
    ? priceSelection[0] !== initialFilters.price[0] || priceSelection[1] !== initialFilters.price[1]
      ? '1'
      : null
    : null;
  const activeDeliveryId = deliveryOptions.find((option) => option.active)?.id ?? null;
  const deliveryBadge = initialFilters && activeDeliveryId && activeDeliveryId !== initialFilters.delivery ? '1' : null;

  const formattedAverage = formatCurrency(priceRange.average, priceRange.currency);
  const formattedMin = formatCurrency(priceSelection[0], priceRange.currency);
  const formattedMax = formatCurrency(priceSelection[1], priceRange.currency);

  const containerClasses =
    variant === 'desktop'
      ? 'flex flex-col gap-4 rounded-[32px] bg-white p-6 shadow-soft ring-1 ring-indigo-100/70 lg:sticky lg:top-24'
      : 'flex h-full flex-col overflow-hidden rounded-t-3xl bg-white p-4 shadow-soft';

  const scrollAreaClasses = variant === 'desktop' ? 'space-y-4' : 'flex-1 space-y-4 overflow-y-auto pr-1';

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((current) => ({ ...current, [section]: !current[section] }));
  };

  return (
    <div className={containerClasses}>
      {variant === 'desktop' ? (
        <header className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Filters</h2>
            <p className="text-xs text-neutral-500">
              {activeCount ? `${activeCount} active filter${activeCount > 1 ? 's' : ''}` : 'Refine product results'}
            </p>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="text-sm font-semibold text-primary transition hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60"
          >
            Reset
          </button>
        </header>
      ) : (
        <header className="flex items-center justify-between gap-3 pb-2">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Filters</h2>
            <p className="text-xs text-neutral-500">
              {activeCount ? `${activeCount} active filter${activeCount > 1 ? 's' : ''}` : 'Refine product results'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-indigo-100/70 text-neutral-500 transition hover:text-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/50"
            aria-label="Close filters"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
      )}

      <div className={scrollAreaClasses}>
        <section className="rounded-3xl border border-indigo-100/70 bg-white p-5 shadow-soft">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60"
            id="filter-price-header"
            aria-expanded={openSections.price}
            aria-controls="filter-price-content"
            onClick={() => toggleSection('price')}
          >
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-neutral-900">Price Range</span>
              <span className="text-xs text-neutral-500">Average price {formattedAverage}</span>
            </div>
            <div className="flex items-center gap-2">
              {priceBadge ? (
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {priceBadge}
                </span>
              ) : null}
              <ChevronDown className={`h-4 w-4 transition-transform ${openSections.price ? 'rotate-180 text-primary' : 'text-neutral-400'}`} />
            </div>
          </button>
          <div
            id="filter-price-content"
            role="region"
            aria-labelledby="filter-price-header"
            className={openSections.price ? 'mt-4 space-y-4' : 'mt-4 space-y-4 hidden'}
          >
            <div className="rounded-3xl border border-indigo-100/70 bg-white/90 p-5 shadow-inner">
              <div className="relative h-16">
                <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-indigo-100" />
                <div
                  className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary via-secondary to-primary"
                  style={{
                    left: `${Math.min(clampedMinPercent, clampedMaxPercent)}%`,
                    right: `${100 - Math.max(clampedMinPercent, clampedMaxPercent)}%`,
                  }}
                />
                <span
                  className="absolute top-0 inline-flex -translate-y-full -translate-x-1/2 items-center gap-1 rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white shadow-[0_10px_25px_-15px_rgba(15,23,42,0.9)]"
                  style={{ left: `${clampedMinPercent}%` }}
                >
                  {formattedMin}
                </span>
                <span
                  className="absolute top-0 inline-flex -translate-y-full -translate-x-1/2 items-center gap-1 rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white shadow-[0_10px_25px_-15px_rgba(15,23,42,0.9)]"
                  style={{ left: `${clampedMaxPercent}%` }}
                >
                  {formattedMax}
                </span>
                <input
                  type="range"
                  min={priceRange.minimum}
                  max={priceRange.maximum}
                  value={priceSelection[0]}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    setPriceSelection(([currentMin, currentMax]) => {
                      const requested = Math.min(value, currentMax - 10);
                      return [Math.max(requested, priceRange.minimum), currentMax];
                    });
                    onFilterChange();
                  }}
                  className="absolute inset-0 z-10 h-full w-full appearance-none bg-transparent focus:outline-none focus-visible:outline-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-secondary [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:-mt-[6px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-secondary"
                  aria-label="Minimum price"
                />
                <input
                  type="range"
                  min={priceRange.minimum}
                  max={priceRange.maximum}
                  value={priceSelection[1]}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    setPriceSelection(([currentMin, currentMax]) => {
                      const requested = Math.max(value, currentMin + 10);
                      return [currentMin, Math.min(requested, priceRange.maximum)];
                    });
                    onFilterChange();
                  }}
                  className="absolute inset-0 z-20 h-full w-full appearance-none bg-transparent focus:outline-none focus-visible:outline-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-secondary [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:-mt-[6px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-secondary"
                  aria-label="Maximum price"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-indigo-100/70 bg-white p-5 shadow-soft">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60"
            id="filter-rating-header"
            aria-expanded={openSections.rating}
            aria-controls="filter-rating-content"
            onClick={() => toggleSection('rating')}
          >
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-neutral-900">Star Rating</span>
              <span className="text-xs text-neutral-500">{ratingFilter.label}</span>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${openSections.rating ? 'rotate-180 text-primary' : 'text-neutral-400'}`} />
          </button>
          <div
            id="filter-rating-content"
            role="region"
            aria-labelledby="filter-rating-header"
            className={openSections.rating ? 'mt-4' : 'mt-4 hidden'}
          >
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={String(index)}
                  className={`h-5 w-5 ${index < Math.round(ratingFilter.minimum_rating) ? 'fill-current text-amber-400' : 'text-neutral-200'}`}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-indigo-100/70 bg-white p-5 shadow-soft">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60"
            id="filter-brand-header"
            aria-expanded={openSections.brand}
            aria-controls="filter-brand-content"
            onClick={() => toggleSection('brand')}
          >
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-neutral-900">Brand</span>
              <span className="text-xs text-neutral-500">
                {appliedBrandIds.length ? `${appliedBrandIds.length} selected` : 'Select preferred brands'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {brandBadge ? (
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {brandBadge}
                </span>
              ) : null}
              <ChevronDown className={`h-4 w-4 transition-transform ${openSections.brand ? 'rotate-180 text-primary' : 'text-neutral-400'}`} />
            </div>
          </button>
          <div
            id="filter-brand-content"
            role="region"
            aria-labelledby="filter-brand-header"
            className={openSections.brand ? 'mt-4 space-y-3' : 'mt-4 space-y-3 hidden'}
          >
            {displayedBrands.map((brand) => {
              const checked = selectedBrands.length === 0
                ? brand.checked
                : selectedBrands.includes(brand.id);
              const initial = brand.name.charAt(0).toUpperCase();

              return (
                <label
                  key={brand.id}
                  className={`group flex items-center justify-between gap-3 rounded-2xl px-3 py-2 shadow-sm ring-1 transition-all transition-standard hover:-translate-y-0.5 hover:ring-primary/60 ${
                    checked
                      ? 'bg-primary/10 ring-primary/50'
                      : 'bg-white/95 ring-indigo-100/70'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onBrandToggle(brand.id)}
                    className="peer sr-only"
                    aria-label={`Filter by ${brand.name}`}
                  />
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-primary shadow-inner">
                      {initial}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-neutral-800 group-hover:text-neutral-900">
                        {brand.name}
                      </span>
                      <span className="text-[11px] font-medium text-neutral-400">{brand.product_count} items</span>
                    </div>
                  </div>
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-2xl border transition-all transition-standard group-hover:border-primary/50 group-hover:bg-primary/5 ${
                      checked
                        ? 'scale-100 border-secondary bg-secondary text-white shadow-soft'
                        : 'scale-90 border-indigo-200 bg-white text-secondary/40'
                    }`}
                  >
                    <Check
                      className={`h-3.5 w-3.5 transition-transform duration-[180ms] ease-[var(--motion-ease-out)] ${
                        checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                      }`}
                    />
                  </span>
                </label>
              );
            })}

            {hasAdditionalBrands ? (
              <button
                type="button"
                onClick={() => setShowAllBrands((current) => !current)}
                className="text-sm font-semibold text-primary transition hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60"
              >
                {showAllBrands ? 'Show fewer brands' : 'Show more brands'}
              </button>
            ) : null}

            <button
              type="button"
              onClick={onBrandsReset}
              className="inline-flex items-center gap-2 text-xs font-semibold text-primary transition hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60"
            >
              Reset brands
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-indigo-100/70 bg-white p-5 shadow-soft">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60"
            id="filter-delivery-header"
            aria-expanded={openSections.delivery}
            aria-controls="filter-delivery-content"
            onClick={() => toggleSection('delivery')}
          >
            <span className="text-sm font-semibold text-neutral-900">Delivery Options</span>
            <div className="flex items-center gap-2">
              {deliveryBadge ? (
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {deliveryBadge}
                </span>
              ) : null}
              <ChevronDown className={`h-4 w-4 transition-transform ${openSections.delivery ? 'rotate-180 text-primary' : 'text-neutral-400'}`} />
            </div>
          </button>
          <div
            id="filter-delivery-content"
            role="region"
            aria-labelledby="filter-delivery-header"
            className={openSections.delivery ? 'mt-4 flex flex-wrap gap-3' : 'mt-4 hidden'}
          >
            {deliveryOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onDeliveryToggle(option.id)}
                className={`inline-flex min-w-[120px] items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary/40 ${
                  option.active
                    ? 'bg-primary text-white shadow-soft'
                    : 'bg-indigo-50/60 text-neutral-600 hover:bg-indigo-100 hover:text-primary'
                }`}
                aria-pressed={option.active}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>
      </div>

      {variant === 'desktop' ? null : (
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-indigo-100/70 pt-4">
          <button
            type="button"
            onClick={onReset}
            className="text-sm font-semibold text-neutral-600 transition hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/50"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onApply}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60"
          >
            Show results
          </button>
        </div>
      )}
    </div>
  );
}

type FilterSummaryItem = {
  id: string;
  label: string;
  onClear?: () => void;
};

function FilterSummaryBar({
  items,
  onClearAll,
}: {
  items: FilterSummaryItem[];
  onClearAll: () => void;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 rounded-3xl border border-indigo-100/70 bg-white/80 p-3 shadow-soft backdrop-blur lg:sticky lg:top-24">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={item.onClear}
          className="inline-flex items-center gap-2 rounded-full border border-indigo-100/70 bg-white px-3 py-1 text-xs font-semibold text-neutral-600 transition-all transition-standard hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/50"
        >
          <span>{item.label}</span>
          {item.onClear ? <X className="h-3.5 w-3.5" /> : null}
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="ml-auto inline-flex items-center gap-2 rounded-full border border-transparent bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-all transition-standard hover:-translate-y-0.5 hover:bg-primary/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/40"
      >
        Clear all
      </button>
    </div>
  );
}

function InsightsWidget({
  spotlightMetric,
  overviewMetrics,
}: {
  spotlightMetric: SpotlightMetric;
  overviewMetrics: OverviewMetric[];
}) {
  const palette = TREND_PALETTE[spotlightMetric.trend] ?? TREND_PALETTE.steady;
  const TrendIcon = palette.icon;

  return (
    <div className="insights-widget rounded-3xl border border-indigo-100/70 bg-white p-6 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-600">Customer insight</p>
          <AnimatedMetricValue
            value={spotlightMetric.value}
            className="mt-1 block text-3xl font-semibold text-neutral-900"
            duration={900}
          />
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${palette.badge} ${palette.text}`}>
          <TrendIcon className="h-3.5 w-3.5" />
          {formatChange(spotlightMetric.change)}
        </span>
      </div>
      <p className="mt-3 text-sm text-neutral-600">{spotlightMetric.label}</p>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-0">
        {overviewMetrics.map((metric, index) => {
          const extraClasses = [
            index >= 2 ? 'sm:border-t sm:border-indigo-100/60 sm:pt-5' : '',
            index % 2 === 0 ? 'sm:pr-5' : 'sm:pl-5',
          ]
            .filter(Boolean)
            .join(' ');

          return <KpiCard key={metric.id} metric={metric} className={extraClasses} />;
        })}
      </div>
      <button
        type="button"
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-white/70 px-4 py-2 text-sm font-semibold text-secondary shadow-soft transition hover:border-secondary hover:bg-secondary/10 hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary/40"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Personalise insights
      </button>
    </div>
  );
}

const KPI_ICON_MATCHERS: { pattern: RegExp; icon: LucideIcon }[] = [
  { pattern: /revenue|sales|order|gmv|income/i, icon: BarChart3 },
  { pattern: /conversion|rate|performance|growth/i, icon: LineChart },
  { pattern: /customer|client|user|retention|loyalty/i, icon: Users },
  { pattern: /traffic|visit|view|session|engagement/i, icon: PieChart },
];

function resolveMetricIcon(metric: OverviewMetric): LucideIcon {
  const match = KPI_ICON_MATCHERS.find(({ pattern }) => pattern.test(metric.label));
  return match?.icon ?? BarChart3;
}

function KpiCard({ metric, className }: { metric: OverviewMetric; className?: string }) {
  const palette = TREND_PALETTE[metric.trend] ?? TREND_PALETTE.steady;
  const TrendIcon = palette.icon;
  const Icon = resolveMetricIcon(metric);

  return (
    <article
      className={`flex min-h-[184px] flex-col justify-between rounded-2xl border border-indigo-100/70 bg-white/90 p-5 shadow-soft transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:shadow-glow ${className ?? ''}`}
    >
      <div className="flex items-start justify-between">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary/10 via-primary/10 to-secondary/5 text-secondary shadow-inner">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${palette.badge} ${palette.text}`}>
          <TrendIcon className="h-3.5 w-3.5" />
          {formatChange(metric.change)}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-600">{metric.label}</p>
        <AnimatedMetricValue
          value={metric.value}
          className="mt-2 block text-xl font-semibold text-neutral-900"
          duration={720}
        />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-neutral-600">{metric.description}</p>
    </article>
  );
}

function ProductCard({
  product,
  ratingThreshold,
  index,
  isFiltering,
  onAddToCart,
  onQuickView,
}: {
  product: Product;
  ratingThreshold: number;
  index: number;
  isFiltering: boolean;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}) {
  const [imgSrc, setImgSrc] = useState(product.image ?? FALLBACK_IMAGE);
  const [isBouncing, setIsBouncing] = useState(false);
  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round((1 - product.price / product.original_price) * 100)
      : null;
  const bounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardStyle = useMemo(
    () => ({
      '--product-index': String(Math.min(index, 8)),
    }) as CSSProperties,
    [index],
  );

  useEffect(() => {
    setImgSrc(product.image ?? FALLBACK_IMAGE);
  }, [product.image]);

  useEffect(() => {
    return () => {
      if (bounceTimeoutRef.current) {
        clearTimeout(bounceTimeoutRef.current);
      }
    };
  }, []);

  const handleAddToCartClick = () => {
    if (bounceTimeoutRef.current) {
      clearTimeout(bounceTimeoutRef.current);
    }
    setIsBouncing(true);
    bounceTimeoutRef.current = setTimeout(() => {
      setIsBouncing(false);
    }, 320);
    onAddToCart(product);
  };

  const handleQuickViewClick = () => {
    onQuickView(product);
  };

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-indigo-100/70 bg-surface-alt p-5 shadow-soft transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-glow ${
        isFiltering ? 'opacity-70' : 'opacity-100'
      } product-card-enter`}
      style={cardStyle}
      data-price={product.price}
    >
      <div className="relative mb-4 overflow-hidden rounded-2xl bg-accent-soft shadow-inner">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 360px"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            onError={() => setImgSrc(FALLBACK_IMAGE)}
            loading="lazy"
          />
        </div>
        <button
          type="button"
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-neutral-400 shadow-soft transition hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/50"
          aria-label={product.favorite ? 'Saved to favourites' : 'Add to favourites'}
        >
          <Heart className={`h-4 w-4 ${product.favorite ? 'fill-primary text-primary' : ''}`} />
        </button>
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {discount ? (
            <Badge tone="bg-rose-100 text-rose-600">-{discount}%</Badge>
          ) : null}
          {product.badges.map((badge) => (
            <Badge key={badge.id} tone={badge.tone}>
              {badge.label}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <h3 className="line-clamp-2 text-lg font-semibold text-neutral-900">{product.name}</h3>
        <div className="mt-3 flex items-baseline gap-2">
          <p className="text-2xl font-semibold text-neutral-900">{formatCurrency(product.price, product.currency)}</p>
          {product.original_price ? (
            <p className="text-sm text-neutral-600 line-through">
              {formatCurrency(product.original_price, product.currency)}
            </p>
          ) : null}
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm text-neutral-600">
          <div className="flex items-center gap-1 text-amber-400" aria-hidden="true">
            <Star className="h-4 w-4 fill-current" />
            <span className="font-semibold text-neutral-700">{product.rating.toFixed(1)}</span>
          </div>
          <span aria-label={`${product.rating.toFixed(1)} stars from ${product.reviews} reviews`}>
            ({product.reviews})
          </span>
          {product.rating >= ratingThreshold ? (
            <Badge tone="bg-primary/10 text-primary">Top rated</Badge>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone="bg-secondary/10 text-secondary">{product.category_id}</Badge>
          <Badge tone="bg-primary/10 text-primary">{product.brand_id}</Badge>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition-all transition-standard hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60 ${
              isBouncing ? 'bounce-tap' : ''
            }`}
            onClick={handleAddToCartClick}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to cart
          </button>
          <button
            type="button"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-primary/40 px-4 py-2 text-sm font-semibold text-primary transition-standard hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/50"
            onClick={handleQuickViewClick}
          >
            Quick view
          </button>
        </div>
      </div>
    </article>
  );
}

function Badge({ tone, children }: { tone: string; children: React.ReactNode }) {
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{children}</span>;
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}) {
  if (!toasts.length) {
    return null;
  }

  return (
    <div
      className="toast-stack fixed bottom-6 right-6 z-50 max-w-sm text-sm"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const toneStyles =
          toast.tone === 'success'
            ? 'border border-emerald-200 bg-emerald-50/95 text-emerald-800 shadow-[0_12px_30px_rgba(16,185,129,0.18)]'
            : 'border border-rose-200 bg-rose-50/95 text-rose-800 shadow-[0_12px_30px_rgba(244,63,94,0.15)]';
        const Icon = toast.tone === 'success' ? Check : AlertTriangle;

        return (
          <div
            key={toast.id}
            className={`toast-item flex items-start gap-3 rounded-2xl px-4 py-3 backdrop-blur ${toneStyles}`}
            data-leaving={toast.leaving ? 'true' : 'false'}
          >
            <span className="mt-0.5 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/70 text-current shadow-inner">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="flex flex-1 flex-col gap-1">
              <strong className="text-sm font-semibold leading-tight">{toast.title}</strong>
              {toast.description ? (
                <span className="text-xs leading-snug text-current/80">{toast.description}</span>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-current/70 transition-standard hover:bg-white/40 hover:text-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/50"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function AnimatedMetricValue({
  value,
  className,
  duration = 800,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const { prefix, suffix, numericValue, decimals, showPlus } = useMemo(() => {
    const trimmed = value.trim();
    const prefixMatch = trimmed.match(/^[^\d+-]*/)?.[0] ?? '';
    const rest = trimmed.slice(prefixMatch.length);
    const numberMatch = rest.match(/[-+]?\d*[.,]?\d*/)?.[0] ?? '';
    const sanitizedNumber = numberMatch.replace(/,/g, '');
    const numericValue = Number.parseFloat(sanitizedNumber);
    const suffix = rest.slice(numberMatch.length);
    const decimals = sanitizedNumber.includes('.')
      ? sanitizedNumber.split('.')[1]?.length ?? 0
      : 0;
    const showPlus = numberMatch.trim().startsWith('+');
    return { prefix: prefixMatch, suffix, numericValue, decimals, showPlus };
  }, [value]);

  const isNumeric = Number.isFinite(numericValue);
  const [current, setCurrent] = useState(() => (isNumeric ? numericValue : 0));
  const previousValueRef = useRef(isNumeric ? numericValue : 0);

  useEffect(() => {
    if (!isNumeric) return;

    const startValue = previousValueRef.current;
    const targetValue = numericValue;

    if (startValue === targetValue) {
      setCurrent(targetValue);
      previousValueRef.current = targetValue;
      return;
    }

    const durationMs = Math.max(duration, 0);
    const startTime = performance.now();
    setCurrent(startValue);

    let frame: number;
    const step = (timestamp: number) => {
      const progress = durationMs === 0 ? 1 : Math.min((timestamp - startTime) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextValue = startValue + (targetValue - startValue) * eased;
      setCurrent(nextValue);

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        previousValueRef.current = targetValue;
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isNumeric, numericValue, duration]);

  if (!isNumeric) {
    return <span className={className}>{value}</span>;
  }

  const decimalsToDisplay = Math.min(decimals, 2);
  const formattedNumber = current.toLocaleString('en-US', {
    minimumFractionDigits: decimalsToDisplay,
    maximumFractionDigits: decimalsToDisplay,
  });
  const withSign = showPlus && current >= 0 ? `+${formattedNumber}` : formattedNumber;

  return <span className={className}>{`${prefix}${withSign}${suffix}`}</span>;
}

function ProductGridSkeleton({ count }: { count: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="animate-pulse rounded-3xl border border-indigo-100/60 bg-surface-alt p-5 shadow-soft"
          aria-hidden="true"
        >
          <div className="mb-4 h-56 rounded-2xl bg-neutral-200/80" />
          <div className="space-y-3">
            <div className="h-4 w-3/4 rounded bg-neutral-200" />
            <div className="h-6 w-1/2 rounded bg-neutral-200" />
            <div className="h-4 w-2/3 rounded bg-neutral-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
