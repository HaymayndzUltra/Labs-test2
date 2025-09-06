# API Documentation

## Overview
API documentation for healthtech-demo fastapi backend.

## Base URL
- Development: `http://localhost:8000`
- Staging: `https://api-staging.healthtech-demo.com`
- Production: `https://api.healthtech-demo.com`

## Authentication
This API uses auth0 for authentication.

### Headers
```
Authorization: Bearer {token}
```

### Getting a Token
1. Register/login through auth0
2. Receive JWT token
3. Include token in all API requests

## Endpoints

### Health Check
```
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Industry-Specific Endpoints

Based on healthcare requirements, the following endpoints are available:

#### Patients
- `GET /api/v1/patients` - List patients
- `GET /api/v1/patients/{id}` - Get patient details
- `POST /api/v1/patients` - Create patient
- `PUT /api/v1/patients/{id}` - Update patient
- `DELETE /api/v1/patients/{id}` - Delete patient

#### Appointments
- `GET /api/v1/appointments` - List appointments
- `POST /api/v1/appointments` - Schedule appointment
- `PUT /api/v1/appointments/{id}` - Update appointment
- `DELETE /api/v1/appointments/{id}` - Cancel appointment

#### Medical Records
- `GET /api/v1/patients/{id}/records` - Get patient records
- `POST /api/v1/patients/{id}/records` - Add medical record

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

### Common Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per authenticated user

## Versioning
API versioning is handled through URL path: `/api/v1/`

## Webhooks
No webhooks configured.

## SDKs
- JavaScript/TypeScript
- Python
- Go

## OpenAPI Specification
Full OpenAPI 3.0 specification available at `/openapi.json`
