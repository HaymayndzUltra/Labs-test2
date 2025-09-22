# Deployment Guide

## Environments
- Development (docker-compose)
- Staging
- Production

## Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ for frontend build
- Python 3.11+ for backend tasks

## Local Development
```bash
make setup
make dev
```

## Build
```bash
make build
```

## Deployment Targets
### Vercel (Frontend) - Outline
1. Connect repository to Vercel
2. Configure environment variables
3. Deploy via Git push

## Post-Deployment
- Health checks
- Log aggregation
- Metrics and alerts
- Backup and restore checks

## Compliance Operations
- Confirm GDPR regime is enabled via `COMPLIANCE_REGIMES` and audit/access logging flags in the backend environment.
- Ensure the audit log destination (`COMPLIANCE_LOG_DESTINATION`) is writable and forwarded to your SIEM.
- Redact additional headers by appending to `COMPLIANCE_REDACT_HEADERS` when deploying behind custom proxies.
- Execute `python scripts/validate_compliance_assets.py` prior to releases to confirm docs and gates match the generator outputs.
- Review `docs/COMPLIANCE.md` with operators and document the completion of each checklist stage.