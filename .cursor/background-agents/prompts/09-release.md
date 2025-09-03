# Background Agent Prompt: F9 — Release & Deployment

## Goal
Implement CI/CD pipelines, artifact signing, and progressive delivery.

## Context Package
- CI/CD platform, infra-as-code, rollout strategies, SRE guidelines
- `dev-workflow/0-master-planner-output.md`

## Tasks & Deliverables
1. Build pipelines; artifact signing; environment promotion
2. Canary/progressive delivery; rollback automation
3. SRE runbooks and change review process

## Success Criteria
- Repeatable deployments; DORA CFR < 15%; rollback < 5 min

## Integration Requirements
- Inputs from QA/Security; outputs to Observability

## Quality Gates
- Release checklist passed; change approvals; SLO alignment

## Output Instructions
- PR to `integration`: `.github/workflows/*`, `infra/*`, `docs/release/runbooks/*.md`
