---
title: "Phase 01: Brief Analysis"
phase: 1
triggers: ["phase-01","brief","analyze","requirements"]
scope: "project-rules"
inputs: ["Client brief markdown path"]
outputs: ["Requirements summary","Open questions list","PLAN.md","PLAN.tasks.json"]
artifacts: ["docs/briefs/*/brief.md","docs/briefs/*/PLAN.md"]
gates: { coverage: ">=80%", perf_p95_ms: "<=500", vulns_critical: 0 }
owner: "Product/BA"
---

# Brief Analysis Workflow

## Overview
Analyze a client brief to extract constraints, goals, timelines, and derive an initial stack and compliance map.

## Prerequisites
- Confirm brief file path under `/workspace/docs/briefs/*/brief.md`
- Tooling available to optionally generate artifacts: Python 3.11+

## Inputs
- Brief markdown content

## Outputs
- Requirements summary
- Open questions list
- Optional: `PLAN.md` and `<name>.tasks.json`

## Steps

### Step 1: Locate & Validate Brief
Execute:
- `test -f docs/briefs/<proj>/brief.md`
Acceptance:
- [ ] Brief file exists and readable

### Step 2: Summarize Requirements
Action:
- Read brief and extract: goals, scope, constraints, deadlines, stakeholders
Acceptance:
- [ ] Requirements captured in summary (bulleted)
- [ ] Out-of-scope items listed

### Step 3: Derive Stack & Compliance (Dry Inference)
Action:
- Map hints in the brief to frontend/backend/db/auth/deploy and compliance (HIPAA/GDPR/SOX/PCI)
Acceptance:
- [ ] Proposed stack recorded with rationale
- [ ] Compliance candidates listed

### Step 4: Optional PLAN + Tasks Artifacts
Execute:
- `python scripts/plan_from_brief.py --brief docs/briefs/<proj>/brief.md --out PLAN.md`
Acceptance:
- [ ] `PLAN.md` and `PLAN.tasks.json` created

## Evidence
- Paths to created files and the requirements summary

## Failure Modes & Troubleshooting
- Missing brief → ensure correct path under `docs/briefs/`
- Ambiguous stack → capture as questions for client confirmation

## Overall Acceptance
- [ ] Requirements summary and questions ready for client sign-off

---

Variables
- PROJ=<project-key>

Run Commands
```
# Validate brief path
test -f docs/briefs/$PROJ/brief.md

# Generate Phase 01 artifacts
python3 scripts/scaffold_phase_artifacts.py --project $PROJ --phase 1

# Validate docs and HIPAA mentions (pre-gate)
python3 scripts/validate_workflows.py --all
python3 scripts/check_compliance_docs.py
```

Generated/Updated Files
- docs/briefs/$PROJ/requirements_summary.md
- docs/briefs/$PROJ/questions.md
- docs/briefs/$PROJ/stack_compliance_inference.md
- (optional) docs/briefs/$PROJ/PLAN.md

Gate to Phase 02
- [ ] Brief exists and readable
- [ ] Requirements summary + questions present
- [ ] Stack & compliance inference present
- [ ] Validators pass (workflows + HIPAA mentions)