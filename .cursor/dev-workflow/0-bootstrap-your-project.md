# Protocol 0 · Project Bootstrap & Context Initialization

## Purpose & Role
- **Role:** Universal Project Bootstrap Lead (AI or human).
- **Mission:** Establish a complete understanding of the project vision, constraints, and working agreements so that every subsequent protocol operates with accurate, validated context.
- **Success Criteria:** Repository access confirmed, stakeholders aligned on outcomes, working environment validated, initial risks logged, and a concise "Context Kit" prepared for Protocol 1.

## Required Inputs
- Access to the project repository and any existing documentation (README, architecture notes, rule sets, service runbooks).
- Named stakeholders or decision makers who can confirm business goals and priorities.
- The list of mandatory rule files (e.g., `master-rules`, `common-rules`, custom `.mdc` files) supplied with the engagement.

## Expected Outputs
1. Validated repository map highlighting core modules, tech stacks, and entry points.
2. Environment readiness report covering tooling, runtime versions, and integration credentials.
3. Stakeholder alignment summary capturing business goals, success metrics, and delivery constraints.
4. Risk, dependency, and assumption log with mitigation owners.
5. "Context Kit" packet referencing:
   - Core documentation links
   - Technology summary
   - Rule collections loaded
   - Outstanding questions for the PRD interview (Protocol 1)

## Phase Breakdown

### Phase 0 · Rule & Instruction Refresh
1. Re-discover all rule directories: `find . -type d -name "*rules"`.
2. Load mandatory instruction sets (e.g., `elaboration-specialist.mdc`, master/common rules, domain-specific overlays).
3. Summarize active rule scopes and clarify any conflicts or waivers.
4. Record the refresh in the Context Kit.

### Phase 1 · Stakeholder & Vision Alignment
1. Identify sponsor, product owner, technical lead, and QA contact.
2. Capture business objectives, target users, value proposition, and high-level success metrics.
3. Document delivery constraints (timeline, budget, compliance, localization, accessibility, service-level objectives).
4. Validate assumptions and outstanding decisions with stakeholders; log unresolved items.

### Phase 2 · Repository & Architecture Discovery
1. Produce a non-destructive directory map (tree summary) of the repository.
2. Identify core services, applications, packages, infrastructure code, and shared libraries.
3. Highlight technology stacks per area (languages, frameworks, tooling, deployment targets).
4. Note integration points (APIs, queues, databases, external providers) and existing test infrastructure.

### Phase 3 · Environment & Toolchain Validation
1. Confirm availability of required runtimes, package managers, and build/test tools.
2. Validate ability to run the project locally (smoke install/build/test commands where safe).
3. Verify access to supporting resources: environment variables, secrets, CI/CD pipelines, monitoring dashboards.
4. Record compatibility issues, license constraints, or missing access.

### Phase 4 · Risk, Dependency, and Governance Review
1. Classify risks (delivery, technical, compliance, operational) with severity and mitigation owners.
2. Map dependencies to teams, vendors, or services; confirm communication channels.
3. Check governance requirements (security reviews, legal sign-off, data residency, audit trails).
4. Identify required approvals or checkpoints before implementation can start.

### Phase 5 · Context Kit Assembly & Handoff
1. Assemble all findings into the Context Kit (shared document or repository notes).
2. Include:
   - Executive summary of goals and constraints
   - Repository architecture map
   - Environment readiness results
   - Risk/dependency register
   - Open questions for Protocol 1
3. Share the Context Kit with stakeholders for validation.
4. Confirm readiness to start **Protocol 1 · PRD Creation** once validation and outstanding questions are addressed.

## Quality Gates & Checkpoints
- **Rule Activation Gate:** All relevant rule files documented and conflicts resolved.
- **Stakeholder Sign-off Gate:** Business objectives and success metrics approved.
- **Environment Gate:** Critical tooling verified or mitigation plan documented.
- **Risk Log Gate:** High/critical risks tracked with mitigation owners.
- **Context Kit Gate:** Context Kit approved and stored in a discoverable location.

## Transition to Protocol 1
Proceed to `1-create-prd.md` only after:
1. Context Kit is published and acknowledged.
2. Outstanding questions for the PRD interview are assigned to responsible stakeholders.
3. Environment blockers (if any) have an agreed resolution plan.

*This protocol ensures that every collaborator—human or AI—shares the same foundational understanding before requirements gathering begins.*
