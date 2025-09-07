# Template Packs Guide

This document explains the structure of `template-packs/`, how to extend templates, and how to run template-level tests locally.

## Structure

- `template-packs/backend/`
  - `fastapi/`, `django/`, `nestjs/`, `go/`
  - Variants: `base/`, `enterprise/`, `microservice/` (where applicable)
- `template-packs/frontend/`
  - `nextjs/`, `nuxt/`, `angular/`, `expo/`
  - Variant: `base/`
- `template-packs/database/`
  - `postgres/`, `mongodb/`, `firebase/`

## Extending Templates

1. Copy the closest `base/` variant as a starting point for a new variant (e.g., `enterprise/`).
2. Keep placeholders like `{{PROJECT_NAME}}`, `{{INDUSTRY}}`, `{{PROJECT_TYPE}}` intact.
3. Add only minimal opinionated configuration; prefer defaults with clear comments.
4. Document new files in the template's `README.md`.

## Running Template Tests Locally

These tests are optional during generator CI; they require local tooling.

### Backend: FastAPI

- Python 3.11+
- Create a venv and install:
  ```bash
  python -m venv .venv && . .venv/bin/activate
  pip install -r template-packs/backend/fastapi/base/requirements.txt
  pytest -q template-packs/backend/fastapi/base/tests -vv
  ```
- Notes: The template uses Pydantic v2 and falls back to SQLite for tests.

### Backend: Django

- Python 3.11+
- From a generated project, run:
  ```bash
  python -m venv venv && source venv/bin/activate
  pip install -r backend/requirements.txt
  python manage.py test
  ```
- The template includes health and users tests under `apps/*/tests.py`.

### Frontend: Next.js

- Node 18+
- From a generated project:
  ```bash
  cd frontend
  npm ci
  npm test
  ```
- The template includes Jest + Testing Library with `next-jest` and a minimal `page.test.tsx`.

### Frontend: Angular

- Node 18+
- From a generated project:
  ```bash
  cd frontend
  npm ci
  npm run test
  ```
- The template ships with Karma/Jasmine; a simple component spec is included.

## Known Compatibility Notes

- Jest + Next 14 requires `next-jest` and Babel presets; already configured in the template.
- FastAPI template requires `python-multipart`, `python-jose[cryptography]`, `passlib[bcrypt]`.
- For CI in generated projects, prefer running backend/frontend tests separately.

## Adding New Files

- Keep file names consistent and avoid framework-specific hidden assumptions.
- Update the template's `README.md` with any new scripts or environment variables.