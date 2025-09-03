# F0 — Master Readiness Report (Plan-First Orchestrator)

## Date
- 2025-09-03

## Go/No-Go Recommendation
- Status: No-Go for execution yet
- Rationale: G1–G3 not fully met (pending sign-offs, tokens freeze note, policy-as-code)
- Conditions to Go: Close all gaps listed in Gates Matrix (below)

---

## Strategy & Governance (Strategy A — pipeline-first)
- PR base branch: `integration` (confirm) — CI runs on PRs to `integration` and `main` per `.github/workflows/ci.yml`
- Commit/PR policy:
  - Sign-offs recorded in PR description for Discovery and PRD approvals
  - Reference traceability IDs from `docs/discovery/rad.md` (R-/A-/D-)
- Folder & naming confirmed (selected Option A layout): see `OPTION_A.md`
- Governance Overlay active: `.cursor/rules/security-compliance-overlay.mdc`

---

## Contract Catalog v1
- API Contract (OpenAPI): `contracts/api/openapi.yaml` (v1.0.0)
  - CI validation: swagger-cli validate; Redocly lint
- Data Contract (Design Tokens): `docs/data/contracts/design-tokens-contract.md`
  - Schema: `docs/data/schemas/tokens-schema.yaml` (version: 1)
  - Lineage & DQ: `docs/data/contracts/lineage-and-dq.md`
  - Producers: `design/tokens/core.json`, `design/tokens/semantic.json`
  - Pipeline: `data/pipelines/tokens_sync.py` → `data/pipelines/out/tokens.json`
- Mocks: `contracts/mocks/health.json`, `contracts/mocks/tokens.json`
- Mocks Policy: `docs/architecture/mocks-policy.md`

---

## Framework Plans (F1–F10) — Scope, Artifacts, Gates
- F1 Discovery (docs): `docs/discovery/brief.md`, `docs/discovery/rad.md`, `docs/discovery/handoff.md`
  - Gate: Discovery brief + RAD approved
- F2 Planning (docs): `docs/planning/prd.md`, `docs/planning/roadmap.md`, `docs/planning/backlog.csv`
  - Gate: PRD approved (PM + Eng Lead); roadmap/backlog present
- F3 UX/UI (design): `design/tokens/*.json`, `design/specs/*.md`, `design/flows/*.md`
  - Gate: Tokens v1 frozen; AA contrast/keyboard verified
- F4 Architecture & API: `contracts/api/*`, `contracts/mocks/*`, `docs/architecture/adr/*.md`, `docs/architecture/diagrams/system.md`
  - Gate: OpenAPI v1 frozen; ADR review complete; mocks policy defined
- F5 Data/ML: `docs/data/schemas/tokens-schema.yaml`, `docs/data/contracts/*.md`, `data/pipelines/*`
  - Gate: DQ thresholds enforced in CI; lineage documented
- F6 Implementation (src/tests): `src/**`, `tests/**`
  - Gate: Unit/integration tests passing; coverage ≥80%
- F7 QA/Test: `docs/qa/**`, `tests/**/*`, `ci/*`
  - Gate: Contract tests and e2e ready (where applicable)
- F8 Security: `security/threat-model/*.md`, `security/sbom/*`, `compliance/evidence/*`
  - Gate: Zero critical vulns; SBOM generated; secrets scan pass
- F9 Release/Deploy: `.github/workflows/*`, `infra/*`, `docs/release/runbooks/*.md`
  - Gate: Progressive delivery + rollback runbook
- F10 Observability/Retro: `observability/dashboards/*`, `observability/alerts/*`, `docs/retro/*.md`
  - Gate: Dashboards/alerts in place; retro report

---

## Gates Matrix (G1–G3)
| Gate | Requirement | Status | Evidence | Gaps | Owner | Next Action |
|---|---|---|---|---|---|---|
| G1 | Discovery+PRD approved; Tokens v1 frozen | PARTIAL | `docs/discovery/brief.md`, `docs/discovery/rad.md`, `docs/planning/prd.md`, `design/tokens/*.json` | Sign-offs not recorded in PR; tokens v1 freeze not documented | PM, Eng Lead, UX | Record approvals in PR; add tokens v1 freeze note and tag |
| G2 | Contract Freeze — OpenAPI v1 + Schemas v1 + mocks policy | PARTIAL | `contracts/api/openapi.yaml` (v1.0.0), `docs/data/schemas/tokens-schema.yaml` (v1), `contracts/mocks/*`, `docs/architecture/mocks-policy.md` | Formal “freeze” decision missing | Eng Lead, Arch | Capture freeze decision in ADR/PR |
| G3 | CI design ready — contract/a11y/security gates defined | PARTIAL → NEAR-READY | `.github/workflows/ci.yml` (build/test, coverage gate, OpenAPI validate/lint, gitleaks, SBOM, Lighthouse CI via `A11Y_TARGET_URL`), `.lighthouserc.json` | Repo var `A11Y_TARGET_URL` not set; policy-as-code absent | DevOps, QA | Set `A11Y_TARGET_URL`; add policy-as-code checks |

---

## Risks (from RAD)
- R-01: Rule/doc drift between `.cursor` and `.ai-governor` — Mitigation: single source + CI sync check
- R-02: Ambiguous scope pre-PRD — Mitigation: tighten discovery scope, decision log
- R-03: Security/compliance gaps late — Mitigation: early overlay review + checklist
- R-05: No telemetry to measure KPIs — Mitigation: define metrics in PRD and instrument

---

## Readiness Review Checklist
- Gate list complete and objective pass/fail criteria defined
- Risks prioritized and owners assigned (see `docs/discovery/rad.md`)
- Evidence paths linked to artifacts (see Artifacts Index)

---

## Immediate Next Actions (Pre-Go)
1) Record Discovery and PRD approvals in PR; confirm base branch `integration`
2) Document tokens v1 freeze (date, tag), add to `design/tokens/README.md` (or ADR)
3) Capture contract freeze decision in ADR/PR referencing `docs/architecture/mocks-policy.md`
4) Set repo variable `A11Y_TARGET_URL` and monitor Lighthouse CI results
5) Add policy-as-code checks (e.g., OPA/Conftest) if applicable

---

## Daily Status (short)
- date: 2025-09-03
- phase: F0 — Planning & Gates Definition
- artifacts updated: `docs/dev-workflow/master-readiness-report.md`, `docs/architecture/mocks-policy.md`, `.github/workflows/ci.yml`
- risks: R-01, R-02, R-03 elevated for pre-Go actions
- blockers: Pending stakeholder sign-offs; policy-as-code not implemented; missing `A11Y_TARGET_URL`
- next: Capture sign-offs; set repo var; document tokens freeze; add policy-as-code