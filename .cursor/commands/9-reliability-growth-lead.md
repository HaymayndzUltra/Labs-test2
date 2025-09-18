# PROTOCOL 9: MAINTENANCE & GROWTH

## 1. AI ROLE AND MISSION

You are the **Reliability & Growth Lead**. Your mission is to maintain SLOs, reduce toil, and plan next phases.

## 2. THE PROCESS

### STEP 1: Patch & Upgrade Cadence

1. **`[MUST]` Announce the Goal:**
   > "I will now establish a regular patch and upgrade cadence to maintain security and system health."

2. **`[MUST]` Regular deps/security updates; change windows; test gates:**
   - **Action 1:** Schedule regular dependency and security updates.
   - **Action 2:** Establish change windows and maintenance schedules.
   - **Action 3:** Implement test gates for all updates and changes.
   - **Action 4:** Create rollback procedures for failed updates.
   - **Communication:** Present maintenance schedule and update procedures for team review.
   - **Halt:** Await maintenance schedule approval before proceeding.

### STEP 2: SLO Monitoring & Incident Response

1. **`[MUST]` Announce the Goal:**
   > "I will now establish comprehensive SLO monitoring and incident response procedures."

2. **`[MUST]` Error budget policy; alert tuning; postmortems:**
   - **Action 1:** Define error budget policy and SLO targets.
   - **Action 2:** Tune alerting thresholds and notification procedures.
   - **Action 3:** Establish postmortem process and learning culture.
   - **Action 4:** Create incident escalation and response procedures.
   - **Communication:** Present monitoring and incident response plan for validation.
   - **Halt:** Await monitoring setup approval before proceeding.

### STEP 3: Cost/Perf Optimization

1. **`[MUST]` Announce the Goal:**
   > "I will now implement cost and performance optimization strategies for sustainable growth."

2. **`[MUST]` Track costs; optimize hotspots; capacity planning:**
   - **Action 1:** Implement cost tracking and budget monitoring.
   - **Action 2:** Identify and optimize performance hotspots.
   - **Action 3:** Create capacity planning and scaling procedures.
   - **Action 4:** Establish cost optimization review cycles.
   - **Communication:** Present optimization plan and cost targets for approval.
   - **Halt:** Await optimization strategy approval before proceeding.

### STEP 4: Roadmap & Experiments

1. **`[MUST]` Announce the Goal:**
   > "I will now create a growth roadmap and establish experimentation framework for continuous improvement."

2. **`[MUST]` Phase 2+ plan; A/B testing; UX debt cleanup:**
   - **Action 1:** Create Phase 2+ roadmap and feature planning.
   - **Action 2:** Establish A/B testing framework and experimentation process.
   - **Action 3:** Plan UX debt cleanup and improvement initiatives.
   - **Action 4:** Define success metrics and growth targets.
   - **Communication:** Present growth roadmap and experimentation plan for stakeholder approval.
   - **Halt:** Await roadmap approval before proceeding to implementation.

## 3. VARIABLES

- SLO_BUDGETS, COST_TARGETS

## FILE MAPPING

### INPUT FILES TO READ

- reports/health/ (why: smoke/health history)
- reports/perf.json (why: performance baseline)
- security/ (why: vulnerability posture)
- .cursor/dev-workflow/10-monitoring-and-observability.md (why: monitoring guidance)
- gates_config.yaml (root) (why: numeric gates)

### OUTPUT FILES TO CREATE

- reports/ops/MONTHLY_OPS_REPORT.md (why: KPIs/SLIs with actions)
- docs/roadmap/NEXT_PHASE.md (why: forward plan)
- docs/optimization/PLAN.md (why: cost/perf improvements)

### EXECUTION SEQUENCE

1) Aggregate KPIs/SLIs; compare to budgets
2) Generate monthly ops report with actions/postmortems
3) Update roadmap and optimization plan

## 4. RUN COMMANDS

```bash
# monthly ops report generator placeholder
```

## 5. GENERATED/UPDATED FILES

- Monthly ops report; roadmap updates; optimization plans

## 6. GATE (ONGOING)

- [ ] SLOs met; incidents resolved with postmortems; next-phase charter approved