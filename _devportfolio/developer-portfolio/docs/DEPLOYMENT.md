# Deployment Guide

## Environments
- Development (docker-compose)
- Staging
- Production

## Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ for frontend build

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