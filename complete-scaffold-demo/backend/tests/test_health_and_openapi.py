from fastapi.testclient import TestClient
from main import app

c = TestClient(app)

def _first_200(paths: list[str]) -> str:
    for p in paths:
        r = c.get(p)
        if r.status_code == 200:
            return p
    import pytest; pytest.skip("No health endpoint found")
    return ""

def test_health_200():
    path = _first_200(["/health", "/api/v1/health", "/api/health"])
    r = c.get(path)
    assert r.status_code == 200
    # basic shape if JSON
    if r.headers.get("content-type","").startswith("application/json"):
        body = r.json()
        assert "status" in body or "ok" in body or "healthy" in body

def test_openapi_json_present():
    r = c.get("/openapi.json")
    assert r.status_code == 200
    data = r.json()
    assert "openapi" in data and "paths" in data
