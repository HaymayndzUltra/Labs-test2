'use client';

import Image from 'next/image';
import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  Heart,
  LineChart,
  Loader2,
  Package,
  PieChart,
  RefreshCw,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

type MetricTrend = 'up' | 'down' | 'steady';

type OverviewMetric = {
  id: string;
  label: string;
  value: string;
  change: number;
  trend: MetricTrend;
  description: string;
};

type Category = {
  id: string;
  label: string;
  active: boolean;
};

type PriceRange = {
  currency: string;
  minimum: number;
  maximum: number;
  average: number;
  selected_min: number;
  selected_max: number;
};

type RatingFilter = {
  label: string;
  minimum_rating: number;
};

type BrandFilter = {
  id: string;
  name: string;
  checked: boolean;
  product_count: number;
};

type DeliveryOption = {
  id: string;
  label: string;
  description?: string | null;
  active: boolean;
};

type ProductBadge = {
  id: string;
  label: string;
  tone: string;
};

type Product = {
  id: string;
  name: string;
  category_id: string;
  brand_id: string;
  image: string;
  price: number;
  currency: string;
  rating: number;
  reviews: number;
  favorite: boolean;
  badges: ProductBadge[];
  original_price?: number;
};

type SpotlightMetric = {
  id: string;
  label: string;
  value: string;
  change: number;
  trend: MetricTrend;
};

type EcommerceDashboardResponse = {
  generated_at: string;
  overview_metrics: OverviewMetric[];
  categories: Category[];
  price_range: PriceRange;
  rating_filter: RatingFilter;
  brand_filters: BrandFilter[];
  delivery_options: DeliveryOption[];
  spotlight_metric: SpotlightMetric;
  products: Product[];
};

const productImageMap: Record<string, string> = {
  'Premium Boxing Gloves for Training':
    'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=640&h=640&q=80',
  'Club Kit 1 Recurve Archer Set':
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=640&h=640&q=80',
  'Lightweight White Nike Training Shoes':
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=640&h=640&q=80',
  'Wireless Sports Earbuds':
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=640&h=640&q=80',
};

const FALLBACK_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="320" viewBox="0 0 400 320"%3E%3Cdefs%3E%3ClinearGradient id="a" x1="0%25" x2="100%25" y1="0%25" y2="100%25"%3E%3Cstop offset="0%25" stop-color="%23eef2ff"/%3E%3Cstop offset="100%25" stop-color="%23e0f2fe"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="320" fill="url(%23a)" rx="32"/%3E%3Cpath d="M128 222h144c9 0 16-7 16-16v-93c0-9-7-16-16-16H128c-9 0-16 7-16 16v93c0 9 7 16 16 16Zm20-32 32-40 26 31 38-50 44 59H148Z" fill="%235865d8" fill-opacity="0.38"/%3E%3Ccircle cx="172" cy="148" r="18" fill="%235865d8" fill-opacity="0.3"/%3E%3C/svg%3E';

const brandLogos = [
  {
    name: 'Adidas',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg',
    width: 120,
    height: 40,
  },
  {
    name: 'Nike',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
    width: 120,
    height: 40,
  },
  {
    name: 'New Balance',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/29/New_Balance_logo.svg',
    width: 140,
    height: 40,
  },
  {
    name: 'Xiaomi',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg',
    width: 100,
    height: 40,
  },
  {
    name: 'Chanel',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Chanel_logo_interlocking_cs.svg',
    width: 120,
    height: 40,
  },
  {
    name: 'Louis Vuitton',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Louis_Vuitton_logo_and_wordmark.svg',
    width: 156,
    height: 40,
  },
  {
    name: 'Gucci',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Gucci_logo.svg',
    width: 132,
    height: 40,
  },
];

const FALLBACK_BRAND_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="80" viewBox="0 0 200 80"%3E%3Cdefs%3E%3ClinearGradient id="b" x1="0%25" x2="100%25" y1="0%25" y2="0%25"%3E%3Cstop offset="0%25" stop-color="%23e0e7ff"/%3E%3Cstop offset="100%25" stop-color="%23f5f3ff"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="200" height="80" fill="url(%23b)" rx="24"/%3E%3Cpath d="M54 40a26 26 0 1 1 52 0 26 26 0 0 1-52 0Zm26-18a18 18 0 1 0 0 36 18 18 0 0 0 0-36Z" fill="%235865d8" fill-opacity="0.4"/%3E%3C/svg%3E';

type BrandLogo = (typeof brandLogos)[number];

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

export default function DashboardPage() {
  const [data, setData] = useState<EcommerceDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceSelection, setPriceSelection] = useState<[number, number]>([0, 0]);
  const [isFiltering, setIsFiltering] = useState(false);
  const filterTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/commerce-dashboard`);
      if (!response.ok) {
        throw new Error('Failed to load commerce dashboard');
      }

      const payload = (await response.json()) as EcommerceDashboardResponse;
      const enrichedProducts = payload.products.map((product) => ({
        ...product,
        image: productImageMap[product.name] ?? product.image,
      }));
      const enrichedPayload = { ...payload, products: enrichedProducts };

      setData(enrichedPayload);
      const initialCategory =
        enrichedPayload.categories.find((category) => category.active)?.id ??
        enrichedPayload.categories[0]?.id ??
        'all';
      setActiveCategory(initialCategory);
      setSelectedBrands(
        enrichedPayload.brand_filters.filter((brand) => brand.checked).map((brand) => brand.id),
      );
      setPriceSelection([
        enrichedPayload.price_range.selected_min,
        enrichedPayload.price_range.selected_max,
      ]);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Unable to load e-commerce dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

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
      setData((current) => {
        if (!current) return current;
        const updated = current.delivery_options.map((option) => ({
          ...option,
          active: option.id === optionId,
        }));
        return { ...current, delivery_options: updated };
      });
      triggerFilteringFeedback();
    },
    [triggerFilteringFeedback],
  );

  const handleResetFilters = useCallback(() => {
    if (!data) return;
    const initialCategory = data.categories.find((category) => category.active)?.id ?? data.categories[0]?.id ?? 'all';
    setActiveCategory(initialCategory);
    setSelectedBrands(data.brand_filters.filter((brand) => brand.checked).map((brand) => brand.id));
    setPriceSelection([data.price_range.selected_min, data.price_range.selected_max]);
    triggerFilteringFeedback();
  }, [data, triggerFilteringFeedback]);

  useEffect(() => {
    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, []);

  const filteredProducts = useMemo(() => {
    if (!data) return [];
    return data.products.filter((product) => {
      const matchesCategory = activeCategory === 'all' || product.category_id === activeCategory;
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand_id);
      const matchesRating = product.rating >= data.rating_filter.minimum_rating;
      const matchesPrice = product.price >= priceSelection[0] && product.price <= priceSelection[1];
      return matchesCategory && matchesBrand && matchesRating && matchesPrice;
    });
  }, [data, activeCategory, selectedBrands, priceSelection]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-neutral-600">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm font-medium">Loading commerce analytics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center text-neutral-600">
        <p className="text-lg font-semibold">{error ?? 'Unable to display dashboard data.'}</p>
        <button
          type="button"
          onClick={fetchDashboard}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:shadow-glow"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  const {
    overview_metrics: overviewMetrics,
    categories,
    price_range: priceRange,
    rating_filter: ratingFilter,
    brand_filters: brandFilters,
    delivery_options: deliveryOptions,
    spotlight_metric: spotlightMetric,
  } = data;

  return (
    <div className="min-h-screen bg-surface">
      <div className="w-full border-b border-indigo-100/70 bg-surface-alt/80 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary/90 via-secondary/80 to-primary/60 text-lg font-semibold text-white shadow-soft">
              CX
            </div>
            <div>
              <p className="text-lg font-semibold text-neutral-900">Commerce Experience</p>
              <p className="text-sm text-neutral-600">Enterprise analytics workspace</p>
            </div>
          </div>
          <div className="hidden flex-1 items-center gap-3 rounded-full border border-indigo-100 bg-surface-alt px-4 py-2 shadow-soft md:flex">
            <Search className="h-4 w-4 text-neutral-500" />
            <input
              type="search"
              placeholder="Search product, SKU, or insight"
              className="w-full border-0 bg-transparent text-sm text-neutral-600 placeholder:text-neutral-500 focus:outline-none"
              aria-label="Search products"
            />
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-white shadow-soft transition hover:shadow-glow"
            >
              <Sparkles className="h-3 w-3" />
              Quick find
            </button>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="hidden items-center gap-2 rounded-full border border-indigo-100 bg-surface-alt px-3 py-2 text-sm font-medium text-neutral-600 transition hover:border-primary/40 hover:text-primary lg:flex"
            >
              <Package className="h-4 w-4" />
              Orders
            </button>
            <button
              type="button"
              className="hidden items-center gap-2 rounded-full border border-indigo-100 bg-surface-alt px-3 py-2 text-sm font-medium text-neutral-600 transition hover:border-primary/40 hover:text-primary xl:flex"
            >
              <Heart className="h-4 w-4" />
              Saved
            </button>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-soft transition hover:shadow-glow"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl space-y-6 px-6 pb-12 pt-6">
        <BrandCarousel />

        <section className="grid grid-cols-12 gap-6">
          <aside className="col-span-12 space-y-5 lg:col-span-4 xl:col-span-3">
            <FilterPanel
              priceRange={priceRange}
              priceSelection={priceSelection}
              setPriceSelection={setPriceSelection}
              ratingFilter={ratingFilter}
              brandFilters={brandFilters}
              selectedBrands={selectedBrands}
              onBrandToggle={handleBrandToggle}
              deliveryOptions={deliveryOptions}
              onDeliveryToggle={handleDeliveryToggle}
              onReset={handleResetFilters}
              onFilterChange={triggerFilteringFeedback}
            />

            <InsightsWidget spotlightMetric={spotlightMetric} overviewMetrics={overviewMetrics} />
          </aside>

          <section className="col-span-12 space-y-5 lg:col-span-8 xl:col-span-9">
            <div className="flex flex-col gap-4 rounded-3xl border border-indigo-100/70 bg-surface-alt px-6 py-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">Product Catalogue</h2>
                <p className="text-sm text-neutral-600">
                  Showing <span className="font-semibold text-primary">{filteredProducts.length}</span> curated results
                </p>
              </div>
              <div className="flex items-center gap-3">
                {isFiltering ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Filtering
                  </span>
                ) : null}
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-indigo-100/80 bg-surface-alt px-4 py-2 text-sm font-semibold text-neutral-600 transition hover:border-primary/40 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/50"
                >
                  Sort by
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={`${product.id}-${priceSelection[0]}-${priceSelection[1]}`}
                    product={product}
                    ratingThreshold={ratingFilter.minimum_rating}
                    index={index}
                    isFiltering={isFiltering}
                  />
                ))}
              </div>
              {isFiltering ? <ProductGridSkeleton count={Math.max(filteredProducts.length, 3)} /> : null}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

function BrandCarousel() {
  const marqueeDuration = Math.max(1, brandLogos.length * 3);
  const trackStyle: CSSProperties = { animationDuration: `${marqueeDuration}s` };
  const trackClasses =
    'flex w-max items-center gap-16 animate-marquee group-hover:[animation-play-state:paused]';

  return (
    <div className="space-y-2">
      <div className="overflow-hidden border-y border-indigo-100/70 bg-white/95 py-6 shadow-soft">
        <div className="mx-auto hidden w-full max-w-7xl px-6 md:block">
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-r from-white via-white/90 to-white">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white via-white/90 to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white via-white/90 to-transparent"
            />
            <div className={trackClasses} style={trackStyle}>
              {brandLogos.map((brand) => (
                <BrandLogo key={`desktop-${brand.name}`} brand={brand} />
              ))}
            </div>
            <div className={trackClasses} style={trackStyle} aria-hidden="true">
              {brandLogos.map((brand) => (
                <BrandLogo key={`desktop-duplicate-${brand.name}`} brand={brand} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden">
        <div className="scrollbar-hidden overflow-x-auto border-y border-indigo-100/70 bg-white/95 px-4 py-4">
          <div className="flex w-max items-center gap-10">
            {brandLogos.map((brand) => (
              <BrandLogo key={`mobile-${brand.name}`} brand={brand} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandLogo({ brand }: { brand: BrandLogo }) {
  const [logoSrc, setLogoSrc] = useState(brand.logo);

  return (
    <div className="flex h-12 min-h-[40px] items-center justify-center rounded-2xl bg-white/80 px-6 shadow-soft ring-1 ring-indigo-100/80 transition hover:ring-primary/50">
      <Image
        src={logoSrc}
        alt={`${brand.name} logo`}
        width={brand.width}
        height={brand.height}
        className="max-h-10 w-auto object-contain opacity-80 transition-opacity hover:opacity-100"
        onError={() => setLogoSrc(FALLBACK_BRAND_IMAGE)}
        loading="lazy"
      />
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
  deliveryOptions,
  onDeliveryToggle,
  onReset,
  onFilterChange,
}: {
  priceRange: PriceRange;
  priceSelection: [number, number];
  setPriceSelection: React.Dispatch<React.SetStateAction<[number, number]>>;
  ratingFilter: RatingFilter;
  brandFilters: BrandFilter[];
  selectedBrands: string[];
  onBrandToggle: (brandId: string) => void;
  deliveryOptions: DeliveryOption[];
  onDeliveryToggle: (optionId: string) => void;
  onReset: () => void;
  onFilterChange: () => void;
}) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    price: true,
    rating: true,
    brand: true,
    delivery: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 rounded-3xl border border-indigo-100/70 bg-surface-alt p-6 shadow-soft">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Filters</h2>
          <p className="text-xs text-neutral-600">Refine your catalogue in a click</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-medium text-primary transition hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/70"
        >
          Reset
        </button>
      </header>

      <FilterSection
        id="price"
        title="Price Range"
        description={`Average ${formatCurrency(priceRange.average, priceRange.currency)}`}
        isOpen={openSections.price}
        onToggle={() => toggleSection('price')}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm font-medium text-neutral-700">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary shadow-soft">
              {formatCurrency(priceSelection[0], priceRange.currency)}
            </span>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary shadow-soft">
              {formatCurrency(priceSelection[1], priceRange.currency)}
            </span>
          </div>
          <div className="relative flex flex-col gap-3">
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
              style={{ background: getSliderBackground(priceSelection, priceRange) }}
              className="h-1 w-full cursor-pointer appearance-none rounded-full accent-secondary"
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
              style={{ background: getSliderBackground(priceSelection, priceRange) }}
              className="h-1 w-full cursor-pointer appearance-none rounded-full accent-secondary"
              aria-label="Maximum price"
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection
        id="rating"
        title="Rating"
        description={ratingFilter.label}
        isOpen={openSections.rating}
        onToggle={() => toggleSection('rating')}
      >
        <div className="flex items-center gap-1 text-amber-400">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={String(index)}
              className={`h-5 w-5 ${index < Math.round(ratingFilter.minimum_rating) ? 'fill-current text-amber-400' : 'text-neutral-200'}`}
              aria-hidden="true"
            />
          ))}
          <span className="ml-2 text-sm font-medium text-neutral-600">{ratingFilter.minimum_rating.toFixed(1)} &amp; above</span>
        </div>
      </FilterSection>

      <FilterSection
        id="brand"
        title="Brands"
        description={`${selectedBrands.length || brandFilters.filter((brand) => brand.checked).length} selected`}
        isOpen={openSections.brand}
        onToggle={() => toggleSection('brand')}
      >
        <div className="space-y-2">
          {brandFilters.map((brand) => {
            const checked = selectedBrands.length === 0 ? brand.checked : selectedBrands.includes(brand.id);
            const labelClasses = checked
              ? 'border-secondary bg-secondary/10 text-secondary shadow-soft'
              : 'border-indigo-100/60 bg-white/90 text-neutral-600 hover:border-primary/50 hover:bg-primary/5';
            return (
              <label
                key={brand.id}
                className={`group flex cursor-pointer items-center justify-between rounded-2xl border px-3 py-2 text-sm font-medium transition ${labelClasses}`}
              >
                <span className="flex items-center gap-3">
                  <span className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onBrandToggle(brand.id)}
                      className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-md border border-indigo-200 bg-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 checked:border-secondary checked:bg-secondary"
                      aria-label={`Filter by ${brand.name}`}
                    />
                    <Check className="pointer-events-none h-3 w-3 text-white opacity-0 transition peer-checked:opacity-100" />
                  </span>
                  <span className="text-neutral-700 transition group-hover:text-neutral-900">{brand.name}</span>
                </span>
                <span className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-semibold text-neutral-500 shadow-soft">
                  {brand.product_count}
                </span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection
        id="delivery"
        title="Delivery"
        description="Choose preferred method"
        isOpen={openSections.delivery}
        onToggle={() => toggleSection('delivery')}
      >
        <div className="grid grid-cols-2 gap-2">
          {deliveryOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onDeliveryToggle(option.id)}
              className={`rounded-2xl border px-3 py-2 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary/40 ${
                option.active
                  ? 'border-secondary bg-secondary/10 text-secondary shadow-soft'
                  : 'border-indigo-100 bg-surface-alt text-neutral-600 hover:border-primary/40 hover:text-primary'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

function FilterSection({
  id,
  title,
  description,
  isOpen,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
        className="flex w-full items-center justify-between rounded-2xl bg-white/60 px-4 py-3 text-left transition hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60"
      >
        <div>
          <p className="text-sm font-semibold text-neutral-800">{title}</p>
          {description ? <p className="text-xs text-neutral-600">{description}</p> : null}
        </div>
        <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        id={`${id}-content`}
        className={`overflow-hidden transition-all duration-300 ease-out ${isOpen ? 'mt-4 max-h-[320px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        {isOpen ? <div className="space-y-4 text-sm text-neutral-600">{children}</div> : null}
      </div>
    </section>
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
    <div className="rounded-3xl bg-gradient-to-br from-secondary/12 via-accent-soft to-primary/10 p-6 shadow-soft">
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
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {overviewMetrics.map((metric) => (
          <KpiCard key={metric.id} metric={metric} />
        ))}
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

function KpiCard({ metric }: { metric: OverviewMetric }) {
  const palette = TREND_PALETTE[metric.trend] ?? TREND_PALETTE.steady;
  const TrendIcon = palette.icon;
  const Icon = resolveMetricIcon(metric);

  return (
    <article className="flex min-h-[184px] flex-col justify-between rounded-2xl border border-indigo-100/70 bg-white/90 p-5 shadow-soft transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:shadow-glow">
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
}: {
  product: Product;
  ratingThreshold: number;
  index: number;
  isFiltering: boolean;
}) {
  const [imgSrc, setImgSrc] = useState(product.image ?? FALLBACK_IMAGE);
  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round((1 - product.price / product.original_price) * 100)
      : null;

  useEffect(() => {
    setImgSrc(product.image ?? FALLBACK_IMAGE);
  }, [product.image]);

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-indigo-100/70 bg-surface-alt p-5 shadow-soft transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-glow ${
        isFiltering ? 'opacity-70' : 'opacity-100'
      }`}
      style={{ animationDelay: `${index * 0.12}s` }}
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
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to cart
          </button>
          <button
            type="button"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-primary/40 px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/50"
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
