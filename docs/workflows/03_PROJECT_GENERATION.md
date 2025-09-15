---
title: "Phase 03: Project Generation"
phase: 3
triggers: ["phase-03","generate","scaffold","project"]
scope: "project-rules"
inputs: ["Approved PRD and planning outputs"]
outputs: ["Generated project structure","CI files","Docs","Rules"]
artifacts: ["../_generated/{{NAME}}","../_generated/{{NAME}}/.github/workflows/*"]
gates: { coverage: ">=80%", perf_p95_ms: "<=500", vulns_critical: 0 }
owner: "Build Engineer"
---

# Project Generation Workflow

## Overview
Generate a production-ready project structure (FE/BE/DB/CI/CD/docs/rules) from parameters or a brief. Includes dry-run preview, actual generation, validation, and local run.

## Prerequisites
- Tooling: Python 3.11+, Node 18+ (if FE), Docker, Git
- Repo context: run from repo root `/workspace`
- If current repo already has a root `.cursor/`, prefer `--include-cursor-assets` to emit project rules/tools into generated projects
- Secrets: none required during generation (deployment secrets are configured later)

## Decision Matrix (inputs → generator flags)
- Industry: healthcare|finance|ecommerce|saas|enterprise → `--industry`
- Project type: web|mobile|api|fullstack|microservices → `--project-type`
- Stack: `--frontend` nextjs|nuxt|angular|expo; `--backend` fastapi|django|nestjs|go; `--database` postgres|mongodb|firebase
- Auth: `--auth` auth0|firebase|cognito|custom
- Deploy target: `--deploy` aws|azure|gcp|vercel|self-hosted
- Compliance: comma-separated (e.g., `--compliance hipaa,gdpr`)
- Output base: `--output-dir ../_generated`

## Paths & Artifacts
- Script: `/workspace/scripts/generate_client_project.py`
- Engine: `/workspace/project_generator/core/generator.py`
- Output: `../_generated/{{NAME}}`
- Generated files: `.github/workflows/*`, `docs/*`, `.cursor/*` (if assets included), `Makefile`, `docker-compose.yml`

## Steps

### Step 1: List Available Templates (Optional)
Execute:
- `python scripts/generate_client_project.py --list-templates | cat`
Acceptance:
- [ ] Templates printed without error
- Evidence: console list of template types/variants

### Step 2: Dry Run Generation (No writes)
Execute:
- `python scripts/generate_client_project.py --name {{NAME}} --industry {{INDUSTRY}} --project-type {{PROJECT_TYPE}} --frontend {{FRONTEND}} --backend {{BACKEND}} --database {{DATABASE}} --auth {{AUTH}} --deploy {{DEPLOY}} {{#if COMPLIANCE}}--compliance {{COMPLIANCE}}{{/if}} --output-dir ../_generated --workers {{WORKERS|8}} --dry-run --yes --include-cursor-assets`
Acceptance:
- [ ] Dry-run prints planned structure
- [ ] No files created
- [ ] Exit code = 0
- Evidence: printed tree under “📁 Project Structure:”

### Step 3: Actual Generation
Execute:
- `python scripts/generate_client_project.py --name {{NAME}} --industry {{INDUSTRY}} --project-type {{PROJECT_TYPE}} --frontend {{FRONTEND}} --backend {{BACKEND}} --database {{DATABASE}} --auth {{AUTH}} --deploy {{DEPLOY}} {{#if COMPLIANCE}}--compliance {{COMPLIANCE}}{{/if}} --output-dir ../_generated --workers {{WORKERS|8}} --yes --force --include-cursor-assets`
Acceptance:
- [ ] “Project generated successfully” printed
- [ ] Project folder exists at `../_generated/{{NAME}}`
- [ ] `.github/workflows/ci-*.yml` files exist
- [ ] `docs/API.md`, `docs/DEVELOPMENT.md`, `docs/DEPLOYMENT.md` exist
- [ ] `docker-compose.yml` and `Makefile` exist
- [ ] Exit code = 0
- Evidence: console success, directory listing

### Step 4: Validate Rules/Gates (Optional)
Execute:
- `cd ../_generated/{{NAME}} && [ -d .git ] && python .cursor/tools/validate_rules.py`
- `cd ../_generated/{{NAME}} && [ -d .git ] && python .cursor/tools/check_compliance.py`
Acceptance:
- [ ] Rules validation OK
- [ ] Required compliance rules present
- Evidence: “[RULES] OK …” / “[COMPLIANCE] All required …”

### Step 5: Setup And Run (Local Dev)
Execute:
- `cd ../_generated/{{NAME}} && make setup`
- `cd ../_generated/{{NAME}} && make dev`
Acceptance:
- [ ] Dependencies install without fatal errors
- [ ] Services start locally
- Evidence: services listening on 3000/8000 (if FE/BE present)

## Evidence
- Console outputs from dry-run and generation
- Directory listings and presence of CI/docs files

## Failure Modes & Troubleshooting
- Exit 2 (validation errors): inspect listed errors; fix flags/inputs; rerun
- Exit 1 (unexpected error): rerun with `--verbose`; check missing tools (e.g., Node, Docker)
- Root `.cursor/` present → assets isolation: pass `--include-cursor-assets` to include tools/rules in generated project
- Minimal rule fallback: when manifests expect filenames at root but rules live in subfolders, only minimal embedded rules appear; prefer relative paths in manifests (e.g., `frameworks/fastapi.mdc`)

## Overall Acceptance
- [ ] Generated project meets structure standards
- [ ] CI files present
- [ ] Docs present
- [ ] Compliance rules present (if requested)
- [ ] Local dev environment starts