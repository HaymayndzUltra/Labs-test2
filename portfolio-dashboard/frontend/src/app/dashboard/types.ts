export type MetricTrend = 'up' | 'down' | 'steady';

export type OverviewMetric = {
  id: string;
  label: string;
  value: string;
  change: number;
  trend: MetricTrend;
  description: string;
};

export type Category = {
  id: string;
  label: string;
  active: boolean;
};

export type PriceRange = {
  currency: string;
  minimum: number;
  maximum: number;
  average: number;
  selected_min: number;
  selected_max: number;
};

export type RatingFilter = {
  label: string;
  minimum_rating: number;
};

export type BrandFilter = {
  id: string;
  name: string;
  checked: boolean;
  product_count: number;
};

export type DeliveryOption = {
  id: string;
  label: string;
  description?: string | null;
  active: boolean;
};

export type ProductBadge = {
  id: string;
  label: string;
  tone: string;
};

export type Product = {
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

export type SpotlightMetric = {
  id: string;
  label: string;
  value: string;
  change: number;
  trend: MetricTrend;
};

export type EcommerceDashboardResponse = {
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

export type SortOptionId = 'featured' | 'price-asc' | 'price-desc' | 'rating-desc' | 'popularity-desc';

export type SortOption = {
  id: SortOptionId;
  label: string;
  description: string;
};
