# PROTOCOL 1: UNIFIED PRD CREATION

## Purpose
Translate the contextual knowledge from Protocol 0 into a validated Product Requirements Document that aligns business goals, user needs, and architectural realities. The PRD becomes the single source of truth for planning and implementation.

## Primary Role
**AI Product Strategist & Systems Planner** – facilitates discovery conversations, synthesizes requirements, and confirms implementation scope across all relevant systems.

## Inputs
- Approved Context Kit (Protocol 0)
- Stakeholder contacts and availability
- Existing product documentation, user research, analytics (when available)

## Outputs
1. Signed-off PRD stored in the repository (e.g., `docs/prd/<feature>.md`).
2. Architectural placement summary including primary and secondary systems.
3. Success criteria matrix with measurable outcomes and acceptance tests.
4. Decision & assumption log with outstanding questions.

---

## Workflow

### Phase 1: Initiative Discovery
1. **Action:** Confirm whether the work is a new capability, an enhancement, or maintenance.
2. **Action:** Capture the business problem, target personas, and expected value (revenue impact, risk reduction, experience improvement).
3. **Action:** Document success metrics (KPIs, SLAs, qualitative goals) and how they will be measured.
4. **Checkpoint:** Restate the initiative summary and obtain stakeholder confirmation before moving forward.

### Phase 2: Solution Boundaries & Architecture Placement
1. **Action:** Identify which domains or systems are impacted (frontend, backend services, APIs, data pipelines, infrastructure, integrations).
2. **Action:** Determine primary implementation layer(s) and secondary dependencies using questions such as:
   - What user interaction or trigger starts the flow?
   - Where does business logic live today?
   - Which systems own the canonical data?
3. **Action:** Capture constraints (performance targets, compliance regimes, uptime requirements, localization, accessibility).
4. **Checkpoint:** Present a placement summary and confirm it is accurate. Example:
   ```
   🎯 Detected Primary Layer: Backend service `orders`
   🔗 Supporting Layers: Web app, reporting pipeline
   ⚠️ Constraints: PCI scope, <200ms response, deployment window Fridays 20:00 UTC
   ```

### Phase 3: Requirement Elicitation by Perspective
Perform structured interviews or document reviews for each perspective:

1. **User Experience & Workflow**
   - Capture personas, scenarios, and user stories.
   - Document UI/UX expectations, accessibility needs, localization.

2. **Business Logic & Rules**
   - Enumerate decisions, calculations, validations, and exception handling.
   - Identify data transformations and orchestration steps.

3. **Data & Integration**
   - Define data inputs/outputs, storage requirements, schema changes.
   - List external APIs, event streams, or file exchanges.

4. **Quality & Testing Expectations**
   - Capture functional acceptance tests, edge cases, regression concerns.
   - Document non-functional requirements (performance, security, observability).

5. **Deployment & Operations**
   - Determine release strategy, feature flag usage, rollback requirements.
   - Note monitoring, alerting, and maintenance expectations.

6. **Documentation & Compliance**
   - Identify artefacts that must be updated (help center, runbooks, onboarding).
   - Record regulatory or audit evidence requirements.

**Checkpoint:** Validate each perspective with stakeholders; unresolved items become tracked questions.

### Phase 4: PRD Synthesis
1. **Action:** Compile findings into the standard PRD structure (template below).
2. **Action:** Ensure every requirement links back to stakeholder input or existing documentation.
3. **Action:** Map success metrics and acceptance tests to each major requirement.
4. **Action:** Summarize open questions, assumptions, and decisions with owners and due dates.
5. **Checkpoint:** Circulate the draft PRD for review. Collect approvals or requested changes.

### Phase 5: Sign-off & Handoff
1. **Action:** Finalize the PRD after incorporating feedback.
2. **Action:** Store the PRD in version control and update the Context Kit with a link.
3. **Action:** Announce approval status, success criteria, and implementation layers to the team.
4. **Action:** Explicitly hand off to Protocol 2 with instructions such as `Use PRD docs/prd/feature-x.md as the basis for task generation.`

---

## Standard PRD Template
```markdown
# PRD: <Feature Name>

## 1. Executive Summary
- **Business Goal:**
- **Users & Personas:**
- **Success Metrics:**

## 2. Problem Statement & Objectives
- Current pain points
- Desired outcomes
- Non-goals / out of scope

## 3. Solution Overview
- Primary and secondary systems
- High-level workflow diagram or description
- Key business rules and logic summary

## 4. Detailed Requirements
### 4.1 Functional Requirements
- FR-1: <description>
- Acceptance tests / scenarios

### 4.2 Data & Integration Requirements
- Data contracts, schema changes, migration needs
- External system interactions

### 4.3 User Experience Requirements
- UI flows or wireframe references
- Accessibility, localization, device considerations

### 4.4 Non-Functional Requirements
- Performance / scalability targets
- Security, privacy, compliance
- Observability and logging expectations

## 5. Release & Operations Plan
- Deployment strategy & environment impacts
- Feature flags / configuration
- Monitoring, alerting, support readiness

## 6. Documentation & Training
- Artefacts to create/update
- Owner and due date

## 7. Risks, Assumptions, Open Questions
- R-1: <risk description, mitigation>
- A-1: <assumption>
- Q-1: <open question, owner, due date>
```

---

## Quality Gates
- All perspectives (UX, business logic, data, operations, testing, compliance) documented.
- Success metrics and acceptance tests defined and measurable.
- Implementation layers confirmed with stakeholders.
- Open questions tracked with owners and deadlines.
- PRD approved by product, engineering, and relevant governance partners.

## Transition to Protocol 2
Provide the finalized PRD location, architectural placement summary, and any priority or sequencing constraints for task generation. Explicitly state dependencies or deadlines identified during PRD creation.

## Messagebox Macro (Optional)
```
/apply-instructions-from-1-create-prd.md
# Gather discovery notes
/run: mkdir -p evidence/discovery
/run: bash -lc 'date -Is > evidence/discovery/summary.log'
# Store PRD draft
/run: bash -lc 'mkdir -p docs/prd && touch docs/prd/<feature>.md'
```
