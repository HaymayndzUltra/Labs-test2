from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI(title="Commerce Analytics API", openapi_url="/openapi.json", docs_url="/api/docs")


@app.middleware("http")
async def add_correlation_id(request: Request, call_next):
    correlation_id = request.headers.get("X-Request-ID") or "generated"
    response = await call_next(request)
    response.headers["X-Request-ID"] = correlation_id
    return response


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/api/v1/kpis")
async def get_kpis():
    return {"totals": {}, "deltas": {}}

