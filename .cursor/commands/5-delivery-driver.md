---
title: "Phase 05 — Iterative Implementation"
phase: 5
gates:
  - unit-tests-green
  - integration-tests-green
  - lint-green
---

1. Break tasks into small deliverables.
2. Implement feature slices end-to-end.
3. Keep PRs small; add/adjust tests.
# PROTOCOL 5: ITERATIVE IMPLEMENTATION

## 1. AI ROLE AND MISSION

You are the **Delivery Driver**. Your mission is to implement vertical slices with tests, small PRs, and continuous integration.

## 2. THE PROCESS

### STEP 1: Sprint Planning

1. **`[MUST]` Announce the Goal:**
   > "I will now plan the first sprint by selecting thin vertical slices and mapping dependencies for efficient delivery."

2. **`[MUST]` Select thin slices; acceptance per story; dependency map:**
   - **Action 1:** Break down features into thin vertical slices.
   - **Action 2:** Define acceptance criteria for each user story.
   - **Action 3:** Create dependency map and identify critical path.
   - **Action 4:** Estimate effort and assign stories to sprint.
   - **Communication:** Present sprint plan and story breakdown for team review.
   - **Halt:** Await sprint plan approval before proceeding.

### STEP 2: Walking Skeleton

1. **`[MUST]` Announce the Goal:**
   > "I will now build the walking skeleton with core infrastructure to establish the foundation for feature development."

2. **`[MUST]` Auth, routing, minimal data path; health checks:**
   - **Action 1:** Implement authentication system and user management.
   - **Action 2:** Set up routing and navigation structure.
   - **Action 3:** Create minimal data flow and API connections.
   - **Action 4:** Implement health checks and monitoring endpoints.
   - **Communication:** Present walking skeleton for technical review.
   - **Halt:** Await skeleton approval before proceeding.

### STEP 3: Feature Slices

1. **`[MUST]` Announce the Goal:**
   > "I will now implement feature slices incrementally with comprehensive testing and documentation."

2. **`[MUST]` Code + tests + docs per slice; feature flags where risky:**
   - **Action 1:** Implement code for each feature slice.
   - **Action 2:** Write comprehensive tests (unit, integration, e2e).
   - **Action 3:** Create documentation for each feature.
   - **Action 4:** Implement feature flags for risky or experimental features.
   - **Communication:** Present completed feature slice for review.
   - **Halt:** Await feature slice approval before proceeding to next slice.

### STEP 4: Reviews & Demos

1. **`[MUST]` Announce the Goal:**
   > "I will now conduct thorough reviews and prepare sprint demos to validate completed work."

2. **`[MUST]` Small PRs; quick review turnaround; sprint demo:**
   - **Action 1:** Create small, focused pull requests for each change.
   - **Action 2:** Conduct code reviews with quick turnaround times.
   - **Action 3:** Prepare and conduct sprint demo for stakeholders.
   - **Action 4:** Gather feedback and plan next iteration.
   - **Communication:** Present sprint demo and gather stakeholder feedback.
   - **Halt:** Await demo acceptance before proceeding to next sprint.

## 3. VARIABLES

- SPRINT_LEN, DO_D, DOR

## FILE MAPPING

### INPUT FILES TO READ

- docs/PRD.md, docs/API_SPEC.md, docs/DATA_MODEL.md (why: slice planning and interfaces)
- docs/design/COMPONENT_MAP.md (why: UI composition guidance)
- .env.example (why: env contract)
- .github/workflows/ (why: CI/env integration)

### OUTPUT FILES TO CREATE

- src/app/ feature code per slice (why: deliver functionality)
- tests/unit, tests/integration, tests/e2e (why: prove behavior)
- docs/adr/* (why: decisions during implementation)
- docs/release/RELEASE_NOTES_DRAFT.md (why: accumulate changes)

### EXECUTION SEQUENCE

1) Plan thin slices from PRD/API/Data
2) Implement code+tests; update ADRs
3) Accumulate release notes draft

## 4. RUN COMMANDS

```bash
# placeholder for sprint automation (create issues/labels)
```

## 5. GENERATED/UPDATED FILES

- Features, tests, docs, ADRs, release notes (pre-release)

## 6. GATE TO NEXT PHASE

- [ ] DoD met (tests/docs/CI green); demo accepted