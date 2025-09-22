# Deployment Guide

This document describes how to configure the environments, wire in secrets, and ship code using the automated CI/CD pipeline that lives in `.github/workflows/ci-deploy.yml` and the helper targets in the project `Makefile`.

## Environment overview

| Environment   | Purpose                          | Frontend host                  | Backend host                  |
|---------------|----------------------------------|--------------------------------|-------------------------------|
| `development` | Local work using Docker Compose  | http://localhost:3000          | http://localhost:8000         |
| `staging`     | Pre-production smoke tests       | https://app.staging.example.com | https://api.staging.example.com |
| `production`  | Public traffic                   | https://app.example.com        | https://api.example.com       |

## Configure secrets and variables

1. Copy `.env.example` into environment-specific files (`.env.staging`, `.env.production`) and replace placeholder values with real endpoints and credentials.  
2. In **Vercel**, add the same environment variables for each environment. These are required for `npx vercel deploy` during Makefile deploys and for the GitHub Actions `deploy-vercel` job.  
3. In **AWS (ECS/Fargate)**:  
   - Create the execution role (`TASK_EXECUTION_ROLE_ARN`) with permissions for `AmazonECSTaskExecutionRolePolicy` and private registry access if required.  
   - Create the application task role (`TASK_ROLE_ARN`) with the minimal permissions the API needs (database, SSM, etc.).  
   - Provision an ECS cluster and service (`ECS_CLUSTER_NAME`, `ECS_SERVICE_NAME`) pointing at the task family defined in `deploy/aws/task-definition.json`.  
4. In **GitHub > Settings > Secrets and variables > Actions** configure per-environment secrets:  
   - **Secrets**: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ECS_EXECUTION_ROLE_ARN`, `AWS_ECS_TASK_ROLE_ARN`, `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `FRONTEND_URL`, `API_HEALTH_URL`, `DB_HEALTH_URL` (optional), `VERCEL_ROLLBACK_TARGET` (or environment-specific overrides).  
   - **Variables**: `DEPLOY_TARGET=aws`, `AWS_REGION`, `APP_NAME`, `ECS_CLUSTER_NAME`, `ECS_SERVICE_NAME`, `ECS_DESIRED_COUNT`.  

> ℹ️ *Secrets should be managed in your password vault (1Password, Bitwarden, etc.). Never commit real credentials to the repository. Share `.env` values via secure channels only.*

## Local validation before deploy

```bash
# Prepare dependencies
make setup

# Run the build pipeline locally
make build

# Verify health endpoints (requires staging/prod URLs)
make pipeline-validate ENV=staging FRONTEND_URL=https://app.staging.example.com API_URL=https://api.staging.example.com/health \
  DB_URL=https://api.staging.example.com/health/db

The pipeline-validate target uses scripts/health/check_deployment.py to hit the public health endpoints and stores results in reports/<env>-pipeline-validation.json.

Deployment workflow

Automated deployments are executed by .github/workflows/ci-deploy.yml. The workflow:

Resolves the deployment environment (staging on push to main, overridable via workflow_dispatch) and allows emergency runs with skip_tests: true.

Detects which stacks/tests exist, then runs the reusable test and security workflows unless explicitly skipped.

Builds and pushes the backend container image to GHCR (ghcr.io/<org>/<repo>-backend:sha-<commit>).

Deploys the AWS backend with scripts/deploy_backend.sh and the frontend via the Vercel CLI (using .env.<env> when present).

Executes health verification via scripts/health/check_deployment.py and Postman smoke tests.

On failure, triggers rollback scripts for ECS and Vercel (and optionally posts to Slack).

# Deploy to staging (requires env vars from .env.staging)
VERCEL_TOKEN=... VERCEL_ORG_ID=... VERCEL_PROJECT_ID=... \
BACKEND_IMAGE=ghcr.io/org/portfolio-dashboard-backend:sha-<commit> \
AWS_REGION=us-east-1 make deploy-staging

# Deploy to production
ENV=production FRONTEND_ENV_FILE=.env.production \
VERCEL_TOKEN=... VERCEL_ORG_ID=... VERCEL_PROJECT_ID=... \
BACKEND_IMAGE=ghcr.io/org/portfolio-dashboard-backend:sha-<commit> \
AWS_REGION=us-east-1 make deploy-production

The Makefile target builds the frontend and runs the Vercel CLI, then calls scripts/deploy_backend.sh for ECS. For production deployments set FRONTEND_ENV_FILE=.env.production so secrets are applied correctly.

Rollbacks

If smoke tests fail or a regression is detected:

# Backend: revert to previous ECS task definition
AWS_REGION=us-east-1 make rollback ENV=staging REVISION=previous

# Frontend: provide the deployment/alias to restore
VERCEL_TOKEN=... ./scripts/rollback_frontend.sh staging <deployment-url>

The CI workflow automatically triggers the same scripts when smoke-tests fail.

Deployment targets
Vercel (frontend)

Connect the repository to Vercel and confirm the production/staging aliases match the URLs listed above.

Configure the environment variables (from .env.<env>) in the Vercel dashboard for each environment.

Trigger deployments either through the CI workflow or manually via npx vercel deploy/Git pushes. The Makefile and workflow pass VERCEL_ORG_ID to --scope automatically.

Backend (ECS/Fargate)

Ensure the ECS service references the task definition family shipped in deploy/aws/task-definition.json.

Update the container image via the Makefile targets or call scripts/deploy_backend.sh directly with --image when running outside CI.

Confirm autoscaling policies, load balancer listeners, and Route53 records are pointed at the service before cutting over traffic.

Post-deployment validation

Run the automated health checks (make pipeline-validate) to verify the frontend, API, and database endpoints respond with success codes.

Inspect logs/metrics dashboards (CloudWatch, Datadog, Grafana) to ensure error rates stay within the agreed SLOs.

Confirm alerts remain green and no new anomalies are reported in your incident management tooling.

Validate backups are still scheduled and restore a recent snapshot in a non-production environment at least once per release cycle.

Compliance operations

Confirm the appropriate data-protection regime is enabled via COMPLIANCE_REGIMES and related audit/access logging flags in the backend environment variables.

Ensure the audit log destination (COMPLIANCE_LOG_DESTINATION) is writable and forwarded to your SIEM.

Redact additional headers by appending to COMPLIANCE_REDACT_HEADERS when deploying behind custom proxies.

Execute python scripts/validate_compliance_assets.py prior to releases to confirm docs and gates match the generator outputs.

Review docs/COMPLIANCE.md with operators and document the completion of each checklist stage.

Observability and evidence

Health verification reports are uploaded as build artifacts and also stored locally when you run make pipeline-validate.

Place additional run evidence (Grafana exports, log snapshots) in observability/ or reports/ as needed. The example report generated during development lives at reports/staging-pipeline-validation.json.

Troubleshooting
Issue	Resolution
Vercel deploy fails with missing env	Ensure .env.<env> exists and the Makefile has access to VERCEL_TOKEN, VERCEL_ORG_ID, and VERCEL_PROJECT_ID.
ECS deployment fails with IAM error	Double-check TASK_EXECUTION_ROLE_ARN/TASK_ROLE_ARN permissions and that the secrets are configured in GitHub.
Health checks fail	Inspect the health-report.json artifact for the failing endpoint and rerun scripts/health/check_deployment.py locally with --insecure if using self-signed certificates.
Rollback script cannot find previous revision	ECS must have at least two task definition revisions. Register a new revision manually or provide an explicit ARN/number to make rollback.