# Client Project Generator

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

## 🤖 AI Governor Integration

Each generated project includes:

### AI Development Workflows
- **Analyze**: `Apply instructions from .cursor/dev-workflow/1-analyze-and-plan-prd.md`
- **Plan**: `Apply instructions from .cursor/dev-workflow/2-create-actionable-plan.md`
- **Execute**: `Apply instructions from .cursor/dev-workflow/3-execute-tasks-parallel.md`
- **Review**: `Apply instructions from .cursor/dev-workflow/4-retrospective-learnings.md`

### Active Rules
- Client-specific development standards
- Industry compliance requirements
- Master quality and safety rules
- Documentation guidelines

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