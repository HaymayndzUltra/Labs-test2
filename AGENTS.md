Phase 2 — Design & Planning

Purpose: gawing executable plan ang outputs ng Phase 1 (brief pack) bago mag-heavy build.

Inputs: Charter, Requirements (+NFRs), Scope_Slices, initial risks.

Core activities (high-level):

Architecture & ADRs (C4, tradeoffs), repo/branching policy, env strategy (no real secrets), coding standards.

(Optional) Design System seeding; Backlog & Sprint-0; Data model + OpenAPI/ERD (contract-first).

Primary outputs (artefacts):

Architecture.md, C4 diagrams, ADRs; repo initialized (commit rules).

env/.env.example + env strategy (secrets = human-only later).

Lint/format/typecheck configs; (optional) Design_Tokens.json, Storybook seed.

Product_Backlog.csv + Sprint-0 plan; openapi.yaml, ERD, migration plan.

Exit (go/no-go) checks (objective):

ADRs accepted (no blocking decisions open).

OpenAPI validated; mock server running.

CI “skeleton” green (lint/type/build).

Backlog prioritized ≥2 sprints with AC.

Design handoff present kung UI-heavy.

How this maps to your “Protocol” library:

Malapit sa Protocol 2: Technical Task Generation – Phase 0/1 (prep + workstream map) bago ka pumasok sa detailed tasking.

Phase 3 — Build Foundations & Quality Rails

Purpose: itayo ang guardrails at quality bars para predictable ang dev.

Inputs: Phase 2 outputs (contracts, repo, CI skeleton).

Core activities:

Security by Design (ASVS mapping, threat model draft).

Performance budgets (Lighthouse budgets), Accessibility targets (WCAG 2.2 AA).

Analytics spec + Feature Flags framework.

Testing pyramid plan + coverage thresholds.

CI/CD gates; Code Review rules + branch protections.

Primary outputs:

Security_Checklist.md (ASVS map, threat model draft).

perf/budgets.json, A11y_Test_Plan.md.

Analytics_Spec.xlsx, Feature_Flags.md.

Test_Plan.md + thresholds; CI pipelines; Code_Review_Checklist.md.

Exit checks (objective):

CI gates enforced (PRs can’t merge on fail).

Baseline unit tests running; coverage ≥ target (or justified risk-based).

Perf/A11y/Security checks automated sa CI.

Feature flag framework live; analytics schema approved.

Protocol mapping:

Katugma ng Protocol 2 – Phase 2 (define tasks + AC) at Protocol 3 (execution guardrails) kung meron ka.

Phase 4 — Feature Build & Integration

Purpose: mag-implement ng features under flags, i-integrate sa staging na may telemetry.

Inputs: Contracts + guardrails (Phases 2–3).

Core activities:

Incremental feature delivery behind flags; cohesive integration.

E2E smoke on staging; observability wiring (logs/metrics/traces).

Draft SLO/SLI; init release mgmt (SemVer, CHANGELOG).

Primary outputs:

Features behind flags; passing E2E smoke on staging.

Observability_Spec.md + basic dashboards.

SLO_SLI.md (draft); CHANGELOG.md initialized.

Exit checks (objective):

Staging deploy stable; smoke E2E green.

p75 Web Vitals meet budgets on staging.

Traces + error tracking cover golden paths.

Draft SLOs agreed (availability + latency).

Protocol mapping:

Tugma sa Protocol 2 – Phase 3 (sequence & dependencies) → Protocol 3 (execution/integration checkpoints).

Phase 5 — Hardening & Launch Readiness

Purpose: i-prove na prod-ready: deploy strategy, alerts, DR, docs, UAT, legal/privacy.
(Dito papasok ang SEO/i18n kung public.)

Inputs: Stable staging build, draft SLOs, runbooks, contracts.

Core activities:

Finalize deployment strategy (blue-green/canary) + rollback rehearsal.

Observability prod-ready; alerting tuned (on-call rota + runbooks).

Backup/DR with test-restore; Docs complete.

UAT & Go-Live checklist; SEO/i18n for public apps.

Release notes final.

Primary outputs:

Deployment_Runbook.md, Rollback_Plan.md.

Prod dashboards + alerts + runbooks.

Backup_Policy.md, DR_Plan.md, restore test report.

README.md, CONTRIBUTING.md, onboarding notes, ADRs updated.

Public: seo/checklist.md, sitemap, robots, structured data.

GoLive_Checklist.md + UAT sign-off + release notes.

Exit checks (objective):

Canary plan tested; rollback rehearsed.

Alerts actionable (noise under threshold); on-call set.

Restore test passed (RPO/RTO met).

UAT + legal/privacy sign-off complete.

Go-Live checklist 100% ✅.

Protocol mapping:

Ito ang “Validation & Publication” ng Protocol 2 – Phase 4, plus operationalization (deployment/SEO/UAT).

Phase 6 — Launch, Operate & Improve

Purpose: stable operations, mabilis na remediation, tuloy-tuloy na learning.

Inputs: Prod release + on-call, dashboards, DR, runbooks.

Core activities:

Post-launch monitoring; incident response; postmortems.

Dependency updates & security patching cadence.

Regular retros; ongoing releases (SemVer).

Primary outputs:

Postmortems; action items with owners/dates.

Weekly dep-updates; monthly security window.

Retro_YYYY-MM-DD.md with ≥3 actions; ongoing CHANGELOG.

Exit checks (steady-state):

SLOs met 2–4 consecutive weeks.

No high/critical vulns open >14 days.

Retro actions closed on time.

Protocol mapping:

Tumatawid sa Protocol 3/4 (execution/operations) kung meron kang hiwalay na ops protocol.

Quick sanity rules (para consistent sa 100 workflows mo)

Phase boundaries = reviewable artefacts + objective gates, hindi lang opinion.

Secrets: laging human-only insertion/rotation; nasa Phase 2/3/5 ang references pero di ini-store.

(7) Design System at (13) SEO/i18n ay contextual (UI-heavy/public).

Consensus + machine checks: bawat phase approval = alignment ng reviewers at passing ng automated gates (como napag-usapan natin).