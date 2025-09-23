"""Service layer returning e-commerce dashboard data."""
from __future__ import annotations

from datetime import datetime
from typing import List

from app.schemas.commerce_dashboard import (
    BrandFilter,
    Category,
    DeliveryOption,
    EcommerceDashboardResponse,
    MetricTrend,
    OverviewMetric,
    PriceRange,
    Product,
    ProductBadge,
    RatingFilter,
    SpotlightMetric,
)


class CommerceDashboardService:
    """Provides curated enterprise e-commerce insights."""

    @staticmethod
    def get_dashboard() -> EcommerceDashboardResponse:
        """Build the dashboard response shaped for the front-end."""

        categories: List[Category] = [
            Category(id="all", label="All Categories", active=True),
            Category(id="deals", label="Deals"),
            Category(id="crypto", label="Crypto"),
            Category(id="fashion", label="Fashion"),
            Category(id="health", label="Health & Wellness"),
            Category(id="art", label="Art"),
            Category(id="home", label="Home"),
            Category(id="sport", label="Sport"),
            Category(id="music", label="Music"),
            Category(id="gaming", label="Gaming"),
        ]

        overview_metrics = [
            OverviewMetric(
                id="net-revenue",
                label="Net Revenue",
                value="$284,500",
                change=12.4,
                trend=MetricTrend.UP,
                description="Revenue grew week-over-week driven by sport accessories",
            ),
            OverviewMetric(
                id="orders",
                label="Orders",
                value="3,420",
                change=9.1,
                trend=MetricTrend.UP,
                description="Orders increased after the spring loyalty campaign",
            ),
            OverviewMetric(
                id="aov",
                label="Avg. Order Value",
                value="$83.15",
                change=-2.3,
                trend=MetricTrend.DOWN,
                description="Average basket size dipped due to bundle promotions",
            ),
            OverviewMetric(
                id="conversion",
                label="Conversion Rate",
                value="4.8%",
                change=0.6,
                trend=MetricTrend.UP,
                description="Conversion lifted following UX optimizations on checkout",
            ),
        ]

        price_range = PriceRange(
            currency="USD",
            minimum=20,
            maximum=1130,
            average=300,
            selected_min=130,
            selected_max=940,
        )

        rating_filter = RatingFilter(label="4 Stars & up", minimum_rating=4.0)

        brand_filters = [
            BrandFilter(id="adidas", name="Adidas", checked=True, product_count=64),
            BrandFilter(id="columbia", name="Columbia", checked=True, product_count=38),
            BrandFilter(id="demix", name="Demix", checked=True, product_count=17),
            BrandFilter(id="new-balance", name="New Balance", checked=True, product_count=24),
            BrandFilter(id="nike", name="Nike", checked=True, product_count=52),
            BrandFilter(id="xiaomi", name="Xiaomi", checked=False, product_count=14),
            BrandFilter(id="asics", name="Asics", checked=False, product_count=11),
        ]

        delivery_options = [
            DeliveryOption(id="standard", label="Standard", description="3-5 business days", active=True),
            DeliveryOption(id="pickup", label="Pick Up", description="Ready in 2 hours"),
        ]

        spotlight_metric = SpotlightMetric(
            id="retention",
            label="Returning Customer Rate",
            value="61%",
            change=5.2,
            trend=MetricTrend.UP,
        )

        products = [
            Product(
                id="smart-watch-wh22",
                name="Smart Watch WH22-6 Fitness Edition",
                category_id="sport",
                brand_id="nike",
                image="https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=600&h=600&q=80",
                price=454.0,
                currency="USD",
                rating=4.8,
                reviews=215,
                favorite=False,
                badges=[ProductBadge(id="top", label="Top item", tone="bg-amber-100 text-amber-600")],
            ),
            Product(
                id="tennis-racket",
                name="Tennis Rackets for Beginners",
                category_id="sport",
                brand_id="adidas",
                image="https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=600&h=600&q=80",
                price=30.99,
                currency="USD",
                rating=4.6,
                reviews=168,
                favorite=False,
            ),
            Product(
                id="boxing-gloves",
                name="Premium Boxing Gloves for Training",
                category_id="sport",
                brand_id="nike",
                image="https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=600&h=600&q=80",
                price=196.84,
                currency="USD",
                original_price=275.57,
                rating=4.7,
                reviews=192,
                favorite=True,
            ),
            Product(
                id="archery-kit",
                name="Club Kit 1 Recurve Archer Set",
                category_id="sport",
                brand_id="columbia",
                image="https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=600&h=600&q=80",
                price=48.99,
                currency="USD",
                rating=4.5,
                reviews=74,
                favorite=False,
            ),
            Product(
                id="training-hoodie",
                name="Nike Therma-Fit Pullover Training Hoodie",
                category_id="sport",
                brand_id="nike",
                image="https://images.unsplash.com/photo-1521579971123-1192931a1452?auto=format&fit=crop&w=600&h=600&q=80",
                price=154.99,
                currency="USD",
                rating=4.9,
                reviews=321,
                favorite=True,
                badges=[ProductBadge(id="editor", label="4.7/5", tone="bg-indigo-500 text-white")],
            ),
            Product(
                id="nike-sneakers",
                name="Lightweight White Nike Training Shoes",
                category_id="sport",
                brand_id="nike",
                image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&h=600&q=80",
                price=210.0,
                currency="USD",
                rating=4.8,
                reviews=287,
                favorite=False,
                badges=[ProductBadge(id="top", label="Top item", tone="bg-emerald-100 text-emerald-600")],
            ),
            Product(
                id="smart-tracker",
                name="Smart Fitness Tracker Pro",
                category_id="health",
                brand_id="xiaomi",
                image="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&h=600&q=80",
                price=89.99,
                currency="USD",
                rating=4.4,
                reviews=189,
                favorite=False,
            ),
            Product(
                id="wireless-earbuds",
                name="Wireless Sports Earbuds",
                category_id="music",
                brand_id="demix",
                image="https://images.unsplash.com/photo-1518444028785-8fbcd101ebb9?auto=format&fit=crop&w=600&h=600&q=80",
                price=129.0,
                currency="USD",
                rating=4.6,
                reviews=143,
                favorite=False,
            ),
        ]

        return EcommerceDashboardResponse(
            generated_at=datetime.utcnow(),
            overview_metrics=overview_metrics,
            categories=categories,
            price_range=price_range,
            rating_filter=rating_filter,
            brand_filters=brand_filters,
            delivery_options=delivery_options,
            spotlight_metric=spotlight_metric,
            products=products,
        )
