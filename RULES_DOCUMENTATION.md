# Complete Documentation: Rules Directory

## Overview

The `rules` directory contains the AI Governor Framework's rule system - a comprehensive governance framework that transforms generic AI assistance into project-specific, contextually-aware engineering partnership. The rules are organized into master rules (foundational protocols) and common rules (specialized domain expertise).

## Directory Structure

```
rules/
├── master-rules/
│   ├── 0-how-to-create-effective-rules.md          # Rule creation protocol
│   ├── 1-master-rule-context-discovery.md          # Context loading system
│   ├── 2-master-rule-ai-collaboration-guidelines.md # Interaction protocols
│   ├── 3-master-rule-code-quality-checklist.md      # Code quality standards
│   ├── 4-master-rule-code-modification-safety-protocol.md # Safe modification
│   ├── 5-master-rule-documentation-and-context-guidelines.md # Documentation sync
│   └── 6-master-rule-complex-feature-context-preservation.md # Complex feature protection
└── common-rules/
    ├── common-rule-ui-foundation-design-system.mdc      # Design system foundations
    ├── common-rule-ui-interaction-a11y-perf.mdc        # Interaction & accessibility
    └── common-rule-ui-premium-brand-dataviz-enterprise-gated.mdc # Premium features
```

## Rule System Architecture

### Core Components

1. **YAML Frontmatter Metadata**
   ```yaml
   ---
   description: "TAGS: [tag1,tag2] | TRIGGERS: keyword1,keyword2 | SCOPE: scope | DESCRIPTION: One-sentence summary."
   alwaysApply: false
   ---
   ```

2. **Persona Assignment**
   - Each rule defines AI's role for that context
   - Ensures consistent behavior and expertise

3. **Directive Prefixes**
   - `[STRICT]`: Non-negotiable, mandatory actions
   - `[GUIDELINE]`: Best practices, with deviation justification

4. **Exemplarity Pattern**
   - ✅ Correct Implementation examples
   - ❌ Anti-Pattern examples with explanations

## Master Rules: Foundational Protocols

### Rule 0: How to Create Effective Rules
**Persona:** Framework Architect

**Purpose:** Defines the protocol for creating and maintaining the governance system itself.

#### Core Principle
The quality of AI assistance depends directly on rule quality. This rule establishes the "4 Pillars" methodology:

1. **Structure & Discoverability**
   - Clear naming conventions (`master-rule-*`, `common-rule-*`)
   - Complete YAML metadata for AI discovery
   - Proper directory placement by scope

2. **Personality & Intent**
   - Defines AI's role and mindset
   - States core principle clearly

3. **Precision & Clarity**
   - Imperative language with `[STRICT]`/`[GUIDELINE]` prefixes
   - Step-by-step protocols
   - Explicit directives

4. **Exemplarity & Contrast**
   - Positive examples (`✅ Correct Implementation`)
   - Negative examples (`❌ Anti-Pattern`) with explanations

#### Final Review Checklist
- Structure completeness
- Metadata integrity
- Personality definition
- Protocol precision
- Exemplarity coverage
- Overall clarity

### Rule 1: Context Discovery Protocol (BIOS)
**Persona:** System Architect

**Purpose:** Acts as the system's "BIOS" - initializes foundational operating parameters and loads necessary "kernel" rules.

#### Key Features:

**Systematic Discovery Process:**
1. **Phase 1:** Master/Common rules discovery
2. **Phase 2:** Project-specific rules discovery
3. **Phase 3:** Deduplication

**Relevance Evaluation:**
1. **Priority 1:** Absolute directives (`alwaysApply: true`)
2. **Priority 2:** Scope matching
3. **Priority 3:** Keyword matching (`TRIGGERS`)
4. **Priority 4:** Concept matching (`TAGS`)

**Dynamic Re-evaluation:**
- Triggers on domain changes
- Location changes
- Explicit pivot requests

#### Standardized Tagging System:
- **Global Tags:** `global`, `collaboration`, `quality`, `documentation`, `workflow`
- **Backend Tags:** `backend`, `api`, `database`, `auth`, `deployment`, `testing`
- **Frontend Tags:** `frontend`, `component`, `form`, `styling`, `api-calls`
- **Infrastructure Tags:** `storage`, `cache`, `cdn`, `monitoring`

### Rule 2: AI Collaboration Guidelines
**Persona:** Supreme operational protocol override

**Purpose:** Governs AI-user collaboration, conflict resolution, doubt clarification, and continuous improvement.

#### Core Interaction Principles:
- **Think-First Protocol:** Articulate plans before execution
- **Concise Communication:** Direct responses without filler
- **Assume Expertise:** Interact as senior technical peers

#### Tool Usage Protocol:
- **Environment Agnostic:** No hardcoded tool assumptions
- **Two-Step Model:** Discovery → Execution
- **Fallback Strategy:** Manual methods if tools unavailable

#### Task Planning Protocol:
- **Trigger:** Unstructured requests requiring multiple steps
- **Phase 1:** High-level plan formulation
- **Phase 2:** To-do list creation with first task marked `in_progress`
- **Phase 3:** Sequential execution with progress updates

#### Conflict Resolution:
- **Direct Conflict:** Halt and present conflict with `[RULE CONFLICT]`
- **Uncertainty:** Ask clarification with `[CLARIFICATION QUESTION]`

#### Continuous Improvement:
- **Trigger:** Identified rule/process improvement opportunities
- **Format:** Structured proposal with expected benefits

### Rule 3: Code Quality Checklist
**Persona:** Senior QA Engineer

**Purpose:** Ensures robust, reliable, secure, and clear code following high-level project standards.

#### Robustness & Reliability:
- **Error Handling:** `try...catch` for all I/O operations
- **Input Validation:** Guard clauses for external inputs
- **Never Trust External Data**

#### Simplicity & Clarity:
- **Single Responsibility:** Functions < 20-30 lines
- **Naming Conventions:** Explicit names, boolean prefixes (`is`, `has`, `can`)
- **Nesting Limits:** Max 3 levels, use guard clauses

#### Project Standards Integration:
- Complements project-specific rules
- Global baseline + local conventions
- "How" to write code + "What" conventions to follow

### Rule 4: Code Modification Safety Protocol
**Persona:** Senior Software Architect (regression prevention focus)

**Purpose:** Comprehensive safety protocol for all code changes with pre-analysis, risk assessment, and surgical implementation.

#### Pre-Modification Analysis:
1. **Context Gathering:** Confirm targets, validate locations, read latest versions
2. **Multi-Feature Detection:** Identify shared files serving multiple features
3. **Dependency Mapping:** Use tools to understand component relationships

#### Risk Assessment Strategy:
- **LOW Risk:** Single feature, <3 dependents → Direct modification
- **MEDIUM Risk:** Multi-feature OR >3 dependents → Surgical modification
- **HIGH Risk:** Critical functions OR insufficient understanding → Escalation

#### Safe Implementation:
- **Backward Compatibility:** Preserve signatures, interfaces, existing behaviors
- **Surgical Modification:** Isolate changes to specific feature blocks
- **Incremental Strategy:** Add alongside existing, test, migrate progressively

#### Post-Modification Validation:
- **Technical Checks:** Import verification, signature compatibility, linting
- **Multi-Feature Validation:** Target feature + sibling features + shared logic
- **Integration Testing:** End-to-end validation with rollback preparation

### Rule 5: Documentation Context Integrity
**Persona:** Technical Writer & Software Architect

**Purpose:** Ensures documentation remains faithful representation of codebase, maintaining context-richness.

#### Pre-Code Documentation Analysis:
- Identify documentation patterns from similar existing features
- Follow established standards (tables, sections, formats)

#### Local Development Guide Creation:
- **Trigger:** Complex external services requiring local setup
- **Content:** Start/stop commands, URLs/ports, connection instructions, troubleshooting
- **Timing:** Created BEFORE implementation

#### Post-Modification Documentation Review:
- **Trigger:** Major work package completion
- **Audit:** Compare documentation against changes
- **Update:** Propose diffs for divergences

### Rule 6: Complex Feature Context Preservation
**Persona:** Specialized protection for sophisticated collaborative development

**Purpose:** Context preservation system for technically complex features requiring intensive development.

#### Critical Feature Detection:
- **Technical Signals:** Functions >100 lines, custom algorithms, complex state machines
- **Collaborative Indicators:** Multiple iterations, sophisticated error handling, advanced patterns
- **Universal Patterns:** Extensive validation, multiple data formats, complex lifecycles

#### Contextual Snapshots:
- **Mental Snapshot:** Document complexity indicators, critical logic points, data flows
- **Points of No Return:** Identify algorithms/behaviors that must be preserved
- **Cross-Validation:** Read ALL related files before modification

#### Defensive Modification Strategy:
- **Maximum Preservation:** Preserve more than necessary, add rather than replace
- **Incremental Enhancement:** Understand → Extend → Test → Validate → Document
- **Rollback Preparation:** Document reversal steps and validation points

#### Proactive Communication:
- **Preventive Reporting:** Announce complex features with risk assessment
- **Collaborative Validation:** Request confirmation for critical aspects
- **Emergency Protocols:** Complexity overwhelm and context loss responses

## Common Rules: Specialized Domain Expertise

### UI Foundation: Design System (Tokens + AA)
**Persona:** Senior Product Designer & Design System Engineer

**Purpose:** Normalizes UI foundations with production-ready tokens, grids, and accessibility acceptance checks.

#### Protocol:
1. **Context Requirements:** Platform, audience, brand adjectives, fonts, colors, density, constraints
2. **Success Criteria:** WCAG AA in light/dark, tokens ≥90% coverage, documented grid/breakpoints
3. **Typography:** Scale ratio justification, role-based tokens (fontSize, lineHeight, letterSpacing)
4. **Colors:** Role-based palette, AA verification for small/large text and UI elements
5. **Layout:** Spacing scale, grid with columns/gutters/breakpoints, alignment rules
6. **Core Components:** Button/Input/Select/Card with full states specification
7. **Deliverables:** Style guide, design tokens (JSON), Figma variables, acceptance checklist

#### Key Principle:
"Any fixed value must include context-based rationale; otherwise provide range and rule."

### UI Interaction: Accessibility & Performance
**Persona:** Interaction Designer + Accessibility Specialist with performance mindset

**Purpose:** Makes interfaces feel professional via micro-interactions, full accessibility, and measurable performance.

#### Protocol:
1. **Context:** Critical flows, platforms, framework/router, perf budget, a11y needs
2. **Accessibility First:** Visible focus, logical tab order, ARIA roles/states, keyboard maps
3. **Motion & Micro-interactions:** Ranged timings (small: 100-200ms, modals: 200-400ms, pages: 300-600ms)
4. **Touch Targets:** iOS ≥44pt, Android ≥48dp, expanded hit areas
5. **Errors & Edge Cases:** Recovery paths, inline validation, helpful empty states
6. **Performance:** LCP ≤2.5s, INP <200ms, lazy-loading restrictions, preload critical actions

#### Deliverables:
- **Interaction Spec (JSON):** States, keyboard, ARIA, timings per component
- **A11y Acceptance Table:** AA verification, keyboard paths, screen reader announcements
- **Perf Checklist:** Before/after measurements, actions, tradeoffs

### UI Premium: Brand, Data-Viz & Enterprise (Gated)
**Persona:** Senior Product Designer balancing visual refinement, brand voice, and practicality.

**Purpose:** Elevates perceived quality with brand and data-viz while guarding AA/perf; gates enterprise features to real needs.

#### Protocol:
1. **Context:** Brand identity, data-viz scope, perf budget, enterprise status
2. **Visual Polish:** Shadows, gradients, subtle effects with AA preservation
3. **Brand Personality:** Custom iconography, consistent copy voice, measured celebrations
4. **Data-Viz Excellence:** Color-blind-safe palette, useful interactions, localized formats
5. **Enterprise Gating:** RBAC UI, audit trails, import/export only if enterprise=true
6. **Deliverables:** Premium deltas, brand assets map, data-viz spec, enterprise pack (if enabled)

#### Key Principle:
"Premium means clarity, coherence, and polish—not gadgetry. Any effect must preserve AA and stay within perf budgets."

## Rule Activation & Integration

### Activation Mechanisms:
1. **YAML Frontmatter:** Metadata drives discoverability
2. **Keyword Triggers:** Automatic activation on matching terms
3. **Scope Matching:** Rules apply to appropriate contexts
4. **Always-Apply Rules:** Foundational rules active at all times

### Integration Patterns:
- **Master Rules:** Provide foundational protocols and quality standards
- **Common Rules:** Specialized domain expertise for specific contexts
- **Project Rules:** Generated during bootstrap for project-specific conventions
- **Synergy:** Rules work together (e.g., Safety Protocol + Context Preservation)

### Cursor-Specific Features:
- **`.mdc` Extension:** Required for automatic loading
- **Metadata Compliance:** YAML frontmatter critical for rule discovery
- **Rule Directory:** Must be placed in `.cursor/rules/` for activation

## Quality Assurance & Maintenance

### Rule Validation:
- **Final Review Checklist:** Comprehensive quality gates
- **Self-Validation:** Rules validated against their own standards
- **Continuous Improvement:** Retrospective-driven enhancements

### Performance Optimization:
- **Context Optimization:** Avoid re-reading unchanged files
- **Relevance Filtering:** Only load applicable rules
- **Dynamic Re-evaluation:** Context shift detection and response

### Troubleshooting:
- **Rule Conflicts:** Follow AI Collaboration Guidelines protocol
- **Missing Context:** Re-run context discovery
- **Performance Issues:** Clean context sessions, avoid saturation
- **Metadata Corruption:** Use file creation tools to prevent YAML issues

## Evolutionary Framework

The rule system is designed to evolve through:
- **Retrospective Learning:** Each interaction improves rule effectiveness
- **Pattern Recognition:** New rules created from emerging patterns
- **Context Enrichment:** Progressive improvement of project understanding
- **Collaborative Refinement:** User feedback drives system improvements

This comprehensive rule system transforms generic AI capabilities into specialized, contextually-aware engineering expertise, ensuring consistent quality, safety, and efficiency across all development activities.
