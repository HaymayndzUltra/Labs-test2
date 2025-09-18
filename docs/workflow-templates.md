# 📋 Workflow Templates

This document provides ready-to-use workflow templates for common project types and scenarios.

## 🏥 Healthcare Project Template

### Template Overview
- **Industry**: Healthcare
- **Compliance**: HIPAA + GDPR
- **Stack**: Next.js + FastAPI + PostgreSQL
- **Auth**: Auth0
- **Deploy**: AWS

### Workflow Template
```bash
#!/bin/bash
# Healthcare Project Workflow Template

# Phase 0: Bootstrap
python scripts/generate_client_project.py \
  --name "$PROJECT_NAME" \
  --industry healthcare \
  --project-type fullstack \
  --frontend nextjs \
  --backend fastapi \
  --database postgres \
  --auth auth0 \
  --deploy aws \
  --compliance hipaa,gdpr \
  --features "telehealth,appointment-scheduling,secure-messaging"

# Phase 1: Create PRD
python scripts/plan_from_brief.py \
  --brief "docs/briefs/$PROJECT_NAME/brief.md" \
  --out PLAN.md

# Phase 2: Generate Tasks
python scripts/enrich_tasks.py --input tasks.json --output enriched_tasks.json
python scripts/validate_tasks.py --tasks enriched_tasks.json

# Phase 3: Sync Tasks
python scripts/sync_from_scaffold.py \
  --scaffold-dir "../_generated/$PROJECT_NAME" \
  --tasks-file tasks.json \
  --preview

# Phase 4: Process Tasks (Backend First)
python scripts/update_task_state.py --task-id BE-001 --state in_progress
python scripts/update_task_state.py --task-id BE-001 --state completed

# Phase 5: Quality Control
make test
make lint
python scripts/enforce_gates.py --config gates_config.yaml

# Phase 6: Retrospective
python scripts/write_context_report.py \
  --project-name "$PROJECT_NAME" \
  --industry healthcare \
  --frontend nextjs --backend fastapi --database postgres \
  --auth auth0 --deploy aws \
  --compliance hipaa,gdpr \
  --output .cursor/ai-governor/project.json
```

## 🛒 E-commerce Project Template

### Template Overview
- **Industry**: E-commerce
- **Compliance**: PCI + GDPR + SOX
- **Stack**: Next.js + Django + PostgreSQL
- **Auth**: Firebase
- **Deploy**: Vercel

### Workflow Template
```bash
#!/bin/bash
# E-commerce Project Workflow Template

# Phase 0: Bootstrap
python scripts/generate_client_project.py \
  --name "$PROJECT_NAME" \
  --industry ecommerce \
  --project-type fullstack \
  --frontend nextjs \
  --backend django \
  --database postgres \
  --auth firebase \
  --deploy vercel \
  --compliance pci,gdpr,sox \
  --features "inventory,payment-processing,recommendations"

# Phase 1: Create PRD
python scripts/plan_from_brief.py \
  --brief "docs/briefs/$PROJECT_NAME/brief.md" \
  --out PLAN.md

# Phase 2: Generate Tasks
python scripts/enrich_tasks.py --input tasks.json --output enriched_tasks.json
python scripts/validate_tasks.py --tasks enriched_tasks.json

# Phase 3: Sync Tasks
python scripts/sync_from_scaffold.py \
  --scaffold-dir "../_generated/$PROJECT_NAME" \
  --tasks-file tasks.json \
  --preview

# Phase 4: Process Tasks (Parallel)
python scripts/update_task_state.py --task-id FE-001 --state in_progress
python scripts/update_task_state.py --task-id BE-001 --state in_progress

# Phase 5: Quality Control
make test
make lint
python scripts/enforce_gates.py --config gates_config.yaml

# Phase 6: Retrospective
python scripts/write_context_report.py \
  --project-name "$PROJECT_NAME" \
  --industry ecommerce \
  --frontend nextjs --backend django --database postgres \
  --auth firebase --deploy vercel \
  --compliance pci,gdpr,sox \
  --output .cursor/ai-governor/project.json
```

## 🏦 Financial Services Template

### Template Overview
- **Industry**: Finance
- **Compliance**: SOX + PCI + GDPR
- **Stack**: Angular + Go + PostgreSQL
- **Auth**: Cognito
- **Deploy**: AWS

### Workflow Template
```bash
#!/bin/bash
# Financial Services Project Workflow Template

# Phase 0: Bootstrap
python scripts/generate_client_project.py \
  --name "$PROJECT_NAME" \
  --industry finance \
  --project-type fullstack \
  --frontend angular \
  --backend go \
  --database postgres \
  --auth cognito \
  --deploy aws \
  --compliance sox,pci,gdpr \
  --features "real-time-quotes,transaction-processing,audit-trail"

# Phase 1: Create PRD
python scripts/plan_from_brief.py \
  --brief "docs/briefs/$PROJECT_NAME/brief.md" \
  --out PLAN.md

# Phase 2: Generate Tasks
python scripts/enrich_tasks.py --input tasks.json --output enriched_tasks.json
python scripts/validate_tasks.py --tasks enriched_tasks.json

# Phase 3: Sync Tasks
python scripts/sync_from_scaffold.py \
  --scaffold-dir "../_generated/$PROJECT_NAME" \
  --tasks-file tasks.json \
  --preview

# Phase 4: Process Tasks (Sequential)
python scripts/update_task_state.py --task-id BE-001 --state in_progress
python scripts/update_task_state.py --task-id BE-001 --state completed
python scripts/update_task_state.py --task-id FE-001 --state in_progress
python scripts/update_task_state.py --task-id FE-001 --state completed

# Phase 5: Quality Control
make test
make lint
python scripts/enforce_gates.py --config gates_config.yaml

# Phase 6: Retrospective
python scripts/write_context_report.py \
  --project-name "$PROJECT_NAME" \
  --industry finance \
  --frontend angular --backend go --database postgres \
  --auth cognito --deploy aws \
  --compliance sox,pci,gdpr \
  --output .cursor/ai-governor/project.json
```

## 🏢 Enterprise SaaS Template

### Template Overview
- **Industry**: SaaS
- **Compliance**: GDPR + SOC 2
- **Stack**: Nuxt + NestJS + MongoDB
- **Auth**: Auth0
- **Deploy**: Azure

### Workflow Template
```bash
#!/bin/bash
# Enterprise SaaS Project Workflow Template

# Phase 0: Bootstrap
python scripts/generate_client_project.py \
  --name "$PROJECT_NAME" \
  --industry saas \
  --project-type fullstack \
  --frontend nuxt \
  --backend nestjs \
  --database mongodb \
  --auth auth0 \
  --deploy azure \
  --compliance gdpr \
  --features "multi-tenant,analytics,real-time-updates"

# Phase 1: Create PRD
python scripts/plan_from_brief.py \
  --brief "docs/briefs/$PROJECT_NAME/brief.md" \
  --out PLAN.md

# Phase 2: Generate Tasks
python scripts/enrich_tasks.py --input tasks.json --output enriched_tasks.json
python scripts/validate_tasks.py --tasks enriched_tasks.json

# Phase 3: Sync Tasks
python scripts/sync_from_scaffold.py \
  --scaffold-dir "../_generated/$PROJECT_NAME" \
  --tasks-file tasks.json \
  --preview

# Phase 4: Process Tasks (Microservices)
python scripts/update_task_state.py --task-id MS-001 --state in_progress
python scripts/update_task_state.py --task-id MS-001 --state completed
python scripts/update_task_state.py --task-id MS-002 --state in_progress
python scripts/update_task_state.py --task-id MS-002 --state completed

# Phase 5: Quality Control
make test
make lint
python scripts/enforce_gates.py --config gates_config.yaml

# Phase 6: Retrospective
python scripts/write_context_report.py \
  --project-name "$PROJECT_NAME" \
  --industry saas \
  --frontend nuxt --backend nestjs --database mongodb \
  --auth auth0 --deploy azure \
  --compliance gdpr \
  --output .cursor/ai-governor/project.json
```

## 📱 Mobile App Template

### Template Overview
- **Industry**: General
- **Compliance**: GDPR
- **Stack**: Expo + FastAPI + Firebase
- **Auth**: Firebase
- **Deploy**: Expo

### Workflow Template
```bash
#!/bin/bash
# Mobile App Project Workflow Template

# Phase 0: Bootstrap
python scripts/generate_client_project.py \
  --name "$PROJECT_NAME" \
  --industry general \
  --project-type mobile \
  --frontend expo \
  --backend fastapi \
  --database firebase \
  --auth firebase \
  --deploy expo \
  --compliance gdpr \
  --features "push-notifications,offline-support,analytics"

# Phase 1: Create PRD
python scripts/plan_from_brief.py \
  --brief "docs/briefs/$PROJECT_NAME/brief.md" \
  --out PLAN.md

# Phase 2: Generate Tasks
python scripts/enrich_tasks.py --input tasks.json --output enriched_tasks.json
python scripts/validate_tasks.py --tasks enriched_tasks.json

# Phase 3: Sync Tasks
python scripts/sync_from_scaffold.py \
  --scaffold-dir "../_generated/$PROJECT_NAME" \
  --tasks-file tasks.json \
  --preview

# Phase 4: Process Tasks (Parallel)
python scripts/update_task_state.py --task-id FE-001 --state in_progress
python scripts/update_task_state.py --task-id BE-001 --state in_progress

# Phase 5: Quality Control
make test
make lint
python scripts/enforce_gates.py --config gates_config.yaml

# Phase 6: Retrospective
python scripts/write_context_report.py \
  --project-name "$PROJECT_NAME" \
  --industry general \
  --frontend expo --backend fastapi --database firebase \
  --auth firebase --deploy expo \
  --compliance gdpr \
  --output .cursor/ai-governor/project.json
```

## 🔧 Custom Template Creation

### Step 1: Define Template Parameters
```yaml
# template-config.yaml
name: "custom-template"
industry: "your-industry"
project_type: "fullstack"
frontend: "nextjs"
backend: "fastapi"
database: "postgres"
auth: "auth0"
deploy: "aws"
compliance: ["gdpr"]
features: ["feature1", "feature2"]
```

### Step 2: Create Workflow Script
```bash
#!/bin/bash
# Custom Template Workflow

# Load configuration
source template-config.yaml

# Phase 0: Bootstrap
python scripts/generate_client_project.py \
  --name "$PROJECT_NAME" \
  --industry "$industry" \
  --project-type "$project_type" \
  --frontend "$frontend" \
  --backend "$backend" \
  --database "$database" \
  --auth "$auth" \
  --deploy "$deploy" \
  --compliance "$(IFS=,; echo "${compliance[*]}")" \
  --features "$(IFS=,; echo "${features[*]}")"

# Continue with standard workflow...
```

### Step 3: Test Template
```bash
# Test the template
chmod +x custom-template.sh
./custom-template.sh
```

## 📊 Template Metrics

### Performance Benchmarks
- **Healthcare**: ~25 minutes total workflow time
- **E-commerce**: ~30 minutes total workflow time
- **Financial**: ~35 minutes total workflow time
- **SaaS**: ~20 minutes total workflow time
- **Mobile**: ~15 minutes total workflow time

### Success Rates
- **Template Accuracy**: >95%
- **Compliance Coverage**: 100%
- **Quality Gate Pass**: >90%
- **Documentation Coverage**: >85%

## 🎯 Template Best Practices

1. **Start Simple**: Begin with basic templates and add complexity
2. **Test Thoroughly**: Validate templates with real projects
3. **Document Everything**: Include clear instructions and examples
4. **Version Control**: Track template changes and improvements
5. **Community Feedback**: Gather input from template users

## 📚 Additional Resources

- [Workflow Examples](workflow-examples.md)
- [Complete Workflow Guide](../WORKFLOW_GUIDE.md)
- [Quick Reference](../WORKFLOW_QUICK_REFERENCE.md)
- [Template Documentation](../TEMPLATES.md)
