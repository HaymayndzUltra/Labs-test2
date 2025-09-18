# 🔄 Workflow Examples

This document provides real-world examples of how to use the Client Project Generator workflow system.

## 📋 Example 1: Healthcare Web Application

### Scenario
Creating a patient portal application for a healthcare provider with HIPAA compliance.

### Workflow Steps

#### Phase 0: Bootstrap Project
```bash
python scripts/generate_client_project.py \
  --name patient-portal \
  --industry healthcare \
  --project-type fullstack \
  --frontend nextjs \
  --backend fastapi \
  --database postgres \
  --auth auth0 \
  --deploy aws \
  --compliance hipaa \
  --features "telehealth,appointment-scheduling,secure-messaging"
```

#### Phase 1: Create PRD
```bash
python scripts/plan_from_brief.py \
  --brief docs/briefs/patient-portal/brief.md \
  --out PLAN.md
```

#### Phase 2: Generate Tasks
```bash
python scripts/enrich_tasks.py --input tasks.json --output enriched_tasks.json
python scripts/validate_tasks.py --tasks enriched_tasks.json
```

#### Phase 3: Sync Tasks
```bash
python scripts/sync_from_scaffold.py \
  --scaffold-dir ../_generated/patient-portal \
  --tasks-file tasks.json \
  --preview
```

#### Phase 4: Process Tasks
```bash
# Start with backend tasks
python scripts/update_task_state.py --task-id BE-001 --state in_progress

# Complete backend tasks
python scripts/update_task_state.py --task-id BE-001 --state completed

# Start frontend tasks
python scripts/update_task_state.py --task-id FE-001 --state in_progress
```

#### Phase 5: Quality Control
```bash
# Run tests
make test

# Run lints
make lint

# Enforce gates
python scripts/enforce_gates.py --config gates_config.yaml
```

#### Phase 6: Implementation Retrospective
```bash
python scripts/write_context_report.py \
  --project-name "patient-portal" \
  --industry healthcare \
  --frontend nextjs --backend fastapi --database postgres \
  --auth auth0 --deploy aws \
  --compliance hipaa \
  --output .cursor/ai-governor/project.json
```

## 📋 Example 2: E-commerce API

### Scenario
Creating a microservices-based e-commerce API with PCI compliance.

### Workflow Steps

#### Phase 0: Bootstrap Project
```bash
python scripts/generate_client_project.py \
  --name ecommerce-api \
  --industry ecommerce \
  --project-type microservices \
  --backend go \
  --database postgres \
  --auth cognito \
  --deploy aws \
  --compliance pci,gdpr \
  --features "inventory,payment-processing,recommendations"
```

#### Phase 1: Create PRD
```bash
python scripts/plan_from_brief.py \
  --brief docs/briefs/ecommerce-api/brief.md \
  --out PLAN.md
```

#### Phase 2: Generate Tasks
```bash
python scripts/enrich_tasks.py --input tasks.json --output enriched_tasks.json
python scripts/validate_tasks.py --tasks enriched_tasks.json
```

#### Phase 3: Sync Tasks
```bash
python scripts/sync_from_scaffold.py \
  --scaffold-dir ../_generated/ecommerce-api \
  --tasks-file tasks.json \
  --preview
```

#### Phase 4: Process Tasks
```bash
# Process microservices in order
python scripts/update_task_state.py --task-id MS-001 --state in_progress
python scripts/update_task_state.py --task-id MS-001 --state completed

python scripts/update_task_state.py --task-id MS-002 --state in_progress
python scripts/update_task_state.py --task-id MS-002 --state completed
```

#### Phase 5: Quality Control
```bash
# Run comprehensive tests
make test-all

# Security scanning
make security-scan

# Performance testing
make perf-test

# Enforce gates
python scripts/enforce_gates.py --config gates_config.yaml
```

#### Phase 6: Implementation Retrospective
```bash
python scripts/write_context_report.py \
  --project-name "ecommerce-api" \
  --industry ecommerce \
  --backend go --database postgres \
  --auth cognito --deploy aws \
  --compliance pci,gdpr \
  --output .cursor/ai-governor/project.json
```

## 📋 Example 3: SaaS Dashboard

### Scenario
Creating a multi-tenant SaaS dashboard with GDPR compliance.

### Workflow Steps

#### Phase 0: Bootstrap Project
```bash
python scripts/generate_client_project.py \
  --name saas-dashboard \
  --industry saas \
  --project-type fullstack \
  --frontend angular \
  --backend django \
  --database postgres \
  --auth firebase \
  --deploy vercel \
  --compliance gdpr \
  --features "multi-tenant,analytics,real-time-updates"
```

#### Phase 1: Create PRD
```bash
python scripts/plan_from_brief.py \
  --brief docs/briefs/saas-dashboard/brief.md \
  --out PLAN.md
```

#### Phase 2: Generate Tasks
```bash
python scripts/enrich_tasks.py --input tasks.json --output enriched_tasks.json
python scripts/validate_tasks.py --tasks enriched_tasks.json
```

#### Phase 3: Sync Tasks
```bash
python scripts/sync_from_scaffold.py \
  --scaffold-dir ../_generated/saas-dashboard \
  --tasks-file tasks.json \
  --preview
```

#### Phase 4: Process Tasks
```bash
# Process frontend and backend in parallel
python scripts/update_task_state.py --task-id FE-001 --state in_progress
python scripts/update_task_state.py --task-id BE-001 --state in_progress

# Complete tasks
python scripts/update_task_state.py --task-id FE-001 --state completed
python scripts/update_task_state.py --task-id BE-001 --state completed
```

#### Phase 5: Quality Control
```bash
# Run tests
make test

# Run lints
make lint

# Enforce gates
python scripts/enforce_gates.py --config gates_config.yaml
```

#### Phase 6: Implementation Retrospective
```bash
python scripts/write_context_report.py \
  --project-name "saas-dashboard" \
  --industry saas \
  --frontend angular --backend django --database postgres \
  --auth firebase --deploy vercel \
  --compliance gdpr \
  --output .cursor/ai-governor/project.json
```

## 🔧 Common Workflow Patterns

### Pattern 1: Sequential Development
- Complete backend tasks first
- Then complete frontend tasks
- Good for: API-first development

### Pattern 2: Parallel Development
- Process frontend and backend tasks simultaneously
- Good for: Full-stack development with clear separation

### Pattern 3: Microservices Development
- Process each microservice independently
- Good for: Complex distributed systems

### Pattern 4: Iterative Development
- Complete small batches of tasks
- Regular quality control checks
- Good for: Agile development

## 🚨 Common Issues and Solutions

### Issue: Task Dependencies Not Met
**Solution**: Check task dependencies and complete blocking tasks first

### Issue: Quality Gates Failing
**Solution**: Review gate configuration and fix failing tests

### Issue: Compliance Requirements Not Met
**Solution**: Check compliance mapping and update project configuration

### Issue: Template Not Found
**Solution**: Verify template pack exists and check template registry

## 📊 Workflow Metrics

### Success Metrics
- **Task Completion Rate**: >90%
- **Quality Gate Pass Rate**: >95%
- **Compliance Score**: 100%
- **Documentation Coverage**: >80%

### Performance Metrics
- **Bootstrap Time**: <5 minutes
- **Task Processing Time**: <2 minutes per task
- **Quality Control Time**: <10 minutes
- **Total Workflow Time**: <30 minutes

## 🎯 Best Practices

1. **Start with Bootstrap**: Always begin with Phase 0
2. **Plan Before Execution**: Use Phase 1 to establish clear requirements
3. **Sync Regularly**: Use Phase 3 whenever code changes
4. **Quality First**: Run Phase 5 before major milestones
5. **Document Learnings**: Use Phase 6 for continuous improvement

## 📚 Additional Resources

- [Complete Workflow Guide](WORKFLOW_GUIDE.md)
- [Quick Reference](WORKFLOW_QUICK_REFERENCE.md)
- [Template Documentation](TEMPLATES.md)
- [Compliance Guide](COMPLIANCE.md)
