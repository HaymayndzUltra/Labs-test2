# portfolio-dashboard

## Overview
Saas fullstack application built with modern technologies.

## Technology Stack
- **Frontend**: nextjs
- **Backend**: fastapi
- **Database**: postgres
- **Authentication**: auth0
- **Deployment**: vercel

## Features
- admin_dashboard
- api_access
- authentication
- authorization
- multi_tenancy
- subscription_billing
- usage_tracking
- user_management

## Compliance
- GDPR (privacy, consent management, data deletion workflows)
- Audit and access logging toggles controlled via `COMPLIANCE_*` environment variables

### Operator Checklist
1. Populate the compliance variables in `backend/.env.example` before deploying (regimes, log destinations, redaction lists).
2. Review `docs/COMPLIANCE.md` for the complete GDPR control set and operational procedures.
3. Ship the generated compliance audit log (`logs/compliance.log` by default) to your centralized logging platform.
4. Run `python scripts/validate_compliance_assets.py` (or rely on CI) whenever the stack changes to ensure docs and gates stay in sync with generator outputs.

## Quick Start

1. Install dependencies:
   ```bash
   make setup
   ```

2. Start development environment:
   ```bash
   make dev
   ```

3. Run tests:
   ```bash
   make test
   ```

## Documentation
- [Development Guide](docs/DEVELOPMENT.md)
- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)


## License
Proprietary - All rights reserved
