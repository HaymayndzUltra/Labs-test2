# Deployment Guide

## Environments
- Development (docker-compose)
- Staging
- Production

## Prerequisites
- Docker and Docker Compose installed
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
### AWS (ECS/Fargate) - Outline
1. Build and push images to ECR
2. Provision ECS service and Task Definition
3. Configure load balancer and target group
4. Attach IAM roles and secrets
5. Run database migrations

## Post-Deployment
- Health checks
- Log aggregation
- Metrics and alerts
- Backup and restore checks