# API Documentation

## Overview
This document describes the API endpoints for the bench_par backend.

### FastAPI
- Interactive docs available at /docs (Swagger UI)
- Alternative docs at /redoc

## Authentication
- Bearer JWT via Authorization header

## Example Endpoints
- GET /health
- GET /items?skip=0&limit=100
- POST /items

## Error Handling
- Errors follow a standard JSON shape with `message` and optional `code`.