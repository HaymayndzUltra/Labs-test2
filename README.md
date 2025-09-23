# Project Generator Factory

This repository houses the automation that turns an approved client brief into a production-ready software project. It contains the generator engine, stack templates, lifecycle scripts, and CI/CD workflows that implement the brief → plan → validate → generate pipeline.

## What Lives Here

- **Generator core** – [`project_generator/core/generator.py`](project_generator/core/generator.py) and [`project_generator/core/validator.py`](project_generator/core/validator.py) assemble scaffolds, enforce manifests, and validate task graphs.
- **Template packs** – [`project_generator/template-packs/`](project_generator/template-packs) provide the frontend, backend, infrastructure, documentation, and compliance assets emitted during generation.
- **Lifecycle scripts** – [`scripts/e2e_from_brief.sh`](scripts/e2e_from_brief.sh) orchestrates the non-interactive flow; helper scripts handle planning, stack selection, installs/tests, metrics, gates, and compliance validation.
- **Automation** – [`Makefile`](Makefile) exposes convenience targets (`lifecycle`, `pipeline-validate`) and GitHub Actions workflows manage secrets preflight, staging deploys, production promotion, and nightly health checks.
- **Documentation** – The refreshed docs under `docs/` form the single source of truth for architecture, local workflows, deployment, and compliance expectations.

Legacy documentation for the retired AI Governor workflow has been archived under [`archive/legacy-ai-governor/`](archive/legacy-ai-governor/).

## Getting Started

1. **Review the architecture** – [System Overview](docs/SYSTEM_OVERVIEW.md) explains the repository layout and primary components.
2. **Run the lifecycle** – Follow the [Local Development Workflow](docs/LOCAL_DEV_WORKFLOW.md) to provision an isolated output directory (`../_generated/<NAME>/`) and execute the end-to-end pipeline from a client brief.
3. **Understand automation** – The [CI/CD Overview](docs/CI_CD_OVERVIEW.md) and [Deployment Guide](docs/DEPLOYMENT.md) describe how staging, production, and nightly health checks operate.
4. **Maintain evidence** – The [Compliance & Evidence Guide](docs/COMPLIANCE_EVIDENCE.md) outlines required artifacts, gate thresholds, and validation steps.

## Key Commands

```bash
# Run the full lifecycle using workflow.config.json or exported environment variables
NAME=acme INDUSTRY=enterprise PROJECT_TYPE=fullstack \
FE=nextjs BE=fastapi DB=postgres OUTPUT_ROOT=../_generated make lifecycle

# Validate remote environments (execute from the factory repo)
make pipeline-validate ENV=staging \
  FRONTEND_URL=https://app.staging.example.com \
  API_URL=https://api.staging.example.com/health \
  DB_URL=https://api.staging.example.com/health/db
```

All generator outputs are isolated under `../_generated/<NAME>/` (configurable with `OUTPUT_ROOT`). Do not commit generated artifacts, evidence, or metrics to this repository—`.gitignore` blocks them by default.

## Adding New Capabilities

- Extend template packs or generator logic within `project_generator/`.
- Update lifecycle scripts under `scripts/` so local and CI flows remain consistent.
- Document changes in the relevant guides inside `docs/` and cross-link from this README.
- When new automation is required, add or update workflows alongside the maintained ones (`ci-secrets-preflight.yml`, `ci-deploy.yml`, `ci-promote-prod.yml`, `nightly-observability.yml`) and describe them in [CI/CD Overview](docs/CI_CD_OVERVIEW.md).

For historical context on earlier processes, see [`archive/legacy-ai-governor/`](archive/legacy-ai-governor/). The new documentation set above is the authoritative reference for all current work.
