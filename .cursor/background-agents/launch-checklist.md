# Launch Checklist (Swarm with Guardrails)

## Preflight
- Confirm repo is clean (no uncommitted changes)
- Ensure CI is configured on this repo (tests, lint, SAST)
- Ensure environments exist (staging at minimum)
- Decide on the integration branch name (default: `integration`)

## Branch Preparation
- Run script: `bash background-agents/scripts/prepare_integration_branch.sh`
- If remote exists, push the branch: `git push -u origin integration`
- Set CI to target the integration branch for merge trains

## Agent Naming Convention
- Framework prefix (F1..F10), short name, and slice (optional)
- Example: `F1-Discovery` or `F6-Impl-FE-Auth`

## Orchestration (Recommended Sequence)
- T0: Launch F1-Discovery, F2-Planning, F3-UX
- T0+3d: Launch F4-Architecture, F6-Implementation (FE/BE) with mocks
- T0+1w: Launch F7-QA, F8-Security, F10-Observability
- T0+2w: Launch F9-Release (build pipelines, artifact signing)

## Quality Gates
- Contract tests pass before merging to integration
- Test coverage >= 80%; no P0/P1 defects
- Zero critical vulnerabilities; SBOM generated
- Release checklist completed; SRE runbooks updated

## Definition of Done (Per Framework)
- Deliverables merged into integration
- Documentation updated
- Quality gates green
- Handoff artifacts delivered to dependent frameworks

