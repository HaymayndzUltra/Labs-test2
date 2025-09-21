from fastapi.testclient import TestClient
from main import app
import pytest

c = TestClient(app)

def test_root_endpoint():
    """Test root endpoint"""
    response = c.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data

def test_health_endpoints():
    """Test health endpoints"""
    # Test /health
    response = c.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    
    # Test /api/v1/health
    response = c.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"

def test_openapi_endpoint():
    """Test OpenAPI endpoint"""
    response = c.get("/openapi.json")
    assert response.status_code == 200
    data = response.json()
    assert "openapi" in data
    assert "paths" in data

def test_login_success():
    """Test successful login"""
    response = c.post("/api/v1/auth/login", json={
        "username": "admin",
        "password": "password"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_failure():
    """Test failed login"""
    response = c.post("/api/v1/auth/login", json={
        "username": "admin",
        "password": "wrong"
    })
    assert response.status_code == 401
    data = response.json()
    assert "Invalid credentials" in data["detail"]

def test_login_validation_error():
    """Test login validation error"""
    response = c.post("/api/v1/auth/login", json={
        "username": "",
        "password": ""
    })
    assert response.status_code == 422

def test_protected_routes_without_auth():
    """Test protected routes without authentication"""
    # These should return 401 or 403
    protected_routes = ["/api/v1/users", "/users", "/api/v1/me"]
    
    for route in protected_routes:
        response = c.get(route)
        assert response.status_code in [401, 403, 404]  # 404 if route doesn't exist

def test_protected_routes_with_auth():
    """Test protected routes with authentication"""
    # Get auth token
    login_response = c.post("/api/v1/auth/login", json={
        "username": "admin",
        "password": "password"
    })
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test /api/v1/users
    response = c.get("/api/v1/users", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "users" in data
    assert isinstance(data["users"], list)
    
    # Test /users (alternative endpoint)
    response = c.get("/users", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "users" in data

def test_http_methods():
    """Test different HTTP methods"""
    # Test wrong method on login endpoint
    response = c.get("/api/v1/auth/login")
    assert response.status_code == 405  # Method not allowed
    
    # Test wrong method on users endpoint
    response = c.post("/api/v1/users")
    assert response.status_code == 405

def test_request_validation():
    """Test request validation"""
    # Test with invalid JSON
    response = c.post("/api/v1/auth/login", json={
        "invalid_field": "value"
    })
    assert response.status_code == 422

def test_concurrent_requests():
    """Test concurrent requests"""
    import threading
    import time
    
    results = []
    
    def make_request():
        response = c.post("/api/v1/auth/login", json={
            "username": "admin",
            "password": "password"
        })
        results.append(response.status_code)
    
    # Make 3 concurrent requests
    threads = []
    for _ in range(3):
        thread = threading.Thread(target=make_request)
        threads.append(thread)
        thread.start()
    
    for thread in threads:
        thread.join()
    
    # All should succeed
    assert all(status == 200 for status in results)
