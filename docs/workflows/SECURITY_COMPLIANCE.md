# Security & Compliance Workflow

## Overview
Validate compliance rules presence, enforce security controls, and ensure CI gates are configured per industry.

## Steps

### Step 1: Rules Presence
Execute:
- `python .cursor/tools/check_compliance.py` (in generated project)
Acceptance:
- [ ] Required compliance rules present

### Step 2: Controls Validation
Action: Confirm encryption at rest/in transit, RBAC, audit logging, session timeout
Acceptance:
- [ ] Controls documented and mapped

### Step 3: CI Gates
Action: Review `gates_config.yaml` and security scans
Acceptance:
- [ ] Gates enabled and thresholds set

## Evidence
- Compliance checklist; gates config snapshot