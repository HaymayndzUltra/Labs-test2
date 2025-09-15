---
title: "Phase 06: Deployment"
phase: 6
triggers: ["phase-06","deploy","release","production"]
scope: "project-rules"
inputs: ["UAT-approved build","Gates satisfied from Phase 05"]
outputs: ["Deployed environment","Post-deploy report"]
artifacts: ["ci/deploy-logs.txt","post-deploy/smoke-report.json"]
gates: { coverage: ">=80%", perf_p95_ms: "<=500", vulns_critical: 0 }
owner: "DevOps Lead"
---

# Deployment Workflow

## Overview
Prepare and execute deployment with pre-deploy checks, environment configuration, and post-deploy verification.

## Prerequisites
- UAT sign-off; secrets available in target environment

## Steps

### Step 1: Pre-Deploy Checks
Action: Confirm CI green, gates met, migrations ready
Acceptance:
- [ ] All gates green; rollback plan ready

### Step 2: Configure Environment
Action: Provision infra/secrets; update env vars
Acceptance:
- [ ] Secrets and configs verified

### Step 3: Execute Deploy
Action: Use generated CI deploy workflow (AWS/Azure/GCP/Vercel) or manual
Acceptance:
- [ ] Deployment completes without critical errors

### Step 4: Post-Deploy Verification
Action: Run smoke tests; monitor errors
Acceptance:
- [ ] Smoke tests pass; no critical alerts

## Evidence
- CI deploy logs; post-deploy report; runbook

## Failure Modes & Troubleshooting
- Rollout failure → rollback plan; verify secrets and infra quota
- Smoke test flakiness → re-run; check dependencies and feature flags

## Overall Acceptance
- [ ] Deployment completed without critical errors
- [ ] Smoke tests pass
- [ ] Alerts nominal post-deploy
- [ ] Related Phases: 05 (gates input), 07/10 (operations)

Variables
- PROJ=<project-key>

Run Commands
```
# Ensure CI checks are required (workflows_validation, gates_enforcer)
# Trigger deployment via CI workflow or approved manual run
```

Generated/Updated Files
- ci/deploy-logs.txt
- post-deploy/smoke-report.json

Gate to Phase 07
- [ ] CI jobs green on base branch
- [ ] Deployment completed without critical errors
- [ ] Smoke tests pass; alerts nominal