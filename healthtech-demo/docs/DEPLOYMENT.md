# Deployment Guide

## Overview
This guide covers deploying healthtech-demo to aws.

## Prerequisites
- aws account with appropriate permissions
- Docker installed locally
- Environment variables configured
- SSL certificates ready

## Deployment Targets

### Development
- **URL**: https://dev.healthtech-demo.com
- **Branch**: develop
- **Auto-deploy**: Yes

### Staging
- **URL**: https://staging.healthtech-demo.com
- **Branch**: release/*
- **Auto-deploy**: Yes

### Production
- **URL**: https://healthtech-demo.com
- **Branch**: main
- **Auto-deploy**: No (manual approval required)

## Deployment Steps

### 1. Pre-deployment Checklist
- [ ] All tests passing
- [ ] Security scan completed
- [ ] Database migrations ready
- [ ] Environment variables updated
- [ ] Backup current production

### 2. Build Process
```bash
# Build frontend
cd frontend && npm run build

# Build backend
cd backend && python -m build



# Build Docker images
docker build -t healthtech-demo:latest .
```

### 3. Deploy to aws

#### AWS Deployment

1. **Configure AWS CLI**
   ```bash
   aws configure
   ```

2. **Deploy with ECS/Fargate**
   ```bash
   # Push image to ECR
   aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_URL
   docker tag healthtech-demo:latest $ECR_URL/healthtech-demo:latest
   docker push $ECR_URL/healthtech-demo:latest
   
   # Update service
   aws ecs update-service --cluster healthtech-demo-cluster --service healthtech-demo-service --force-new-deployment
   ```

3. **Update Load Balancer**
   - Update target groups
   - Configure health checks
   - Update SSL certificates

### 4. Post-deployment Steps
1. **Verify Deployment**
   - Check application health endpoint
   - Run smoke tests
   - Monitor error rates

2. **Database Migrations**
   ```bash
   # Run migrations if needed
   # Apply database migrations
   ```

3. **Cache Warming**
   - Prime application caches
   - Preload frequently accessed data

4. **Monitoring Setup**
   - Verify logging is working
   - Check metrics collection
   - Set up alerts

## Rollback Procedure

### Automatic Rollback
Deployment will automatically rollback if:
- Health checks fail
- Error rate exceeds threshold
- Response time degrades

### Manual Rollback
```bash
# Revert to previous version
aws ecs update-service --cluster healthtech-demo-cluster --service healthtech-demo-service --task-definition healthtech-demo:previous
```

## Environment Variables

### Required Variables
```env
# Application
APP_ENV=production
APP_URL=https://healthtech-demo.com

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Authentication
AUTH0_CLIENT_ID=xxx
AUTH0_CLIENT_SECRET=xxx

# Monitoring
SENTRY_DSN=xxx
LOG_LEVEL=info
```

### Security Considerations
- Never commit secrets to version control
- Use secret management service
- Rotate credentials regularly
- Limit access to production environment

## Troubleshooting

### Common Issues

1. **Deployment Fails**
   - Check build logs
   - Verify environment variables
   - Check resource limits

2. **Application Won't Start**
   - Check application logs
   - Verify database connection
   - Check for port conflicts

3. **Performance Issues**
   - Check resource utilization
   - Review database queries
   - Check for memory leaks

### Debug Commands
```bash
# View logs
docker logs -f healthtech-demo

# Check application status
curl https://healthtech-demo.com/health

# SSH into container
docker exec -it healthtech-demo /bin/bash
```

## Maintenance

### Regular Tasks
- **Daily**: Check logs and metrics
- **Weekly**: Review performance trends
- **Monthly**: Update dependencies
- **Quarterly**: Security audit

### Backup Strategy
- Database: Daily automated backups
- Application data: Hourly snapshots
- Retention: 30 days
- Test restore: Monthly

## Contact

### Escalation Path
1. **On-call Engineer**: Check PagerDuty
2. **Team Lead**: #healthtech-demo-leads
3. **Infrastructure Team**: #infrastructure
4. **Security Team**: security@company.com

### Documentation
- [Architecture Overview](./ARCHITECTURE.md)
- [API Documentation](./API.md)
- [Security Policies](./SECURITY.md)
