---
title: "Workflow Index"
phase: 0
triggers: ["workflows","index","overview"]
scope: "project-rules"
inputs: ["All phase docs","validators","gates config"]
outputs: ["Execution map","Gate checklist"]
artifacts: ["docs/workflows/*.md","gates_config.yaml"]
gates: { coverage: ">=80%", perf_p95_ms: "<=500", vulns_critical: 0 }
owner: "Workflow Owner"
---

# Workflow Index (Phases, Commands, Gates)

## Overview
This index provides the ordered phases, local commands, and CI gates for sequential, gated execution across projects.

## Prerequisites
- Python 3 and make available
- Validators present in `scripts/`

## Steps

### Map and Commands

## Evidence
- Validator runs attached to PRs

## Failure Modes & Troubleshooting
- Missing validators → run `python3 scripts/validate_workflows.py --all`
- CI gate failures → review `gates_config.yaml` and fix thresholds or code

## Overall Acceptance
- [ ] All phases listed with gates and commands
- [ ] Validators and gates referenced