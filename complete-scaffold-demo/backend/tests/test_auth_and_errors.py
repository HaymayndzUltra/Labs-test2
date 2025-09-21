from fastapi.testclient import TestClient
from main import app
import pytest

c = TestClient(app)

def test_login_validation_error():
    # Should be 400/422 when body invalid; 401 if requires creds.
    r = c.post("/api/v1/auth/login", json={})
    assert r.status_code in (400, 401, 422)

@pytest.mark.parametrize("path", ["/api/v1/users", "/users", "/api/v1/me"])
def test_protected_like_routes_are_not_200_without_auth(path):
    r = c.get(path)
    # If route exists it should not allow unauth access; if 404, skip (not in this template).
    if r.status_code == 404:
        pytest.skip(f"{path} not present")
    assert r.status_code in (401, 403)
