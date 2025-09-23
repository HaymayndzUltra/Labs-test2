# Documentation Hub

This directory contains the authoritative guides for operating the project generator factory. Start with the high-level overview, then dive into the workflow, automation, and compliance references as needed.

## Core Guides

- [System Overview](SYSTEM_OVERVIEW.md) – Architecture, repository layout, and how the generator, template packs, scripts, and automation fit together.
- [Local Development Workflow](LOCAL_DEV_WORKFLOW.md) – Step-by-step instructions for executing the brief → plan → validate → generate lifecycle inside an isolated output directory.
- [CI/CD Overview](CI_CD_OVERVIEW.md) – Responsibilities, triggers, and artifact expectations for the supported GitHub Actions workflows.
- [Deployment Guide](DEPLOYMENT.md) – Environment configuration, local verification, pipeline behavior, and rollback procedures.
- [Compliance & Evidence Guide](COMPLIANCE_EVIDENCE.md) – Required artifacts, gate thresholds, and validation tooling.

## Additional References

- [`docs/workflows/`](workflows/) – Detailed phase documentation retained for historical context. Each file links back to the refreshed workflow guide above.
- [`archive/legacy-ai-governor/`](../archive/legacy-ai-governor/) – Deprecated AI Governor materials kept for reference only.
- [`template-packs/`](../template-packs/) – Source templates consumed by the generator (frontend, backend, database, infrastructure, policies, rules).

## Running the Lifecycle

Use the Makefile wrapper from the repository root once `workflow.config.json` (or environment variables) is populated:

```bash
NAME=acme INDUSTRY=enterprise PROJECT_TYPE=fullstack \
FE=nextjs BE=fastapi DB=postgres OUTPUT_ROOT=../_generated make lifecycle
```

All outputs are created in `../_generated/<NAME>/`. For the end-to-end command list, see [Local Development Workflow](LOCAL_DEV_WORKFLOW.md).
