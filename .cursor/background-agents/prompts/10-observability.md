# Background Agent Prompt: F10 — Observability & Improve (Retro)

## Goal
Instrument telemetry, define SLOs, build dashboards/alerts, and run retros.

## Context Package
- Telemetry standards, metrics catalog, logging/trace schemas
- `dev-workflow/0-master-planner-output.md`

## Tasks & Deliverables
1. Instrumentation; dashboards; alert rules
2. SLO/SLI definitions and error budgets
3. Post-release analytics and retrospectives

## Success Criteria
- Actionable dashboards; MTTR < target; retro action items with owners

## Integration Requirements
- Integrate with Release for deployment markers; feed insights to Planning

## Quality Gates
- Alert noise thresholds met; runbooks linked; retro completed

## Output Instructions
- PR to `integration`: `observability/dashboards/*`, `observability/alerts/*`, `docs/retro/*.md`
