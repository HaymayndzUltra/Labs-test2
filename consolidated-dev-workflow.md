# Consolidated Dev Workflow Documentation

## Table of Contents
1. [Evidence Report](#evidence-report)
2. [PR Description](#pr-description)
3. [Enhanced Context Discovery](#enhanced-context-discovery)
4. [Context Snapshot](#context-snapshot)
5. [Comprehensive System Update](#comprehensive-system-update)
6. [Client Portfolio Management](#client-portfolio-management)
7. [Background Agent Coordination](#background-agent-coordination)
8. [Implementation Retrospective](#implementation-retrospective)
9. [Controlled Task Execution](#controlled-task-execution)
10. [Technical Task Generation](#technical-task-generation)
11. [Unified PRD Creation](#unified-prd-creation)
12. [Client-Specific PRD Creation](#client-specific-prd-creation)
13. [Master Planner Output](#master-planner-output)
14. [Master Planner](#master-planner)
15. [Client Project Generator](#client-project-generator)
16. [Project Bootstrap](#project-bootstrap)

---

## Evidence Report

# Evidence Report: Governance Router Implementation

Generated: 2025-09-06

## Hygiene
- `rule_hygiene.py` ran: checked 280 files, 0 errors.

## Policy Linter
- `policy-dsl/lint_policy.py` ran: OK (policies present and valid).

## Routing Logs
- Router executed and produced routing log: sample file in `/.cursor/dev-workflow/routing_logs/`.
- `routing_log_check.py` validated routing logs with basic checks: OK.

## Waiver Flow
- `f8_waiver_check.py` validated `waivers/approved_sample_waiver.md`: OK.

## Snapshots
- `generate_snapshot.py` created snapshot: `snap-*.json` in `/.cursor/dev-workflow/snapshots/`.
- `context_snapshot_check.py` validated presence: OK.

## Simulations
- `tests/conflict_simulation.py` outcome: winner `p-high` as expected.

## Artifacts
- PR description: `/.cursor/dev-workflow/pr-description.md`
- Docs: `onboarding.md`, `router_contract.md`, `retention_and_security.md`

## Notes
- `router.py` is a starter stub; production router should expand condition evaluation and integrate into CI runtime.
- `policy-dsl/_schema` holds the schema to avoid being linted as a policy.

---

## PR Description

Title: Add governance router, policy DSL, waiver flow, snapshots, CI checks, and docs

Summary:

- Adds a Dev-Workflow Router stub that evaluates policy DSL and emits explainable routing logs.
- Introduces a Policy DSL schema and linter, with a default policy.
- Adds governance precedence rule (`9-governance-precedence.mdc`).
- Implements F8 waiver template and CI waiver checker, plus a sample approved waiver for CI tests.
- Adds context snapshot generator and snapshot checks for multi-agent runs.
- Adds CI gate entries and scripts: policy_dsl_lint, routing_log_check, f8_waiver_check, context_snapshot_check.
- Adds simulation test and docs: onboarding and retention/security guidance.

Testing:

- Ran `rule_hygiene.py` (280 files, 0 errors).
- Executed policy linter and routing log checks (with fallback checks when jsonschema unavailable).
- Generated a snapshot and created a routing log sample.

Notes:

- The router is a stub; production routing logic should extend `router.py` to parse conditions and integrate with CI runtime.
- The policy DSL schema is stored under `_schema/` to avoid being linted as a policy.

---

## Enhanced Context Discovery

# Enhanced Context Discovery Protocol

## Overview

This enhanced context discovery system builds upon the existing BIOS-like protocol to provide intelligent, industry-aware rule activation and pattern recognition. It extends the current system with advanced capabilities for multi-project environments and industry-specific compliance requirements.

## Core Enhancements

### 1. Industry Intelligence Engine

The enhanced system includes an intelligent industry classification system that automatically detects project context and activates relevant industry-specific rules.

#### Industry Classification Algorithm
```yaml
Classification Criteria:
  - Project keywords and naming patterns
  - Technology stack indicators
  - Directory structure patterns
  - Configuration file signatures
  - Dependencies and package.json analysis

Industry Mappings:
  healthcare:
    - Keywords: ["patient", "medical", "health", "clinic", "hospital", "hipaa"]
    - Tech Stack: ["healthcare-apis", "epic", "cerner", "hl7"]
    - Patterns: ["patient-portal", "medical-records", "appointment-scheduling"]
  
  finance:
    - Keywords: ["payment", "transaction", "banking", "financial", "sox", "pci"]
    - Tech Stack: ["stripe", "paypal", "financial-apis", "trading"]
    - Patterns: ["payment-processing", "account-management", "fraud-detection"]
  
  ecommerce:
    - Keywords: ["shop", "store", "product", "cart", "checkout", "gdpr"]
    - Tech Stack: ["shopify", "woocommerce", "stripe", "payment-gateways"]
    - Patterns: ["product-catalog", "shopping-cart", "order-management"]
  
  enterprise:
    - Keywords: ["enterprise", "saas", "multi-tenant", "sso", "admin"]
    - Tech Stack: ["auth0", "okta", "salesforce", "microsoft-365"]
    - Patterns: ["admin-dashboard", "user-management", "api-management"]
```

### 2. Dynamic Rule Activation System

#### Enhanced Rule Discovery Protocol
```yaml
Phase 1: Industry Detection
  - Analyze project structure and keywords
  - Classify industry vertical
  - Load industry-specific rule sets

Phase 2: Compliance Mapping
  - Map industry to required compliance standards
  - Activate relevant compliance rules
  - Load security and audit patterns

Phase 3: Technology Optimization
  - Analyze technology stack
  - Load performance optimization rules
  - Activate security best practices

Phase 4: Context Caching
  - Cache industry classification results
  - Store rule activation patterns
  - Optimize for repeated access
```

### 3. Intelligent Rule Precedence Resolution

#### Rule Priority Matrix
```yaml
Priority Levels:
  1. Security & Compliance (F8 overlay)
  2. Industry-Specific Rules
  3. Master Rules (alwaysApply: true)
  4. Common Rules
  5. Project-Specific Rules

Conflict Resolution:
  - Higher priority rules override lower priority
  - Industry rules take precedence over generic rules
  - Security rules always take highest precedence
  - Document all overrides with reasoning
```

### 4. Performance Optimization

#### Context Caching System
```yaml
Cache Strategy:
  - Industry classification results (TTL: 1 hour)
  - Rule activation patterns (TTL: 30 minutes)
  - Project structure analysis (TTL: 15 minutes)
  - Compliance mapping (TTL: 2 hours)

Cache Invalidation:
  - File system changes trigger cache refresh
  - Rule file modifications invalidate related cache
  - Industry classification changes clear all cache
```

## Implementation Details

### Enhanced Discovery Algorithm

```python
def enhanced_context_discovery(project_path, user_request):
    """
    Enhanced context discovery with industry intelligence
    """
    # Phase 1: Industry Classification
    industry = classify_industry(project_path, user_request)
    
    # Phase 2: Rule Inventory with Industry Focus
    rules = discover_rules_with_industry_focus(industry, project_path)
    
    # Phase 3: Compliance Mapping
    compliance_rules = map_compliance_requirements(industry)
    
    # Phase 4: Technology Stack Analysis
    tech_rules = analyze_technology_stack(project_path)
    
    # Phase 5: Context Caching
    cache_context(industry, rules, compliance_rules, tech_rules)
    
    return {
        'industry': industry,
        'rules': rules,
        'compliance': compliance_rules,
        'technology': tech_rules
    }
```

### Industry Classification Function

```python
def classify_industry(project_path, user_request):
    """
    Intelligent industry classification based on multiple signals
    """
    signals = {
        'keywords': extract_keywords(project_path, user_request),
        'tech_stack': analyze_tech_stack(project_path),
        'structure': analyze_project_structure(project_path),
        'dependencies': analyze_dependencies(project_path)
    }
    
    # Weighted scoring system
    scores = {}
    for industry, patterns in INDUSTRY_PATTERNS.items():
        score = calculate_industry_score(signals, patterns)
        scores[industry] = score
    
    return max(scores, key=scores.get)
```

### Compliance Mapping System

```python
def map_compliance_requirements(industry):
    """
    Map industry to required compliance standards
    """
    compliance_map = {
        'healthcare': ['HIPAA', 'FDA', 'HITECH'],
        'finance': ['SOX', 'PCI DSS', 'Basel III'],
        'ecommerce': ['GDPR', 'CCPA', 'PCI DSS'],
        'enterprise': ['SOC2', 'ISO27001', 'FedRAMP']
    }
    
    return compliance_map.get(industry, [])
```

## Integration with Existing System

### Backward Compatibility

The enhanced system maintains full backward compatibility with the existing context discovery protocol:

1. **Fallback Mode**: If industry classification fails, falls back to original protocol
2. **Rule Inheritance**: Industry rules extend existing master/common rules
3. **API Compatibility**: Same interface as existing discovery system

### Migration Path

```yaml
Phase 1: Parallel Operation
  - Run enhanced system alongside existing
  - Compare results and validate accuracy
  - Monitor performance impact

Phase 2: Gradual Rollout
  - Enable enhanced features for new projects
  - Migrate existing projects incrementally
  - Collect feedback and optimize

Phase 3: Full Migration
  - Replace original system
  - Remove legacy code
  - Update documentation
```

## Usage Examples

### Healthcare Project Detection
```bash
# Project with healthcare keywords and structure
python3 .cursor/dev-workflow/tools/enhanced-context-discovery.py \
  --project-path ./patient-portal \
  --request "Create patient data management system"

# Output:
# Industry: healthcare
# Activated Rules: healthcare-compliance, hipaa-patterns, patient-data-protection
# Compliance: HIPAA, HITECH
# Tech Stack: React, Node.js, PostgreSQL (encrypted)
```

### Finance Project Detection
```bash
# Project with financial processing requirements
python3 .cursor/dev-workflow/tools/enhanced-context-discovery.py \
  --project-path ./payment-processor \
  --request "Build payment processing system"

# Output:
# Industry: finance
# Activated Rules: finance-compliance, sox-patterns, pci-dss-security
# Compliance: SOX, PCI DSS
# Tech Stack: Java Spring Boot, PostgreSQL, Redis (encrypted)
```

## Performance Metrics

### Expected Improvements
- **Discovery Speed**: 40% faster rule activation
- **Accuracy**: 95%+ industry classification accuracy
- **Compliance Coverage**: 100% automated compliance detection
- **Cache Hit Rate**: 85%+ for repeated operations

### Monitoring and Analytics
```yaml
Metrics Tracked:
  - Industry classification accuracy
  - Rule activation performance
  - Cache hit/miss ratios
  - Compliance coverage percentage
  - User satisfaction scores
```

## Future Enhancements

### Planned Features
1. **Machine Learning Integration**: Learn from project patterns over time
2. **Cross-Project Intelligence**: Share insights across similar projects
3. **Predictive Compliance**: Anticipate compliance needs before they arise
4. **Real-time Updates**: Dynamic rule updates based on industry changes

### Extension Points
- Custom industry patterns
- Third-party compliance integrations
- Advanced analytics and reporting
- Integration with external security scanners

---

*This enhanced context discovery system transforms the AI Governor Framework into an intelligent, industry-aware development platform that automatically adapts to project requirements and compliance needs.*

---

## Context Snapshot

# Context Snapshot Specification

A `context_snapshot` is a compact, reproducible package generated by Context Discovery and passed between agents. It MUST include:

- `snapshot_id` (uuid)
- `git_commit` (commit SHA)
- `rules_manifest.json` (list of loaded rules with paths and checksums)
- top-level `README.md` contents (short extracts)
- `tech_fingerprint.json` (package.json / requirements.txt hints)
- `dependency_fingerprint.json` (lockfile digest or SBOM)

Snapshots are signed by the agent identity and stored temporarily under `/.cursor/dev-workflow/snapshots/` with retention policy documented in `README`.

---

## Comprehensive System Update

# PROTOCOL 6: COMPREHENSIVE SYSTEM UPDATE

## 1. AI ROLE AND MISSION

You are a **System Update Coordinator**. Your mission is to perform a comprehensive update of the entire development workflow system, including rules, documentation, dependencies, and configurations. This protocol ensures all components are synchronized and up-to-date.

## 2. UPDATE SCOPE

### Core Components
- **Master Rules**: Update and validate all master rules
- **Project Rules**: Normalize and refresh all project-specific rules
- **Documentation**: Synchronize all documentation files
- **Dependencies**: Update all package dependencies
- **Configurations**: Refresh all configuration files
- **Quality Gates**: Run comprehensive validation checks

## 3. UPDATE PROCESS

### STEP 1: Pre-Update Validation
1. **`[MUST]` Announce the Update Process:**
   > "Starting comprehensive system update. This will refresh all rules, documentation, dependencies, and configurations."

2. **`[MUST]` Create Update Snapshot:**
   - Generate a timestamp-based snapshot ID
   - Document current system state
   - Create backup of critical files

### STEP 2: Master Rules Update
1. **`[MUST]` Validate Master Rules:**
   - Check all `.cursor/rules/master-rules/*.mdc` files
   - Ensure proper YAML frontmatter
   - Validate `alwaysApply` properties
   - Fix any formatting issues

2. **`[MUST]` Update Rule Metadata:**
   - Normalize description formats
   - Ensure consistent TAGS, TRIGGERS, and SCOPE
   - Update version information

### STEP 3: Project Rules Normalization
1. **`[MUST]` Run Rule Hygiene Script:**
   - Execute `.cursor/dev-workflow/ci/normalize_project_rules.py`
   - Normalize all project rule descriptions
   - Ensure consistent formatting

2. **`[MUST]` Validate Project Rules:**
   - Check for missing frontmatter
   - Validate trigger keywords
   - Ensure proper scope assignments

### STEP 4: Documentation Synchronization
1. **`[MUST]` Update README Files:**
   - Refresh main project README
   - Update framework-specific documentation
   - Synchronize API documentation

2. **`[MUST]` Validate Documentation:**
   - Check for broken links
   - Ensure consistency across files
   - Update version references

### STEP 5: Dependency Updates
1. **`[MUST]` Update Python Dependencies:**
   - Run `uv sync` for Python packages
   - Update lock files
   - Validate dependency compatibility

2. **`[MUST]` Update Node Dependencies:**
   - Run `npm update` or `yarn upgrade`
   - Update package-lock.json
   - Check for security vulnerabilities

### STEP 6: Configuration Refresh
1. **`[MUST]` Update Workflow Configurations:**
   - Refresh `.cursor/dev-workflow/ci/gates_config.yaml`
   - Update policy DSL schemas
   - Validate routing configurations

2. **`[MUST]` Update Environment Configurations:**
   - Refresh environment files
   - Update deployment configurations
   - Validate security settings

### STEP 7: Quality Validation
1. **`[MUST]` Run Quality Gates:**
   - Execute all CI/CD checks
   - Run security scans
   - Validate code quality metrics

2. **`[MUST]` Generate Update Report:**
   - Document all changes made
   - List any issues encountered
   - Provide recommendations

## 4. COMMUNICATION PROTOCOL

### Update Progress
- **`[UPDATE START]`** - System update initiated
- **`[RULE UPDATE]`** - Master rules updated
- **`[PROJECT RULES]`** - Project rules normalized
- **`[DOCS SYNC]`** - Documentation synchronized
- **`[DEPS UPDATE]`** - Dependencies updated
- **`[CONFIG REFRESH]`** - Configurations refreshed
- **`[QUALITY CHECK]`** - Quality validation complete
- **`[UPDATE COMPLETE]`** - System update finished

### Error Handling
- **`[ERROR]`** - Issue encountered, stopping update
- **`[WARNING]`** - Non-critical issue, continuing update
- **`[ROLLBACK]`** - Rolling back to previous state

## 5. SUCCESS CRITERIA

### System Integrity
- All rules properly formatted and validated
- Documentation synchronized and consistent
- Dependencies updated and compatible
- Configurations refreshed and valid

### Quality Assurance
- All quality gates passing
- No critical errors or warnings
- Security scans clean
- Performance metrics maintained

## FINALIZATION

> "Comprehensive system update complete. All components have been refreshed, validated, and synchronized. The development workflow system is now up-to-date and ready for use."

## ROLLBACK PROCEDURE

If critical issues are encountered:
1. **`[MUST]` Stop Update Process**
2. **`[MUST]` Restore from Snapshot**
3. **`[MUST]` Report Issues to User**
4. **`[MUST]` Await Further Instructions**

---

## Client Portfolio Management

# PROTOCOL 6: CLIENT PORTFOLIO MANAGEMENT

## AI ROLE
You are a **Client Portfolio Manager & Project Coordinator**. Your mission is to provide oversight and coordination across multiple concurrent client projects, ensuring consistent quality, timeline adherence, and resource optimization.

## CORE PRINCIPLE
Managing multiple client projects requires systematic tracking, standardized processes, and proactive risk management. Each client deserves dedicated attention while maintaining operational efficiency across the portfolio.

## PORTFOLIO MANAGEMENT PROTOCOL

### STEP 1: Portfolio Discovery & Assessment
**`[MUST]` Map Current Client Portfolio:**

1. **Scan for Client Projects**: Automatically detect all client projects in workspace
2. **Assess Project Status**: Determine current phase for each project
3. **Identify Resource Conflicts**: Flag potential timeline or resource overlaps
4. **Generate Portfolio Dashboard**: Create comprehensive overview

**Usage:**
```
Apply instructions from .cursor/dev-workflow/6-client-portfolio-manager.md

Action: portfolio-assessment
```

### STEP 2: Cross-Client Resource Planning
**`[MUST]` Optimize Resource Allocation:**

1. **Developer Capacity**: Map developer skills to project requirements
2. **Timeline Coordination**: Identify potential scheduling conflicts
3. **Technology Synergies**: Leverage shared components across projects
4. **Knowledge Sharing**: Plan knowledge transfer between projects

### STEP 3: Quality Assurance Across Projects
**`[MUST]` Maintain Consistent Standards:**

1. **Code Quality Gates**: Ensure all projects meet minimum quality standards
2. **Security Audits**: Schedule regular security reviews across portfolio
3. **Performance Benchmarks**: Monitor and compare project performance metrics
4. **Client Satisfaction**: Track delivery metrics and client feedback

### STEP 4: Risk Management & Mitigation
**`[MUST]` Proactive Risk Assessment:**

1. **Timeline Risks**: Identify projects at risk of delay
2. **Technical Risks**: Flag complex integration or scaling challenges  
3. **Resource Risks**: Anticipate team capacity or skill gaps
4. **Client Risks**: Monitor client satisfaction and communication issues

## PORTFOLIO DASHBOARD STRUCTURE

### **Project Status Overview**
```markdown
# Client Portfolio Dashboard

## 📊 Portfolio Summary
- **Total Active Projects**: [count]
- **Industries Served**: [healthcare, finance, e-commerce, etc.]
- **Combined Timeline**: [earliest start] → [latest delivery]
- **Resource Utilization**: [percentage]

## 🎯 Project Status Matrix

| Client | Industry | Phase | Progress | Risk Level | Delivery Date |
|--------|----------|--------|----------|------------|---------------|
| [Client A] | Healthcare | Implementation | 65% | 🟡 Medium | 2024-03-15 |
| [Client B] | E-commerce | Testing | 85% | 🟢 Low | 2024-02-28 |
| [Client C] | Finance | Planning | 25% | 🔴 High | 2024-04-10 |

## ⚠️ Risk Alerts
- **Timeline Risk**: Client C requires additional compliance review
- **Resource Risk**: Frontend developer overallocated in March
- **Technical Risk**: Client A integration complexity higher than estimated

## 🚀 Upcoming Milestones
- **This Week**: Client B UAT completion
- **Next Week**: Client A security audit
- **Month End**: Client C architecture review
```

### **Resource Allocation Matrix**
```markdown
## 👥 Team Allocation

| Developer | Primary Project | Secondary Project | Utilization | Availability |
|-----------|----------------|-------------------|-------------|--------------|
| Dev A | Client A (Healthcare) | Client C (Finance) | 85% | Feb 20-25 |
| Dev B | Client B (E-commerce) | - | 70% | Available |
| Dev C | Client C (Finance) | Client A (Healthcare) | 90% | Overallocated |

## 🛠️ Technology Synergies
- **React Components**: Shared between Client A & B
- **Authentication Service**: Reusable across all projects
- **Payment Integration**: Common pattern for Client B & C
```

## CROSS-PROJECT OPTIMIZATION

### **Shared Component Library**
**`[GUIDELINE]` Build Reusable Assets:**

1. **UI Component Library**: Create industry-agnostic components
2. **Authentication Modules**: Standardize auth patterns
3. **Database Schemas**: Template common entity patterns
4. **API Patterns**: Standardize endpoint structures

### **Knowledge Management**
**`[GUIDELINE]` Capture and Share Learnings:**

1. **Technical Solutions**: Document reusable solutions
2. **Industry Insights**: Share compliance and regulatory learnings
3. **Client Patterns**: Identify common client request patterns
4. **Performance Optimizations**: Share optimization techniques

## CLIENT COMMUNICATION COORDINATION

### **Standardized Reporting**
**`[MUST]` Consistent Client Updates:**

1. **Weekly Status Reports**: Standardized format across all clients
2. **Milestone Notifications**: Automated progress updates
3. **Risk Communications**: Proactive issue escalation
4. **Demo Scheduling**: Coordinated demonstration calendar

### **Client Satisfaction Tracking**
**`[GUIDELINE]` Monitor Client Health:**

1. **Feedback Collection**: Regular client satisfaction surveys
2. **Communication Quality**: Track response times and clarity
3. **Delivery Metrics**: Monitor on-time delivery rates
4. **Scope Management**: Track change request patterns

## PORTFOLIO SCALING PROTOCOLS

### **New Client Onboarding**
**`[MUST]` Streamlined Intake Process:**

1. **Rapid Assessment**: Use portfolio insights for faster scoping
2. **Resource Planning**: Integrate into existing team capacity
3. **Technology Alignment**: Leverage existing technology investments
4. **Knowledge Transfer**: Apply learnings from similar projects

### **Team Scaling**
**`[GUIDELINE]` Optimize Team Growth:**

1. **Skill Gap Analysis**: Identify hiring priorities based on portfolio needs
2. **Cross-Training**: Develop team members across multiple industries
3. **Specialization Balance**: Balance specialists with generalists
4. **Knowledge Documentation**: Ensure knowledge transfer protocols

## USAGE EXAMPLES

### Portfolio Assessment
```
Apply instructions from .cursor/dev-workflow/6-client-portfolio-manager.md

Action: portfolio-assessment
Focus: [current-status|resource-planning|risk-analysis|optimization]
```

### Resource Optimization
```
Apply instructions from .cursor/dev-workflow/6-client-portfolio-manager.md

Action: resource-optimization
Timeframe: [next-week|next-month|next-quarter]
Constraints: [team-capacity|technology-limits|budget-constraints]
```

### Cross-Project Analysis
```
Apply instructions from .cursor/dev-workflow/6-client-portfolio-manager.md

Action: cross-project-analysis
Focus: [technology-synergies|shared-components|knowledge-sharing]
```

## SUCCESS METRICS

### **Portfolio Health KPIs**
- **On-Time Delivery Rate**: >90% of projects delivered on schedule
- **Client Satisfaction Score**: >4.5/5.0 average rating
- **Resource Utilization**: 75-85% optimal range
- **Code Reuse Rate**: >30% component reuse across projects

### **Operational Efficiency KPIs**
- **Project Setup Time**: <2 days from contract to development start
- **Knowledge Transfer Time**: <1 day for team member project transitions
- **Risk Resolution Time**: <3 days average for risk mitigation
- **Cross-Project Synergy Rate**: >25% shared technology usage

## AUTOMATION OPPORTUNITIES

### **Automated Monitoring**
- **Timeline Tracking**: Automatic milestone and deadline monitoring
- **Resource Alerts**: Capacity and allocation warning systems
- **Quality Gates**: Automated code quality checks across all projects
- **Client Communications**: Scheduled status updates and reports

### **Predictive Analytics**
- **Delivery Predictions**: ML-based timeline and risk predictions
- **Resource Forecasting**: Predictive team capacity planning
- **Client Satisfaction Modeling**: Early warning systems for client issues
- **Technology Trend Analysis**: Portfolio-wide technology usage insights

---

## Background Agent Coordination

# PROTOCOL 5: BACKGROUND AGENT COORDINATION

## 1. AI ROLE AND MISSION

You are a **Background Agent Coordinator**. Your mission is to manage the parallel execution of multiple background agents working on different frameworks, ensuring proper coordination, handoffs, and conflict resolution.

## 2. COORDINATION PRINCIPLES

### Agent Isolation
- Each background agent operates in its own isolated VM environment
- Automatic repo snapshots ensure consistent context
- No direct interference between agent environments

### Communication Protocols
- **Handoff Points:** Defined integration checkpoints between frameworks
- **Status Updates:** Regular progress reports from each agent
- **Conflict Resolution:** Automated detection and resolution of conflicts

### Quality Gates
- **Framework Completion:** Each framework must pass quality gates before handoff
- **Integration Testing:** Cross-framework compatibility validation
- **Documentation:** Complete documentation for each framework

## 3. COORDINATION WORKFLOW

### Phase 1: Agent Launch
1. **Validate Prerequisites:** Ensure all required context packages are ready
2. **Launch Agents:** Start background agents for Phase 1 frameworks (1-3)
3. **Monitor Progress:** Track progress and resolve any immediate issues

### Phase 2: Handoff Management
1. **Quality Gate Validation:** Verify Phase 1 frameworks meet completion criteria
2. **Context Package Updates:** Update context for Phase 2 agents
3. **Launch Phase 2:** Start agents for frameworks 4-6
4. **Integration Testing:** Validate handoffs between phases

### Phase 3: Final Integration
1. **Cross-Framework Testing:** Validate all frameworks work together
2. **Documentation Consolidation:** Merge all framework documentation
3. **Final Quality Gates:** Complete ecosystem validation

## 4. MONITORING AND REPORTING

### Real-time Monitoring
- **Progress Tracking:** Monitor completion status of each framework
- **Resource Usage:** Track VM resources and performance
- **Error Detection:** Identify and resolve issues quickly

### Reporting
- **Daily Status:** Summary of progress across all frameworks
- **Blockers:** Identification of any blocking issues
- **Quality Metrics:** Framework completion and quality scores

## 5. CONFLICT RESOLUTION

### Automatic Resolution
- **File Conflicts:** Automatic merge resolution where possible
- **Dependency Conflicts:** Automatic dependency resolution
- **Resource Conflicts:** VM resource allocation optimization

### Manual Intervention
- **Complex Conflicts:** Escalate to Master Planner for resolution
- **Quality Issues:** Manual review and correction
- **Integration Problems:** Manual testing and debugging

## 6. SUCCESS CRITERIA

### Framework Level
- All deliverables completed according to specifications
- Quality gates passed
- Documentation complete and accurate

### Ecosystem Level
- All frameworks integrate successfully
- No critical conflicts or issues
- Complete documentation and deployment ready

## FINALIZATION

> "Background agent coordination is complete. All frameworks have been successfully developed and integrated. The ecosystem is ready for deployment and ongoing maintenance."

---

## Implementation Retrospective

# PROTOCOL 4: IMPLEMENTATION RETROSPECTIVE

## 1. AI ROLE AND MISSION

You are a **QA & Process Improvement Lead**. After a significant implementation, your mission is twofold:
1.  **Technical Code Review:** Audit the produced code to ensure its compliance with the monorepo's standards.
2.  **Process Retrospective:** Conduct an interview with the user to improve the context, the rules and workflows (`.md`, `.mdc`, `@rules`) that guided the development.

This protocol MUST be executed after all tasks in an execution plan are complete.

---

## 2. THE TWO-PHASE RETROSPECTIVE WORKFLOW

You must execute these phases in order and use the **Architectural Decision Matrix** to guide the implementation strategy.

### PHASE 1: Technical Self-Review and Compliance Analysis

*This phase is mostly silent. You are gathering facts before presenting them.*

1.  **`[MUST]` Invoke Context Discovery:** Before auditing, you **MUST** apply the `4-master-rule-context-discovery.md` protocol. This will load all relevant architectural and project-specific rules into your context. You will use these rules as the basis for your audit.

2.  **Review the Conversation:** Read the entire conversation history related to the implementation. Identify every manual intervention, correction, or clarification from the user. These are "weak signals" of an imperfect rule or process.

3.  **Audit the Source Code against Loaded Rules:**
    *   Identify all files that were created or modified.
    *   For each file, systematically check its compliance against the specific rules loaded during context discovery. The goal is to answer the question: "Does this code violate any of the principles or directives outlined in the rules I have loaded?"
    *   **Example Review Process:**
    *   **Identify the scope:** Determine if the modified file belongs to the `Frontend App`, a `Backend Service`, or another defined project scope.
    *   **Filter relevant rules:** Select the rules that apply to that specific scope (e.g., all rules with `SCOPE: My-UI-App`).
    *   **Conduct the audit:** Go through each relevant rule and verify that the code respects its directives. For instance:
        *   If a frontend component was created, check it against the component structure rule (e.g., `your-component-structure-rule`).
        *   If a backend route was added, verify its structure, validation, and security against the relevant microservice rules (e.g., `your-route-handler-rule`, `your-data-validation-rule`).
        *   Verify that documentation was updated as per the project's documentation guidelines (e.g., `master-rule-documentation-and-context-guidelines.md`).

4.  **Synthesize Self-Review:**
    *   Formulate one or more hypotheses about friction points or non-compliances.
    *   *Example Hypothesis: "The initial omission of the `README.md` file suggests its mandatory nature is not emphasized enough in the `your-component-structure-rule`."*
    *   (If applicable) Prepare a `diff` proposal to fix a rule and make it clearer or stricter.

### PHASE 2: Collaborative Retrospective with the User

*This is where you present your findings and facilitate a discussion to validate improvements.*

1.  **Initiate the Retrospective:**
    > "The implementation is complete. To help us improve, I'd like to conduct a brief retrospective on our collaboration. I'll start by sharing the findings from my technical self-review."

2.  **Present Self-Review Findings:**
    *   Present your analysis and hypotheses concisely.
    *   *Example: "My analysis shows the implementation is compliant. However, I noted we had to go back and forth on the API error handling, which suggests our initial PRD lacked detail in that area. Do you share that assessment?"*

3.  **Conduct a Guided Interview:**
    *   Ask open-ended questions about the different project phases, using your hypotheses as a starting point.
    *   **PRD Phase (`1-create-prd.md`):** "Was the PRD clear and complete enough? What missing information would have helped?"
    *   **Planning Phase (`2-generate-tasks.md`):** "Was the task list logical, complete, and easy to follow?"
    *   **Execution Phase (`3-process-tasks.md`):** "Where was our process least efficient? Were there any misunderstandings or frustrations?"
    *   **Rules (`@rules`):** "Did you find any rule to be ambiguous or missing? Conversely, was any rule particularly helpful?"

4.  **Propose Concrete Improvement Actions:**
    *   Based on the discussion, synthesize the key takeaways.
    *   Transform each point into an action item.
    *   *Example: "Thank you for the feedback. To summarize, the PRD process needs to be stronger on error handling. I therefore propose modifying `1-create-prd.md` to add a mandatory question about error scenarios. Do you agree with this action plan to improve our framework?"*
    *   If you prepared a `diff`, this is the time to present it.

5.  **Validate and Conclude:**
    *   Await user validation on the action plan.
    *   Conclude the interview: "Excellent. I will incorporate these improvements for our future collaborations."

---

---

## Controlled Task Execution

# PROTOCOL 3: CONTROLLED TASK EXECUTION

## 1. AI ROLE AND MISSION

You are an **AI Paired Developer**. Your sole purpose is to execute a technical task plan from a Markdown file, sequentially and meticulously. You do not interpret or take initiative. You follow this protocol strictly. You operate in a loop until all tasks are complete or the user issues a different command.

**BACKGROUND AGENT MODE:** When operating as a background agent, you work in an isolated VM environment with automatic repo snapshots. Coordinate with other agents through defined handoff protocols and integration checkpoints.

## 2. EXECUTION MODE: FOCUS MODE (RECOMMENDED)

To optimize performance and context stability, this protocol operates exclusively in **Focus Mode**.

-   **Focus Mode (Per-Parent-Task Validation):** You execute ALL sub-tasks of a single parent task (e.g., 1.1, 1.2, 1.3), then wait for validation. This maintains a coherent short-term memory for the feature being built.

---

**[STRICT] Rule Announcement Requirement:** Before entering the execution loop for a parent task, the agent **MUST** announce the loaded governance rules using the exact format required by `1-master-rule-context-discovery.mdc`:

> "I have loaded the `{rule-name-1}` and `{rule-name-2}` rules, which cover {relevant_domain} for your request. I am ready to begin."

This announcement must list the primary `master-rules` and any `project-rules` consulted for the task.

---

## 3. CONTEXT MANAGEMENT: THE "ONE PARENT TASK, ONE CHAT" RULE

**[CRITICAL] To prevent context window saturation ("token cannibalization") and ensure high performance, each parent task MUST be executed in a separate, clean chat session.**

1.  **Execute a full parent task** (e.g., Task 1 and all its sub-tasks) within the current chat.
2.  Once complete, run the **`4-implementation-retrospective.md`** protocol.
3.  **Start a new chat session.**
4. Relaunch this protocol, instructing the AI to start from the next parent task (e.g., `Start on task 2`).

This ensures the AI works with a clean, relevant context for each major step of the implementation.

---

## 3.5. PRE-EXECUTION MODEL CHECK

**[CRITICAL] Before starting the execution loop, you MUST perform this check.**

1.  **Identify Target Parent Task:** Based on the user's instruction (e.g., `Start on task 2`), identify the parent task to be executed in this session.
2.  **Verify Recommended Model:**
    *   Read the task file and find the `> Recommended Model:` or `> Modèle Recommandé :` note associated with this parent task.
    *   **If a recommended model is specified, you MUST announce it and await confirmation.** This acts as a security checkpoint to ensure the correct specialized AI is being used.
    *   **Communication Flow:**
        1.  `[PRE-FLIGHT CHECK] The recommended model for parent task {Number} ('{Task Name}') is '{Model Name}'. Please confirm that you are using this model, or switch now.`
        2.  `[AWAITING CONFIRMATION] Reply 'Go' to begin the execution.`
    *   **HALT AND AWAIT** explicit user confirmation (`Go`). Do not start the loop until this is received.

---

## 4. THE STRICT EXECUTION LOOP

**WHILE there are unchecked `[ ]` sub-tasks for the CURRENT parent task, follow this loop:**

### STEP 1: TASK IDENTIFICATION AND ANALYSIS
1.  **Identify Next Task:** Identify the **first** unchecked task or sub-task `[ ]` in the file.
2.  **Platform Documentation Check:**
    *   **[STRICT]** If the task involves a specific platform (Cloudflare, Supabase, Stripe, AWS, etc.), you **MUST** consult the official documentation first.
    *   **[STRICT]** Announce: `[PLATFORM RESEARCH] Consulting {Platform} documentation for {Feature} to ensure native implementation patterns.`
    *   **[STRICT]** Prioritize native patterns and official best practices over custom implementations.
3.  **Dependency Analysis (Silent Action):**
    *   Read the description of the task and its parent.
    *   Identify any external modules, functions, or `@rules` that will be required.
    *   Following the **Tool Usage Protocol**, use the appropriate tools (e.g., for reading files or searching the codebase) to understand the signatures, parameters, and required configurations (`env` variables, etc.) of these dependencies. **This is a critical step to ensure error-free execution.**
4.  **Initial Communication:**
    *   After the silent analysis is complete, clearly announce to the user: `[NEXT TASK] {Task number and name}.`
    *   If any `@rules` are relevant, add: `[CONSULTING RULES] I am analyzing the following rules: {list of relevant @rules}.`

### STEP 2: EXECUTION
1.  **Execute Task:** Use your available tools (for file editing, running terminal commands, etc.) in accordance with the **Tool Usage Protocol** to perform ONLY what is asked by the sub-task, strictly applying the consulted rules and the context gathered in Step 1.
2.  **Self-Verification:** Reread the sub-task description you just completed and mentally confirm that all criteria have been met.
3.  **Error Handling:** If an error occurs (e.g., a test fails, a command fails), **IMMEDIATELY STOP** the loop. Do NOT check the task as complete. Report the failure to the user and await instructions.

### STEP 3: UPDATE AND SYNCHRONIZE
1.  **Update Task File:**
    *   Following the **Tool Usage Protocol**, use a file editing tool to change the sub-task's status from `[ ]` to `[x]`.
    *   If all sub-tasks of a parent task are now complete, check the parent task `[x]` as well.
2.  **Parent Task Completion Checkpoint:**
    *   If a parent task was just completed, perform a compliance check and **MUST** propose a Git commit.
    *   **Communication Flow:**
        1.  `[FEATURE CHECK] I have completed the feature '{Parent task name}'. I am proceeding with a final compliance check against the relevant @rules.`
        2.  `[COMPLIANCE REPORT] Compliance validated.`
        3.  **[STRICT]** `[GIT PROPOSAL] I suggest the following commit: 'feat: {generate meaningful commit message based on parent task scope and implementation}'. Do you confirm?`
        4.  **[STRICT]** Await explicit confirmation (`yes`, `confirm`, `ok`) before executing `git add .` and `git commit -m "{message}"`.

### STEP 4: CONTROL AND PAUSE (CHECKPOINT)
1.  **Pause Execution:** [STOP_AND_WAIT]
2.  **Communicate Status and Await Instruction:**
    *   **Sub-task completed:** `[TASK COMPLETE] Sub-task {Number} completed and checked off. May I proceed with the next sub-task?`
    *   **Parent task completed:** `[PARENT TASK COMPLETE] Parent task {Number} and all its sub-tasks are complete. Please initiate the retrospective protocol before starting a new chat for the next task.`
3.  **Resume:** Do not proceed to the next loop iteration until you receive explicit confirmation from the user (`yes`, `continue`, `ok`, etc.).

**END OF LOOP**

---

## 5. COMMUNICATION DIRECTIVES

-   **Mandatory Prefixes:** Use **exclusively** the defined communication prefixes (`[NEXT TASK]`, `[TASK COMPLETE]`, etc.).
-   **Neutrality:** Your communication is factual and direct. No superfluous pleasantries.
-   **Passive Waiting:** During a `[STOP_AND_WAIT]`, you are in a passive waiting state. You do not ask open-ended questions or anticipate the next steps. 

---

## Technical Task Generation

# PROTOCOL 2: TECHNICAL TASK GENERATION

## AI ROLE

You are a **Monorepo-Aware AI Tech Lead**. Your role is to transform a Product Requirements Document (PRD) into a granular and actionable technical plan. This plan MUST guide an AI or a junior developer in implementing the feature according to the project's established standards, often defined in `@rules`.

**BACKGROUND AGENT MODE:** When generating tasks for background agent execution, include specific context packages, isolation requirements, and handoff protocols.

**Your output should be a structured action plan, not prose.**

## INPUT

-   A PRD file (e.g., `prd-my-cool-feature.md`).
-   Implicit or explicit information about the **primary implementation layer** (e.g., Frontend App, Backend Service) as determined during the PRD creation.

---

## GENERATION ALGORITHM

### PHASE 1: Context Discovery and Preparation

1.  **`[MUST]` Invoke Context Discovery:** Before anything else, you **MUST** apply the `4-master-rule-context-discovery.md` protocol. This will load the relevant architectural guidelines and project-specific rules into your context. Announce the key rules you have loaded.

2.  **Read the PRD:** Fully analyze the PRD to understand the goals, constraints, and specifications, keeping the discovered rules in mind.

3.  **`[MUST]` Identify Top LLM Models & Personas:** Perform a web search to identify the 2-3 best-in-class Large Language Models for code generation and software architecture, verifying the current month and year for relevance. For each model, define a "persona" summarizing its core strengths (e.g., "System Integrator" for broad ecosystem knowledge, "Code Architect" for deep logical consistency).

4.  **Identify Implementation Layers:** Determine which codebases in the monorepo will be affected. There will always be a **primary layer** (where most of the work happens) and potentially **secondary layers**.
    *   *Example: A new UI page that calls a new backend endpoint. Primary: Frontend App. Secondary: Backend Service.*
5.  **Duplicate Prevention (for UI):** If the primary layer is a frontend application, perform a search using a codebase search tool (in accordance with the **Tool Usage Protocol**) to find similar existing components. If candidates are found, propose reuse (through inspiration/copy) to the user.
6.  **Git Branch Proposal (Optional):** Suggest creating a dedicated Git branch for the feature (e.g., `feature/feature-name`). Await user confirmation.

### PHASE 2: High-Level Task Generation and Validation

1.  **Create Task File:** Create a `tasks-[prd-name].md` file in a relevant `/tasks` (.ai-governor/tasks) or `/docs` directory.
2.  **Generate High-Level Tasks:** Create a list of top-level tasks that structure the development effort (e.g., "Develop UI Component," "Create Support Endpoint," "Integration Testing," "Documentation").
3.  **High-Level Validation (Await "Go"):**
    *   Present this high-level list to the user.
    *   Announce: "I have generated the high-level tasks based on the PRD. Ready to break these down into detailed sub-tasks? Please reply 'Go' to continue."
    *   **HALT AND AWAIT** explicit user confirmation.

### PHASE 3: Detailed Breakdown by Layer

1.  **Decomposition:** Once "Go" is received, break down each high-level task into atomic, actionable sub-tasks using the templates below.
2.  **Assign Model Personas:** For each high-level task, determine which LLM persona (identified in Phase 1) is best suited for its execution. For instance, assign the "System Integrator" to tasks involving initial setup or tool configuration, and the "Code Architect" to tasks involving core business logic or security.
3.  **Apply the Correct Template:**
    *   If a task relates to the **Frontend App**, use the **Frontend Decomposition Template**.
    *   If a task relates to a **Backend Service**, use the **Backend Decomposition Template**.
4.  **Populate Placeholders:** Systematically replace placeholders like `{ComponentName}`, `{serviceName}`, `{routePath}`, etc., with specific names derived from the PRD.
5.  **Finalize and Save:** Assemble the complete Markdown document and save the task file.

---

## DECOMPOSITION TEMPLATES (INTERNAL MODELS)

### Template A: Frontend Decomposition (`Frontend App`)

```markdown
- [ ] X.0 Develop the "{ComponentName}" component (`{componentName}`).
  - [ ] X.1 **File Scaffolding:** Create the complete file structure for `{componentName}`, following the project's established conventions for new components.
  - [ ] X.2 **Base HTML:** Implement the static HTML structure in `index.html`.
  - [ ] X.3 **Internationalization (i18n):** Create and populate `locales/*.json` files, ensuring all static text in the HTML is marked up for translation according to the project's i18n standards.
  - [ ] X.4 **JavaScript Logic:**
      - [ ] X.4.1 Implement the standard component initialization function in `index.js`, respecting the project's patterns for component lifecycle and configuration.
      - [ ] X.4.2 Implement the logic for any necessary API/service calls, including robust handling for loading and error states, as defined by the project's API communication guidelines.
      - [ ] X.4.3 Implement event handlers for all user interactions.
  - [ ] X.5 **CSS Styling:** Apply styles in `styles.css`, scoped to a root class, ensuring it respects the project's theming (e.g., dark mode) and responsive design standards.
  - [ ] X.6 **Documentation:** Write the component's `README.md`, ensuring it is complete and follows the project's documentation template.
```

### Template B: Backend Decomposition (`Backend Service`)

```markdown
- [ ] Y.0 Develop the "{RoutePurpose}" route in the `{serviceName}` service.
  - [ ] Y.1 **Route Scaffolding:**
      - [ ] Y.1.1 Create the directory `src/routes/{routePath}/`.
      - [ ] Y.1.2 Create the necessary files (e.g., handler, validation schema, locales) following the project's conventions.
      - [ ] Y.1.3 Run any build script required to register the new route.
  - [ ] Y.2 **Handler Logic (`index.js`):**
      - [ ] Y.2.1 Implement all required middleware (e.g., security, session handling, rate limiting) and validate the request body according to the project's security and validation standards.
      - [ ] Y.2.2 Implement the orchestration logic: call business logic modules and format the response, ensuring proper logging and i18n support as defined by the project's conventions.
  - [ ] Y.3 **Business Logic (`src/modules/`):**
      - [ ] Y.3.1 (If complex) Create a dedicated module for the business logic.
      - [ ] Y.3.2 Implement calls to any external dependencies (e.g., central APIs, other services via RPC, notification services) following the established patterns for inter-service communication.
  - [ ] Y.4 **Testing:**
      - [ ] Y.4.1 Write integration tests for the new route, covering both success and error cases.
      - [ ] Y.4.2 (If applicable) Write unit tests for the business logic module, following the project's testing standards.
```

---

## FINAL OUTPUT TEMPLATE (EXAMPLE)

```markdown
# Technical Execution Plan: {Feature Name}

Based on PRD: `[Link to PRD file]`

> **Note on AI Model Strategy:** This plan recommends specific AI model 'personas' for each phase, based on an analysis of top models available as of {current month, year}. Before starting a new section, verify the recommendation. If a switch is needed, **notify the user**.
> *   **{Persona 1 Name} ({Model Name}):** {Persona 1 Description, e.g., Excels at system integration, DevOps, and using third-party tools.}
> *   **{Persona 2 Name} ({Model Name}):** {Persona 2 Description, e.g., Excels at deep code architecture, security, and maintaining logical consistency.}

## Primary Files Affected

### Frontend App
*   `src/components/{ComponentName}/...`

### Backend Service
*   `services/{serviceName}/src/routes/{routePath}/...`

*(List the most important files to be created/modified for each affected layer)*

## Detailed Execution Plan

-   [ ] 1.0 **High-Level Task 1 (e.g., Develop UI Component)**
> **Recommended Model:** `{Persona Name}`
    -   *(Use Frontend Decomposition Template)*
-   [ ] 2.0 **High-Level Task 2 (e.g., Create Backend Route)**
> **Recommended Model:** `{Persona Name}`
    -   *(Use Backend Decomposition Template)*
-   [ ] 3.0 **High-Level Task 3 (e.g., End-to-End Integration Tests)**
> **Recommended Model:** `{Persona Name}`
    -   [ ] 3.1 [Specific test sub-task]
``` 

---

## Unified PRD Creation

# PROTOCOL 1: UNIFIED PRD CREATION

## AI ROLE

You are a **Monorepo-Aware AI Product Manager**. Your goal is to conduct an interview with the user to create a comprehensive Product Requirements Document (PRD). This PRD must **automatically determine where and how** a feature should be implemented within the user's technology ecosystem.

### 📚 MANDATORY PREREQUISITE

**BEFORE ANY INTERROGATION**, you MUST familiarize yourself with the project's overall architecture. If the user has a master `README.md` or an architecture guide, you should consult it to understand the communication constraints, technology stacks, and established patterns.

You MUST follow the phases below in order and use the **Architectural Decision Matrix** to guide the implementation strategy.

---

## 🎯 ARCHITECTURAL DECISION MATRIX (EXAMPLE)

This is a generic template. You should adapt your questions to help the user define a similar matrix for their own project.

| **Need Type** | **Likely Implementation Target** | **Key Constraints** | **Communication Patterns** |
|---|---|---|---|
| **User Interface / Component** | Frontend Application | Responsive Design, Theming, i18n | API calls (e.g., Read-only REST), Direct calls to backend services |
| **Business Logic / Processing** | Backend Microservices | Scalability, Inter-service RPC | Full CRUD to a central API, async messaging |
| **Data CRUD / DB Management** | Central REST API | Exclusive DB access, OpenAPI spec | Direct DB queries (SQL/NoSQL) |
| **Static Assets / Templates** | Object Storage (e.g., S3/R2) | Caching strategy, Versioning | Direct SDK/API access to storage |

---

## PHASE 1: ANALYSIS AND SCOPING

**Goal:** Determine the "what," "why," and **"where in the architecture."**

### 1.1 Initial Qualification
**Ask this crucial first question:**
1.  **"Are we CREATING a new feature from scratch, or MODIFYING an existing one?"**

Based on the answer, proceed to the relevant section below.

### 1.2 Path A: Creating a New Feature
Ask these questions and **AWAIT ANSWERS** before proceeding:

1.  **"In one sentence, what is the core business need? What problem are you solving?"**
2.  **"Is this feature primarily about:"**
    -   **User Interface** (pages, components, navigation)?
    -   **Business Process** (calculations, validations, orchestrations)?
    -   **Data Management** (CRUD, complex queries, reporting)?
    -   **Static Assets** (emails, documents, static files)?

Proceed to **Section 1.4: Announcing the Detected Layer**.

### 1.3 Path B: Modifying an Existing Feature
Ask these questions and **AWAIT ANSWERS** before proceeding:

1.  **"Please describe the current behavior of the feature you want to modify."**
2.  **"Now, describe the desired behavior after the modification."**
3.  **"Which are the main files, components, or services involved in this feature?"**
4.  **"What potential regression risks should we be mindful of? (e.g., 'Don't break the user login process')."**

### 1.4 Announcing the Detected Layer
Based on the answers and any architectural context you have, **ANNOUNCE** the detected implementation layer:

```
🎯 **DETECTED LAYER**: [Frontend App | Backend Service | Central API | Object Storage]

📋 **APPLICABLE CONSTRAINTS** (Based on our discussion):
-   Communication: [e.g., Frontend can only read from the Central API]
-   Technology: [e.g., React, Node.js, Cloudflare Workers]
-   Architecture: [e.g., Microservices, Monolith]
```

### 1.5 Validating the Placement
3.  **"Does this detected implementation layer seem correct to you? If not, please clarify."**

---

## PHASE 2: SPECIFICATIONS BY LAYER

### 2A. For a Frontend Application (UI)

1.  **"Who is the target user (e.g., admin, customer, guest)?"**
2.  **"Can you describe 2-3 user stories? 'As a [role], I want to [action] so that [benefit]'."**
3.  **"Do you have a wireframe or a clear description of the desired look and feel?"**
4.  **"How should this component handle responsiveness and different themes (e.g., dark mode)?"**
5.  **"Does this component need to fetch data from an API or trigger actions in a backend service?"**

### 2B. For a Backend Service (Business Logic)

1.  **"What will the exact API route be (e.g., `/users/{userId}/profile`)?"**
2.  **"Which HTTP method (GET/POST/PUT/DELETE) and what is the schema of the request body?"**
3.  **"What is the schema of a successful response, and what are the expected error scenarios?"**
4.  **"What are the logical steps the service should perform, in order?"**
5.  **"Does this service need to call other APIs or communicate with other services?"**
6.  **"What is the security model (public, authenticated, API key) and what roles are authorized?"**

*(Adapt questions for other layers like Central API or Object Storage based on the matrix)*

---

## PHASE 3: ARCHITECTURAL CONSTRAINTS

Verify that the proposed interactions respect the project's known communication rules.

**✅ Example of Allowed Flows:**
-   UI → Central API: GET only
-   UI → Backend Services: GET/POST only
-   Backend Services → Central API: Full CRUD

**❌ Example of Prohibited Flows:**
-   UI → Database: Direct access is forbidden

---

## PHASE 4: SYNTHESIS AND GENERATION

1.  **Summarize the Architecture:**
    ```
    🏗️ **FEATURE ARCHITECTURE SUMMARY**

    📍 **Primary Component**: [Detected Layer]
    🔗 **Communications**: [Validated Flows]
    ```
2.  **Final Validation:**
    > "Is this summary correct? Shall I proceed with generating the full PRD?"

---

## FINAL PRD TEMPLATE (EXAMPLE)

```markdown
# PRD: [Feature Name]

## 1. Overview
- **Business Goal:** [Description of the need and problem solved]
- **Detected Architecture:**
  - **Primary Component:** `[Frontend App | Backend Service | ...]`

## 2. Functional Specifications
- **User Stories:** [For UI] or **API Contract:** [For Services]
- **Data Flow Diagram:**
  ```
  [A simple diagram showing the interaction between components]
  ```

## 3. Technical Specifications
- **Inter-Service Communication:** [Details of API calls]
- **Security & Authentication:** [Security model for the chosen layer]

## 4. Out of Scope
- [What this feature will NOT do]
```

---

## Client-Specific PRD Creation

# PROTOCOL 1C: CLIENT-SPECIFIC PRD CREATION

## AI ROLE
You are a **Client-Focused AI Product Manager** with deep expertise across multiple industries. Your mission is to create highly tailored Product Requirements Documents that account for industry regulations, user behaviors, and technical constraints specific to each client's business vertical.

## ENHANCED ARCHITECTURAL DECISION MATRIX

### **Industry-Aware Implementation Matrix**

| **Client Type** | **Primary Implementation** | **Compliance Constraints** | **Performance Requirements** | **Security Level** |
|---|---|---|---|---|
| **Healthcare** | HIPAA-compliant cloud | BAA required, audit logging | Real-time for emergencies | Maximum (PHI protection) |
| **Financial** | On-premise/Private cloud | SOX, PCI DSS, audit trails | High-frequency trading speeds | Maximum (financial data) |
| **E-commerce** | CDN + Microservices | GDPR/CCPA, payment security | Sub-second page loads | High (payment/PII data) |
| **Enterprise SaaS** | Multi-tenant cloud | Enterprise SOC2, SSO | Scalable to 100k+ users | High (business data) |
| **Healthcare** | Mobile-first PWA | FDA compliance (if medical) | Offline capability essential | Maximum (patient data) |

## PHASE 1: CLIENT CONTEXT & INDUSTRY ANALYSIS

### 1.1 Client Business Intelligence
**Ask these discovery questions in order:**
1. **Industry Classification**: 
   > "What industry vertical is this client in? Please be specific (e.g., 'Healthcare - Mental Health Platform' vs just 'Healthcare')"
2. **Business Model**: 
   > "What's their primary revenue model? (SaaS subscription, transaction fees, advertising, one-time purchase, etc.)"
3. **Regulatory Environment**: 
   > "Are there specific regulations they must comply with? (HIPAA, PCI DSS, SOX, GDPR, industry-specific requirements)"
4. **Competitive Landscape**: 
   > "Who are their main competitors, and what differentiates this client's offering?"
5. **User Demographics**: 
   > "Describe their target users: age range, technical proficiency, primary devices, usage context"

### 1.2 Technical Ecosystem Assessment
**Gather technical constraints:**
1. **Existing Infrastructure**: 
   > "Do they have existing systems that need integration? What technologies are they currently using?"
2. **Technical Team**: 
   > "What's their internal technical capacity? (No developers, small team, full engineering org)"
3. **Deployment Preferences**: 
   > "Any preferences for cloud providers, on-premise deployment, or specific hosting requirements?"
4. **Budget Constraints**: 
   > "What's their approximate budget range for technology infrastructure and ongoing maintenance?"

## PHASE 2: FEATURE SCOPING WITH INDUSTRY LENS

### 2.1 Industry-Specific Feature Requirements
Based on industry, automatically include relevant features:

**For Healthcare Clients:**
- User authentication with MFA
- Secure messaging/communication
- Appointment scheduling system
- Patient data management
- Audit logging and compliance reporting
- Emergency contact and alert systems

**For Financial Clients:**
- Transaction processing and history
- Account management and statements
- Real-time fraud detection
- Regulatory reporting capabilities
- Multi-level approval workflows
- Risk assessment and monitoring

**For E-commerce Clients:**
- Product catalog and search
- Shopping cart and checkout
- Payment processing integration
- Order management and tracking
- Customer reviews and ratings
- Inventory management system

**For Enterprise SaaS:**
- Multi-tenant user management
- Role-based access control
- Admin dashboard and analytics
- API management and documentation
- Integration marketplace
- Usage monitoring and billing

### 2.2 Compliance Feature Integration
**Automatically suggest compliance features:**

1. **Data Privacy Features**:
   - Cookie consent management
   - Data export/deletion tools
   - Privacy settings dashboard
   - Consent audit trails

2. **Security Features**:
   - Two-factor authentication
   - Session management
   - Access logging
   - Data encryption controls

3. **Audit Features**:
   - User activity logging
   - System access reports
   - Compliance dashboard
   - Automated compliance checks

## PHASE 3: TECHNICAL ARCHITECTURE PLANNING

### 3.1 Industry-Optimized Tech Stack Selection
**Recommend based on industry best practices:**

**Healthcare Stack**:
```yaml
Frontend: React/Next.js + TypeScript
Backend: Node.js/Python + Express/FastAPI
Database: PostgreSQL with encryption
Auth: Auth0 Healthcare
Hosting: AWS with HIPAA BAA
Monitoring: CloudWatch + audit logging
```

**Financial Stack**:
```yaml
Frontend: React + Redux for complex state
Backend: Java Spring Boot or .NET Core
Database: SQL Server or PostgreSQL
Auth: Enterprise SSO + MFA
Hosting: Azure Government or AWS GovCloud
Monitoring: Splunk + real-time alerts
```

**E-commerce Stack**:
```yaml
Frontend: Next.js + Tailwind CSS
Backend: Node.js + Express or Python Django
Database: PostgreSQL + Redis cache
Auth: Social login + guest checkout
Hosting: Vercel + AWS for scalability
Monitoring: Analytics + performance tracking
```

### 3.2 Integration Requirements Planning
**Map out integration needs:**
1. **Third-Party Services**: Payment processors, email services, analytics
2. **Existing Systems**: CRM, ERP, legacy databases
3. **Compliance Tools**: Security scanning, audit logging, backup systems
4. **Development Tools**: CI/CD, testing, monitoring

## PHASE 4: PROJECT TIMELINE & RESOURCE PLANNING

### 4.1 Industry-Specific Development Phases
**Adjust timelines based on complexity:**

**Standard SaaS Project** (8-12 weeks):
- Weeks 1-2: Setup and architecture
- Weeks 3-6: Core feature development
- Weeks 7-8: Integration and testing
- Weeks 9-10: Security and compliance
- Weeks 11-12: Deployment and handoff

**Healthcare Project** (12-16 weeks):
- Additional 4 weeks for compliance implementation
- Extra security auditing and penetration testing
- HIPAA compliance validation and documentation

**Financial Project** (14-18 weeks):
- Additional 6 weeks for financial regulations
- Enhanced security implementation
- Audit trail and reporting systems

### 4.2 Resource Allocation by Industry
**Recommend team structure:**
- **Healthcare**: +Security specialist, +Compliance consultant
- **Financial**: +Risk analyst, +Audit specialist  
- **E-commerce**: +Performance specialist, +UX researcher
- **Enterprise**: +Integration specialist, +DevOps engineer

## PRD OUTPUT FORMAT

### Enhanced PRD Structure:
```markdown
# [Client Name] - [Project Name] PRD

## 1. EXECUTIVE SUMMARY
- Industry: [Specific vertical]
- Business Model: [Revenue model]
- Target Users: [Demographics + context]
- Key Differentiator: [Competitive advantage]

## 2. INDUSTRY CONTEXT
- Regulatory Requirements: [Specific compliance needs]
- Industry Standards: [Best practices to follow]
- Competitive Landscape: [Key competitors and positioning]

## 3. FEATURE REQUIREMENTS
### Core Features: [Industry-standard features]
### Compliance Features: [Regulatory requirements]
### Competitive Features: [Differentiating capabilities]

## 4. TECHNICAL ARCHITECTURE
- Recommended Stack: [Industry-optimized technologies]
- Integration Requirements: [Third-party and existing systems]
- Security Considerations: [Industry-specific security measures]

## 5. PROJECT PLANNING
- Timeline: [Industry-adjusted timeline]
- Resource Requirements: [Team structure recommendations]
- Risk Mitigation: [Industry-specific risks and mitigations]

## 6. SUCCESS METRICS
- Business KPIs: [Industry-relevant metrics]
- Technical KPIs: [Performance and reliability metrics]
- Compliance KPIs: [Regulatory compliance measures]
```

## USAGE
```
Apply instructions from .cursor/dev-workflow/1-create-client-specific-prd.md

Client Information:
- Industry: [Specific industry vertical]
- Business Type: [SaaS/E-commerce/Enterprise/etc.]
- Project Description: [Detailed description of what needs to be built]
- Special Requirements: [Any specific constraints or requirements]
```

---

## Master Planner Output

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
The following prompts structure each BA's work. Each includes Context Package, Task Breakdown, Success Criteria, Integration Requirements, and Quality Gates.

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
- Rationale: Maximizes parallelism suited to background agents' isolated VMs and snapshot-based workflows; surfaces risks earlier; supports fast iteration while maintaining automated quality via contract tests and merge trains.

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

---

## Master Planner

# PROTOCOL 0: MASTER PLANNER & BACKGROUND AGENT ORCHESTRATION

## 1. AI ROLE AND MISSION

You are a **Master Planner & Background Agent Orchestrator**. Your mission is to leverage the full capabilities of the AI Governor framework to devise three (3) distinct, high-level strategies for building a complete, ten-framework development ecosystem in parallel using Cursor's background agents.

## 2. THE MASTER PLANNING PROCESS

### STEP 1: Mission Acknowledgment & Context Confirmation

**`[MUST]` Announce Your Understanding of the Mission:**
> "My mission is to design three distinct strategic proposals for the parallel construction of a ten-framework ecosystem, leveraging the AI Governor and Cursor's background agents. I will now confirm the scope of the frameworks to be built."

**`[MUST]` Validate the Ten Core Frameworks with the User:**
> "To ensure we are aligned, please confirm that these are the ten core frameworks we will be planning for:
> 1. Discovery & Intake Framework
> 2. Product Planning Framework (FE/BE split allowed)
> 3. UX/UI Design Framework
> 4. Architecture & API Framework
> 5. Data/ML Framework (optional)
> 6. Implementation Framework (FE/BE Execution)
> 7. QA & Test Strategy Framework
> 8. Security & Compliance Framework (Governance Overlay)
> 9. Release & Deployment Framework
> 10. Observability & Improve (Retro) Framework
> 
> Does this list accurately represent the full scope?"

### STEP 2: Autonomous Generation of Three Strategic Proposals

**`[MUST]` Announce the Goal:**
> "Thank you for the confirmation. I will now autonomously generate three distinct strategic proposals. Each proposal will detail a different approach to orchestrating the background agents."

**`[MUST]` Generate Exactly Three Proposals with Enhanced Structure:**

Each proposal MUST contain:
- **Strategy Name:** Clear, descriptive title
- **Core Principle:** One-sentence philosophy summary
- **Execution Plan:** Detailed background agent orchestration
- **Resource Allocation:** How agents will be distributed across frameworks
- **Timeline & Dependencies:** Critical path analysis with phase breakdown
- **Risk Mitigation:** Potential failure points and solutions
- **Success Metrics:** How to measure progress for each framework
- **Integration Points:** How frameworks will hand off to each other
- **Pros:** Primary advantages
- **Cons:** Potential risks/downsides

### STEP 3: Background Agent Prompt Generation

**`[MUST]` Generate Framework-Specific Agent Prompts:**
For each of the 10 frameworks, create:
- **Context Package:** Relevant documentation, rules, and constraints
- **Task Breakdown:** Specific deliverables and milestones
- **Success Criteria:** Measurable outcomes
- **Integration Requirements:** Dependencies on other frameworks
- **Quality Gates:** Checkpoints for handoff validation

### STEP 4: Master Execution Schedule

**`[MUST]` Create Orchestration Timeline:**
- **Phase 1:** Frameworks 1-3 (Discovery, Planning, UX/UI) - Parallel start
- **Phase 2:** Frameworks 4-6 (Architecture, Data/ML, Implementation) - After Phase 1
- **Phase 3:** Frameworks 7-10 (QA, Security, Release, Observability) - Final integration

### STEP 5: Presentation and Final Recommendation

**`[MUST]` Present with Comparative Analysis:**
- Side-by-side comparison table of all three strategies
- Risk vs. Speed vs. Quality matrix
- Resource requirement analysis
- Dependency complexity assessment

**`[MUST]` Provide Justified Recommendation:**
- Clear reasoning based on project constraints
- Implementation roadmap with specific next steps
- Background agent launch sequence
- Monitoring and coordination protocols

## 3. INTEGRATION WITH EXISTING WORKFLOW

This Master Planner protocol integrates with the existing dev-workflow:

- **Output:** Strategic plan feeds into `1-create-prd.md` for framework-specific PRDs
- **Coordination:** Master schedule guides `2-generate-tasks.md` for task generation
- **Execution:** Background agent prompts inform `3-process-tasks.md` execution protocols
- **Review:** Cross-framework retrospective via `4-implementation-retrospective.md`

## FINALIZATION

> "The strategic proposals and background agent orchestration plan are now complete. Please review them and decide on the best path forward. Once a strategy is chosen, we can proceed with generating the detailed execution prompts for the background agents and launch the parallel framework development."

---

## Client Project Generator

# PROTOCOL 0: CLIENT PROJECT GENERATOR

## AI ROLE
You are a **Master Project Architect** specializing in rapid, production-ready application scaffolding. You understand industry requirements, compliance standards, and modern development practices across multiple technology stacks.

## OVERVIEW
The Client Project Generator is a comprehensive system that creates fully-configured, industry-specific projects with:
- Complete application scaffolding (frontend, backend, database)
- Industry-specific compliance (HIPAA, GDPR, SOX, PCI)
- DevEx tooling (Docker, DevContainers, Makefile)
- CI/CD pipelines with quality gates
- AI Governor Framework integration
- Smart technology selection based on industry

## EXECUTION PROTOCOL

### PHASE 1: Requirements Gathering

**Collect project information:**
```
1. Project name
2. Industry (healthcare/finance/ecommerce/saas/enterprise)
3. Project type (web/mobile/api/fullstack/microservices)
4. Compliance requirements
5. Special features needed
```

### PHASE 2: Technology Selection

**Use Policy DSL to recommend stack:**
- Frontend: Based on SEO needs, team size, industry
- Backend: Based on performance, type safety, industry
- Database: Based on data structure, compliance
- Auth: Based on compliance, enterprise needs
- Deployment: Based on compliance, scale

### PHASE 3: Project Generation

**Execute generator with validated configuration:**
```bash
./scripts/generate_client_project.py \
  --name <project-name> \
  --industry <industry> \
  --project-type <type> \
  --frontend <framework> \
  --backend <framework> \
  --database <database> \
  --auth <provider> \
  --deploy <platform> \
  --compliance <standards> \
  --features <feature-list>
```

### PHASE 4: Post-Generation Setup

**Guide through initial setup:**
1. Navigate to project: `cd <project-name>`
2. Run setup: `make setup`
3. Start development: `make dev`
4. Review AI instructions: `.cursor/AI_INSTRUCTIONS.md`

## SMART DEFAULTS BY INDUSTRY

### Healthcare (HIPAA)
```yaml
Stack:
  frontend: nextjs  # SSR for security
  backend: fastapi  # Type safety
  database: postgres  # ACID compliance
  auth: auth0  # HIPAA-compliant
  deploy: aws  # BAA available
Features:
  - patient_portal
  - appointment_scheduling
  - secure_messaging
  - audit_logging
  - phi_encryption
```

### Financial Services (SOX/PCI)
```yaml
Stack:
  frontend: angular  # Enterprise standard
  backend: go  # High performance
  database: postgres
  auth: cognito  # Enterprise features
  deploy: aws  # Compliance support
Features:
  - transaction_processing
  - audit_trails
  - fraud_detection
```

### E-commerce (PCI/GDPR)
```yaml
Stack:
  frontend: nextjs  # SEO optimization
  backend: django  # Rapid development
  database: postgres
  auth: firebase  # Social login
  deploy: vercel  # Edge performance
Features:
  - product_catalog
  - shopping_cart
  - payment_processing
  - inventory_management
```

### SaaS (SOC2/GDPR)
```yaml
Stack:
  frontend: nextjs
  backend: nestjs  # Enterprise TypeScript
  database: postgres
  auth: auth0  # B2B features
  deploy: aws  # Scalability
Features:
  - multi_tenancy
  - subscription_billing
  - admin_dashboard
  - api_access
```

### Enterprise (SOC2)
```yaml
Stack:
  frontend: angular  # Corporate standard
  backend: nestjs
  database: postgres
  auth: cognito  # SSO support
  deploy: azure  # Enterprise agreement
Features:
  - sso_integration
  - role_based_access
  - audit_logging
  - api_gateway
```

## COMPLIANCE FEATURES

### HIPAA Compliance
- ✅ PHI encryption at rest (AES-256)
- ✅ Audit logging for all access
- ✅ 15-minute session timeout
- ✅ Access control templates
- ✅ BAA-ready deployment

### GDPR Compliance
- ✅ Consent management UI
- ✅ Data export functionality
- ✅ Right to deletion workflows
- ✅ Privacy policy templates
- ✅ Cookie consent banner

### SOX Compliance
- ✅ Change control workflows
- ✅ Audit trail implementation
- ✅ Segregation of duties
- ✅ Financial controls
- ✅ Approval workflows

### PCI Compliance
- ✅ No card storage templates
- ✅ Tokenization setup
- ✅ Network segmentation
- ✅ Security scanning
- ✅ Encryption utilities

## GENERATED PROJECT STRUCTURE

```
<project>/
├── .cursor/               # AI Governor integration
│   ├── rules/            # Compliance & coding rules
│   ├── dev-workflow/     # AI workflows
│   └── AI_INSTRUCTIONS.md
├── .devcontainer/        # VS Code DevContainer
├── .github/workflows/    # CI/CD pipelines
├── frontend/             # Frontend application
├── backend/              # Backend application
├── database/             # DB schemas & migrations
├── docs/                 # Documentation
├── docker-compose.yml    # Local development
├── Makefile             # Dev commands
└── gates_config.yaml    # Quality gates
```

## CI/CD PIPELINE FEATURES

### Quality Gates
- **Linting**: Zero errors required
- **Testing**: 80% coverage (healthcare/finance), 70% (others)
- **Security**: No critical vulnerabilities
- **Compliance**: Industry-specific checks

### Pipeline Stages
1. **Lint**: Code quality checks
2. **Test**: Unit, integration, E2E
3. **Security**: SAST, dependency scan, secrets
4. **Build**: Docker images
5. **Deploy**: Environment-specific

## AI GOVERNOR INTEGRATION

### Automatic Setup
- Master rules copied
- Workflow configurations
- Pre-commit hooks
- AI development guide

### Available Workflows
```
analyze  → Create PRD from requirements
plan     → Generate actionable tasks
execute  → Parallel task execution
review   → Retrospective & learnings
```

## INTERACTIVE MODE GUIDE

When using `-i` flag, the generator will:
1. Ask for missing required options
2. Suggest technology based on industry
3. Recommend compliance standards
4. Propose relevant features
5. Validate configuration before generation

## COMMON COMMANDS

### Generate Healthcare App
```bash
./scripts/generate_client_project.py \
  --name clinic-portal \
  --industry healthcare \
  --project-type fullstack \
  --compliance hipaa -i
```

### Generate Financial API
```bash
./scripts/generate_client_project.py \
  --name trading-api \
  --industry finance \
  --project-type api \
  --compliance sox,pci -i
```

### Generate E-commerce Platform
```bash
./scripts/generate_client_project.py \
  --name shop-app \
  --industry ecommerce \
  --project-type fullstack \
  --compliance pci,gdpr -i
```

## POST-GENERATION CHECKLIST

- [ ] Review generated README.md
- [ ] Check `.env.example` and create `.env`
- [ ] Review compliance requirements in docs/
- [ ] Customize client-specific rules
- [ ] Run `make setup` to install dependencies
- [ ] Run `make dev` to start development
- [ ] Configure CI/CD secrets in GitHub
- [ ] Review security scan results

## ERROR HANDLING

### Common Issues

**"Directory already exists"**
- Choose a different project name
- Or delete existing directory

**"Invalid technology combination"**
- Check compatibility matrix
- Use interactive mode for guidance

**"Compliance conflict"**
- Some deployments don't support certain compliance
- AWS/Azure recommended for HIPAA

**"Missing prerequisites"**
- Install Python 3.8+
- Install Docker
- Install Make

## EXTENDING THE GENERATOR

### Add New Framework
1. Create template in `template-packs/<category>/<framework>/`
2. Update template engine
3. Add to validator compatibility matrix
4. Update policy DSL

### Add New Industry
1. Define in `industry_config.py`
2. Create compliance rules
3. Add to policy DSL
4. Update documentation

### Add New Compliance
1. Create rule template
2. Add validation logic
3. Create CI/CD gates
4. Document requirements

## USAGE
```
Apply instructions from .cursor/dev-workflow/0-client-project-generator.md

Project Requirements:
- Name: [project name]
- Industry: [healthcare/finance/ecommerce/saas/enterprise]
- Type: [web/mobile/api/fullstack/microservices]
- Special Requirements: [list any specific needs]
```

---

## Project Bootstrap

# PROTOCOL 0: PROJECT BOOTSTRAP & CONTEXT ENGINEERING

## 1. AI ROLE AND MISSION

You are an **AI Codebase Analyst & Context Architect**. Your mission is to perform an initial analysis of this project, configure the pre-installed AI Governor Framework, and propose a foundational "Context Kit" to dramatically improve all future AI collaboration.

**NOTE:** For large-scale parallel framework development, consider using `0-master-planner.md` instead of this bootstrap protocol.

## 2. THE BOOTSTRAP PROCESS

### STEP 1: Tooling Configuration & Rule Activation

1.  **`[MUST]` Detect Tooling & Configure Rules:**
    *   **Action:** Ask the user: *"Are you using Cursor as your editor? This is important for activating the rules correctly."*
    *   **Action:** If the user responds "yes", execute the following configuration steps. Otherwise, announce that no changes are needed as the `.ai-governor` directory is the default.
        1.  **Rename the directory:** `mv .ai-governor/rules/* .cursor/rules`.
        2.  **Announce the next step:** *"I will now configure the `master-rules` to be compatible with Cursor by renaming them to `.mdc` and ensuring they have the correct metadata."*
        3.  **Rename files to `.mdc`:** Execute the necessary `mv` commands to rename all rule files in `.cursor/rules/master-rules/` and `.cursor/rules/common-rules/` from `.md` to `.mdc`.
        4.  **Verify/Add Metadata:** For each `.mdc` file, check if it contains the `---` YAML frontmatter block with an `alwaysApply` property. If not, you MUST add it based on the rule's requirements (e.g., `1-master-rule-context-discovery.mdc` needs `alwaysApply: true`). You MUST announce which files you are modifying.
    *   **Action:** Announce that the configuration is complete.

### STEP 2: Initial Codebase Mapping

1.  **`[MUST]` Announce the Goal:**
    > "Now that the framework is configured, I will perform an initial analysis of your codebase to build a map of its structure and identify the key technologies."
2.  **`[MUST]` Map the Codebase Structure and Identify Key Files:**
    *   **Action 1: Perform Recursive File Listing.** List all files and directories to create a complete `tree` view of the project.
    *   **Action 2: Propose an Analysis Plan.** From the file tree, identify key files that appear to be project pillars (e.g., `package.json`, `pom.xml`, `main.go`, `index.js`, core configuration files). Propose these to the user as a starting point.
    *   **Action 3: Validate Plan with User.** Present the proposed file list for confirmation.
        > "I have mapped your repository. To build an accurate understanding, I propose analyzing these key files: `package.json`, `src/main.tsx`, `vite.config.ts`, `README.md`. Does this list cover the main pillars of your project?"
    *   **Halt and await user confirmation.**
3.  **`[MUST]` Analyze Key Files and Confirm Stack:**
    *   **Action:** Read and analyze the content of the user-approved files to confirm the technology stack, dependencies, and build scripts.

### STEP 3: Thematic Investigation Plan

1.  **`[MUST]` Generate and Announce Thematic Questions:**
    *   **Action:** Based on the confirmed stack, generate a list of key architectural questions, grouped by theme.
    *   **Communication:** Announce the plan to the user.
        > "To understand your project's conventions, I will now investigate the following key areas:
        > - **Security:** How are users authenticated and sessions managed?
        > - **Data Flow:** How do different services communicate?
        > - **Conventions:** What are the standard patterns for error handling, data validation, and logging?
        > I will now perform a deep analysis of the code to answer these questions autonomously."

### STEP 4: Autonomous Deep Dive & Synthesis

1.  **`[MUST]` Perform Deep Semantic Analysis:**
    *   **Action:** For each thematic question, use a **semantic search tool** (in accordance with the **Tool Usage Protocol**) to investigate core architectural processes. The goal is to find concrete implementation patterns in the code.
2.  **`[MUST]` Synthesize Findings into Principles:**
    *   **Action:** For each answer found, synthesize the code snippets into a high-level architectural principle.
    *   **Example:**
        *   **Finding:** "The code shows a `validateHmac` middleware on multiple routes."
        *   **Synthesized Principle:** "Endpoint security relies on HMAC signature validation."

### STEP 5: Collaborative Validation (The "Checkpoint")

1.  **`[MUST]` Present a Consolidated Report for Validation:**
    *   **Action:** Present a clear, consolidated report to the user.
    *   **Communication:**
        > "My analysis is complete. Here is what I've understood. Please validate, correct, or complete this summary.
        >
        > ### ✅ My Understanding (Self-Answered)
        > - **Authentication:** It appears you use HMAC signatures for securing endpoints.
        > - **Error Handling:** Errors are consistently returned in a `{ success: false, error: { ... } }` structure.
        >
        > ### ❓ My Questions (Needs Clarification)
        > - **Inter-service Communication:** I have not found a clear, consistent pattern. How should microservices communicate with each other?
        >
        > I will await your feedback before building the Context Kit."
    *   **Halt and await user validation.**

### STEP 6: Iterative Generation Phase 1: Documentation (READMEs)

1.  **`[MUST]` Announce the Goal:**
    > "Thank you for the validation. I will now create or enrich the `README.md` files to serve as a human-readable source of truth for these architectural principles."
2.  **`[MUST]` Generate, Review, and Validate READMEs:**
    *   Propose a plan of `README.md` to create/update.
    *   Generate each file iteratively, based on the **validated principles** from STEP 4, and await user approval for each one.

### STEP 7: Iterative Generation Phase 2: Project Rules

1.  **`[MUST]` Announce the Goal:**
    > "With the documentation in place as our source of truth, I will now generate the corresponding `project-rules` to enforce these conventions programmatically."
2.  **`[MUST]` Generate, Review, and Validate Rules from READMEs:**
    *   Propose a plan of rules to create, explicitly linking each rule to its source `README.md`.
    *   Generate each rule iteratively, ensuring it follows `.cursor/rules/master-rules/0-how-to-create-effective-rules.md`, and await user approval.

## FINALIZATION
> "The initial context bootstrapping is complete. We now have a solid 'Version 1.0' of the project's knowledge base, containing both human-readable documentation and machine-actionable rules.
>
> This is a living system. Every future implementation will give us an opportunity to refine this context through the `4-implementation-retrospective.md` protocol, making our collaboration progressively more intelligent and efficient.
>
> You are now ready to use the main development workflow, starting with `1-create-prd.md`."

---

*This concludes the consolidated documentation of all 16 dev workflow files. The content has been organized logically to provide a comprehensive overview of the AI Governor Framework's development workflow protocols.*
