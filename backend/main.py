from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base
from app.api.v1.router import api_router
from app.middleware import ComplianceAuditMiddleware, configure_compliance_logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Enable compliance loggers before the application starts serving requests
configure_compliance_logging(
    destination=settings.COMPLIANCE_LOG_DESTINATION,
    level=settings.COMPLIANCE_LOG_LEVEL,
    enable_access=settings.COMPLIANCE_ACCESS_LOG_ENABLED,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up portfolio-dashboard API")
    if settings.COMPLIANCE_REGIMES:
        logger.info("Compliance regimes active: %s", ", ".join(settings.COMPLIANCE_REGIMES))
    if settings.COMPLIANCE_AUDIT_LOG_ENABLED:
        logger.info("Compliance audit logging enabled")
    if settings.COMPLIANCE_ACCESS_LOG_ENABLED:
        logger.info("Compliance access logging enabled")
    # Create database tables
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown
    logger.info("Shutting down portfolio-dashboard API")


app = FastAPI(
    title="portfolio-dashboard API",
    description="saas fullstack API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if settings.COMPLIANCE_AUDIT_LOG_ENABLED or settings.COMPLIANCE_ACCESS_LOG_ENABLED:
    app.add_middleware(
        ComplianceAuditMiddleware,
        regimes=settings.COMPLIANCE_REGIMES,
        redact_headers=settings.COMPLIANCE_REDACT_HEADERS,
        log_access=settings.COMPLIANCE_ACCESS_LOG_ENABLED,
    )

# Include routers
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"message": "Welcome to portfolio-dashboard API"}


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "portfolio-dashboard API",
        "version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info"
    )