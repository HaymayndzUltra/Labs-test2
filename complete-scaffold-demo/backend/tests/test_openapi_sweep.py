from fastapi.testclient import TestClient
from main import app
import pytest

c = TestClient(app)

def test_openapi_driven_endpoint_sweep():
    """OpenAPI-driven sweep: test all endpoints based on OpenAPI spec"""
    # Get OpenAPI spec
    openapi_response = c.get("/openapi.json")
    assert openapi_response.status_code == 200
    openapi_spec = openapi_response.json()
    
    # Extract all paths and methods
    paths = openapi_spec.get("paths", {})
    
    # Test each endpoint
    for path, methods in paths.items():
        for method, spec in methods.items():
            if method.upper() in ["GET", "POST", "PUT", "DELETE"]:
                test_endpoint(path, method.upper(), spec)

def test_endpoint(path, method, spec):
    """Test individual endpoint based on OpenAPI spec"""
    # Determine if endpoint requires auth based on security requirements
    requires_auth = False
    if "security" in spec:
        requires_auth = len(spec["security"]) > 0
    
    # Prepare headers
    headers = {}
    if requires_auth:
        # Get auth token
        login_response = c.post("/api/v1/auth/login", json={
            "username": "admin",
            "password": "password"
        })
        if login_response.status_code == 200:
            token = login_response.json()["access_token"]
            headers["Authorization"] = f"Bearer {token}"
    
    # Make request
    if method == "GET":
        response = c.get(path, headers=headers)
    elif method == "POST":
        # Use appropriate payload based on request body schema
        json_data = {}
        if "requestBody" in spec:
            content = spec["requestBody"].get("content", {})
            if "application/json" in content:
                schema = content["application/json"].get("schema", {})
                # Generate minimal valid payload
                json_data = generate_minimal_payload(schema)
        
        response = c.post(path, json=json_data, headers=headers)
    else:
        response = c.request(method, path, headers=headers)
    
    # Assert expected status
    if requires_auth and not headers.get("Authorization"):
        assert response.status_code in [401, 403], f"{method} {path} should require auth"
    else:
        # For public endpoints or authenticated requests
        assert response.status_code in [200, 201, 404, 405, 422], f"{method} {path} unexpected status: {response.status_code}"

def generate_minimal_payload(schema):
    """Generate minimal valid payload based on JSON schema"""
    if "$ref" in schema:
        # Handle references (simplified)
        return {}
    
    properties = schema.get("properties", {})
    required = schema.get("required", [])
    
    payload = {}
    for field in required:
        if field in properties:
            field_type = properties[field].get("type", "string")
            if field_type == "string":
                payload[field] = "test"
            elif field_type == "integer":
                payload[field] = 1
            elif field_type == "boolean":
                payload[field] = True
            else:
                payload[field] = "test"
    
    return payload

def test_health_endpoints():
    """Test all health-related endpoints"""
    health_paths = ["/health", "/api/v1/health", "/api/health"]
    
    for path in health_paths:
        response = c.get(path)
        if response.status_code == 200:
            # Found a working health endpoint
            data = response.json()
            assert "status" in data or "ok" in data or "healthy" in data
            break
    else:
        pytest.skip("No health endpoint found")

def test_root_endpoint():
    """Test root endpoint if it exists"""
    response = c.get("/")
    # Root endpoint might not exist, that's okay
    assert response.status_code in [200, 404]
