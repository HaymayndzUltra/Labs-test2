# 🚀 Workflow Guide - Client Project Generator

This comprehensive guide explains the complete workflow system for the Client Project Generator, including all phases, commands, and best practices.

## 📋 Table of Contents

- [Workflow Overview](#workflow-overview)
- [Phase Commands](#phase-commands)
- [Key Scripts](#key-scripts)
- [Configuration & Rules](#configuration--rules)
- [Task Management](#task-management)
- [Quality Gates](#quality-gates)
- [Compliance Mapping](#compliance-mapping)
- [Isolation Strategy](#isolation-strategy)
- [Context Reports](#context-reports)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## 🔄 Workflow Overview

The Client Project Generator follows a structured 6-phase workflow designed to create production-ready applications with built-in compliance, quality gates, and AI integration.

### Workflow Principles

- **Non-deploy phases**: All phases are designed for development, not deployment
- **Human confirmation**: HALT checkpoints ensure human oversight
- **Quality first**: Built-in quality gates and compliance checks
- **AI integration**: Seamless integration with AI development workflows

## 🎯 Phase Commands

### Phase 0: Bootstrap Project (`/0-bootstrap-project`)

**Purpose**: Fast, portable bootstrap for any repo using dry-run-first and HALT checkpoints. Supports brief-first and scaffold-first starts. **Never deploy.**

**What it does**:
- Analyzes the project brief (dry-run mode) with HALT checkpoints
- Selects appropriate isolation strategy and output root
- Generates project scaffold with templates (brief-first or scaffold-first)
- Applies optional quality gates and context reports
- **Never deploys** - all operations are local development only

**Usage**:
```bash
python scripts/generate_client_project.py \
  --name my-project \
  --industry healthcare \
  --project-type fullstack \
  --frontend nextjs \
  --backend fastapi \
  --database postgres \
  --compliance hipaa
```

**Outputs**:
- Complete project scaffold
- Template files and configurations
- Initial project structure

### Phase 1: Create PRD (`/1-create-prd`)

**Purpose**: Generate Product Requirements Document and planning artifacts

**What it does**:
- Creates `PLAN.md` from project brief
- Generates `PLAN.tasks.json` with task definitions
- Establishes project scope and requirements

**Usage**:
```bash
python scripts/plan_from_brief.py \
  --brief docs/briefs/project1/brief.md \
  --out PLAN.md
```

**Outputs**:
- `PLAN.md` - Human-readable project plan
- `PLAN.tasks.json` - Machine-readable task definitions

### Phase 2: Generate Tasks (`/2-generate-tasks`)

**Purpose**: Build comprehensive task management system

**What it does**:
- Builds complete `tasks.json` with enriched personas
- Adds acceptance criteria and definitions of done
- Validates DAG (Directed Acyclic Graph) and enums
- Ensures proper task dependencies

**Usage**:
```bash
python scripts/enrich_tasks.py --input tasks.json --output enriched_tasks.json
python scripts/validate_tasks.py --tasks enriched_tasks.json
```

**Outputs**:
- Enriched `tasks.json` with personas and acceptance criteria
- Validation report for task dependencies

### Phase 3: Sync Tasks (`/sync-tasks`)

**Purpose**: Scan repo (routes/pages/migrations/tests) and reconcile tasks.json with actual code. **Idempotent, never deploy.**

**What it does**:
- Scans repository structure for implemented features
- Identifies missing or completed tasks based on code
- Updates task states to match actual implementation
- **Idempotent** - safe to run multiple times
- Previews changes before applying
- Updates task definitions based on code changes

**Usage**:
```bash
python scripts/sync_from_scaffold.py \
  --scaffold-dir ../_generated/my-project \
  --tasks-file tasks.json \
  --preview
```

**Outputs**:
- Updated `tasks.json` reflecting current code state
- Diff report showing changes made

### Phase 4: Process Tasks (`/3-process-tasks`)

**Purpose**: Execute tasks.json per lane with HALTs, update state, record run history. **Never deploy.**

**What it does**:
- Executes tasks lane-by-lane (backend/frontend/devops) with HALT checkpoints
- Updates task states (pending → in_progress → completed)
- Records run history for audit and tracking
- **Never deploys** - only local build/test/lint operations

**Usage**:
```bash
python scripts/update_task_state.py --task-id TASK-001 --state in_progress
python scripts/update_task_state.py --task-id TASK-001 --state completed
```

**Outputs**:
- Updated task states
- Execution history
- Progress reports

### Phase 5: Quality Control (`/4-quality-control`)

**Purpose**: Ensure code quality and compliance

**What it does**:
- Runs comprehensive test suites
- Executes linting and code quality checks
- Enforces numeric quality gates
- Validates compliance requirements

**Usage**:
```bash
python scripts/enforce_gates.py --config gates_config.yaml
make test
make lint
```

**Outputs**:
- Test results and coverage reports
- Linting reports
- Quality gate validation results

### Phase 6: Implementation Retrospective (`/5-implementation-retrospective`)

**Purpose**: Review outcomes and propose improvements

**What it does**:
- Summarizes implementation outcomes
- Identifies lessons learned
- Proposes process improvements
- Documents best practices

**Usage**:
```bash
python scripts/write_context_report.py \
  --project-name "myapp" \
  --industry healthcare \
  --output .cursor/ai-governor/project.json
```

**Outputs**:
- Retrospective report
- Improvement recommendations
- Updated project context

## 🛠️ Key Scripts

### Core Generation Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `scripts/plan_from_brief.py` | Generate PRD/plan artifacts | `python scripts/plan_from_brief.py --brief brief.md --out PLAN.md` |
| `scripts/generate_from_brief.py` | Split FE/BE generation from brief | `python scripts/generate_from_brief.py --brief brief.md` |
| `scripts/generate_client_project.py` | Single project generation | `python scripts/generate_client_project.py --name myapp --industry healthcare` |

### Task Management Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `scripts/enrich_tasks.py` | Add personas and acceptance criteria | `python scripts/enrich_tasks.py --input tasks.json` |
| `scripts/validate_tasks.py` | Validate DAG and enums | `python scripts/validate_tasks.py --tasks tasks.json` |
| `scripts/sync_from_scaffold.py` | Sync tasks with code changes | `python scripts/sync_from_scaffold.py --scaffold-dir .` |
| `scripts/update_task_state.py` | Update task state by ID | `python scripts/update_task_state.py --task-id TASK-001 --state completed` |

### Utility Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `scripts/write_context_report.py` | Generate project context report | `python scripts/write_context_report.py --project-name myapp` |
| `scripts/enforce_gates.py` | Enforce quality gates | `python scripts/enforce_gates.py --config gates_config.yaml` |

## ⚙️ Configuration & Rules

### Rules Emission Control

The system provides three levels of rule emission for generated projects:

#### Safe Default (`--no-cursor-assets`)
- **Use case**: When generating projects in existing repositories
- **Behavior**: No nested rules in child projects
- **Output location**: `../_generated` (if root `.cursor` exists)

#### Minimal Rules (`--minimal-cursor --include-cursor-assets`)
- **Use case**: When you want focused rule sets
- **Behavior**: Emits a focused set of essential rules
- **Output location**: `.cursor/rules/` in generated project

#### Full Rules (`--include-cursor-assets`)
- **Use case**: When you want complete rule coverage
- **Behavior**: Emits complete rules ecosystem
- **Output location**: `.cursor/rules/` in generated project

### Quality Gates Configuration

Quality gates are configured via `gates_config.yaml`:

```yaml
gates:
  coverage:
    minimum: 80
    critical: 90
  
  vulnerabilities:
    critical: 0
    high: 2
    medium: 10
  
  performance:
    p95_ms: 500
    p99_ms: 1000
  
  security:
    secrets_detected: 0
    dependency_vulnerabilities: 0
```

### Industry-Specific Overlays

Different industries have different quality requirements:

- **Healthcare**: Stricter security and compliance gates
- **Finance**: Enhanced audit and compliance requirements
- **E-commerce**: Performance and security focus
- **SaaS**: Scalability and reliability emphasis

## 📊 Task Management

### Task States

Tasks can be in one of five states:

| State | Description | Next Actions |
|-------|-------------|--------------|
| `pending` | Not started | Can be moved to `in_progress` |
| `in_progress` | Currently being worked on | Can be moved to `completed` or `blocked` |
| `blocked` | Cannot proceed due to dependencies | Wait for dependencies to be resolved |
| `completed` | Finished successfully | No further actions needed |
| `cancelled` | No longer needed | Removed from active workflow |

### Personas

The system uses three personas for task enrichment:

#### System Integrator
- **Focus**: Integration, deployment, infrastructure
- **Responsibilities**: CI/CD, deployment pipelines, system integration
- **Tasks**: Environment setup, deployment automation, monitoring

#### Code Architect
- **Focus**: Technical design, architecture, code quality
- **Responsibilities**: System design, code structure, technical decisions
- **Tasks**: Architecture design, code review, technical documentation

#### QA (Quality Assurance)
- **Focus**: Testing, quality validation, compliance
- **Responsibilities**: Test design, quality gates, compliance validation
- **Tasks**: Test creation, quality validation, compliance checking

### Task Dependencies

Tasks are organized in a Directed Acyclic Graph (DAG) to ensure proper execution order:

```json
{
  "id": "TASK-001",
  "title": "Setup database schema",
  "blocked_by": [],
  "blocks": ["TASK-002", "TASK-003"],
  "dependencies": [],
  "dependents": ["TASK-002", "TASK-003"]
}
```

## 🚦 Quality Gates

### Gate Types

#### Coverage Gates
- **Unit Test Coverage**: Minimum 80%, Critical 90%
- **Integration Test Coverage**: Minimum 70%
- **E2E Test Coverage**: Minimum 60%

#### Security Gates
- **Critical Vulnerabilities**: 0 allowed
- **High Vulnerabilities**: Maximum 2
- **Secrets Detection**: 0 allowed
- **Dependency Vulnerabilities**: 0 critical

#### Performance Gates
- **Response Time P95**: Maximum 500ms
- **Response Time P99**: Maximum 1000ms
- **Memory Usage**: Within defined limits
- **CPU Usage**: Within defined limits

#### Compliance Gates
- **HIPAA Compliance**: All requirements met
- **GDPR Compliance**: All requirements met
- **SOX Compliance**: All requirements met
- **PCI Compliance**: All requirements met

### Gate Enforcement

Gates are enforced through:

1. **Pre-commit Hooks**: Basic checks before code commit
2. **CI/CD Pipeline**: Comprehensive checks during build
3. **Manual Validation**: On-demand gate checking
4. **Automated Reports**: Regular gate status reports

## 🏛️ Compliance Mapping

### Industry to Compliance Mapping

| Industry | Primary Compliance | Secondary Compliance | Additional Requirements |
|----------|-------------------|---------------------|------------------------|
| **Healthcare** | HIPAA | GDPR | FDA (if applicable) |
| **E-commerce** | PCI, GDPR | SOX | Consumer protection laws |
| **Finance** | SOX, PCI | GDPR | Basel III, MiFID II |
| **SaaS** | GDPR | SOC 2 | Industry-specific |
| **Enterprise** | GDPR | SOC 2 | Custom compliance |

### Compliance Implementation

Each compliance requirement includes:

- **Technical Controls**: Encryption, access controls, audit logging
- **Process Controls**: Change management, incident response
- **Documentation**: Policies, procedures, evidence collection
- **Monitoring**: Continuous compliance monitoring and reporting

## 🔒 Isolation Strategy

### Default Behavior

When a root `.cursor` directory exists:

- **Output Location**: `../_generated` (parent directory)
- **Rule Emission**: Disabled by default
- **Asset Inclusion**: Minimal assets only

### Override Options

- **`--include-cursor-assets`**: Force include Cursor assets
- **`--minimal-cursor`**: Include minimal Cursor configuration
- **`--output-dir`**: Specify custom output directory

### Benefits

- **Prevents Conflicts**: Avoids rule conflicts between projects
- **Clean Separation**: Keeps generated projects isolated
- **Flexible Integration**: Allows controlled integration when needed

## 📋 Context Reports

### Report Generation

Generate comprehensive project context reports:

```bash
python scripts/write_context_report.py \
  --project-name "myapp" \
  --industry healthcare \
  --frontend nextjs \
  --backend fastapi \
  --database postgres \
  --auth auth0 \
  --deploy aws \
  --compliance hipaa,gdpr \
  --output .cursor/ai-governor/project.json
```

### Report Contents

- **Project Metadata**: Name, industry, technology stack
- **Compliance Status**: Current compliance state
- **Quality Metrics**: Test coverage, performance metrics
- **Task Status**: Current task progress and blockers
- **Configuration**: Current project configuration

## 🎯 Best Practices

### Workflow Best Practices

1. **Start with Bootstrap**: Always begin with `/0-bootstrap-project`
2. **Plan Before Execution**: Use `/1-create-prd` to establish clear requirements
3. **Sync Regularly**: Use `/sync-tasks` whenever code changes
4. **Quality First**: Run `/4-quality-control` before major milestones
5. **Document Learnings**: Use `/5-implementation-retrospective` for continuous improvement

### Task Management Best Practices

1. **Clear Dependencies**: Define clear task dependencies
2. **Regular Updates**: Update task states frequently
3. **Block Resolution**: Address blockers immediately
4. **Progress Tracking**: Monitor progress through all phases

### Quality Assurance Best Practices

1. **Early Testing**: Start testing early in development
2. **Continuous Integration**: Use CI/CD for automated quality checks
3. **Compliance Validation**: Regular compliance checking
4. **Performance Monitoring**: Continuous performance monitoring

## 🚨 Troubleshooting

### Common Issues

#### Issue: "No evidence found in codebase"
**Solution**: Ensure you're in the correct directory and files exist

#### Issue: "Conflicting evidence found"
**Solution**: Review conflicting files and resolve inconsistencies

#### Issue: "Partial evidence suggests..."
**Solution**: Gather more information or make reasonable assumptions

#### Issue: "Rule conflicts detected"
**Solution**: Review rule hierarchy and resolve conflicts

### Debug Commands

```bash
# Check project structure
ls -la

# Validate configuration
python scripts/validate_tasks.py --tasks tasks.json

# Check quality gates
python scripts/enforce_gates.py --config gates_config.yaml --verbose

# Generate context report
python scripts/write_context_report.py --project-name myapp --verbose
```

### Getting Help

1. **Check Documentation**: Review this guide and other docs
2. **Validate Configuration**: Use validation scripts
3. **Check Logs**: Review error logs and output
4. **Community Support**: Use GitHub issues for support

## 📚 Additional Resources

- [Architecture Guide](docs/ARCHITECTURE.md)
- [Compliance Guide](docs/COMPLIANCE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Contributing Guide](CONTRIBUTING.md)
- [API Documentation](docs/API.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to:

- Report bugs
- Request features
- Submit pull requests
- Join our community

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Remember**: This workflow system is designed to be flexible and adaptable. Don't hesitate to customize it for your specific needs while maintaining the core principles of quality, compliance, and continuous improvement.
