# CI/CD Overview

This document explains the automation that validates, deploys, and monitors generated projects. Every workflow relies on the same scripts used locally so evidence and behavior stay consistent across environments.

## Supported Workflows

| Workflow | Trigger | Responsibilities |
| --- | --- | --- |
| `ci-secrets-preflight.yml` | push to `main`, pull requests, manual dispatch | Fails fast when required secrets or repository variables are missing. |
| `ci-deploy.yml` | push to `main`, manual dispatch | Builds, tests, and deploys the latest scaffold to staging. |
| `ci-promote-prod.yml` | manual dispatch with protected `production` environment | Re-runs gates, deploys to production, uploads evidence. |
| `nightly-observability.yml` | nightly schedule (02:00 UTC) and manual dispatch | Runs health checks against staging and production, capturing evidence for operations. |

Deprecated workflows (`ci.yml`, `ci-security.yml`, `ci-templates.yml`, etc.) were removed in favour of the streamlined set above. Historical copies live in [`archive/legacy-ai-governor/`](../archive/legacy-ai-governor/).

## Secrets Preflight (`ci-secrets-preflight.yml`)

- Ensures Vercel tokens, AWS/ECS roles, deployment metadata, and health-check URLs are populated before downstream jobs start.
- Exports the secrets/variables to the job environment and fails with a descriptive message if any value is empty.
- Run this workflow whenever secrets change to confirm configuration parity across environments.

## Staging Deployment (`ci-deploy.yml`)

1. Checks out the repository and restores dependencies.
2. Runs linters, tests, and security scans via shared jobs under `ci/`.
3. Builds the backend container image and pushes it to GHCR (`ghcr.io/<org>/<repo>-backend:sha-<commit>`).
4. Deploys the frontend through the Vercel CLI (consuming `.env.staging` when present) and the backend via `scripts/deploy_backend.sh staging`.
5. Executes `scripts/health/check_deployment.py` to verify staging endpoints and uploads the generated reports and evidence artifacts.

Configure secrets/variables in GitHub and Vercel as described in the [Deployment Guide](DEPLOYMENT.md).

## Production Promotion (`ci-promote-prod.yml`)

- Triggered manually through the Actions tab with approvals enforced by the `production` environment.
- Re-runs `scripts/install_and_test.sh` plus the coverage, performance, and dependency collectors before executing `scripts/enforce_gates.py`.
- Deploys using the same pattern as staging but targets `production` and records health validation under `reports/production-pipeline-validation.json`.
- Uploads `reports/`, `evidence/`, and submission bundles so compliance teams have immutable artifacts for the release.

## Nightly Observability (`nightly-observability.yml`)

- Scheduled to run at 02:00 UTC and available on demand through workflow dispatch.
- Calls `scripts/health/check_deployment.py` for both staging and production using the URLs stored in repository variables.
- Saves the results in `reports/<env>-pipeline-validation.json` and publishes artifacts for review in the morning.

## Adding or Modifying Checks

- Prefer extending the shared jobs located in the `ci/` directory so local and CI behavior match.
- Keep new workflows consistent with the isolated-output model: write artifacts to the working directory (or a temporary directory) and upload them as workflow artifacts instead of committing results back to the repository.
- Document any new automation in this overview and cross-link it from the [README](../README.md) and [Deployment Guide](DEPLOYMENT.md).

For local replication of CI behavior, use the [`make lifecycle`](../Makefile) target followed by `make pipeline-validate`, then run the relevant scripts manually to mirror the CI stages.
