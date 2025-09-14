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