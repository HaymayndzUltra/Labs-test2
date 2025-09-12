## Stage I/O (Verbatim or NOT SPECIFIED)

### Flow A — Execution Plan Orchestrator

#### BR
- Required inputs (verbatim):
```
## [STRICT] Inputs
- brief_paths: one or more markdown/text files containing the client brief/requirements.
- context: name, industry, project_type. Optional: frontend, backend, database, auth, compliance, team lanes (Agent A/B/C names).
- policy (optional): selection rules to infer missing stack defaults.
```
- Expected outputs (verbatim):
```
## [STRICT] Outputs (single artifact per run)
- DAG of tasks with fields: id, title, area (backend|frontend|devops|db|qa|docs), estimate, blocked_by[], risks.
- Labels:
  - Blocking: task is on the critical path OR a prerequisite of ≥2 downstream tasks.
  - Independent: zero in-degree AND not on the critical path.
- Lanes:
  - Lane A (Backend), Lane B (Frontend), Lane C (DevOps/Compliance, only if needed).
  - Each lane is topologically ordered and capped at 3 concurrent tasks.
- Conflicts Table:
  - resource/file/port/db → contending tasks → guardrail (lock|sequence|mock|feature-flag).
- Guided Triggers:
  - BR, AP, LA, LB, LC, CS, QA, PR, HP with explicit go-signal rules.
```
- Acceptance: Inherited from orchestrator’s `[STRICT] Acceptance`.

#### AP
- Required inputs: NOT SPECIFIED (uses frozen plan from BR in rule text)
- Expected outputs (verbatim):
```
- Freeze plan; lock lanes/ownership; snapshot DAG.
- Emit: go-signal “Run LA and LB in parallel” (LC only if present).
```
- Acceptance: Inherited from orchestrator.

#### LA
- Required inputs: NOT SPECIFIED
- Expected outputs (verbatim):
```
- Execute Lane A tasks until first milestone or block.
- On block: print blocker ids and two choices: (a) continue via unblocked tasks; (b) run CS for mock/guardrail resequence.
- Emit: next allowed triggers (e.g., LB or CS).
```
- Acceptance: Inherited from orchestrator.

#### LB
- Required inputs: NOT SPECIFIED
- Expected outputs: Same semantics as LA (verbatim in rule)
- Acceptance: Inherited from orchestrator.

#### LC
- Required inputs: NOT SPECIFIED
- Expected outputs: Same semantics as LA/LB (verbatim in rule)
- Acceptance: Inherited from orchestrator.

#### CS
- Required inputs: NOT SPECIFIED
- Expected outputs (verbatim):
```
- Re-scan conflicts and print concrete mitigations and any resequencing deltas.
```
- Acceptance: Inherited from orchestrator.

#### QA
- Required inputs (verbatim):
```
- Run tests/coverage/lints for COMPLETED scope only; report pass/fail with next steps.
```
- Expected outputs: Pass/fail report; artifacts governed by gates configs.
- Acceptance: Inherited from orchestrator; thresholds in gates configs.

#### PR
- Required inputs: NOT SPECIFIED
- Expected outputs (verbatim):
```
- Emit acceptance checks, artifacts summary, changelog points; STOP. NO DEPLOY.
```
- Acceptance: Inherited from orchestrator.

#### HP
- Required inputs: NOT SPECIFIED
- Expected outputs (verbatim):
```
- Print trigger cheat sheet, plan status, current go-signal, and blocked_on.
```
- Acceptance: Inherited from orchestrator.

### Flow B — FE/BE Plan Orchestrator

#### PLAN
- Required inputs (verbatim):
```
## Inputs
- `brief.md` (client brief)  
- Optional config presets (stack/industry/features)
```
- Expected outputs (verbatim):
```
## Outputs
- `PLAN.md` and `tasks.json` in chosen path (no deploy, no code edits)
```
- Acceptance: As defined in rule’s “## Acceptance (PLAN)” block.

#### RUN_BE
- Required inputs: NOT SPECIFIED (uses plan artifacts)
- Expected outputs (verbatim):
```
- `RUN_BE`: execute BE lane in order until milestone/blocker  
```
- Acceptance: NOT SPECIFIED.

#### RUN_FE
- Required inputs: NOT SPECIFIED (uses plan artifacts)
- Expected outputs (verbatim):
```
- `RUN_FE`: execute FE lane in order until milestone/blocker  
```
- Acceptance: NOT SPECIFIED.

#### CSAN
- Required inputs: NOT SPECIFIED
- Expected outputs (verbatim):
```
- `CSAN`: conflict scan + mitigations (resequencing, mocks, feature flags)  
```
- Acceptance: NOT SPECIFIED.

#### QA
- Required inputs: NOT SPECIFIED (gates configs applied to completed scope)
- Expected outputs (verbatim):
```
- `QA`: tests/lints/coverage for completed scope only  
```
- Acceptance: NOT SPECIFIED in this rule.

#### PR
- Required inputs: NOT SPECIFIED
- Expected outputs (verbatim):
```
- `PR`: artifacts + acceptance checklist; STOP (no deploy)  
```
- Acceptance: NOT SPECIFIED.

#### STATUS
- Required inputs: NOT SPECIFIED
- Expected outputs (verbatim):
```
- `STATUS`: progress, blocked_on, next allowed triggers
```
- Acceptance: NOT SPECIFIED.

