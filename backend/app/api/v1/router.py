"""API V1 router"""
from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, tenants, billing

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(tenants.router, prefix="/tenants", tags=["tenants"])
api_router.include_router(billing.router, prefix="/billing", tags=["billing"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
