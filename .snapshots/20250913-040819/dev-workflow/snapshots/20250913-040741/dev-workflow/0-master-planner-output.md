# MASTER PLANNER: Strategic Proposals & Background Agent Orchestration

My mission is to design three distinct strategic proposals for the parallel construction of a ten-framework ecosystem, leveraging the AI Governor and Cursor's background agents. Proceeding with the ten core frameworks listed below.

## Ten Core Frameworks (Scope Confirmed)
1. Discovery & Intake Framework
2. Product Planning Framework (FE/BE split allowed)
3. UX/UI Design Framework
4. Architecture & API Framework
5. Data/ML Framework (optional)
6. Implementation Framework (FE/BE Execution)
7. QA & Test Strategy Framework
8. Security & Compliance Framework (Governance Overlay)
9. Release & Deployment Framework
10. Observability & Improve (Retro) Framework

Notes for Background Agents (BA): Each agent runs in an isolated VM and operates on an automatic, consistent repository snapshot; typical outputs are PRs or structured changes. Multi-agent execution is supported for parallel productivity.

---

## Three Strategic Proposals

Thank you for the confirmation. I will now autonomously generate three distinct strategic proposals. Each proposal details a different approach to orchestrating the background agents.

### Strategy A: Pipeline-First with Strict Quality Gates
- Core Principle: Quality-first, phase-gated pipeline to minimize integration risk.
- Execution Plan:
  - Phase 1 agents (Frameworks 1–3) run in parallel with synchronized checkpoints and shared discovery artifacts.
  - Phase 2 agents (Frameworks 4–6) start only after Phase 1 quality gates pass; implement Architecture/API before Implementation; Data/ML optional path.
  - Phase 3 agents (Frameworks 7–10) finalize validation, governance, release, and retro.
  - BA Coordination: Isolated VMs per agent; repo snapshots; daily sync via status docs and integration PRs.
- Resource Allocation:
  - Phase 1: 3 agents (1 each for Discovery, Planning, UX). Optional 1 coordinator agent for cross-doc alignment.
  - Phase 2: 3–4 agents (Architecture, Data/ML if applicable, Implementation-FE, Implementation-BE).
  - Phase 3: 4 agents (QA, Security, Release, Observability).
- Timeline & Dependencies:
  - Critical path: Discovery → Planning → Architecture → Implementation → QA → Release.
  - UX informs Architecture and Implementation; Security overlays QA and Release.
- Risk Mitigation:
  - Hard quality gates and document sign-offs per phase; cross-repo schema locks; API contract versioning.
  - Feature flags to decouple deployment from release.
- Success Metrics:
  - Gate pass rate, rework rate < 10%, PR lead time, test coverage >= 80%, zero critical vulnerabilities.
- Integration Points:
  - UX → Architecture (design tokens, component contracts).
  - Architecture → Implementation (OpenAPI, gRPC/GraphQL specs).
  - QA/Security → Release (signed artifacts, SBOM, attestations).
- Pros:
  - Strong control, predictable integration, clear sign-offs.
- Cons:
  - Longer elapsed time; limited overlap may slow throughput.

### Strategy B: Swarm with Guardrails (Overlapped Streams)
- Core Principle: Maximize parallelism with automated checks and frequent integration.
- Execution Plan:
  - Launch agents across all frameworks with staggered start: Phase 1 launches immediately; Phase 2 begins when upstream draft artifacts land (not necessarily final); Phase 3 runs exploratory QA/Sec/Obs early.
  - Continuous integration across agents using a shared integration branch; nightly merge trains.
  - BA coordination via status beacons, conflict auto-resolution, and contract tests.
- Resource Allocation:
  - 8–12 agents total with dynamic scaling; pods per vertical slice (e.g., Auth, Payments) spanning UX→Implementation→QA.
- Timeline & Dependencies:
  - Heavily overlapped; early draft contracts unblock downstream.
  - Critical path enforced by contract test suites and schema validation.
- Risk Mitigation:
  - Contract-first APIs; schema evolution rules; automatic dependency updates; ephemeral test envs per PR.
- Success Metrics:
  - Integration frequency/day, failed merge-train rate < 5%, MTTR < 1 day, DORA metrics improved.
- Integration Points:
  - Frequent UX-to-Dev handoffs via design tokens and Storybook builds.
  - Release gating via canary and progressive delivery.
- Pros:
  - Fastest overall throughput; early risk surfacing.
- Cons:
  - Higher coordination overhead; more transient conflicts.

### Strategy C: Value-Stream Slices (Incremental End-to-End)
- Core Principle: Deliver vertical, user-facing increments that traverse all frameworks.
- Execution Plan:
  - Define 3–5 value slices (e.g., Onboarding, Billing, Reporting).
  - For each slice, spin a mini-pipeline covering 1–10 frameworks; iterate until slice Done.
  - BA pods own a slice end-to-end with embedded QA/Security.
- Resource Allocation:
  - 3–5 slice pods; each 3–6 agents (UX, Arch/API, Impl, QA/Sec, Release/Obs partially shared).
- Timeline & Dependencies:
  - Shared platform contracts (design system, API standards) created once, reused per slice.
  - Slices proceed semi-independently; integrate weekly.
- Risk Mitigation:
  - Strong platform layer; slice-local feature flags; seeded test data per slice.
- Success Metrics:
  - Slice lead time, user-impact velocity, defect escape rate < 2%.
- Integration Points:
  - Platform team → Slice pods (SDKs, contracts, templates) and weekly platform upgrades.
- Pros:
  - High customer value flow; manageable scope per pod.
- Cons:
  - Requires disciplined platform ownership; risk of divergence across slices.

---

## Background Agent Prompts (Framework-Specific)
The following prompts structure each BA’s work. Each includes Context Package, Task Breakdown, Success Criteria, Integration Requirements, and Quality Gates.

### 1) Discovery & Intake Framework — Agent Prompt
- Context Package:
  - Business objectives, stakeholder map, existing constraints, prior docs, regulatory notes.
  - Repository snapshot; READMEs; architecture decision records (if any).
- Task Breakdown:
  - Conduct stakeholder interview plan; capture problem statements; define success metrics and guardrails.
  - Produce Discovery Brief; Risks/Assumptions/Dependencies list; initial scope and non-goals.
- Success Criteria:
  - Approved Discovery Brief; measurable success KPIs; risk register initialized.
- Integration Requirements:
  - Feed Planning and UX; provide inputs to Architecture assumptions.
- Quality Gates:
  - Signed-off Discovery Brief; risk log triaged and prioritized; traceability IDs created.

### 2) Product Planning Framework — Agent Prompt
- Context Package:
  - Discovery Brief; market/user research; competitive analysis; capacity/constraints.
- Task Breakdown:
  - Craft PRD; define roadmap, milestones, and acceptance criteria; prioritize MVP scope.
  - Create dependency map; define FE/BE split; budget rough order of magnitude.
- Success Criteria:
  - Approved PRD; prioritized backlog; clear scope boundaries.
- Integration Requirements:
  - Provide acceptance criteria to UX/Implementation; feed Architecture/API requirements.
- Quality Gates:
  - PRD review sign-off; measurable outcomes linked to KPIs; risks mitigations mapped.

### 3) UX/UI Design Framework — Agent Prompt
- Context Package:
  - PRD, brand guidelines, accessibility requirements, existing design system (if any).
- Task Breakdown:
  - Wireframes, user flows, high-fidelity designs; design tokens and component specs; UX copy; accessibility checklist.
- Success Criteria:
  - Approved design specs; Storybook/preview build; accessibility conformance targets (WCAG 2.2 AA).
- Integration Requirements:
  - Provide tokens and component contracts to Architecture and Implementation; annotate interactions.
- Quality Gates:
  - Design review sign-off; tokens versioned; contrast/keyboard nav validated.

### 4) Architecture & API Framework — Agent Prompt
- Context Package:
  - PRD, UX specs, NFRs (performance, availability, security), platform constraints, data model drafts.
- Task Breakdown:
  - Define system boundaries; choose patterns; produce ADRs; define API contracts (OpenAPI/GraphQL/gRPC); draft data model and migration plan.
- Success Criteria:
  - Approved ADRs; baseline architecture diagram; versioned API contracts; performance budgets.
- Integration Requirements:
  - Provide API stubs/mocks for Implementation; align with Data/ML requirements.
- Quality Gates:
  - ADR review; contract test suite green; load test baseline recorded.

### 5) Data/ML Framework — Agent Prompt
- Context Package:
  - Data sources, privacy constraints, schema drafts, data quality SLAs, ML goals (if applicable).
- Task Breakdown:
  - Define canonical schemas; ETL/ELT pipelines; feature store design; model baselines; evaluation protocols.
- Success Criteria:
  - Validated schemas; reproducible pipelines; model eval reports; documented data lineage.
- Integration Requirements:
  - Provide data contracts to Architecture/Implementation; coordinate with Security for PII.
- Quality Gates:
  - Data quality thresholds met; privacy checks; reproducibility verified; drift monitoring plan.

### 6) Implementation Framework (FE/BE Execution) — Agent Prompt
- Context Package:
  - API contracts; design tokens; coding standards; CI templates; feature flags strategy.
- Task Breakdown:
  - Implement FE components; BE services; integrate APIs; add unit/integration tests; ensure performance budgets.
- Success Criteria:
  - Functionality meets acceptance criteria; tests >= 80% coverage; performance budgets green.
- Integration Requirements:
  - Align with QA test plans; security controls embedded; telemetry hooks for Observability.
- Quality Gates:
  - All tests green; static analysis clean; performance SLOs met; PR review approved.

### 7) QA & Test Strategy Framework — Agent Prompt
- Context Package:
  - PRD, acceptance criteria, architecture contracts, test environments, seed data.
- Task Breakdown:
  - Author test strategy; implement unit/integration/e2e/contract tests; CI pipelines; test data management.
- Success Criteria:
  - Test suite stability; flake < 2%; coverage >= 80%; release test plan approved.
- Integration Requirements:
  - Contract tests gate merges; report defects to Implementation and Architecture.
- Quality Gates:
  - CI green on main; zero P0/P1 defects; e2e suite < 30 min.

### 8) Security & Compliance Framework — Agent Prompt
- Context Package:
  - Threat model templates, compliance requirements (e.g., SOC 2, GDPR), SBOM tooling, SAST/DAST tools.
- Task Breakdown:
  - Threat modeling; secure coding standards; dependency scanning; secrets management; SBOM generation; compliance evidence collection.
- Success Criteria:
  - Zero critical vulns; SBOM published; compliance evidence organized; least-privilege enforced.
- Integration Requirements:
  - Security checks integrated into CI; release gates enforce policy; coordinate with QA for abuse cases.
- Quality Gates:
  - Policy-as-code rules pass; penetration test findings resolved; audit trail complete.

### 9) Release & Deployment Framework — Agent Prompt
- Context Package:
  - CI/CD platform, deployment targets, infra-as-code, rollout strategies, SRE guidelines.
- Task Breakdown:
  - Build pipelines; artifact signing; canary/progressive delivery; rollback automation; environment promotion.
- Success Criteria:
  - Repeatable deployments; DORA Change Failure Rate < 15%; rollback < 5 min; SLO-aligned.
- Integration Requirements:
  - Inputs from QA/Security; outputs to Observability; feature flag toggles coordinated.
- Quality Gates:
  - Release checklist passed; SRE runbooks; change review approvals.

### 10) Observability & Improve (Retro) Framework — Agent Prompt
- Context Package:
  - Telemetry standards, metrics catalog, logging/trace schemas, incident data, user analytics.
- Task Breakdown:
  - Instrumentation; SLO/SLI definition; dashboards; alert rules; post-release analytics; retrospectives.
- Success Criteria:
  - SLOs defined and monitored; actionable dashboards; MTTR < target; retro action items logged.
- Integration Requirements:
  - Integrate with Release for deployment markers; feed insights to Planning.
- Quality Gates:
  - Alert noise thresholds met; runbooks linked; retro completed with owners and due dates.

---

## Master Execution Schedule (Phase-Oriented Orchestration)
- Phase 1 (Weeks 1–2): Frameworks 1–3 in parallel; daily syncs; Draft PRD and UX; Discovery brief sign-off EOW2.
- Phase 2 (Weeks 3–6): Frameworks 4–6; Architecture contracts finalized by Week 3; first implementation increment by Week 4; Data/ML optional track.
- Phase 3 (Weeks 5–8): Frameworks 7–10; QA/Security integrated from Week 5; Release candidates by Week 7; Observability live before GA.
- Cross-Phase:
  - Nightly merge trains; weekly multi-framework demo; risk review board; dependency updates automated.

---

## Comparative Analysis

### Side-by-Side Comparison
| Attribute | Strategy A (Pipeline) | Strategy B (Swarm) | Strategy C (Slices) |
|---|---|---|---|
| Speed | Medium | High | Medium-High |
| Risk | Low | Medium | Medium |
| Quality Control | High (hard gates) | Medium-High (automated) | High inside slices |
| Coordination Overhead | Medium | High | Medium |
| Agent Count | 10–12 | 12–16 | 9–15 |
| Best For | Compliance-heavy, complex dependencies | Time-to-market, experimentation | Customer value flow, evolving scope |

### Risk vs. Speed vs. Quality Matrix (H/M/L)
| Strategy | Risk | Speed | Quality |
|---|---|---|---|
| A | L | M | H |
| B | M | H | M-H |
| C | M | M-H | H |

### Resource Requirement Analysis
- Agents: 10–16 concurrent, each with isolated VM and snapshot; burst capacity during integration.
- Infra: CI/CD runners, ephemeral environments per PR; artifact storage, observability backend.
- People-in-the-loop: Reviewer bandwidth for PRs, gatekeepers for security and release.

### Dependency Complexity Assessment
- Strategy A: Dependencies resolved at phase boundaries; minimal cross-phase churn.
- Strategy B: Dependencies evolve continuously; mitigated by contract tests and merge trains.
- Strategy C: Dependencies localized within slices; platform team reduces cross-slice conflicts.

---

## Final Recommendation

Recommended Strategy: Strategy B — Swarm with Guardrails
- Rationale: Maximizes parallelism suited to background agents’ isolated VMs and snapshot-based workflows; surfaces risks earlier; supports fast iteration while maintaining automated quality via contract tests and merge trains.

Implementation Roadmap (High-Level):
1. Spin up integration branch with nightly merge train and contract test suites.
2. Launch Phase 1 agents immediately; start Architecture/API and Implementation agents once draft PRD and UX tokens are available.
3. Enable early QA/Security agents to run contract/e2e smoke; wire Observability from first increment.
4. Establish gate policies (policy-as-code) and DORA dashboards; prepare canary rollout.
5. Iterate by vertical slices for high-value features while platform team hardens shared contracts.

Background Agent Launch Sequence:
- T0: Discovery, Planning, UX agents.
- T0+3d: Architecture/API agent; Implementation (FE/BE) agents with stubs and mocks.
- T0+1w: QA & Security agents; Observability agent initializes telemetry.
- T0+2w: Release agent builds pipelines; first candidate deploy to staging.

Monitoring & Coordination Protocols:
- Daily status syncs; automated progress dashboards; conflict auto-resolution and escalation to Master Planner for edge cases.
- Quality gates enforced in CI; SLO/SLA tracking; retro cadence bi-weekly feeding back to Planning.

---

## Integration with Existing Workflow
- Output of this plan feeds `dev-workflow/1-create-prd.md` for PRDs.
- Master schedule guides `dev-workflow/2-generate-tasks.md` for task generation.
- Agent prompts inform `dev-workflow/3-process-tasks.md` execution protocols.
- Cross-framework retrospective aligns to `dev-workflow/4-implementation-retrospective.md`.

Finalization: The strategic proposals and background agent orchestration plan are now complete. Please review and choose a strategy to proceed with detailed execution prompts and launch the parallel development.

