# Comprehensive API Documentation

## Overview

This document provides comprehensive documentation for all public APIs, functions, and components in the Client Project Generator system. The system supports multiple backend frameworks and provides a unified project generation interface.

## Table of Contents

1. [Backend API Endpoints](#backend-api-endpoints)
2. [Project Generator API](#project-generator-api)
3. [Utility Scripts](#utility-scripts)
4. [OpenAPI Specifications](#openapi-specifications)
5. [Usage Examples](#usage-examples)
6. [Integration Guides](#integration-guides)

## Backend API Endpoints

### FastAPI Backend

#### Base URL
- Development: `http://localhost:8000`
- Production: `https://api.example.com`

#### Authentication Endpoints

##### POST /api/v1/auth/login/access-token
Login with email and password.

**Request Body:**
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer"
}
```

**Status Codes:**
- `200` - Success
- `401` - Invalid credentials
- `422` - Validation error

##### POST /api/v1/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "full_name": "John Doe",
  "is_active": true,
  "is_superuser": false
}
```

##### POST /api/v1/auth/password-recovery/{email}
Request password reset.

**Parameters:**
- `email` (string): User's email address

**Response:**
```json
{
  "message": "Password recovery email sent"
}
```

#### User Management Endpoints

##### GET /api/v1/users/
List all users (admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `skip` (int, optional): Number of records to skip (default: 0)
- `limit` (int, optional): Maximum number of records to return (default: 100)

**Response:**
```json
{
  "items": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "full_name": "John Doe",
      "is_active": true
    }
  ],
  "total": 1,
  "skip": 0,
  "limit": 100
}
```

##### GET /api/v1/users/me
Get current user profile.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "full_name": "John Doe",
  "is_active": true,
  "is_superuser": false
}
```

##### PUT /api/v1/users/me
Update current user profile.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "full_name": "John Smith",
  "email": "john.smith@example.com"
}
```

#### Health Check

##### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Go Echo Backend

#### Base URL
- Development: `http://localhost:8080`
- Production: `https://api.example.com`

#### Authentication Endpoints

##### POST /api/v1/auth/register
Register new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John Doe",
  "email": "user@example.com",
  "role": "user",
  "created_at": "2024-01-01T00:00:00Z"
}
```

##### POST /api/v1/auth/login
Login user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

##### POST /api/v1/auth/refresh
Refresh access token.

**Request Body:**
```json
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### User Management Endpoints

##### GET /api/v1/users
List all users (admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (int, optional): Page number (default: 1)
- `limit` (int, optional): Items per page (default: 10)
- `search` (string, optional): Search term

**Response:**
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "user",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

##### GET /api/v1/users/me
Get current user profile.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John Doe",
  "email": "user@example.com",
  "role": "user",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Django REST Framework Backend

#### Base URL
- Development: `http://localhost:8000`
- Production: `https://api.example.com`

#### Authentication Endpoints

##### POST /api/v1/auth/login/
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

##### POST /api/v1/auth/register/
Register new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "is_active": true,
  "date_joined": "2024-01-01T00:00:00Z"
}
```

#### User Management Endpoints

##### GET /api/v1/users/
List all users.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (int, optional): Page number
- `page_size` (int, optional): Items per page
- `search` (string, optional): Search term

**Response:**
```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "is_active": true,
      "date_joined": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### NestJS Backend

#### Base URL
- Development: `http://localhost:3000`
- Production: `https://api.example.com`

#### Authentication Endpoints

##### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

##### POST /auth/register
Register new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### User Management Endpoints

##### GET /users
List all users (admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (int, optional): Page number (default: 1)
- `limit` (int, optional): Items per page (default: 10)

**Response:**
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

## Error Handling

### Standard Error Response Format

All APIs follow a consistent error response format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {
      "field": "Specific field error"
    }
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "path": "/api/v1/endpoint"
}
```

### Common HTTP Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

### Error Codes

- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_FAILED` - Invalid credentials
- `AUTHORIZATION_FAILED` - Insufficient permissions
- `RESOURCE_NOT_FOUND` - Requested resource not found
- `DUPLICATE_RESOURCE` - Resource already exists
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error

## Rate Limiting

All APIs implement rate limiting:

- **Anonymous users**: 100 requests per hour
- **Authenticated users**: 1000 requests per hour
- **Admin users**: 5000 requests per hour

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Authentication

### JWT Token Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer {token}
```

### Token Structure

JWT tokens contain the following claims:
- `sub` - User ID
- `email` - User email
- `role` - User role
- `iat` - Issued at timestamp
- `exp` - Expiration timestamp

### Token Refresh

Access tokens expire after 1 hour. Use the refresh token to obtain a new access token:

```bash
curl -X POST /api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "your_refresh_token"}'
```

## Pagination

List endpoints support pagination with the following parameters:

- `page` - Page number (starts from 1)
- `limit` - Items per page (max 100)
- `sort` - Sort field
- `order` - Sort order (asc/desc)

Response includes pagination metadata:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Filtering and Search

Many endpoints support filtering and search:

- `search` - Text search across relevant fields
- `filter[field]` - Filter by specific field values
- `date_from` - Filter by date range start
- `date_to` - Filter by date range end

Example:
```
GET /api/v1/users?search=john&filter[role]=admin&date_from=2024-01-01
```

## Webhooks

The system supports webhooks for real-time notifications:

### Webhook Events

- `user.created` - New user registered
- `user.updated` - User profile updated
- `user.deleted` - User account deleted
- `auth.login` - User logged in
- `auth.logout` - User logged out

### Webhook Payload

```json
{
  "event": "user.created",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## SDKs and Libraries

### JavaScript/TypeScript
```bash
npm install @client-project-generator/api-client
```

### Python
```bash
pip install client-project-generator-api
```

### Go
```bash
go get github.com/client-project-generator/api-client-go
```

## Testing

### Test Environment

Use the test environment for development and testing:
- Base URL: `https://api-test.example.com`
- No rate limiting
- Test data is reset daily

### API Testing Tools

- **Postman Collection**: Available in `/docs/postman/`
- **OpenAPI Spec**: Available at `/openapi.json`
- **Swagger UI**: Available at `/docs`

## Support

For API support and questions:
- **Documentation**: https://docs.example.com
- **Support Email**: api-support@example.com
- **GitHub Issues**: https://github.com/client-project-generator/issues


