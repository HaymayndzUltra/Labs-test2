# Workflow Index (Phases, Commands, Gates)

## Phase Order
1. 01_BRIEF_ANALYSIS → Gate: brief exists; summaries; stack/compliance inference
2. 02_TECHNICAL_PLANNING → Gate: PRD + ARCHITECTURE ready; API/UI plans; security plan; estimates
3. 03_PROJECT_GENERATION → Gate: structure, CI files, docs present; local dev starts
4. 04_FEATURE_IMPLEMENTATION → Gate: DOD, validations, integrations, tests/coverage
5. 05_TESTING_QA → Gate: coverage ≥ 80%, no critical vulns, perf p95 ≤ 500ms
6. 06_DEPLOYMENT → Gate: required checks green; smoke tests pass
7. 07_MAINTENANCE → Gate: backup + restore proof updated
8. 08_SECURITY_COMPLIANCE → Gate: HIPAA (or relevant) controls present; docs checker PASS
9. 09_DOCUMENTATION → Gate: dev guide + runbook updated; troubleshooting linked
10. 10_MONITORING_OBSERVABILITY → Gate: dashboard/alerts templates + SLOs documented

## Run Commands (Local)
Variables
- PROJ=<project-key>

Commands
```bash
# Validate workflows & compliance
python3 scripts/validate_workflows.py --all
python3 scripts/check_compliance_docs.py

# Phase dry-run overview
make workflow.phase.N

# Scaffold artifacts
python3 scripts/scaffold_phase_artifacts.py --project $PROJ --phase 1
python3 scripts/scaffold_phase_artifacts.py --project $PROJ --phase 2
```

## CI Gates (PR)
- workflows_validation (required): blocks missing frontmatter/sections
- gates_enforcer (required): blocks coverage/perf/security violations; uploads artifacts