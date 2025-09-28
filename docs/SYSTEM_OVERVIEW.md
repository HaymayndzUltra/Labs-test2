# System Overview

This repository is the factory that turns an approved client brief into a fully scaffolded product codebase. It contains the generator engine, stack templates, workflow scripts, and CI/CD automation that execute the brief → plan → validation → generation lifecycle.

## Architecture at a Glance

| Area | Purpose | Key Locations |
| --- | --- | --- |
| Generator core | Assembles files, resolves manifests, validates DAG output, and applies compliance or stack specific rules. | [`project_generator/core/generator.py`](../project_generator/core/generator.py), [`project_generator/core/validator.py`](../project_generator/core/validator.py) |
| Template packs | Source templates for frontend, backend, infrastructure, docs, and compliance assets. | [`project_generator/template-packs/`](../project_generator/template-packs), [`project_generator/templates/`](../project_generator/templates) |
| Workflow scripts | Non-interactive entrypoints that orchestrate the lifecycle from a brief, collect evidence, and enforce quality gates. | [`scripts/e2e_from_brief.sh`](../scripts/e2e_from_brief.sh), [`scripts/plan_from_brief.py`](../scripts/plan_from_brief.py), [`scripts/select_stacks.py`](../scripts/select_stacks.py), [`scripts/install_and_test.sh`](../scripts/install_and_test.sh), [`scripts/enforce_gates.py`](../scripts/enforce_gates.py) |
| Quality & compliance controls | Gate thresholds and compliance definitions enforced in local and CI flows. | [`gates_config.yaml`](../gates_config.yaml), [`scripts/validate_compliance_assets.py`](../scripts/validate_compliance_assets.py) |
| Automation wrappers | Make targets and CI workflows that invoke the lifecycle for local and remote environments. | [`Makefile`](../Makefile), [`.github/workflows/ci-secrets-preflight.yml`](../.github/workflows/ci-secrets-preflight.yml), [`.github/workflows/ci-deploy.yml`](../.github/workflows/ci-deploy.yml), [`.github/workflows/ci-promote-prod.yml`](../.github/workflows/ci-promote-prod.yml), [`.github/workflows/nightly-observability.yml`](../.github/workflows/nightly-observability.yml) |

## Primary Workflow

1. **Brief ingestion and planning** – `scripts/plan_from_brief.py` parses the client brief and produces `PLAN.md` and `PLAN.tasks.json` inside an isolated project directory.
2. **Task validation** – `scripts/validate_tasks.py` confirms dependency IDs, enums, and graph topology for the generated plan.
3. **Stack preflight** – `scripts/select_stacks.py` records the stack selection, verifies engine requirements, and writes evidence plus layer summaries in the project directory for downstream gates.
4. **Generation** – `scripts/generate_client_project.py` performs a dry-run preview and the final scaffold using the template packs.
5. **Post-generation lifecycle** – install/tests, task sync, metric collection, gate enforcement, submission pack, and compliance validation all run against the isolated project root.
6. **CI/CD** – the supported workflows run secrets preflight, stage deployments, production promotion, and nightly health validation using the same scripts.

A full local walkthrough is documented in [Local Development Workflow](LOCAL_DEV_WORKFLOW.md). Details on the automation that deploys and monitors generated projects live in [CI/CD Overview](CI_CD_OVERVIEW.md) and [Deployment Guide](DEPLOYMENT.md).

## Repository Layout

```
project_generator/     Generator engine, validators, template packs, integration hooks
scripts/               Automation and lifecycle scripts invoked locally and in CI
Makefile               Convenience targets that wrap non-interactive workflows
ci/                    Shared CI assets used by GitHub Actions workflows
.gates_config.yaml     Thresholds for enforce_gates.py
archive/               Historical documents (legacy AI Governor docs retained for reference)
docs/                  Authoritative documentation for this generator
```

## How Everything Fits Together

- `scripts/e2e_from_brief.sh` is the canonical orchestrator. It provisions the project output directory, invokes the planning, validation, selection, generation, and evidence collection steps, and writes all artifacts under `../_generated/<NAME>/` (configurable via `OUTPUT_ROOT`).
- The Makefile `lifecycle` target wraps the same script for easy invocation once `NAME`, `INDUSTRY`, `PROJECT_TYPE`, `FE`, `BE`, and `DB` are supplied via environment variables or `workflow.config.json`.
- Quality gates defined in `gates_config.yaml` are enforced by `scripts/enforce_gates.py` locally and in production promotion workflows to keep evidence consistent.
- CI workflows reuse the same scripts to guarantee parity between local results and deployed environments, uploading artifacts for compliance and audit requirements.

Continue with the [Local Development Workflow](LOCAL_DEV_WORKFLOW.md) to execute the lifecycle, review the [CI/CD Overview](CI_CD_OVERVIEW.md) for automation duties, and consult the [Compliance & Evidence Guide](COMPLIANCE_EVIDENCE.md) to understand required documentation and gate outputs.
