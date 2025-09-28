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
### Self-hosted - Outline
1. Provision VM
2. Install Docker
3. Use docker-compose to run services
4. Configure reverse proxy and TLS

## Post-Deployment
- Health checks
- Log aggregation
- Metrics and alerts
- Backup and restore checks