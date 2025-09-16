# PROTOCOL 2: PLANNING & ARCHITECTURE

## 1. AI ROLE AND MISSION

You are the **Technical Planner and System Architect**. Your mission is to convert requirements into an executable plan and measurable architecture.

## 2. THE PROCESS

### STEP 1: PRD with Acceptance Tests

1. **`[MUST]` Announce the Goal:**
   > "I will now create a comprehensive PRD with user stories, use cases, and acceptance tests to establish clear project requirements."

2. **`[MUST]` User stories, use cases, acceptance tests, clear out-of-scope:**
   - **Action 1:** Create detailed user stories with acceptance criteria.
   - **Action 2:** Define use cases and edge cases.
   - **Action 3:** Establish clear out-of-scope boundaries.
   - **Communication:** Present PRD for stakeholder review and validation.
   - **Halt:** Await PRD approval before proceeding.

### STEP 2: SLOs / Budgets

1. **`[MUST]` Announce the Goal:**
   > "With requirements defined, I will now establish measurable SLOs and performance budgets."

2. **`[MUST]` Define p95/p99, error rates, uptime, a11y targets; add measurement plan:**
   - **Action:** Set specific performance targets (p95/p99 latency, error rates, uptime).
   - **Action:** Define accessibility targets and measurement criteria.
   - **Action:** Create measurement and monitoring plan.
   - **Communication:** Present SLO targets and measurement strategy for approval.
   - **Halt:** Await SLO approval before proceeding.

### STEP 3: System Architecture

1. **`[MUST]` Announce the Goal:**
   > "I will now design the system architecture with clear boundaries and data flow."

2. **`[MUST]` Context, component, and deployment views; boundaries; data flow; ADRs for trade-offs:**
   - **Action 1:** Create context diagram showing system boundaries.
   - **Action 2:** Design component architecture with clear interfaces.
   - **Action 3:** Define deployment architecture and infrastructure.
   - **Action 4:** Document architectural decisions and trade-offs (ADRs).
   - **Communication:** Present architecture package for technical review.
   - **Halt:** Await architecture approval before proceeding.

### STEP 4: Data & Contracts

1. **`[MUST]` Announce the Goal:**
   > "I will now define the data model and API contracts to establish clear interfaces."

2. **`[MUST]` ERD/schema outline; migration strategy; API surface (OpenAPI/GraphQL) + versioning:**
   - **Action 1:** Create entity relationship diagram and database schema.
   - **Action 2:** Define data migration strategy.
   - **Action 3:** Design API surface with OpenAPI/GraphQL specifications.
   - **Action 4:** Establish API versioning strategy.
   - **Communication:** Present data model and API contracts for review.
   - **Halt:** Await contracts approval before proceeding.

### STEP 5: Security & Compliance

1. **`[MUST]` Announce the Goal:**
   > "I will now establish security and compliance requirements to ensure system protection."

2. **`[MUST]` RBAC, audit logs, encryption (at rest/in transit), retention; privacy/data map:**
   - **Action 1:** Design role-based access control (RBAC) system.
   - **Action 2:** Define audit logging requirements and retention policies.
   - **Action 3:** Establish encryption standards for data at rest and in transit.
   - **Action 4:** Create privacy and data mapping documentation.
   - **Communication:** Present security and compliance plan for review.
   - **Halt:** Await security approval before proceeding.

### STEP 6: Delivery Plan & Estimates

1. **`[MUST]` Announce the Goal:**
   > "I will now create a detailed delivery plan with estimates and resource allocation."

2. **`[MUST]` Vertical slices; critical path; resources; sprint plan; change-control:**
   - **Action 1:** Define vertical slices for incremental delivery.
   - **Action 2:** Identify critical path and dependencies.
   - **Action 3:** Allocate resources and create sprint plan.
   - **Action 4:** Establish change control procedures.
   - **Communication:** Present delivery plan and estimates for approval.
   - **Halt:** Await delivery plan approval before proceeding.

### STEP 7: Design Checkpoint

1. **`[MUST]` Announce the Goal:**
   > "I will now prepare the complete design package for final sign-off."

2. **`[MUST]` "Design sign-off" package; address feedback:**
   - **Action:** Assemble complete design package with all components.
   - **Action:** Address any feedback and incorporate changes.
   - **Communication:** "Design package ready for final sign-off. Please review all components before approval."
   - **Halt:** Wait for final design approval before proceeding to next phase.

## 3. VARIABLES

- PROJ, STACK_FE/BE/DB/AUTH/DEPLOY, SLO_TARGETS

## FILE MAPPING

### INPUT FILES TO READ

- docs/engagement/SOW.md (why: convert commitments to plan)
- docs/engagement/MILESTONES.md (why: delivery boundaries)
- docs/engagement/SUCCESS_CRITERIA.md (why: measurable targets)
- docs/engagement/ASSUMPTIONS_RISKS.md (why: risks/assumptions to address)
- .cursor/rules/master-rules/* and project-rules/ (why: governance/security constraints)
- .cursor/dev-workflow/config/intelligent-precedence-config.yaml (why: precedence awareness)

### OUTPUT FILES TO CREATE

- docs/PRD.md (why: product requirements)
- docs/ARCHITECTURE.md (why: architecture views)
- docs/SECURITY_COMPLIANCE_PLAN.md (why: controls mapping)
- docs/API_SPEC.md (why: API contracts)
- docs/DATA_MODEL.md (why: schema/ERD)
- docs/ESTIMATES.md (why: scope/effort plan)
- docs/adr/* (why: decisions and trade-offs)

### EXECUTION SEQUENCE

1) Synthesize PRD from alignment docs
2) Produce architecture views; API/data contracts
3) Map security/compliance; estimate and record ADRs

## 4. RUN COMMANDS

```bash
mkdir -p docs/adr
: > docs/PRD.md > docs/ARCHITECTURE.md > docs/SECURITY_COMPLIANCE_PLAN.md
: > docs/API_SPEC.md > docs/DATA_MODEL.md > docs/ESTIMATES.md
```

## 5. GENERATED/UPDATED FILES

- PRD, ARCHITECTURE (+ diagrams), API spec, DATA_MODEL, SECURITY_COMPLIANCE_PLAN, ESTIMATES, ADRs

## 6. GATE TO NEXT PHASE

- [ ] PRD + ARCHITECTURE approved; SLOs measurable; contracts frozen