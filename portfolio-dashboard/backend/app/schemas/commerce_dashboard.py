"""Pydantic schemas powering the e-commerce dashboard."""
from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class MetricTrend(str, Enum):
    """Trend direction for dashboard metrics."""

    UP = "up"
    DOWN = "down"
    STEADY = "steady"


class OverviewMetric(BaseModel):
    """High level KPI rendered at the top of the dashboard."""

    id: str
    label: str
    value: str
    change: float = Field(..., description="Percent change versus the comparison period")
    trend: MetricTrend
    description: str


class Category(BaseModel):
    """Product category pill."""

    id: str
    label: str
    active: bool = False


class PriceRange(BaseModel):
    """Price range filter values."""

    currency: str
    minimum: float
    maximum: float
    average: float
    selected_min: float
    selected_max: float


class RatingFilter(BaseModel):
    """Rating filter snapshot."""

    label: str
    minimum_rating: float


class BrandFilter(BaseModel):
    """Brand filter entry."""

    id: str
    name: str
    checked: bool = False
    product_count: int


class DeliveryOption(BaseModel):
    """Delivery option toggle."""

    id: str
    label: str
    description: Optional[str] = None
    active: bool = False


class ProductBadge(BaseModel):
    """Badge rendered on product cards."""

    id: str
    label: str
    tone: str = Field(..., description="Tailwind color token used for the badge")


class Product(BaseModel):
    """Product showcased in the grid."""

    id: str
    name: str
    category_id: str
    brand_id: str
    image: str
    price: float
    currency: str
    rating: float
    reviews: int
    favorite: bool = False
    badges: List[ProductBadge] = Field(default_factory=list)
    original_price: Optional[float] = None


class SpotlightMetric(BaseModel):
    """Spotlight metric displayed near the filters."""

    id: str
    label: str
    value: str
    change: float
    trend: MetricTrend


class EcommerceDashboardResponse(BaseModel):
    """Aggregated payload powering the front-end dashboard."""

    generated_at: datetime
    overview_metrics: List[OverviewMetric]
    categories: List[Category]
    price_range: PriceRange
    rating_filter: RatingFilter
    brand_filters: List[BrandFilter]
    delivery_options: List[DeliveryOption]
    spotlight_metric: SpotlightMetric
    products: List[Product]


EcommerceDashboardResponse.model_rebuild()
