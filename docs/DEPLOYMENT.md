# Deployment Guide

This guide explains how to configure environments, run local verification, and operate the supported CI/CD workflows for generated projects. It builds on the lifecycle documented in the [Local Development Workflow](LOCAL_DEV_WORKFLOW.md) and [CI/CD Overview](CI_CD_OVERVIEW.md).

## Environment Matrix

| Environment | Purpose | Frontend URL | API URL |
| --- | --- | --- | --- |
| `development` | Local validation of the generated scaffold | http://localhost:3000 (stack dependent) | http://localhost:8000 (stack dependent) |
| `staging` | Automated smoke testing of the latest commit | `https://app.staging.example.com` | `https://api.staging.example.com` |
| `production` | Customer-facing traffic | `https://app.example.com` | `https://api.example.com` |

Update the hostnames with real values for each client engagement.

## Configure Secrets and Variables

1. **Environment files** – Copy `.env.example` from the generated project into `.env.staging` and `.env.production`, filling in API URLs, authentication settings, third-party integrations, and compliance flags. Store the files securely (not in git).
2. **Vercel** – Add the same variables to the Vercel project for staging and production. Grant the GitHub integration access so CI can deploy via the CLI.
3. **AWS/ECS** – Provision the ECS cluster, service, task execution role, task role, and related security groups. Capture the following for CI: `AWS_REGION`, `AWS_ECS_EXECUTION_ROLE_ARN`, `AWS_ECS_TASK_ROLE_ARN`, `ECS_CLUSTER_NAME`, `ECS_SERVICE_NAME`, `APP_NAME`, `ECS_DESIRED_COUNT`.
4. **GitHub > Settings > Secrets and variables > Actions** – Configure repository-level secrets (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, etc.) and environment-specific variables (`FRONTEND_URL_*`, `API_URL_*`, `DB_URL_*`). The [`ci-secrets-preflight.yml`](../.github/workflows/ci-secrets-preflight.yml) workflow will fail if any required value is missing.
5. **Protected environments** – Require approvals for the `production` environment so `ci-promote-prod.yml` cannot run without explicit authorization.

## Local Validation Before Deployment

Run these commands from the factory repository after provisioning the isolated project directory (see [Local Development Workflow](LOCAL_DEV_WORKFLOW.md)).

```bash
# Execute the full lifecycle using workflow.config.json or env overrides
NAME=acme INDUSTRY=enterprise PROJECT_TYPE=fullstack \
FE=nextjs BE=fastapi DB=postgres OUTPUT_ROOT=../_generated make lifecycle

# Validate the deployed app once URLs are known
make pipeline-validate ENV=staging \
  FRONTEND_URL=https://app.staging.example.com \
  API_URL=https://api.staging.example.com/health \
  DB_URL=https://api.staging.example.com/health/db
```

Artifacts (metrics, evidence, submission pack) remain under `../_generated/<NAME>/` and should be archived with the client deliverable.

## Automated Pipeline

### 1. Secrets Preflight (`ci-secrets-preflight.yml`)

- Triggered on every push to `main`, pull request, and manual dispatch.
- Verifies required secrets/variables are populated before any build or deploy job runs.

### 2. Staging Deployment (`ci-deploy.yml`)

- Builds and tests the scaffold using `scripts/install_and_test.sh` and related collectors.
- Builds the backend container image, deploys it to ECS, and publishes the frontend via Vercel.
- Executes `scripts/health/check_deployment.py` against staging URLs and uploads artifacts (`reports/`, `evidence/`, `dist/`).

### 3. Production Promotion (`ci-promote-prod.yml`)

- Manually triggered with approvals enforced by the `production` environment.
- Re-runs gates using `scripts/enforce_gates.py`, deploys to production, and validates health endpoints.
- Uploads the same artifacts as staging for audit traceability.

### 4. Nightly Observability (`nightly-observability.yml`)

- Scheduled at 02:00 UTC; also available on demand.
- Runs health checks for staging and production, writing results to `reports/<env>-pipeline-validation.json` and publishing them as workflow artifacts.

Refer to the [CI/CD Overview](CI_CD_OVERVIEW.md) for detailed job breakdowns and customization guidance.

## Manual Operations

While the workflows cover the happy path, the generated project also ships with helper scripts:

- `scripts/deploy_backend.sh <environment>` – Deploy the backend container manually (expects `BACKEND_IMAGE` and AWS credentials).
- `scripts/health/check_deployment.py` – Run spot checks locally or during incident response.
- `make pipeline-validate ENV=<env>` – Convenience wrapper around the health script.

These commands should be executed from the generated project directory (`../_generated/<NAME>/`).

## Rollback & Incident Response

1. **Backend** – Use `scripts/deploy_backend.sh <environment> --image <previous-tag>` or roll back the ECS service to an earlier task definition revision.
2. **Frontend** – Restore the previous Vercel deployment via `npx vercel rollback` or the Vercel dashboard.
3. **Health Verification** – Re-run `make pipeline-validate` for the affected environment to confirm recovery.
4. **Evidence** – Capture logs, metrics, and the updated health report and attach them to the incident record.

## Troubleshooting

| Issue | Mitigation |
| --- | --- |
| `ci-secrets-preflight` fails | Review the workflow logs for the missing key name and populate the secret or variable in GitHub. |
| Staging deploy fails tests | Reproduce locally with `make lifecycle` and inspect the artifacts under the generated project directory. |
| Production promotion blocked by gates | Check `${PROJECT_ROOT}/metrics/` and `${PROJECT_ROOT}/reports/` for failing thresholds, increase coverage/performance, or update `gates_config.yaml` (with approvals). |
| Nightly observability artifacts missing | Ensure repository variables for staging/production URLs are present; rerun the workflow manually once corrected. |

For further context, see the [System Overview](SYSTEM_OVERVIEW.md) and [Compliance & Evidence Guide](COMPLIANCE_EVIDENCE.md).
