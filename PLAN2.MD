# Phase-by-Phase Operating Manual (v1)

**Purpose.** Turn the agreed flow into concrete documents, artifacts, and gates that Cursor agents and human reviewers can follow without ambiguity.

**Principles.**

- **Layer 0: AI-Governor** enforces behavior (policy, orchestration, gates, audit trail). Not a framework step.
- **ACL (Anti-Corruption Layer)**: all cross-framework comms via **shared artifacts** only (tokens, API specs, data contracts, test contracts). No direct internal coupling.
- **Dual Checker**: **Auditor → Validator** must reach consensus before coding.
- **Overlays**: **QA (F7)** and **Security (F8)** run throughout Implementation and gate Release.

**Folder baseline** (aligns with repo layout):

your-repo/

.cursor/rules/ # Governor/Rules (to be added after docs are done)

frameworks/

discovery-intake/.cursor/rules/

product-planning/{fe,be}/.cursor/rules/

ux-ui/.cursor/rules/

architecture-api/.cursor/rules/

data-ml/.cursor/rules/

implementation/{fe,be}/.cursor/rules/

qa-test/.cursor/rules/

release-deployment/.cursor/rules/

observability-retro/.cursor/rules/

contracts/{api,data}/ # ACL artifacts (OpenAPI, mocks, schemas)

docs/ # All phase docs (see below)

src/{frontend,backend}/

tests/{unit,integration,contract,e2e,load}/

.github/workflows/

## Layer 0 — AI-Governor (Meta-Layer)

**Role.** Orchestrate, guard, and record. Enforce triggers, immutability, and consensus before phase transitions.

**Key objects.**

- **RunID**: `YYYYMMDD-<feature>-<module>` (e.g., `20250904-auth-fe`).
- **Artifacts**: immutable markdown/JSON files with frontmatter (`runId`, `version`, `status`).
- **Triggers (IDs)**: see _Trigger Table_ below.

**Trigger Table (authoritative).**

| Trigger ID           | Meaning                                  | Requires Artifacts                                                              |
| -------------------- | ---------------------------------------- | ------------------------------------------------------------------------------- |
| `TRIG-F1-APPROVED`   | Discovery brief approved                 | `docs/discovery/brief.md`, `docs/discovery/rad.md`                              |
| `TRIG-F2-PRD-LOCKED` | PRD & backlog locked                     | `docs/planning/prd.md`, `docs/planning/roadmap.md`, `docs/planning/backlog.csv` |
| `TRIG-AUD-PASS`      | Auditor report passes (≥80, no Blockers) | `reports/AUD-<RunID>-vN.md`                                                     |
| `TRIG-VAL-PASS`      | Validator agrees (≥80, no Blockers)      | `reports/VAL-<RunID>-vN.md`, evidence refs                                      |
| `TRIG-F3-F4-READY`   | UX tokens + API contracts ready          | `design/tokens/*.json`, `contracts/api/*`                                       |
| `TRIG-F6-START`      | Implementation may begin                 | `reports/DECISION-<RunID>-vN.md` = Go                                           |
| `TRIG-F7-GREEN`      | QA gates green                           | CI reports + `docs/qa/strategy.md`                                              |
| `TRIG-F8-GREEN`      | Security gates green                     | SBOM + scans + `security/threat-model/*.md`                                     |
| `TRIG-F9-READY`      | Release approved                         | `.github/workflows/*`, runbook, sign-off                                        |
| `TRIG-F10-RETRO`     | Retro complete                           | `docs/retro/<RunID>-retro.md`                                                   |
|                      |                                          |                                                                                 |

**Governor Rules (summary).**

- Only triggers change phase. No implicit transitions.
- All agent communication via artifacts; no shared scratchpads.
- Auditor cannot open repo unless a specific file is cited by Planner; Validator must consult artifacts before repo.
- If `AUD` and `VAL` disagree → create `reports/AUD-VAL-CONFLICT-<RunID>-vN.md`; loop max 2 cycles; if still Major → scope freeze & feature-flag.

---

## F1 — Discovery & Intake

**Goal.** Define the problem, constraints, KPIs, and risks.

**Inputs.** Repo snapshot, any existing docs/policies.

**Deliverables + Paths.**

- `docs/discovery/brief.md`
- `docs/discovery/rad.md` (Risks/Assumptions/Dependencies)

**Definition of Done (DoD).**

- KPIs measurable; top risks ranked; constraints explicit; traceability IDs present.

**ACL Guard.** Only approved brief & KPIs pass to F2.

**Exit Trigger.** `TRIG-F1-APPROVED`.

**Template (brief.md).**

# Discovery Brief — <RunID>

- Problem statement

- Users & constraints

- KPIs (with measurement plan)

- Risks/Assumptions/Dependencies summary

- Trace IDs

## F2 — Product Planning

**Goal.** Turn discovery into PRD, backlog, and milestones.

**Deliverables + Paths.**

- `docs/planning/prd.md`
- `docs/planning/roadmap.md`
- `docs/planning/backlog.csv`

**DoD.** PRD signed; MVP scope fixed; acceptance criteria per feature; non-goals listed.

**ACL Guard.** Only acceptance criteria & milestones pass outward; internal estimation sheets remain private.

**Exit Trigger.** `TRIG-F2-PRD-LOCKED`.

**Template (prd.md).**

# PRD — <RunID>

- Goals & non-goals

- User stories / acceptance criteria

- NFRs (perf/availability/security)

- Rollback strategy / flags

## F3 — UX/UI Design (parallel with F4)

**Goal.** User flows, tokens, component contracts, accessibility.

**Deliverables + Paths.**

- `design/tokens/*.json`
- `design/specs/*.md`
- `design/flows/*.md`

**DoD.** Tokens versioned; Storybook/preview linked; WCAG checks pass.

**ACL Guard.** Expose only tokens & component contracts, not raw explorations.

**Readiness Trigger.** contributes to `TRIG-F3-F4-READY`.

**Checklists.**

## F4 — Architecture & API (parallel with F3)

**Goal.** Boundaries, ADRs, API contracts, performance baseline.

**Deliverables + Paths.**

- `docs/architecture/adr/*.md`
- `docs/architecture/diagrams/*`
- `contracts/api/*.yaml|json` (OpenAPI/GraphQL/gRPC)
- `contracts/mocks/*`

**DoD.** ADR approved; versioned contracts; baseline load test captured.

**ACL Guard.** Publish stubs/mocks; no internal debates.

**Readiness Trigger.** contributes to `TRIG-F3-F4-READY`.

**Checklist.**

- ***

## F5 — Data/ML (Optional)

**Goal.** Canonical schemas, pipelines, (if ML) baseline.

**Deliverables + Paths.**

- `docs/data/schemas/*.yaml`
- `docs/data/contracts/*.md`
- `data/pipelines/*`

**DoD.** Schemas validated; lineage documented; privacy checks green.

**Skip Logic.** If out of scope, mark `F5: SKIPPED` in `DECISION-<RunID>-vN.md`; ensure no other phase assumes pipelines exist.

---

## Pre-Implementation Gate — Dual Checker

**Auditor (First Pass).** `reports/AUD-<RunID>-vN.md`

- Traceability (PRD → UX/API/(Data))
- Logic Completeness/Consistency/Testability
- Risks & change requests
- **Score** (0–100) and Blocking list

**Validator (Second Pass).** `reports/VAL-<RunID>-vN.md`

- Agreement matrix vs Auditor
- Repo alignment (contracts, stubs, CI gates)
- Evidence (paths/lines), recommended tests
- **Score** (0–100) and Go/No-Go

**Scoring rubric.** 0–3 per criterion → normalize to 100; **Proceed** if both ≥ 80 and **no Blocking**.

**Conflict protocol.** `reports/AUD-VAL-CONFLICT-<RunID>-vN.md`; loop ≤ 2; else scope freeze/flag.

**Exit Trigger to Implementation.** `TRIG-AUD-PASS` + `TRIG-VAL-PASS` → `TRIG-F6-START` with `reports/DECISION-<RunID>-vN.md` (Go).

---

## F6 — Implementation (Coding)

**Tracks.** `src/frontend/*` and `src/backend/*`.

**DoD (both tracks).**

- Tests: ≥80% on critical paths; contract & integration tests pass
- Perf smoke within budgets
- Telemetry hooks added
- No direct cross-framework calls (ACL enforced)

**Artifacts.**

- FE: `src/frontend/*`, `tests/frontend/*`, `design/token-usage/*.md`
- BE: `src/backend/*`, `tests/backend/*`, `docs/services/*.md`

**Branching & IDs.**

- Branch: `feat/<feature>/<RunID>`; PR label `ready-for-qa` only if tests/local checks pass.

**Overlays.** QA & Security run continuously.

---

## F7 — QA & Test Strategy (Overlay)

**Goal.** Gate quality by tests and CI stability.

**Deliverables + Paths.**

- `docs/qa/strategy.md`
- `tests/**/*`, `ci/*`

**Gate.** `TRIG-F7-GREEN` if: coverage ≥80%, flake <2%, contract tests green on `integration` branch.

---

## F8 — Security & Compliance (Overlay)

**Goal.** Threat model, scans, SBOM, compliance evidence.

**Deliverables + Paths.**

- `security/threat-model/*.md`
- `.github/dependabot.yml`
- `security/sbom/*`
- `compliance/evidence/*`

**Gate.** `TRIG-F8-GREEN` if: no critical vulns; SBOM published; policies pass.

---

## F9 — Release & Deployment

**Goal.** CI/CD, signing, progressive delivery, rollback.

**Deliverables + Paths.**

- `.github/workflows/*`
- `infra/*`
- `docs/release/runbooks/*.md`

**Gate.** `TRIG-F9-READY` if: QA/Sec green; artifacts signed; rollback ≤5 min; approvals complete.

---

## F10 — Observability & Improve (Retro)

**Goal.** Instrumentation, dashboards, SLOs, retros.

**Deliverables + Paths.**

- `observability/dashboards/*`
- `observability/alerts/*`
- `docs/retro/<RunID>-retro.md`

**Loop.** Retro creates actions routed back to Planning/Discovery.

**Exit Trigger.** `TRIG-F10-RETRO`.

---

## ACL (Anti-Corruption Layer) — Contract Types & Enforcement

**Shared artifacts only:**

- **Design tokens & component contracts** (`design/tokens/*.json`, `design/specs/*.md`)
- **API contracts & mocks** (`contracts/api/*`, `contracts/mocks/*`)
- **Data contracts & schemas** (`docs/data/schemas/*.yaml`, `docs/data/contracts/*.md`)
- **Test contracts** (QA: `tests/contract/*`)

**Enforcement hooks.**

- Contract diff → semver check
- No imports across frameworks except through generated clients
- CI jobs: `check:contracts`, `check:tokens`, `check:sbom`

---

## PR Labels & Status Gates (minimal)

- `ready-for-audit` → run Auditor
- `ready-for-validate` → run Validator
- `ready-for-implementation` → requires `DECISION-<RunID>-vN.md=Go`
- `ready-for-release` → requires `TRIG-F7-GREEN` + `TRIG-F8-GREEN`

---

## Minimal Templates (copy-paste)

`**reports/AUD-<RunID>-vN.md**`

# AUD Report — <RunID> vN

Score: <0–100> | Blockers: [ ]Yes [ ]No

1. Traceability

2. Logic Completeness/Consistency/Testability

3. Risks & Mitigations

4. Change Requests

5. Confidence & Next Steps

reports/VAL-<RunID>-vN.md

# VAL Report — <RunID> vN

Score: <0–100> | Blockers: [ ]Yes [ ]No

Agreement Matrix (AUD item → Agree/Disagree/Partial + reason)

Repo Alignment (paths/lines)

Recommended Tests / CI Gates

Go/No-Go & Residual Risk

reports/DECISION-<RunID>-vN.md

# Decision — <RunID> vN

Result: Go / No-Go

Scope Freezes / Feature Flags

Triggers satisfied: AUD, VAL, F3/F4 readiness

Notes

## Working Agreement (RACI-ish)

- **Planner**: owns F2 artifacts
- **Auditor**: owns AUD report
- **Validator**: owns VAL report + evidence
- **Implementors (FE/BE)**: own F6
- **QA**: owns F7 gates
- **Security**: owns F8 gates
- **Release**: owns F9
- **Observability**: owns F10 & retro
- **AI-Governor**: owns triggers & policy enforcement

---

## Quick Start (what to do next)

1. Create the folders/doc stubs listed above (empty files are okay to start).
2. Fill F1 → get `TRIG-F1-APPROVED`.
3. Fill F2 → lock PRD & backlog (`TRIG-F2-PRD-LOCKED`).
4. Run Auditor → Validator; resolve conflicts; issue `DECISION` (Go) when ready.
5. Only then trigger Implementation (`TRIG-F6-START`).

---

### Simple Tagalog na paliwanag

Ito ang kumpletong gabay na “hakbang-hakbang.” May mga **file na dapat mong likhain** per phase, may **checklist** kung ano ang DoD, at may **triggers** na pipindutin ng AI-Governor para makausad ang trabaho. Bago mag-code, kailangan munang magkasundo si **Auditor at Validator**. Habang nagco-code, bantay ang **QA at Security**. Pag-release, meron tayong **runbooks at rollback**; tapos sa **Observability**, may **retro** para bumalik ang aral sa susunod na cycle.

Done — nilagay ko na sa canvas ang **Phase-by-Phase Operating Manual (v1)** with all phases, deliverables, DoD checklists, ACL rules, and the exact **trigger table** for the AI-Governor.

Kung ok ang structure, next step natin:

1. Fill out **F1 Discovery** stubs → get `TRIG-F1-APPROVED`.
2. Draft **F2 PRD/Backlog** → lock with `TRIG-F2-PRD-LOCKED`.
3. Run **Auditor → Validator** using the provided report templates.
4. Pag **Go**, saka natin i-wire ang **Cursor Rules** to enforce the triggers in the doc.

maikling Tagalog paliwanag:  
Kompleto na ang dokumento ng mga hakbang at requirements. Gagamitin natin ito bilang “script” ng buong cycle. Kapag napunan mo ang bawat section at na-trigger ang mga naka-lista, tuloy-tuloy at kontrolado ang daloy—walang makakalusot na step.
