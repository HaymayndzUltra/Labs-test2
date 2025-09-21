from fastapi.testclient import TestClient
from main import app
import pytest

c = TestClient(app)

def test_users_crud_happy_path():
    """CRUD happy path test for users endpoint"""
    # Get auth token first
    login_response = c.post("/api/v1/auth/login", json={
        "username": "admin",
        "password": "password"
    })
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # READ: Get all users
    users_response = c.get("/api/v1/users", headers=headers)
    assert users_response.status_code == 200
    users_data = users_response.json()
    assert isinstance(users_data, list)
    assert len(users_data) >= 1
    
    # READ: Get specific user
    me_response = c.get("/api/v1/users/me", headers=headers)
    assert me_response.status_code == 200
    user_data = me_response.json()
    assert user_data["username"] == "admin"
    assert "email" in user_data
    assert "id" in user_data

def test_request_validation_errors():
    """Test request validation and error handling"""
    # Test login with invalid JSON structure
    response = c.post("/api/v1/auth/login", json={
        "invalid_field": "value"
    })
    assert response.status_code == 422  # Validation error
    
    # Test login with missing required fields
    response = c.post("/api/v1/auth/login", json={})
    assert response.status_code == 422

def test_http_method_validation():
    """Test HTTP method validation"""
    # Test wrong method on auth endpoint
    response = c.get("/api/v1/auth/login")
    assert response.status_code == 405  # Method not allowed
    
    # Test wrong method on users endpoint
    response = c.post("/api/v1/users")
    assert response.status_code == 405
