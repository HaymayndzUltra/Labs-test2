## Dry-Run Simulation

### Trigger sequence (minimal valid, brief-driven)
1. BR (Execution Plan Orchestrator)
2. AP
3. LA and/or LB (parallel allowed)
4. CS (if blocks)
5. QA
6. PR

### First missing inputs (verbatim requirements)
```
## [STRICT] Inputs
- brief_paths: one or more markdown/text files containing the client brief/requirements.
- context: name, industry, project_type. Optional: frontend, backend, database, auth, compliance, team lanes (Agent A/B/C names).
- policy (optional): selection rules to infer missing stack defaults.
```

Status: STOPPED at BR due to TODO:BRIEF_REQUIRED.

