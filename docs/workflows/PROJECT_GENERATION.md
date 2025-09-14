# Project Generation Workflow

## Overview
Generate a production-ready project structure (FE/BE/DB/CI/CD/docs/rules) from parameters or a brief. Includes dry-run preview, actual generation, validation, and local run.

## Steps

### Step 1: List Available Templates (Optional)
Execute:
- `python scripts/generate_client_project.py --list-templates | cat`
Acceptance:
- [ ] Templates printed without error

### Step 2: Dry Run Generation (No writes)
Execute:
- `python scripts/generate_client_project.py --name {{NAME}} --industry {{INDUSTRY}} --project-type {{PROJECT_TYPE}} --frontend {{FRONTEND}} --backend {{BACKEND}} --database {{DATABASE}} --auth {{AUTH}} --deploy {{DEPLOY}} {{#if COMPLIANCE}}--compliance {{COMPLIANCE}}{{/if}} --output-dir ../_generated --workers {{WORKERS|8}} --dry-run --yes --include-cursor-assets`
Acceptance:
- [ ] Dry-run prints planned structure
- [ ] No files created
- [ ] Exit code = 0

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

### Step 4: Validate Rules/Gates (Optional)
Execute:
- `cd ../_generated/{{NAME}} && [ -d .git ] && python .cursor/tools/validate_rules.py`
- `cd ../_generated/{{NAME}} && [ -d .git ] && python .cursor/tools/check_compliance.py`
Acceptance:
- [ ] Rules validation OK
- [ ] Required compliance rules present

### Step 5: Setup And Run (Local Dev)
Execute:
- `cd ../_generated/{{NAME}} && make setup`
- `cd ../_generated/{{NAME}} && make dev`
Acceptance:
- [ ] Dependencies install without fatal errors
- [ ] Services start locally

## Error Handling
- If validation fails (exit 2), fix reported config errors and rerun
- If generation fails (exit 1), re-run with `--verbose` and correct the root cause

## Overall Acceptance
- [ ] Generated project meets structure standards
- [ ] CI files present
- [ ] Docs present
- [ ] Compliance rules present (if requested)
- [ ] Local dev environment starts