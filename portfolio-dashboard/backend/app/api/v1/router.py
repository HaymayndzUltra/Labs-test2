"""
API V1 router
"""
from fastapi import APIRouter

from app.api.v1.endpoints import auth, commerce_dashboard, dashboard, users

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(dashboard.router, tags=["dashboard"])
api_router.include_router(
    commerce_dashboard.router,
    prefix="/commerce-dashboard",
    tags=["commerce-dashboard"],
)
