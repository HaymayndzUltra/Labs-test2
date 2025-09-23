# API Documentation

## Overview
This document describes the tenant-aware API endpoints for the portfolio-dashboard backend.

### FastAPI
- Interactive docs available at `/api/docs` (Swagger UI)
- Alternative docs at `/api/redoc`

## Authentication
- Bearer JWT via `Authorization` header
- Login: `POST /api/v1/auth/login/access-token`
- Tenant signup: `POST /api/v1/auth/register` or `POST /api/v1/tenants/register`
- Include `X-Tenant-ID` header for superusers who wish to operate on a specific tenant context

## Core Headers
| Header | Purpose |
| --- | --- |
| `Authorization: Bearer <token>` | Authenticated requests |
| `X-Tenant-ID` | Explicit tenant context (optional for tenant members, required for cross-tenant superuser actions) |

## Tenant & User Management
- `GET /api/v1/tenants/me` – Retrieve active tenant profile (name, billing email, slug, subscription)
- `PUT /api/v1/tenants/me` – Update tenant profile (admin-only)
- `GET /api/v1/users/` – List users scoped to the active tenant (admin-only)
- `POST /api/v1/users/` – Invite/create tenant members
- `GET /api/v1/users/me` – Retrieve authenticated user profile
- `PUT /api/v1/users/me` – Update authenticated user profile
- `GET /api/v1/users/{user_id}` – Fetch tenant member by id (admin or self)
- `PUT /api/v1/users/{user_id}` – Update tenant member (admin-only)

## Billing & Subscription
- `GET /api/v1/billing/subscription` – Inspect current subscription plan, status, seats, and renewal window
- `POST /api/v1/billing/subscription` – Update plan or seat counts
- `POST /api/v1/billing/subscription/cancel` – Cancel active subscription
- `POST /api/v1/billing/subscription/resume` – Resume a cancelled subscription

Default plans:
- `starter` – 5 seats, trialing by default
- `growth` – 25 seats
- `scale` – 100 seats

## Error Handling
- Errors follow a standard JSON shape with `detail` and optional metadata
- Authorization or tenant isolation failures return `403` or `404`
