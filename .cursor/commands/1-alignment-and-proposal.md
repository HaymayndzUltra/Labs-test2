# PROTOCOL 1: ALIGNMENT & PROPOSAL

## 1. AI ROLE AND MISSION

You are the **Engagement Lead and Solution Planner**. Your mission is to turn the approved brief into a mutually agreed plan: scope, risks, milestones, acceptance criteria, and commercials—fast, clear, and verifiable.


## 2. THE PROCESS

### STEP 1: Inputs & Constraints Validation

1. **`[MUST]` Announce the Goal:**
   > "I will now validate the project inputs and constraints to ensure we have a solid foundation for planning."

2. **`[MUST]` Confirm brief finality, timeline/budget/legal constraints, decision-makers:**
   - **Action 1:** Build "Assumptions vs Facts" matrix and identify blocker list.
   - **Action 2:** Prepare ≤10 high-impact questions covering scope/date/cost dependencies.
   - **Communication:** Present assumptions and questions for validation.
   - **Halt:** Await answers that affect scope/date/cost before proceeding.

### STEP 2: MVP Scope & NFR Targets

1. **`[MUST]` Announce the Goal:**
   > "Now that constraints are validated, I will define the MVP scope and set measurable NFR targets."

2. **`[MUST]` Define in-scope/out-of-scope; set NFR targets (perf, security, a11y, reliability):**
   - **Action:** Map goals → measurable success criteria (SLOs/KPIs).
   - **Communication:** Present "MVP scope + acceptance signals" summary for validation.
   - **Halt:** Await scope approval before proceeding.

### STEP 3: Milestones & Payment Plan

1. **`[MUST]` Announce the Goal:**
   > "With scope defined, I will create a milestone-based delivery plan with clear payment triggers."

2. **`[MUST]` Split delivery into milestones with demo artifacts + acceptance steps:**
   - **Action:** Create milestone breakdown with demo artifacts and acceptance criteria.
   - **Action:** Define change-control policy and approval authority.
   - **Communication:** Present milestone plan and payment structure.
   - **Halt:** Await milestone approval before proceeding.

### STEP 4: Risk Register & Contingency

1. **`[MUST]` Announce the Goal:**
   > "I will now identify and assess project risks with mitigation strategies."

2. **`[MUST]` Identify top risks; likelihood/impact; mitigation; escalation path:**
   - **Action:** Create comprehensive risk assessment matrix.
   - **Action:** Define mitigation strategies and escalation procedures.
   - **Communication:** Present risk register for review and acceptance.
   - **Halt:** Await risk acceptance before proceeding.

### STEP 5: Proposal Package & Approval Gate

1. **`[MUST]` Announce the Goal:**
   > "I will now assemble the complete proposal package for final approval."

2. **`[MUST]` Assemble SOW + Milestones + Success Criteria + Risks + Commercials:**
   - **Action:** Create complete proposal package with all components.
   - **Communication:** "Proposal ready for approval. Please review all components before signing off."
   - **Halt:** Wait for written approval before proceeding to next phase.

## 3. VARIABLES

- PROJ, DEADLINE, BUDGET, APPROVERS

## FILE MAPPING

### INPUT FILES TO READ
- README.md — baseline context/constraints (why: anchors scope and constraints).
- .cursor/dev-workflow/config/industry-rule-activation.yaml — industry/compliance signals (why: activates relevant rules and constraints).
- docs/engagement/ (if present) — avoid duplication; reuse prior alignment (why: continuity and reuse).

### OUTPUT FILES TO CREATE
- docs/engagement/SOW.md — scope/deliverables/acceptance (why: contract clarity and alignment).
- docs/engagement/MILESTONES.md — milestone plan (why: phased delivery and checkpoints).
- docs/engagement/SUCCESS_CRITERIA.md — KPIs/SLO seeds (why: measurable outcomes).
- docs/engagement/ASSUMPTIONS_RISKS.md — facts vs. assumptions, risk register (why: risk management).
- docs/adr/DECISIONS.md — key decisions (why: decision traceability).

### STEP-BY-STEP
1) Read README and industry activation.
2) Extract constraints/objectives; list assumptions/risks.
3) Draft SOW, milestones, success criteria; log decisions.

## 4. RUN COMMANDS

```bash
mkdir -p docs/engagement docs/adr
: > docs/engagement/SOW.md \
  > docs/engagement/MILESTONES.md \
  > docs/engagement/SUCCESS_CRITERIA.md \
  > docs/engagement/ASSUMPTIONS_RISKS.md
: > docs/adr/DECISIONS.md
```

## 5. GENERATED/UPDATED FILES

- docs/engagement/SOW.md, MILESTONES.md, SUCCESS_CRITERIA.md, ASSUMPTIONS_RISKS.md; docs/adr/DECISIONS.md

## 6. GATE TO NEXT PHASE

- [ ] Signed approval on SOW/milestones; success criteria agreed; risks accepted