# Client Project Generator

[![CI Status](https://github.com/your-org/client-project-generator/workflows/CI/badge.svg)](https://github.com/your-org/client-project-generator/actions)
[![Workflow Documentation](https://img.shields.io/badge/docs-workflow-blue)](WORKFLOW_GUIDE.md)
[![Quick Reference](https://img.shields.io/badge/quick-reference-green)](WORKFLOW_QUICK_REFERENCE.md)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A comprehensive, industry-aware project generator that creates production-ready applications with built-in compliance, CI/CD pipelines, and AI Governor Framework integration.

## 🚀 Features

- **Industry-Specific Templates**: Pre-configured for Healthcare, Finance, E-commerce, SaaS, and Enterprise
- **Compliance Ready**: Built-in support for HIPAA, GDPR, SOX, and PCI compliance
- **Full Stack Support**: Frontend (Next.js, Nuxt, Angular, Expo), Backend (FastAPI, Django, NestJS, Go)
- **DevEx Excellence**: Docker, DevContainers, Makefile, VS Code configurations
- **CI/CD Pipelines**: GitHub Actions with quality gates and security scanning
- **AI Governor Integration**: Seamless integration with AI development workflows
- **Smart Selection**: Policy-driven technology recommendations based on industry

## 📋 Prerequisites

- Python 3.8+
- Docker and Docker Compose
- Git
- Node.js 18+ (for frontend projects)
- Make

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/client-project-generator.git
cd client-project-generator
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Make the generator executable:
```bash
chmod +x scripts/generate_client_project.py
```

## 🎯 Quick Start

### Interactive Mode (Recommended for first-time users)

```bash
./scripts/generate_client_project.py --name my-app --industry healthcare --project-type web -i
```

### Command Line Mode

```bash
./scripts/generate_client_project.py \
  --name acme-health \
  --industry healthcare \
  --project-type fullstack \
  --frontend nextjs \
  --backend fastapi \
  --database postgres \
  --auth auth0 \
  --deploy aws \
  --compliance hipaa
```

## 📚 Usage Guide

### Available Options

| Flag | Options | Description |
|------|---------|-------------|
| `--name` | Any string | Project name (required) |
| `--industry` | healthcare, finance, ecommerce, saas, enterprise | Industry vertical (required) |
| `--project-type` | web, mobile, api, fullstack, microservices | Project type (required) |
| `--frontend` | nextjs, nuxt, angular, expo, none | Frontend framework |
| `--backend` | fastapi, django, nestjs, go, none | Backend framework |
| `--database` | postgres, mongodb, firebase, none | Database technology |
| `--auth` | auth0, firebase, cognito, custom, none | Authentication provider |
| `--deploy` | aws, azure, gcp, vercel, self-hosted | Deployment target |
| `--compliance` | hipaa, gdpr, sox, pci | Compliance requirements (comma-separated) |
| `--features` | Custom features | Additional features (comma-separated) |

### Troubleshooting

- Running inside a repo with a root `.cursor/`:
  - By default, the generator will not emit `.cursor` assets and will place output in `../_generated`. Use `--include-cursor-assets` to force include.
- Docker not installed:
  - The generator requires Docker for the default dev environment. For a dry structure preview, run with `--dry-run` (still validates configuration).
- Template tests (optional):
  - Backend FastAPI: see `template-packs/backend/fastapi/base/requirements.txt` and run `pytest` under that template.
  - Django: run `python manage.py test` in a generated project.
  - Next.js: run `npm ci && npm test` in `frontend` (jest + next-jest configured).
  - Angular: run `npm ci && npm run test` in `frontend`.


### Industry Examples

#### Healthcare Application
```bash
./scripts/generate_client_project.py \
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

#### Financial Services API
```bash
./scripts/generate_client_project.py \
  --name trading-api \
  --industry finance \
  --project-type api \
  --backend go \
  --database postgres \
  --auth cognito \
  --deploy aws \
  --compliance sox,pci \
  --features "real-time-quotes,transaction-processing,audit-trail"
```

#### E-commerce Platform
```bash
./scripts/generate_client_project.py \
  --name shop-platform \
  --industry ecommerce \
  --project-type fullstack \
  --frontend nextjs \
  --backend django \
  --database postgres \
  --auth firebase \
  --deploy vercel \
  --compliance pci,gdpr \
  --features "inventory,payment-processing,recommendations"
```

## 📁 Generated Project Structure

```
<project-name>/
├── .cursor/                    # AI Governor integration
│   ├── rules/                  # Project and compliance rules
│   │   ├── client-specific-rules.mdc
│   │   ├── industry-compliance-*.mdc
│   │   └── master-rules/
│   ├── dev-workflow/           # AI workflow configurations
│   └── AI_INSTRUCTIONS.md      # AI development guide
├── .devcontainer/              # VS Code DevContainer
├── .github/workflows/          # CI/CD pipelines
│   ├── ci-lint.yml
│   ├── ci-test.yml
│   ├── ci-security.yml
│   └── ci-deploy.yml
├── .vscode/                    # VS Code configurations
├── frontend/                   # Frontend application
├── backend/                    # Backend application
├── database/                   # Database schemas and migrations
├── docs/                       # Documentation
├── tests/                      # Test suites
├── docker-compose.yml          # Local development
├── Makefile                    # Development commands
├── gates_config.yaml           # CI/CD quality gates
└── README.md                   # Project documentation
```

## 🔧 Development Workflow

The Client Project Generator follows a structured 6-phase workflow:

### Phase Overview

1. **Bootstrap** (`/0-bootstrap-project`) - Fast, portable bootstrap with dry-run-first and HALT checkpoints. Supports brief-first and scaffold-first starts. **Never deploy.**
2. **Plan** (`/1-create-prd`) - Generate PRD and planning artifacts from brief. **Never deploy.**
3. **Tasks** (`/2-generate-tasks`) - Convert plan tasks into actionable tasks.json, add personas/acceptance, validate DAG. **Never deploy.**
4. **Sync** (`/sync-tasks`) - Scan repo (routes/pages/migrations/tests) and reconcile tasks.json with actual code. **Idempotent, never deploy.**
5. **Execute** (`/3-process-tasks`) - Execute tasks per lane (backend/frontend/devops) with HALTs, update state, record run history. **Never deploy.**
6. **Quality** (`/4-quality-control`) - Validate completed scope, run tests/coverage/lints, enforce numeric gates. **Never deploy.**
7. **Review** (`/5-implementation-retrospective`) - Summarize outcomes, capture learnings, propose rule/process improvements. **Never deploy.**

### Quick Start

After generating a project:

1. **Navigate to project**:
   ```bash
   cd <project-name>
   ```

2. **Initial setup**:
   ```bash
   make setup
   ```

3. **Start development**:
   ```bash
   make dev
   ```

4. **Available commands**:
   - `make test` - Run tests
   - `make lint` - Run linters
   - `make build` - Build for production
   - `make deploy` - Deploy application
   - `make help` - Show all commands

### Workflow Documentation

- **[Complete Workflow Guide](WORKFLOW_GUIDE.md)** - Detailed documentation
- **[Quick Reference](WORKFLOW_QUICK_REFERENCE.md)** - Command cheat sheet

## 🤖 AI Governor Integration

Each generated project includes:

### Development Workflows

#### Slash Commands (Quick Actions)
- **Bootstrap**: `/0-bootstrap-project` - Fast, portable bootstrap with HALT checkpoints
- **PRD Creation**: `/1-create-prd` - Generate PRD and planning artifacts from brief
- **Task Generation**: `/2-generate-tasks` - Convert plan tasks into actionable tasks.json
- **Task Sync**: `/sync-tasks` - Scan repo and reconcile tasks.json with actual code
- **Task Execution**: `/3-process-tasks` - Execute tasks per lane with state management
- **Quality Control**: `/4-quality-control` - Validate scope, run tests, enforce gates
- **Retrospective**: `/5-implementation-retrospective` - Summarize outcomes and improve

#### AI Workflow Protocols (Detailed Instructions)
- **Bootstrap**: `Apply instructions from .cursor/dev-workflow/0-bootstrap-your-project.md`
- **PRD Creation**: `Apply instructions from .cursor/dev-workflow/1-create-prd.md`
- **Task Generation**: `Apply instructions from .cursor/dev-workflow/2-generate-tasks.md`
- **Task Execution**: `Apply instructions from .cursor/dev-workflow/3-process-tasks.md`
- **Quality Control**: `Apply instructions from .cursor/dev-workflow/4-quality-control-protocol.md`
- **Retrospective**: `Apply instructions from .cursor/dev-workflow/5-implementation-retrospective.md`

### Active Rules
- Client-specific development standards
- Industry compliance requirements
- Master quality and safety rules
- Documentation guidelines

### Workflow & Gates
- Workflow docs live in `docs/workflows` with YAML frontmatter for discoverability.
- Validate locally: `python3 scripts/validate_workflows.py --all`.
- Compliance check (docs): `python3 scripts/check_compliance_docs.py` → `validation/compliance_report.json`.
- CI enforces gates (coverage/perf/security) via `.github/workflows/ci.yml` jobs `workflows_validation` and `gates_enforcer`.

## 🔒 Compliance Features

### HIPAA (Healthcare)
- PHI encryption at rest and in transit
- Audit logging for all data access
- 15-minute session timeout
- Access controls and user authentication

### GDPR (EU Privacy)
- Consent management
- Right to deletion
- Data portability
- Privacy by design

### SOX (Financial)
- Change control procedures
- Audit trails
- Segregation of duties
- Financial data integrity

### PCI (Payment Cards)
- Cardholder data protection
- Network segmentation
- Tokenization
- Security scanning

## 🚦 CI/CD Pipeline

Generated projects include:

1. **Lint Stage**: Code quality checks
2. **Test Stage**: Unit, integration, and E2E tests
3. **Security Stage**: Dependency scanning, SAST, secret detection
4. **Build Stage**: Docker image creation
5. **Deploy Stage**: Environment-specific deployment

Quality gates are configured based on industry requirements.

## 📊 Policy-Driven Selection

The generator uses a Policy DSL to recommend technologies:

```yaml
healthcare:
  web_stack:
    required:
      frontend: ["nextjs", "nuxt"]
      backend: ["fastapi", "django"]
      auth: ["auth0", "cognito"]  # HIPAA-compliant
```

## 🛡️ Security Features

- Pre-commit hooks for secret detection
- Security headers configuration
- Input validation templates
- Encryption utilities
- Rate limiting setup
- CORS configuration

## 📖 Additional Documentation

- [**Workflow Guide**](WORKFLOW_GUIDE.md) - Complete workflow documentation
- [**Workflow Quick Reference**](WORKFLOW_QUICK_REFERENCE.md) - Quick command reference
- [Architecture Guide](docs/ARCHITECTURE.md)
- [Compliance Guide](docs/COMPLIANCE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Contributing Guide](CONTRIBUTING.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your templates or improvements
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🆘 Support

- GitHub Issues: [Report bugs or request features](https://github.com/your-org/client-project-generator/issues)
- Documentation: [Full documentation](https://docs.your-org.com/client-generator)
- Community: [Join our Discord](https://discord.gg/your-org)