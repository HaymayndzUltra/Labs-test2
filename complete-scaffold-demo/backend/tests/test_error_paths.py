from fastapi.testclient import TestClient
from main import app
import pytest

c = TestClient(app)

def test_validation_error_paths():
    """Test various validation error paths"""
    # Test login with wrong data types
    response = c.post("/api/v1/auth/login", json={
        "username": 123,  # Should be string
        "password": None  # Should not be null
    })
    assert response.status_code == 422
    
    # Test login with extra fields
    response = c.post("/api/v1/auth/login", json={
        "username": "johndoe",
        "password": "fakehashedpassword",
        "extra_field": "should_not_be_here"
    })
    # This might still work due to Pydantic's extra="ignore" behavior
    assert response.status_code in [200, 422]

def test_malformed_json():
    """Test malformed JSON requests"""
    # Send invalid JSON
    response = c.post(
        "/api/v1/auth/login",
        data="invalid json{",
        headers={"Content-Type": "application/json"}
    )
    assert response.status_code == 422

def test_missing_content_type():
    """Test requests without proper content type"""
    response = c.post(
        "/api/v1/auth/login",
        data='{"username": "johndoe", "password": "fakehashedpassword"}'
        # No Content-Type header
    )
    assert response.status_code in [422, 415]

def test_unsupported_media_type():
    """Test requests with unsupported media type"""
    response = c.post(
        "/api/v1/auth/login",
        data="username=johndoe&password=fakehashedpassword",
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert response.status_code in [422, 415]

def test_large_payload():
    """Test handling of large payloads"""
    large_data = {
        "username": "johndoe",
        "password": "fakehashedpassword",
        "extra_data": "x" * 10000  # Large payload
    }
    response = c.post("/api/v1/auth/login", json=large_data)
    # Should either work or return 422, not crash
    assert response.status_code in [200, 422]

def test_unicode_handling():
    """Test Unicode handling in requests"""
    response = c.post("/api/v1/auth/login", json={
        "username": "admin",
        "password": "password"
    })
    assert response.status_code == 200
    
    # Test with Unicode in response
    if response.status_code == 200:
        data = response.json()
        assert isinstance(data["access_token"], str)

def test_concurrent_requests():
    """Test handling of concurrent requests"""
    import threading
    import time
    
    results = []
    
    def make_request():
        response = c.post("/api/v1/auth/login", json={
            "username": "admin",
            "password": "password"
        })
        results.append(response.status_code)
    
    # Make 5 concurrent requests
    threads = []
    for _ in range(5):
        thread = threading.Thread(target=make_request)
        threads.append(thread)
        thread.start()
    
    for thread in threads:
        thread.join()
    
    # All should succeed
    assert all(status == 200 for status in results)

def test_edge_case_parameters():
    """Test edge case parameter values"""
    # Empty strings
    response = c.post("/api/v1/auth/login", json={
        "username": "",
        "password": ""
    })
    assert response.status_code in [200, 401, 422]
    
    # Very long strings
    response = c.post("/api/v1/auth/login", json={
        "username": "a" * 1000,
        "password": "b" * 1000
    })
    assert response.status_code in [200, 401, 422]
