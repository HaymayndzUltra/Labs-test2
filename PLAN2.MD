FRAMEWORK: FULLSTACK – REACT (Frontend) + DJANGO (Backend)
VERSION: 1.0 (Role-Based, End-to-End Automation Spec)
SCOPE: Single repo or monorepo na may frontend (React) at backend (Django)
GOAL: From idea → prod → learning loop, lahat orchestrated by roles, triggers, at safety gates

Paano gumagalaw end-to-end (conceptual flow)

Framework detection
• I-scan ang repo; kapag may React at/o Django signatures, auto-activate ang tamang RoleBundle.
• Detection signals (high level, no code):
– React: may package manager file at dependencies para sa React; may src/pages o src/components.
– Django: may manage file o config na pahiwatig ng Django; may app/ at migrations/ folders.
• Resulta: ma-load ang roles, triggers, guardrails, KPIs; naka-isolate ang permissions per framework.

Command → Trigger → Routing
• Kapag may command (e.g., “ADD FEATURE”), papasok sa central router.
• Router ang magdi-dispatch kung aling framework at aling roles ang gagalaw; puwedeng sabay kung cross-framework ang feature.
• Namespacing para iwas-banggaan: “frontend:…”, “backend:…”, “fullstack:…”.
• Precedence: project overrides → framework rules → core defaults.

Role execution with boundaries
• Bawat role may malinaw na capabilities at mahigpit na boundaries (files/tools/network).
• Expected outputs ay predictable (component/page, models/migrations, endpoints, tests, docs) para smooth ang handoffs.
• Lahat ng takbo may telemetry (logs/metrics) para madaling audit at learning.

Safety gates at quality checks
• Pre: risk assessment, permission checks, dependency/security scan.
• During: progress monitoring, anomaly detection, budget enforcement (perf/a11y/latency).
• Post: validation vs. requirements, contract tests, release policy checks; human approval kung high-risk (destructive migrations, prod promo).

Audit + Learning
• QA/Audit role ang magva-validate ng outputs at processes, then magla-log ng evidence (coverage, a11y/perf/security scores).
• Learning engine ang magre-refine ng triggers, guardrails, at handoffs base sa patterns at incidents.

Handoffs sa full-stack
• Contract-first: backend maglalabas ng API contracts; frontend susunod (forms/hooks/UI).
• Versioned handoffs at clear source-of-truth para maiwasan drift.
• Rollout: staging → canary → full; may auto-rollback kung may SLO breach.

====================================================
ANONG DAPAT NAKA-DEFINE SA FRAMEWORK NA ITO (walang code, puro konsepto)

A) Role catalog (lahat ng role-based actors)

Frontend (React)
• FE Planner/Architect – i-frame ang requirements, routing/state boundaries, risks.
• UI/Component – reusable components, design patterns, prop/slot contracts.
• State & Forms – data hooks, form schemas, validation, optimistic updates.
• Routing/SEO – routes, guards, metadata, sitemap/robots, OG guidance.
• Accessibility (A11y) – semantics, focus management, keyboard flows.
• Performance – code-splitting, memoization, image pipeline, budgets.
• FE Testing – unit/interaction, snapshot/visual, a11y tests.
• FE Docs – usage guidelines, stories, change notes.

Backend (Django)
• BE Architect – app boundaries, settings matrix (dev/stage/prod), risk controls.
• ORM/Model – entity modeling, constraints, relations, indexes.
• Migration Safety – plan/apply changes; block destructive without approval.
• API/Contracts – REST/GraphQL schema, pagination/filtering/versioning.
• Auth & Security – sessions/JWT/OAuth, RBAC/ABAC policies, privacy gates.
• Jobs/Queues – background tasks, retries, DLQ, schedules.
• Caching – keys, TTLs, invalidation hooks, cache hierarchies.
• BE Testing – unit/integration/contract tests, fixtures/seeds.
• BE Docs – API docs, runbooks, ADRs.

Cross-cutting
• DevOps/SRE – CI/CD pipelines, infra configs, deploy strategies, rollback.
• QA/Audit – end-to-end validation vs. acceptance criteria; evidence capture.
• Security/Privacy – SAST/DAST, dep audit, secret scanning, data classification.
• Observability/Analytics – logs/metrics/traces; dashboards; product analytics.
• Release Manager – versioning, changelogs, approvals, comms.

B) Capabilities (verbs per domain; examples, not code)
• Planning/Design: requirements.parse, backlog.create, design.arch.
• Data/Contracts: model.define, migration.prepare, migration.apply (gated), api.contract.publish.
• Backend runtime: api.endpoint.create, auth.configure, cache.define, job.enqueue.
• Frontend UI: component.create, route.add, form.generate, state.connect.
• Quality: test.unit, test.integration, test.e2e, a11y.audit, perf.analyze, security.scan.
• Ops: ci.setup, build.package, deploy.staging, deploy.canary, deploy.promote, rollback.execute, observe.dashboard.
• Docs: doc.update, runbook.write, adr.record, changelog.generate.

C) Permissions & boundaries (least-privilege mindset)
• File scope: FE roles sumulat lang sa bahagi ng UI; BE roles sa backend apps/migrations; walang cross-writes.
• Tools scope: FE roles may JS/TS toolchain; BE roles may Python toolchain; DevOps may build/deploy tools.
• Network scope: default block; whitelist lang kung kailangan (e.g., registry).
• Secrets scope: read-only via broker; walang raw secrets sa logs o artifacts.

D) Triggers/commands (standard, maikli, predictable)
• fullstack:init project – scaffold at baseline checks.
• backend:define domain <Entity> – models + safe migrations + contracts + tests.
• backend:add endpoint <Method> <Path> – handlers + validators + tests + docs.
• frontend:add page <Route> – page + data hook + a11y tests + perf budget check.
• frontend:add component <Name> – reusable component + unit tests + docs.
• fullstack:add feature <Name> – orchestrated FE+BE flow (contract-first).
• quality:run gates – lint/type/tests/security/a11y/perf/coverage.
• release:deploy staging – build, migrate (safe), smoke tests, preview.
• release:promote prod – canary + SLO watch + promote/rollback.
• docs:update – API docs, changelog, runbooks, ADRs.

E) Quality gates (minimum checks per layer)
• Frontend: lint/typecheck, a11y score ≥ 95, Lighthouse ≥ 90, bundle budgets ok.
• Backend: style/lint, test coverage ≥ 85–90, migration safety pass, p95 latency budget met.
• Security: secret scan blocker, dep audit (no criticals), SAST rules.
• Documentation: updated ADRs/API docs/runbooks bago deploy.
• Release policy: canary mandatory for risky releases; auto-rollback on SLO breach.

F) KPIs (targets na babantayan)
• Global: role activation < 2s; successful task assignment > 95%; error-budget burn < 1%/day.
• FE: a11y ≥ 95; Lighthouse ≥ 90; CLS/LCP/FID budgets met.
• BE: p95 latency ≤ 200ms (typical target); error rate ≤ 0.5%; coverage ≥ 85–90.
• Security: 0 critical vulns; secrets exposure = 0; policy exceptions with approval only.

G) Runbooks/approvals (human-in-the-loop moments)
• Destructive migrations, schema drops, privacy-sensitive changes, prod promotion.
• Rollback steps, paging/alerts, escalation tree documented.
• Approval windows at critical gates; evidence attached (tests, budgets, scans).

====================================================
PAANO ITO NAGCO-COMPOSE SA FULL-STACK

• FE at BE roles ay hiwalay ang ownership pero pinagdudugtong ng central Coordinator.
• May cross-framework triggers para sa features na may UI + API + DB.
• Handoffs ay contract-first: backend mag-publish ng API contract; frontend gagawa ng forms/hooks at UI; QA/Audit magva-validate; DevOps magde-deploy sa staging at maglalakad ng canary/prod.

====================================================
NAMING AT CONVENTIONS (para hindi magulo)

• Capabilities: verb.noun (madaling i-scan at i-enforce).
• Triggers: maikling imperative phrases na may namespace (“frontend:add component”, “backend:define domain”, “release:promote prod”).
• Artifacts: consistent na pangalan sa outputs, tests, docs, changelogs.
• Precedence: project overrides > framework rules > core defaults.

====================================================
LIFECYCLE NG ISANG PAGBABAGO (plain words)

Initiate/Plan – Planner/Architect linawin requirements, risk, sequencing, targets.

Implement – FE/BE roles gumawa ng components/models/endpoints/tests ayon sa contracts.

Quality & Safety – lint/type/tests/security/a11y/perf; budgets at gates enforced.

Deploy – staging (seeded + smoke tests) → canary → promote/rollback; SLOs watched.

Observe & Learn – dashboards/alerts; incidents → auto-rollback → rule/guardrail refinements.

====================================================
COMMON PITFALLS AT MGA I-WAS

• Role overlap – linawin capabilities at router priority; isang owner lang per write path.
• Hidden coupling – gawin ang handoffs sa Project/Workflow layer, hindi sa loob ng role; versioned contracts.
• Wide write access – mas mabuti ang mas maliliit na roles na may masikip na scope.
• Inconsistent triggers – standard, opinionated golden-path set; dokumentado.
• Mabagal na CI – path-based checks, selective testing, caching; heavy checks per framework lang.

====================================================
CI/CD INTEGRATION (folder-aware, high level)

• Path filters: kung FE lang ang nabago, FE checks lang ang tatakbo; ganun din sa BE.
• Required checks per layer:
– FE: lint/type, unit/interaction, a11y/perf budgets.
– BE: lint/style, unit/integration/contract, migration safety, latency budgets.
– Security: secrets scan, dep audit, SAST.
• Release: staging → canary (SLO watch) → promote/rollback; artifacts signed; changelogs updated.

====================================================
SUCCESS METRICS (summary)

• Coordination efficiency > 95%; Safety compliance 100%; Learning effectiveness > 90%.
• User satisfaction ≥ 4.5/5; End-to-end trigger latency: snappy (role activation < 2s).