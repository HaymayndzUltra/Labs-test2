Commit: 007eaa7aac2d66dd8fe1b2dfb7ca339b22a8ebbd

Timestamp: 2025-09-15T05:58:35Z

MISSING: /workspace/SECURITY.md
MISSING: /workspace/ARCHITECTURE.md
== /workspace/RUNBOOK.md (first 60 lines) ==
# Runbook

## Testing & QA (Phase 05)
- Run unit tests: `make test-unit`
- Scripts-only tests: `make test-scripts`
- Coverage (scripts): `make coverage-scripts`
- Security (scripts baseline): `make security-scripts`

## Deployment (Phase 06)
- CI jobs:
  - `workflows_validation`: validates workflow docs
  - `gates_enforcer`: enforces coverage/perf/security gates
- Local simulation:
  - Coverage gate (Node): ensure `coverage/coverage-summary.json` exists
  - Perf gate: place `reports/perf.json` with `{ "p95_ms": <value> }`

## Monitoring & Observability (Phase 10)
- Ensure structured logs with correlation IDs
- Verify "No PHI in logs" policy is applied
- Maintain dashboards and alerts (export JSON/YAML for evidence)

## Backup & Restore
- Backup workflows/rules: `make backup-workflows`
- Restore test: `make restore-test`
- Evidence: `backups/last_success.json`, `backups/last_restore.json`

## Troubleshooting
- Workflow validator failures: add missing sections/frontmatter to the referenced file
- Compliance failures: explicitly include HIPAA controls in 02/08/10
- CI failing gates:
  - Coverage below threshold: raise tests or adjust gates_config.yaml (with approval)
  - Perf p95 above threshold: investigate regressions; optimize hotspots
  - High-severity findings: remediate; rerun scans
== /workspace/CONTRIBUTING.md (first 60 lines) ==
# Contributing to Client Project Generator

Thank you for your interest in contributing to the Client Project Generator! This guide will help you get started.

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive criticism
- Respect differing viewpoints and experiences

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Docker and Docker Compose
- Git
- Node.js 18+ (for testing frontend templates)
- Make

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/client-project-generator.git
   cd client-project-generator
   ```

3. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. Install development dependencies:
   ```bash
   pip install -r requirements-dev.txt
   ```

5. Install pre-commit hooks:
   ```bash
   pre-commit install
   ```

## 📝 Contribution Types

### 1. Adding New Templates

#### Frontend Template
1. Create template directory: `template-packs/frontend/<framework>/`
2. Add base, enterprise, and compliance variants
3. Include package.json, configuration files, and example components
4. Update `project_generator/templates/template_engine.py`

Example structure:
```
template-packs/frontend/vue/

