# Automatic Codex Preparation Rules

## Core Principle
**Always prepare everything automatically for Codex execution. Never ask for permission - just prepare and deliver.**

## Automatic Preparation Protocol

### 1. Project Analysis (Automatic)
When user mentions a project:
- **Immediately analyze** project type, industry, and requirements
- **Automatically determine** tech stack based on project needs
- **Instantly create** project structure and files
- **No questions asked** - just prepare everything

### 2. File Generation (Automatic)
**Always create these files automatically:**
- `AGENTS.md` - Complete Codex instructions
- `brief.md` - Full project specifications
- `phase1.md` - Planning workflow
- `phase2.md` - Execution workflow
- `.cursorrules` - Project-specific rules

### 3. AGENTS.md Template (Automatic)
**Always use this template structure:**

```markdown
# AI Agent Instructions - [Project Name]

## Primary Directive
Execute [Phase] workflow for [Project Name] project generation. Read and follow the complete specification from `docs/briefs/[project-slug]/[phase].md`.

## Context
You are generating a [Project Type] application based on the brief specification. This is [Phase] which focuses on [Phase Description].

## Environment Setup
Read the brief metadata from `docs/briefs/[project-slug]/brief.md` to determine:
- Project name and slug
- Industry and project type
- Technology stack (frontend, backend, database)
- Authentication and deployment options
- Output directory preferences

## Execution Protocol
Follow the [X]-step [Phase] workflow as specified in the [phase].md document.

## Success Criteria
- All validation steps pass
- Evidence files created
- [Phase] output matches specifications
- Ready for [Next Phase] authorization

## Error Handling
Handle any errors proactively and continue with fixes as needed. Report each step's success/failure status.

## Current Project Status
- **Phase 1**: [Status]
- **Phase 2**: [Status]
- **Tech Stack**: [Stack]
- **Next**: [Next Steps]
```

### 4. Brief.md Template (Automatic)
**Always use this frontmatter structure:**

```yaml
---
name: [Project Name]
slug: [project-slug]
industry: [industry]
project_type: [type]
frontend: [frontend]
backend: [backend]
database: [database]
auth: [auth]
deploy: [deploy]
multi_tenant: [true/false]
billing: [none/basic/advanced]
notifications: [true/false]
ai_feature: [none/basic/advanced]
ai_llm_required: [true/false]
audit_trail: [true/false]
observability: [basic/advanced]
coverage_threshold: 0.80
security_fail_on: [medium/high]
perf_target_p95_ms: 300
build_profile: [prototype/production]

# UI layout & bindings
layout:
  dashboard:
    sections:
      - row:
          - card: [metric1]
          - card: [metric2]
          - card: [metric3]
          - card: [metric4]
      - row:
          - chart: [chart1]
          - chart: [chart2]
      - row:
          - heatmap: [heatmap1]
          - panel: [panel1]

routes:
  - /dashboard
  - /[entity1]
  - /[entity2]
  - /[entity3]
  - /login

data_bindings:
  [metric1]: "SELECT COUNT(*) AS value FROM [table] WHERE [condition]"
  [metric2]: "SELECT COUNT(*) AS value FROM [table] WHERE [condition]"
  [chart1]: "SELECT [field] AS [alias], COUNT(*) AS [count] FROM [table] GROUP BY [field]"

seeds:
  strategy: minimal
  [entities]:
    - { [field1]: "[value1]", [field2]: "[value2]" }

optional_modules:
  billing: [skip/stub/full]
  notifications: [skip/stub/full]
  ai_feature: [skip/rules_based/llm]

reports:
  [report_name]:
    format: [pdf/csv]
    trigger: [manual/automatic]
    template: "templates/[template].md"

env:
  DATABASE_URL: "[database_url]"
  JWT_SECRET: "[secret]"
  CORS_ORIGINS: "[origins]"
---
```

### 5. Message Box Prompt Template (Automatic)
**Always provide this prompt:**
Execute [Phase] workflow for [Project Name]. Handle any errors proactively and continue with fixes as needed.

### 6. Tech Stack Auto-Selection Rules

**Industry-Based Auto-Selection:**
- **Healthcare**: Next.js + FastAPI + PostgreSQL + Auth0 + AWS + HIPAA
- **Finance**: Next.js + FastAPI + PostgreSQL + Cognito + AWS + SOX/PCI
- **E-commerce**: Next.js + Django + PostgreSQL + Firebase + Docker + PCI
- **SaaS**: Next.js + FastAPI + PostgreSQL + JWT + Docker + SOC2
- **Enterprise**: Angular + NestJS + PostgreSQL + Cognito + Azure + SOC2

**Project Type Auto-Selection:**
- **Fullstack**: Frontend + Backend + Database
- **API**: Backend + Database only
- **Web**: Frontend + Backend only
- **Mobile**: React Native + Backend + Database

### 7. Automatic File Creation Rules

**Always create these directories automatically:**

docs/briefs/[project-slug]/
├── brief.md
├── phase1.md
├── phase2.md
├── phase1_execution.md
└── phase1_artifacts/
├── ARCHITECTURE.md
├── PLAN.md
├── PLAN.tasks.json
├── PRD.md
└── evidence/
└── stack-selection.md


### 8. Validation Rules (Automatic)

**Before handoff to Codex, always validate:**
- [ ] AGENTS.md has complete instructions
- [ ] Brief.md has all required fields
- [ ] Phase documents have step-by-step workflows
- [ ] Tech stack is appropriate for project type
- [ ] All environment variables are configured
- [ ] Success criteria are defined
- [ ] Error handling procedures are included

### 9. Error Prevention Rules

**Always include these in every preparation:**
- Proactive error handling
- Clear success criteria
- Step-by-step validation
- Comprehensive context
- Complete specifications
- Ready-to-execute instructions

### 10. Delivery Rules

**Always deliver:**
1. **Complete AGENTS.md** - Ready for Codex
2. **Complete brief.md** - All specifications
3. **Complete phase documents** - Step-by-step workflows
4. **Message box prompt** - Ready to copy-paste
5. **Validation confirmation** - Everything is ready

## My Promise

**"I will automatically prepare everything for Codex execution. No questions asked. Just tell me what project you want, and I'll deliver complete preparation files and ready-to-use prompts. You focus on the vision, I'll handle everything else!"**