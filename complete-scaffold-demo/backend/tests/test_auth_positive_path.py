from fastapi.testclient import TestClient
from main import app
import pytest

c = TestClient(app)

def test_positive_auth_flow():
    """High-yield test: valid login → token → protected route"""
    # Step 1: Valid login
    login_response = c.post("/api/v1/auth/login", json={
        "username": "admin",
        "password": "password"
    })
    assert login_response.status_code == 200
    token_data = login_response.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"
    
    # Step 2: Use token to access protected route
    headers = {"Authorization": f"Bearer {token_data['access_token']}"}
    
    # Test /api/v1/users/me (protected)
    me_response = c.get("/api/v1/users/me", headers=headers)
    print(f"DEBUG: Me response status: {me_response.status_code}")
    print(f"DEBUG: Me response text: {me_response.text}")
    assert me_response.status_code == 200
    user_data = me_response.json()
    assert user_data["username"] == "admin"
    
    # Test /api/v1/users (protected)
    users_response = c.get("/api/v1/users", headers=headers)
    assert users_response.status_code == 200
    users_data = users_response.json()
    assert isinstance(users_data, list)
    assert len(users_data) > 0

def test_invalid_login_credentials():
    """Test invalid login credentials"""
    # Wrong password
    response = c.post("/api/v1/auth/login", json={
        "username": "admin",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
    assert "Invalid credentials" in response.json()["detail"]
    
    # Non-existent user
    response = c.post("/api/v1/auth/login", json={
        "username": "nonexistent",
        "password": "anypassword"
    })
    assert response.status_code == 401

def test_protected_routes_without_token():
    """Test protected routes return 401 without token"""
    protected_routes = ["/api/v1/users/me", "/api/v1/users"]
    
    for route in protected_routes:
        response = c.get(route)
        assert response.status_code == 401
