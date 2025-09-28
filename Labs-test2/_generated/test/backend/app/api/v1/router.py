"""API V1 router"""
from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    dashboard,
    tenants,
    payments,
    tickets,
    buildings,
    ai,
    reports,
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(tenants.router, prefix="/tenants", tags=["tenants"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
api_router.include_router(tickets.router, prefix="/tickets", tags=["tickets"])
api_router.include_router(buildings.router, prefix="/buildings", tags=["buildings"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
