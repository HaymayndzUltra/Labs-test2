"""
Project Generator Core
Main project generation logic
"""

import os
import json
import shutil
import subprocess
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime

from .validator import ProjectValidator
from .industry_config import IndustryConfig
from ..templates.template_engine import TemplateEngine


class ProjectGenerator:
    """Main project generator class"""
    
    def __init__(self, args, validator: ProjectValidator, config: IndustryConfig):
        self.args = args
        self.validator = validator
        self.config = config
        self.template_engine = TemplateEngine()
        # When True, do not emit any .cursor assets (rules, tools, ai-governor) into generated projects
        self.no_cursor_assets = bool(getattr(self.args, 'no_cursor_assets', False))
        self.project_root = None
    
    def generate(self) -> Dict[str, Any]:
        """Generate the complete project"""
        try:
            # Create project directory
            self.project_root = Path(self.args.output_dir) / self.args.name
            if self.project_root.exists():
                if getattr(self.args, 'force', False):
                    shutil.rmtree(self.project_root)
                else:
                    return {
                        'success': False,
                        'error': f"Directory {self.project_root} already exists (use --force to overwrite)"
                    }
            
            self.project_root.mkdir(parents=True, exist_ok=True)
            
            # Generate base structure
            self._create_base_structure()
            
            # Generate technology-specific components
            if self.args.frontend != 'none':
                self._generate_frontend()
            
            if self.args.backend != 'none':
                self._generate_backend()
            
            if self.args.database != 'none':
                self._setup_database()
            
            # Generate DevEx assets
            self._generate_devex_assets()
            
            # Generate CI/CD workflows
            self._generate_cicd_workflows()
            
            # Generate compliance and rules
            self._generate_compliance_rules()
            
            # Prepare AI Governor assets (tools, router config, sample logs)
            self._prepare_ai_governor_assets()
            
            # Generate industry gates
            self._generate_industry_gates()
            
            # Generate documentation
            self._generate_documentation()
            
            # Initialize git repository
            if not self.args.no_git:
                self._initialize_git()
                # Install pre-commit hook ONLY when .cursor assets are included
                # and the tools directory exists in the generated project
                tools_dir = self.project_root / '.cursor' / 'tools'
                if (not self.no_cursor_assets) and tools_dir.exists():
                    self._install_precommit_hook()
            
            # Generate setup commands
            setup_commands = self._generate_setup_commands()
            
            return {
                'success': True,
                'project_path': str(self.project_root),
                'setup_commands': setup_commands,
                'next_steps': self._generate_next_steps()
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def _create_base_structure(self):
        """Create the base project structure"""
        directories = [
            '.devcontainer',
            '.github/workflows',
            '.vscode',
            'docs',
            'scripts',
            'tests'
        ]
        if not self.no_cursor_assets:
            directories.extend(['.cursor/rules', '.cursor/dev-workflow'])
        
        for directory in directories:
            (self.project_root / directory).mkdir(parents=True, exist_ok=True)
        
        # If repo has dev-workflow docs, copy them into the project for in-editor triggers
        try:
            if not self.no_cursor_assets:
                repo_root = Path(__file__).resolve().parents[2]
                source_devwf = repo_root / '.cursor' / 'dev-workflow'
                if source_devwf.exists():
                    shutil.copytree(source_devwf, self.project_root / '.cursor' / 'dev-workflow', dirs_exist_ok=True)
        except Exception:
            pass
        
        # Create .gitignore
        gitignore_content = self._generate_gitignore()
        (self.project_root / '.gitignore').write_text(gitignore_content)
        
        # Create README.md
        readme_content = self._generate_readme()
        (self.project_root / 'README.md').write_text(readme_content)
        
        # Create project configuration
        project_config = {
            'name': self.args.name,
            'industry': self.args.industry,
            'project_type': self.args.project_type,
            'stack': {
                'frontend': self.args.frontend,
                'backend': self.args.backend,
                'database': self.args.database,
                'auth': self.args.auth,
                'deploy': self.args.deploy
            },
            'features': self.config.merge_features(self.args.features),
            'compliance': self.args.compliance.split(',') if self.args.compliance else []
        }
        
        if not self.no_cursor_assets:
            (self.project_root / '.cursor' / 'project.json').write_text(
                json.dumps(project_config, indent=2)
            )
    
    def _generate_frontend(self):
        """Generate frontend application"""
        frontend_dir = self.project_root / 'frontend'
        frontend_dir.mkdir(exist_ok=True)
        
        # Copy template files
        template_path = Path(__file__).parent.parent.parent / 'template-packs' / 'frontend' / self.args.frontend
        
        if template_path.exists():
            # Use the appropriate template variant
            variant = 'enterprise' if self.args.industry in ['healthcare', 'finance', 'enterprise'] else 'base'
            variant_path = template_path / variant
            
            if variant_path.exists():
                shutil.copytree(variant_path, frontend_dir, dirs_exist_ok=True)
            else:
                # Fallback to base template
                base_path = template_path / 'base'
                if base_path.exists():
                    shutil.copytree(base_path, frontend_dir, dirs_exist_ok=True)
        
        # Process templates with project-specific values
        self._process_templates(frontend_dir)
        
        # Add industry-specific components
        self._add_industry_components(frontend_dir, 'frontend')
    
    def _generate_backend(self):
        """Generate backend application"""
        backend_dir = self.project_root / 'backend'
        backend_dir.mkdir(exist_ok=True)
        
        # Copy template files
        template_path = Path(__file__).parent.parent.parent / 'template-packs' / 'backend' / self.args.backend
        
        if template_path.exists():
            # Special-case: NestJS Prisma variant selection via --nestjs-orm
            if self.args.backend == 'nestjs' and getattr(self.args, 'nestjs_orm', 'typeorm') == 'prisma':
                prisma_path = template_path / 'prisma'
                if prisma_path.exists():
                    shutil.copytree(prisma_path, backend_dir, dirs_exist_ok=True)
                else:
                    # Fallback to base if prisma variant missing
                    base_path = template_path / 'base'
                    if base_path.exists():
                        shutil.copytree(base_path, backend_dir, dirs_exist_ok=True)
            else:
                # Use the appropriate template variant for other backends
                variant = 'microservice' if self.args.project_type == 'microservices' else 'base'
                variant = 'enterprise' if self.args.industry in ['healthcare', 'finance', 'enterprise'] else variant
                
                variant_path = template_path / variant
                if variant_path.exists():
                    shutil.copytree(variant_path, backend_dir, dirs_exist_ok=True)
                else:
                    # Fallback to base template
                    base_path = template_path / 'base'
                    if base_path.exists():
                        shutil.copytree(base_path, backend_dir, dirs_exist_ok=True)
        
        # Process templates
        self._process_templates(backend_dir)
        
        # Add industry-specific APIs
        self._add_industry_components(backend_dir, 'backend')
    
    def _setup_database(self):
        """Setup database configuration"""
        db_dir = self.project_root / 'database'
        db_dir.mkdir(exist_ok=True)
        
        # Copy database templates
        template_path = Path(__file__).parent.parent.parent / 'template-packs' / 'database' / self.args.database
        
        if template_path.exists():
            shutil.copytree(template_path, db_dir, dirs_exist_ok=True)
        
        # Create docker-compose for database
        if self.args.database in ['postgres', 'mongodb']:
            self._add_database_to_docker_compose()

    def _process_templates(self, root: Path):
        """Process text templates by replacing simple placeholders with project values."""
        try:
            mapping = {
                '{{PROJECT_NAME}}': self.args.name,
                '{{INDUSTRY}}': self.args.industry,
                '{{PROJECT_TYPE}}': self.args.project_type,
                '{{FRONTEND}}': self.args.frontend,
                '{{BACKEND}}': self.args.backend,
                '{{DATABASE}}': self.args.database,
                '{{AUTH}}': self.args.auth,
                '{{DEPLOY}}': self.args.deploy,
            }
            text_exts = {
                '.md', '.mdc', '.txt', '.json', '.yml', '.yaml', '.toml', '.ini', '.env',
                '.js', '.jsx', '.ts', '.tsx', '.py', '.go', '.html', '.css', '.scss', '.sh'
            }
            for path in root.rglob('*'):
                if path.is_file() and path.suffix.lower() in text_exts:
                    try:
                        content = path.read_text()
                        for key, val in mapping.items():
                            content = content.replace(key, str(val))
                        path.write_text(content)
                    except Exception:
                        # Skip files we can't read/write safely
                        pass
        except Exception:
            # Non-fatal: template processing is best-effort
            pass

    def _add_industry_components(self, target_dir: Path, component_type: str):
        """Add industry-specific components (placeholder no-op)."""
        # Intentionally minimal for now; templates already include industry variants.
        return

    def _add_database_to_docker_compose(self):
        """Ensure database service is present in docker-compose (handled by _generate_docker_compose)."""
        # No action required: _generate_docker_compose already includes DB services
        # for postgres/mongodb based on self.args.database.
        return
    
    def _generate_devex_assets(self):
        """Generate developer experience assets"""
        # .devcontainer/devcontainer.json
        devcontainer_config = self._generate_devcontainer_config()
        (self.project_root / '.devcontainer' / 'devcontainer.json').write_text(
            json.dumps(devcontainer_config, indent=2)
        )
        
        # docker-compose.yml
        docker_compose = self._generate_docker_compose()
        (self.project_root / 'docker-compose.yml').write_text(docker_compose)
        
        # Makefile
        makefile = self._generate_makefile()
        (self.project_root / 'Makefile').write_text(makefile)
        
        # .vscode snippets
        self._generate_vscode_snippets()
    
    def _generate_cicd_workflows(self):
        """Generate CI/CD workflow files"""
        workflows_dir = self.project_root / '.github' / 'workflows'
        
        # CI Lint workflow
        lint_workflow = self._generate_lint_workflow()
        (workflows_dir / 'ci-lint.yml').write_text(lint_workflow)
        
        # CI Test workflow
        test_workflow = self._generate_test_workflow()
        (workflows_dir / 'ci-test.yml').write_text(test_workflow)
        
        # Security scan workflow
        security_workflow = self._generate_security_workflow()
        (workflows_dir / 'ci-security.yml').write_text(security_workflow)
        
        # Deploy workflow
        if self.args.deploy != 'self-hosted':
            deploy_workflow = self._generate_deploy_workflow()
            (workflows_dir / 'ci-deploy.yml').write_text(deploy_workflow)
        
        # Gates configuration
        gates_config = self._generate_gates_config()
        (self.project_root / 'gates_config.yaml').write_text(gates_config)
    
    def _generate_compliance_rules(self):
        """Generate compliance and project-specific rules"""
        if self.no_cursor_assets:
            return
        rules_dir = self.project_root / '.cursor' / 'rules'
        
        # Client-specific rules
        client_rules = self._generate_client_rules()
        (rules_dir / 'client-specific-rules.mdc').write_text(client_rules)
        
        # Industry compliance rules
        if self.args.compliance:
            for compliance in self.args.compliance.split(','):
                compliance_rules = self._generate_compliance_rules_content(compliance.strip())
                (rules_dir / f'industry-compliance-{compliance}.mdc').write_text(compliance_rules)
        
        # Project workflow rules
        workflow_rules = self._generate_workflow_rules()
        (rules_dir / 'project-workflow.mdc').write_text(workflow_rules)
    
    def _generate_compliance_rules_content(self, compliance: str) -> str:
        """Generate Cursor-style .mdc content with YAML frontmatter for a compliance standard."""
        c = (compliance or '').strip().lower()
        title_map = {
            'hipaa': 'HIPAA Compliance Rules',
            'gdpr': 'GDPR Compliance Rules',
            'sox': 'SOX Compliance Rules',
            'pci': 'PCI DSS Compliance Rules',
        }
        desc_map = {
            'hipaa': 'Healthcare PHI protection: encryption, access control, audit logging, session timeout',
            'gdpr': 'EU data protection: consent, right to erasure, data export, privacy by design',
            'sox': 'Financial reporting integrity: change control, audit trail, access reviews',
            'pci': 'Cardholder data security: no PAN storage, tokenization, segmentation, encryption',
        }
        title = title_map.get(c, f"{c.upper()} Compliance Rules")
        # Extended triggers to work with Cursor AI workflows (includes update/refresh/sync and planning/execution verbs)
        triggers = [
            'commit', 'ci', 'update all', 'refresh all', 'sync all', 'reload all',
            'bootstrap', 'setup', 'initialize', 'project start', 'master plan',
            'framework ecosystem', 'background agents', 'prd', 'requirements',
            'feature planning', 'product spec', 'task generation', 'technical planning',
            'implementation plan', 'execute', 'implement', 'process tasks', 'development',
            'retrospective', 'review', 'improvement', 'post-implementation',
            'parallel execution', 'coordination', 'multi-agent', 'analyze'
        ]
        triggers_str = ','.join(triggers)
        description_meta = (
            f"TAGS: [compliance,{c}] | TRIGGERS: {triggers_str} | SCOPE: {self.args.name} | DESCRIPTION: {desc_map.get(c, title)}"
        )

        # Minimal control checklist per compliance
        if c == 'hipaa':
            body_lines = [
                f"# {title}",
                "", 
                "## Required Controls [STRICT]",
                "- PHI encrypted at rest (AES-256) and in transit (TLS 1.2+)",
                "- Audit logging for all PHI access and changes",
                "- Minimum necessary access (RBAC) with reviews",
                "- 15-minute session timeout and re-authentication",
                "- No PHI in logs or error messages",
                "",
                "## CI Gates",
                "- Block merge if security scan reports critical vulns",
                "- Enforce unit tests for PHI-related modules",
                "- Validate presence of HIPAA rules in .cursor/rules/",
            ]
        elif c == 'gdpr':
            body_lines = [
                f"# {title}",
                "",
                "## Required Controls [STRICT]",
                "- Consent collection and management",
                "- Data export (access) and deletion workflows",
                "- Data minimization and retention policies",
                "- Privacy by design reviews",
                "",
                "## CI Gates",
                "- Verify privacy endpoints present in API",
                "- Ensure no PII in logs",
            ]
        elif c == 'sox':
            body_lines = [
                f"# {title}",
                "",
                "## Required Controls [STRICT]",
                "- Change control with approvals and rollback",
                "- Audit trail for financial data changes",
                "- Segregation of duties",
                "- Quarterly access reviews",
                "",
                "## CI Gates",
                "- Block merge without migrations audit approval",
                "- Enforce coverage for critical financial modules",
            ]
        elif c == 'pci':
            body_lines = [
                f"# {title}",
                "",
                "## Required Controls [STRICT]",
                "- No storage of sensitive authentication data",
                "- Tokenization of cardholder data",
                "- Network segmentation of CDE",
                "- Encryption at rest and in transit",
                "",
                "## CI Gates",
                "- Secret scanning must pass",
                "- Dependency scan must have no critical issues",
            ]
        else:
            body_lines = [f"# {title}", "", "- Define controls for this standard"]

        frontmatter = [
            "---",
            "alwaysApply: true",
            f"description: \"{description_meta}\"",
            "---",
            "",
        ]
        return "\n".join(frontmatter + body_lines)
    
    def _prepare_ai_governor_assets(self):
        """Prepare AI Governor assets (.cursor/tools and router config)"""
        if self.no_cursor_assets:
            return
        tools_dir = self.project_root / '.cursor' / 'tools'
        tools_dir.mkdir(parents=True, exist_ok=True)

        # Minimal validate_rules.py
        validate_rules = (
            "#!/usr/bin/env python3\n"
            "import os, sys, glob\n"
            "rules_dir = os.path.join('.cursor','rules')\n"
            "mdc_files = glob.glob(os.path.join(rules_dir, '*.mdc'))\n"
            "if not mdc_files:\n"
            "    print('[RULES] No .mdc rules found; failing pre-commit.')\n"
            "    sys.exit(1)\n"
            "print(f'[RULES] Found {len(mdc_files)} rule files.')\n"
        )
        (tools_dir / 'validate_rules.py').write_text(validate_rules)

        # Minimal check_compliance.py
        check_compliance = (
            "#!/usr/bin/env python3\n"
            "import json, os, sys\n"
            "proj_json = os.path.join('.cursor','project.json')\n"
            "if not os.path.exists(proj_json):\n"
            "    print('[COMPLIANCE] project.json missing; skipping.'); sys.exit(0)\n"
            "cfg = json.load(open(proj_json))\n"
            "req = set((cfg.get('compliance') or []))\n"
            "missing = [c for c in req if not os.path.exists(os.path.join('.cursor','rules', f'industry-compliance-{c}.mdc'))]\n"
            "if missing:\n"
            "    print('[COMPLIANCE] Missing compliance rules:', ', '.join(missing))\n"
            "    sys.exit(1)\n"
            "print('[COMPLIANCE] All required compliance rules present.')\n"
        )
        (tools_dir / 'check_compliance.py').write_text(check_compliance)

        # Router config and logs
        ai_dir = self.project_root / '.cursor' / 'ai-governor'
        ai_dir.mkdir(parents=True, exist_ok=True)
        (ai_dir / 'router-config.json').write_text(
            json.dumps(self._generate_ai_governor_router_config(), indent=2, sort_keys=True)
        )
        (ai_dir / 'sample-logs.json').write_text(
            json.dumps(self._generate_ai_governor_sample_logs(), indent=2, sort_keys=True)
        )
    
    def _generate_industry_gates(self):
        """Generate industry gates YAML files at project root"""
        import yaml
        # Healthcare gates
        hc = self._generate_healthcare_gates()
        (self.project_root / 'gates_config_healthcare.yaml').write_text(
            yaml.dump(hc, default_flow_style=False, sort_keys=True)
        )
        # Finance gates
        fin = self._generate_finance_gates()
        (self.project_root / 'gates_config_finance.yaml').write_text(
            yaml.dump(fin, default_flow_style=False, sort_keys=True)
        )
    
    def _generate_documentation(self):
        """Generate project documentation"""
        docs_dir = self.project_root / 'docs'
        
        # API documentation template
        if self.args.backend != 'none':
            api_docs = self._generate_api_docs_template()
            (docs_dir / 'API.md').write_text(api_docs)
        
        # Deployment guide
        deployment_guide = self._generate_deployment_guide()
        (docs_dir / 'DEPLOYMENT.md').write_text(deployment_guide)
        
        # Development guide
        dev_guide = self._generate_development_guide()
        (docs_dir / 'DEVELOPMENT.md').write_text(dev_guide)
        
        # Compliance documentation
        if self.args.compliance:
            compliance_docs = self._generate_compliance_documentation()
            (docs_dir / 'COMPLIANCE.md').write_text(compliance_docs)

    def _generate_api_docs_template(self) -> str:
        """Generate API.md template content based on backend selection"""
        lines: List[str] = []
        lines.append("# API Documentation")
        lines.append("")
        lines.append("## Overview")
        lines.append(f"This document describes the API endpoints for the {self.args.name} backend.")
        lines.append("")
        if self.args.backend == 'fastapi':
            lines.append("### FastAPI")
            lines.append("- Interactive docs available at /docs (Swagger UI)")
            lines.append("- Alternative docs at /redoc")
            lines.append("")
            lines.append("## Authentication")
            lines.append("- Bearer JWT via Authorization header")
            lines.append("")
            lines.append("## Example Endpoints")
            lines.append("- GET /health")
            lines.append("- GET /items?skip=0&limit=100")
            lines.append("- POST /items")
        elif self.args.backend == 'django':
            lines.append("### Django REST Framework")
            lines.append("- API root available at /api/")
            lines.append("- Browsable API if enabled")
            lines.append("")
            lines.append("## Authentication")
            lines.append("- Session or Token depending on setup")
            lines.append("")
            lines.append("## Example Endpoints")
            lines.append("- GET /api/health/")
            lines.append("- GET /api/items/?page=1")
            lines.append("- POST /api/items/")
        elif self.args.backend == 'nestjs':
            lines.append("### NestJS")
            lines.append("- Swagger docs at /api by default if configured")
            lines.append("")
            lines.append("## Authentication")
            lines.append("- JWT / Passport strategies depending on setup")
        elif self.args.backend == 'go':
            lines.append("### Go HTTP")
            lines.append("- Swagger/OpenAPI if configured")
        else:
            lines.append("No backend endpoints defined.")
        lines.append("")
        lines.append("## Error Handling")
        lines.append("- Errors follow a standard JSON shape with `message` and optional `code`.")
        return "\n".join(lines)
    def _generate_deployment_guide(self) -> str:
        """Generate DEPLOYMENT.md content (text-only; no external side-effects)."""
        lines: List[str] = []
        lines.append("# Deployment Guide")
        lines.append("")
        lines.append("## Environments")
        lines.append("- Development (docker-compose)\n- Staging\n- Production")
        lines.append("")
        lines.append("## Prerequisites")
        lines.append("- Docker and Docker Compose installed")
        if self.args.frontend != 'none':
            lines.append("- Node.js 18+ for frontend build")
        if self.args.backend in ['fastapi', 'django']:
            lines.append("- Python 3.11+ for backend tasks")
        if self.args.backend == 'nestjs':
            lines.append("- Node.js 18+ (NestJS)")
        if self.args.backend == 'go':
            lines.append("- Go 1.21+ (Go backend)")
        lines.append("")
        lines.append("## Local Development")
        lines.append("```bash\nmake setup\nmake dev\n```")
        lines.append("")
        lines.append("## Build")
        lines.append("```bash\nmake build\n```")
        lines.append("")
        lines.append("## Deployment Targets")
        target = (self.args.deploy or 'self-hosted').lower()
        if target == 'aws':
            lines.append("### AWS (ECS/Fargate) - Outline")
            lines.append("1. Build and push images to ECR\n2. Provision ECS service and Task Definition\n3. Configure load balancer and target group\n4. Attach IAM roles and secrets\n5. Run database migrations")
        elif target == 'azure':
            lines.append("### Azure (AKS/App Service) - Outline")
            lines.append("1. Build and push images to ACR\n2. Deploy to AKS with manifests or Bicep\n3. Configure Ingress and secrets\n4. Run migrations")
        elif target == 'gcp':
            lines.append("### GCP (Cloud Run/GKE) - Outline")
            lines.append("1. Build and push images to Artifact Registry\n2. Deploy to Cloud Run or GKE\n3. Configure IAM and secrets\n4. Run migrations")
        elif target == 'vercel':
            lines.append("### Vercel (Frontend) - Outline")
            lines.append("1. Connect repository to Vercel\n2. Configure environment variables\n3. Deploy via Git push")
        else:
            lines.append("### Self-hosted - Outline")
            lines.append("1. Provision VM\n2. Install Docker\n3. Use docker-compose to run services\n4. Configure reverse proxy and TLS")
        lines.append("")
        lines.append("## Post-Deployment")
        lines.append("- Health checks\n- Log aggregation\n- Metrics and alerts\n- Backup and restore checks")
        return "\n".join(lines)

    def _generate_ai_governor_router_config(self) -> Dict[str, Any]:
        return {
            'routing': {
                'industry': self.args.industry,
                'project_type': self.args.project_type,
                'rules': [
                    '1-master-rule-context-discovery',
                    '3-master-rule-code-quality-checklist'
                ]
            }
        }

    def _generate_ai_governor_sample_logs(self) -> Dict[str, Any]:
        return {
            'decisions': [
                {'timestamp': 'T+0', 'action': 'load_rules', 'rules_loaded': 2},
                {'timestamp': 'T+1', 'action': 'route', 'target': 'backend'},
            ]
        }

    def _generate_healthcare_gates(self) -> Dict[str, Any]:
        return {
            'quality_gates': {
                'coverage': {'min': 90},
                'critical_vulns': 0,
                'high_vulns': 0
            },
            'compliance': {'hipaa': True}
        }

    def _generate_finance_gates(self) -> Dict[str, Any]:
        return {
            'quality_gates': {
                'coverage': {'min': 90},
                'critical_vulns': 0,
                'high_vulns': 0
            },
            'compliance': {'sox': True, 'pci': True}
        }

    def _generate_ecommerce_gates(self) -> Dict[str, Any]:
        return {
            'quality_gates': {
                'coverage': {'min': 80},
                'critical_vulns': 0,
                'high_vulns': 2
            },
            'compliance': {'gdpr': True}
        }
    
    def _initialize_git(self):
        """Initialize git repository"""
        subprocess.run(['git', 'init'], cwd=self.project_root, capture_output=True)
        subprocess.run(['git', 'add', '.'], cwd=self.project_root, capture_output=True)
        subprocess.run(
            ['git', 'commit', '-m', f'Initial commit for {self.args.name}'],
            cwd=self.project_root,
            capture_output=True
        )
    
    def _install_precommit_hook(self):
        """Install pre-commit hook"""
        hook_path = self.project_root / '.git' / 'hooks' / 'pre-commit'
        hook_path.parent.mkdir(parents=True, exist_ok=True)
        hook_script = (
            "#!/usr/bin/env bash\n"
            "set -euo pipefail\n"
            "python .cursor/tools/validate_rules.py\n"
            "python .cursor/tools/check_compliance.py\n"
        )
        hook_path.write_text(hook_script)
        try:
            os.chmod(hook_path, 0o755)
        except Exception:
            pass
    
    def _generate_setup_commands(self) -> List[str]:
        """Generate setup commands for the project"""
        commands = []
        
        # Frontend setup
        if self.args.frontend != 'none':
            if self.args.frontend in ['nextjs', 'nuxt', 'angular']:
                commands.append('cd frontend && npm install')
            elif self.args.frontend == 'expo':
                commands.append('cd frontend && npm install && npx expo install')
        
        # Backend setup
        if self.args.backend != 'none':
            if self.args.backend == 'fastapi':
                commands.append('cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt')
            elif self.args.backend == 'django':
                commands.append('cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && python manage.py migrate')
            elif self.args.backend == 'nestjs':
                commands.append('cd backend && npm install')
            elif self.args.backend == 'go':
                commands.append('cd backend && go mod download')
        
        # Docker setup
        if self.args.database != 'none':
            commands.append('docker-compose up -d')
        
        return commands
    
    def _generate_next_steps(self) -> List[str]:
        """Generate next steps for the user"""
        steps = [
            f"cd {self.args.name}",
            "Review the generated project structure",
            "Update environment variables in .env files"
        ]
        
        if not self.args.no_install:
            steps.append("Run 'make setup' to install dependencies")
        
        steps.extend([
            "Run 'make dev' to start the development environment",
            "Review documentation in the docs/ directory"
        ])
        
        if self.args.compliance:
            steps.append("Review compliance requirements in docs/COMPLIANCE.md")
        
        return steps
    
    def get_project_structure(self) -> Dict[str, Any]:
        """Get the project structure for dry-run display"""
        structure = {
            'name': self.args.name,
            'children': []
        }
        
        # Add main directories
        if self.args.frontend != 'none':
            structure['children'].append({
                'name': 'frontend/',
                'children': [
                    {'name': 'src/'},
                    {'name': 'public/'},
                    {'name': 'package.json'}
                ]
            })
        
        if self.args.backend != 'none':
            structure['children'].append({
                'name': 'backend/',
                'children': [
                    {'name': 'src/'},
                    {'name': 'tests/'},
                    {'name': 'requirements.txt' if self.args.backend in ['fastapi', 'django'] else 'package.json'}
                ]
            })
        
        extras: List[Dict[str, Any]] = []
        if not self.no_cursor_assets:
            extras.append({
                'name': '.cursor/',
                'children': [
                    {'name': 'rules/'},
                    {'name': 'project.json'}
                ]
            })
        extras.append({
                'name': '.github/',
                'children': [
                    {'name': 'workflows/'}
                ]
            })
        extras.extend([
            {'name': 'docs/'},
            {'name': 'docker-compose.yml'},
            {'name': 'Makefile'},
            {'name': 'README.md'}
        ])
        structure['children'].extend(extras)
        
        return structure
    
    def display_structure(self, structure: Dict[str, Any], prefix: str = ""):
        """Display project structure in tree format"""
        print(f"{prefix}{structure['name']}")
        
        if 'children' in structure:
            for i, child in enumerate(structure['children']):
                is_last = i == len(structure['children']) - 1
                child_prefix = prefix + ("└── " if is_last else "├── ")
                self.display_structure(child, prefix + ("    " if is_last else "│   "))
    
    def run_setup_commands(self, project_path: str, commands: List[str]):
        """Run setup commands for the project"""
        print("\n🚀 Running setup commands...")
        
        for command in commands:
            print(f"\n  ▶ {command}")
            
            # Handle cd commands
            if command.startswith('cd '):
                parts = command.split(' && ')
                working_dir = os.path.join(project_path, parts[0].replace('cd ', ''))
                actual_command = ' && '.join(parts[1:]) if len(parts) > 1 else 'echo "Changed directory"'
                
                result = subprocess.run(
                    actual_command,
                    shell=True,
                    cwd=working_dir,
                    capture_output=True,
                    text=True
                )
            else:
                result = subprocess.run(
                    command,
                    shell=True,
                    cwd=project_path,
                    capture_output=True,
                    text=True
                )
            
            if result.returncode == 0:
                print("    ✅ Success")
            else:
                print(f"    ❌ Failed: {result.stderr}")
    
    # Template generation methods (simplified versions)
    def _generate_gitignore(self) -> str:
        """Generate .gitignore content"""
        return """# Dependencies
node_modules/
venv/
__pycache__/
*.pyc

# Environment
.env
.env.local
.env.*.local

# Build outputs
dist/
build/
.next/
.nuxt/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
.coverage
htmlcov/
.pytest_cache/

# Docker
*.pid
"""
    
    def _generate_readme(self) -> str:
        """Generate README.md content"""
        features_block = '\n'.join(['- ' + feature for feature in self.config.merge_features(self.args.features)])
        compliance_list = (self.args.compliance.split(',') if self.args.compliance else ['None'])
        compliance_block = '\n'.join(['- ' + c.upper() for c in compliance_list])
        comp_doc_line = '- [Compliance Documentation](docs/COMPLIANCE.md)' if self.args.compliance else ''
        return f"""# {self.args.name}

## Overview
{self.args.industry.title()} {self.args.project_type} application built with modern technologies.

## Technology Stack
- **Frontend**: {self.args.frontend if self.args.frontend != 'none' else 'N/A'}
- **Backend**: {self.args.backend if self.args.backend != 'none' else 'N/A'}
- **Database**: {self.args.database if self.args.database != 'none' else 'N/A'}
- **Authentication**: {self.args.auth if self.args.auth != 'none' else 'N/A'}
- **Deployment**: {self.args.deploy}

## Features
{features_block}

## Compliance
{compliance_block}

## Quick Start

1. Install dependencies:
   ```bash
   make setup
   ```

2. Start development environment:
   ```bash
   make dev
   ```

3. Run tests:
   ```bash
   make test
   ```

## Documentation
- [Development Guide](docs/DEVELOPMENT.md)
- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
{comp_doc_line}

## License
Proprietary - All rights reserved
"""
    
    def _generate_devcontainer_config(self) -> Dict[str, Any]:
        """Generate devcontainer configuration"""
        config = {
            "name": f"{self.args.name} Dev Container",
            "dockerComposeFile": "../docker-compose.yml",
            "service": "dev",
            "workspaceFolder": "/workspace",
            "features": {},
            "customizations": {
                "vscode": {
                    "extensions": [],
                    "settings": {}
                }
            }
        }
        
        # Add language-specific extensions
        if self.args.frontend in ['nextjs', 'nuxt', 'angular']:
            config["customizations"]["vscode"]["extensions"].extend([
                "dbaeumer.vscode-eslint",
                "esbenp.prettier-vscode",
                "bradlc.vscode-tailwindcss"
            ])
        
        if self.args.backend == 'fastapi' or self.args.backend == 'django':
            config["customizations"]["vscode"]["extensions"].extend([
                "ms-python.python",
                "ms-python.vscode-pylance",
                "ms-python.black-formatter"
            ])
        
        return config
    
    def _generate_docker_compose(self) -> str:
        """Generate docker-compose.yml content"""
        services = {
            "dev": {
                "build": ".",
                "volumes": [".:/workspace"],
                "ports": [],
                "environment": ["NODE_ENV=development"]
            }
        }
        
        # Add frontend ports
        if self.args.frontend != 'none':
            services["dev"]["ports"].append("3000:3000")
        
        # Add backend ports
        if self.args.backend != 'none':
            services["dev"]["ports"].append("8000:8000")
        
        # Add database service
        if self.args.database == 'postgres':
            services["postgres"] = {
                "image": "postgres:15",
                "environment": [
                    "POSTGRES_DB=myapp",
                    "POSTGRES_USER=postgres",
                    "POSTGRES_PASSWORD=postgres"
                ],
                "ports": ["5432:5432"],
                "volumes": ["postgres_data:/var/lib/postgresql/data"]
            }
        elif self.args.database == 'mongodb':
            services["mongodb"] = {
                "image": "mongo:6",
                "environment": [
                    "MONGO_INITDB_ROOT_USERNAME=admin",
                    "MONGO_INITDB_ROOT_PASSWORD=admin"
                ],
                "ports": ["27017:27017"],
                "volumes": ["mongo_data:/data/db"]
            }
        
        # Convert to YAML format (simplified)
        compose = "version: '3.8'\n\nservices:\n"
        for service, config in services.items():
            compose += f"  {service}:\n"
            for key, value in config.items():
                if isinstance(value, list):
                    compose += f"    {key}:\n"
                    for item in value:
                        compose += f"      - {item}\n"
                else:
                    compose += f"    {key}: {value}\n"
        
        if self.args.database in ['postgres', 'mongodb']:
            compose += "\nvolumes:\n"
            if self.args.database == 'postgres':
                compose += "  postgres_data:\n"
            else:
                compose += "  mongo_data:\n"
        
        return compose
    
    def _generate_makefile(self) -> str:
        """Generate Makefile content"""
        return f""".PHONY: setup dev test lint build deploy clean

# Setup project
setup:
	@echo "Setting up {self.args.name}..."
{'	cd frontend && npm install' if self.args.frontend != 'none' else ''}
{'	cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt' if self.args.backend in ['fastapi', 'django'] else ''}
{'	cd backend && npm install' if self.args.backend == 'nestjs' else ''}
{'	cd backend && go mod download' if self.args.backend == 'go' else ''}
	@echo "Setup complete!"

# Start development environment
dev:
	docker-compose up -d
{'	cd frontend && npm run dev &' if self.args.frontend != 'none' else ''}
{'	cd backend && python main.py' if self.args.backend == 'fastapi' else ''}
{'	cd backend && python manage.py runserver' if self.args.backend == 'django' else ''}
{'	cd backend && npm run start:dev' if self.args.backend == 'nestjs' else ''}
{'	cd backend && go run main.go' if self.args.backend == 'go' else ''}

# Run tests
test:
{'	cd frontend && npm test' if self.args.frontend != 'none' else ''}
{'	cd backend && pytest' if self.args.backend in ['fastapi', 'django'] else ''}
{'	cd backend && npm test' if self.args.backend == 'nestjs' else ''}
{'	cd backend && go test ./...' if self.args.backend == 'go' else ''}

# Run linters
lint:
{'	cd frontend && npm run lint' if self.args.frontend != 'none' else ''}
{'	cd backend && black . && flake8' if self.args.backend in ['fastapi', 'django'] else ''}
{'	cd backend && npm run lint' if self.args.backend == 'nestjs' else ''}
{'	cd backend && golangci-lint run' if self.args.backend == 'go' else ''}

# Build for production
build:
{'	cd frontend && npm run build' if self.args.frontend != 'none' else ''}
{'	cd backend && python -m build' if self.args.backend in ['fastapi', 'django'] else ''}
{'	cd backend && npm run build' if self.args.backend == 'nestjs' else ''}
{'	cd backend && go build -o app' if self.args.backend == 'go' else ''}

# Deploy application
deploy:
	@echo "Deploying to {self.args.deploy}..."
	# Add deployment commands here

# Clean build artifacts
clean:
	rm -rf node_modules/
	rm -rf venv/
	rm -rf __pycache__/
	rm -rf dist/
	rm -rf build/
	docker-compose down -v
"""
    
    def _generate_vscode_snippets(self):
        """Generate VS Code snippets"""
        snippets_dir = self.project_root / '.vscode'
        
        # Language-specific snippets
        if self.args.frontend in ['nextjs', 'nuxt']:
            snippets = {
                "React Component": {
                    "prefix": "rfc",
                    "body": [
                        "import React from 'react';",
                        "",
                        "interface ${1:ComponentName}Props {",
                        "  $2",
                        "}",
                        "",
                        "export const ${1:ComponentName}: React.FC<${1:ComponentName}Props> = ({$3}) => {",
                        "  return (",
                        "    <div>",
                        "      $0",
                        "    </div>",
                        "  );",
                        "};",
                        ""
                    ],
                    "description": "Create a React functional component"
                }
            }
            (snippets_dir / 'typescript.json').write_text(json.dumps(snippets, indent=2))
        
        if self.args.backend == 'fastapi':
            snippets = {
                "FastAPI Endpoint": {
                    "prefix": "endpoint",
                    "body": [
                        "@router.${1|get,post,put,delete|}('/${2:path}')",
                        "async def ${3:function_name}(",
                        "    $4",
                        ") -> ${5:dict}:",
                        '    """',
                        "    ${6:Description}",
                        '    """',
                        "    $0",
                        "    return {}"
                    ],
                    "description": "Create a FastAPI endpoint"
                }
            }
            (snippets_dir / 'python.json').write_text(json.dumps(snippets, indent=2))
    
    def _generate_lint_workflow(self) -> str:
        """Generate lint workflow"""
        frontend_block = ""
        if self.args.frontend != 'none':
            frontend_block = (
                "    - name: Setup Node.js\n"
                "      uses: actions/setup-node@v3\n"
                "      with:\n"
                "        node-version: '18'\n"
                "        cache: 'npm'\n"
                "        cache-dependency-path: frontend/package-lock.json\n\n"
                "    - name: Install frontend dependencies\n"
                "      run: cd frontend && npm ci\n\n"
                "    - name: Run frontend lint\n"
                "      run: cd frontend && npm run lint\n"
            )

        backend_block = ""
        if self.args.backend in ['fastapi', 'django']:
            backend_block = (
                "    - name: Setup Python\n"
                "      uses: actions/setup-python@v4\n"
                "      with:\n"
                "        python-version: '3.11'\n\n"
                "    - name: Install backend dependencies\n"
                "      run: |\n"
                "        cd backend\n"
                "        pip install -r requirements-dev.txt\n\n"
                "    - name: Run backend lint\n"
                "      run: |\n"
                "        cd backend\n"
                "        black --check .\n"
                "        flake8 .\n"
            )

        return (
            "name: Lint\n\n"
            "on:\n"
            "  push:\n"
            "    branches: [main, develop]\n"
            "  pull_request:\n"
            "    branches: [main, develop]\n\n"
            "jobs:\n"
            "  lint:\n"
            "    runs-on: ubuntu-latest\n\n"
            "    steps:\n"
            "    - uses: actions/checkout@v3\n\n"
            f"{frontend_block}"
            f"{backend_block}"
        )
    
    def _generate_test_workflow(self) -> str:
        """Generate test workflow"""
        services_block = ""
        if self.args.database == 'postgres':
            services_block = (
                "    services:\n"
                "      postgres:\n"
                "        image: postgres:15\n"
                "        env:\n"
                "          POSTGRES_PASSWORD: postgres\n"
                "        options: >-\n"
                "          --health-cmd pg_isready\n"
                "          --health-interval 10s\n"
                "          --health-timeout 5s\n"
                "          --health-retries 5\n"
                "        ports:\n"
                "          - 5432:5432\n"
            )

        frontend_block = ""
        if self.args.frontend != 'none':
            frontend_block = (
                "    - name: Setup Node.js\n"
                "      uses: actions/setup-node@v3\n"
                "      with:\n"
                "        node-version: '18'\n\n"
                "    - name: Install and test frontend\n"
                "      run: |\n"
                "        cd frontend\n"
                "        npm ci\n"
                "        npm test -- --coverage\n"
            )

        backend_block = ""
        if self.args.backend in ['fastapi', 'django']:
            backend_block = (
                "    - name: Setup Python\n"
                "      uses: actions/setup-python@v4\n"
                "      with:\n"
                "        python-version: '3.11'\n\n"
                "    - name: Install and test backend\n"
                "      run: |\n"
                "        cd backend\n"
                "        pip install -r requirements-test.txt\n"
                "        pytest --cov=. --cov-report=xml\n"
            )

        return (
            "name: Test\n\n"
            "on:\n"
            "  push:\n"
            "    branches: [main, develop]\n"
            "  pull_request:\n"
            "    branches: [main, develop]\n\n"
            "jobs:\n"
            "  test:\n"
            "    runs-on: ubuntu-latest\n\n"
            f"{services_block if services_block else ''}"
            "    steps:\n"
            "    - uses: actions/checkout@v3\n\n"
            f"{frontend_block}"
            f"{backend_block}"
            "    - name: Upload coverage\n"
            "      uses: codecov/codecov-action@v3\n"
        )
    
    def _generate_security_workflow(self) -> str:
        """Generate security scan workflow"""
        return """name: Security Scan

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday

jobs:
  security:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        scan-type: 'fs'
        scan-ref: '.'
        format: 'sarif'
        output: 'trivy-results.sarif'
    
    - name: Upload Trivy scan results
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: 'trivy-results.sarif'
    
    - name: Run dependency check
      uses: dependency-check/Dependency-Check_Action@main
      with:
        project: '${{ github.repository }}'
        path: '.'
        format: 'HTML'
"""
    
    def _generate_deploy_workflow(self) -> str:
        """Generate deployment workflow"""
        deploy_steps = {
            'aws': """    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
    
    - name: Deploy to AWS
      run: |
        # Add AWS deployment commands""",
            
            'azure': """    - name: Login to Azure
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
    
    - name: Deploy to Azure
      run: |
        # Add Azure deployment commands""",
            
            'gcp': """    - name: Setup Cloud SDK
      uses: google-github-actions/setup-gcloud@v1
      with:
        service_account_key: ${{ secrets.GCP_SA_KEY }}
        project_id: ${{ secrets.GCP_PROJECT_ID }}
    
    - name: Deploy to GCP
      run: |
        # Add GCP deployment commands""",
            
            'vercel': """    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}"""
        }
        
        return f"""name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
    - uses: actions/checkout@v3
    
{deploy_steps.get(self.args.deploy, '    # Add deployment steps')}
"""
    
    def _generate_gates_config(self) -> str:
        """Generate gates configuration"""
        config = {
            'quality_gates': {
                'lint': {
                    'required': True,
                    'threshold': 0
                },
                'test_coverage': {
                    'required': True,
                    'threshold': 80 if self.args.industry in ['healthcare', 'finance'] else 70
                },
                'security_scan': {
                    'required': True,
                    'critical_threshold': 0,
                    'high_threshold': 0 if self.args.industry in ['healthcare', 'finance'] else 5
                }
            },
            'compliance_gates': {}
        }
        
        # Add compliance-specific gates
        if self.args.compliance:
            for compliance in self.args.compliance.split(','):
                if compliance.strip() == 'hipaa':
                    config['compliance_gates']['hipaa'] = {
                        'encryption_check': True,
                        'audit_logging': True,
                        'access_control_review': True
                    }
                elif compliance.strip() == 'gdpr':
                    config['compliance_gates']['gdpr'] = {
                        'privacy_impact': True,
                        'consent_tracking': True,
                        'data_retention_check': True
                    }
                elif compliance.strip() == 'sox':
                    config['compliance_gates']['sox'] = {
                        'change_control': True,
                        'segregation_of_duties': True,
                        'audit_trail_validation': True
                    }
                elif compliance.strip() == 'pci':
                    config['compliance_gates']['pci'] = {
                        'cardholder_data_check': True,
                        'network_segmentation': True,
                        'encryption_validation': True
                    }
        # Convert to YAML format (deterministic)
        import yaml
        return yaml.dump(config, default_flow_style=False, sort_keys=True)
        
    def _generate_client_rules(self) -> str:
        """Generate client-specific rules (safe builder)"""
        uptime = '>99.99%' if self.args.industry in ['healthcare', 'finance'] else '>99.9%'
        if self.args.backend != 'none':
            rt_threshold = '200ms' if self.args.industry == 'finance' else '500ms'
            response_time = f"<{rt_threshold}"
        else:
            response_time = 'N/A'
        coverage = 80 if self.args.industry in ['healthcare', 'finance'] else 70
        ecommerce_extra = []
        if self.args.industry == 'ecommerce':
            ecommerce_extra = [
                '## E-commerce Enhancements',
                '- Mobile-first design approach',
                '- A/B testing infrastructure'
            ]
        lines: List[str] = []
        lines.append("---")
        lines.append("alwaysApply: true")
        # Extended triggers consistent with dev-workflow
        client_triggers = [
            'development', 'coding', 'implementation', 'update all', 'refresh all', 'sync all', 'reload all',
            'bootstrap', 'setup', 'initialize', 'project start', 'master plan', 'framework ecosystem',
            'background agents', 'prd', 'requirements', 'feature planning', 'product spec', 'task generation',
            'technical planning', 'implementation plan', 'execute', 'implement', 'process tasks',
            'retrospective', 'review', 'improvement', 'post-implementation', 'parallel execution',
            'coordination', 'multi-agent', 'analyze'
        ]
        lines.append(
            f"description: \"TAGS: [project,client,standards] | TRIGGERS: {','.join(client_triggers)} | SCOPE: {self.args.name} | DESCRIPTION: Client-specific rules and standards for {self.args.name}\""
        )
        lines.append("---")
        lines.append("")
        lines.append(f"# Client-Specific Rules: {self.args.name}")
        lines.append("")
        lines.append("## Project Context")
        lines.append(f"- **Industry**: {self.args.industry}")
        lines.append(f"- **Project Type**: {self.args.project_type}")
        lines.append(f"- **Technology Stack**: {self.args.frontend}/{self.args.backend}/{self.args.database}")
        lines.append(f"- **Compliance Requirements**: {self.args.compliance or 'None'}")
        lines.append("")
        lines.extend(ecommerce_extra)
        if ecommerce_extra:
            lines.append("")
        lines.append("## Communication Protocols")
        lines.append("- Daily standup: 9:00 AM")
        lines.append("- Sprint planning: Bi-weekly")
        lines.append("- Retrospectives: End of each sprint")
        lines.append("- Emergency contact: On-call rotation")
        lines.append("")
        lines.append("## Success Metrics")
        lines.append(f"- Uptime: {uptime}")
        lines.append(f"- Response time: {response_time}")
        lines.append("- Error rate: <0.1%")
        lines.append(f"- Test coverage: >{coverage}%")
        return "\n".join(lines)

    def _generate_workflow_rules(self) -> str:
        """Generate process/workflow rules with extended triggers and Cursor frontmatter."""
        triggers = [
            'update all', 'refresh all', 'sync all', 'reload all', 'execute', 'implement', 'process tasks',
            'bootstrap', 'setup', 'initialize', 'project start', 'master plan', 'framework ecosystem',
            'background agents', 'prd', 'requirements', 'feature planning', 'product spec', 'task generation',
            'technical planning', 'implementation plan', 'development', 'retrospective', 'review', 'improvement',
            'post-implementation', 'parallel execution', 'coordination', 'multi-agent', 'analyze'
        ]
        frontmatter = [
            '---',
            'alwaysApply: false',
            f"description: \"TAGS: [workflow,process,project] | TRIGGERS: {','.join(triggers)} | SCOPE: {self.args.name} | DESCRIPTION: Project workflow and process rules for {self.args.name}\"",
            '---',
            ''
        ]
        body = [
            f"# Project Workflow Rules: {self.args.name}",
            "",
            "## Process Gates",
            "- Run pre-commit compliance checks",
            "- Enforce lint and test passes in CI",
            "- Block release if gates_config thresholds fail",
            "",
            "## Execution Protocols",
            "- Use 'update all' to normalize rule formatting",
            "- Use 'execute' to process tasks per implementation plan",
            "- Use 'refresh all' to resync generated assets",
        ]
        return "\n".join(frontmatter + body)

    def _generate_development_guide_legacy(self) -> str:
        """Legacy development guide (disabled)"""
        return ""

    def _generate_development_guide(self) -> str:
        """Generate development guide (safe builder)"""
        lines: List[str] = []
        lines.append("# Development Guide")
        lines.append("")
        lines.append("## Getting Started")
        lines.append("")
        lines.append("### Prerequisites")
        if self.args.frontend != 'none' or self.args.backend == 'nestjs':
            lines.append("- Node.js 18+")
        if self.args.backend in ['fastapi', 'django']:
            lines.append("- Python 3.11+")
        if self.args.backend == 'go':
            lines.append("- Go 1.21+")
        lines.append("- Docker and Docker Compose")
        lines.append("- Git")
        lines.append("")
        lines.append("### Initial Setup")
        lines.append("")
        lines.append("1. **Clone the repository**")
        lines.append("   ```bash")
        lines.append(f"   git clone https://github.com/yourorg/{self.args.name}.git")
        lines.append(f"   cd {self.args.name}")
        lines.append("   ```")
        lines.append("")
        lines.append("2. **Install dependencies**")
        lines.append("   ```bash")
        lines.append("   make setup")
        lines.append("   ```")
        lines.append("")
        lines.append("3. **Configure environment**")
        lines.append("   ```bash")
        lines.append("   cp .env.example .env")
        lines.append("   # Edit .env with your values")
        lines.append("   ```")
        lines.append("")
        lines.append("4. **Start development environment**")
        lines.append("   ```bash")
        lines.append("   make dev")
        lines.append("   ```")
        lines.append("")
        lines.append("## Development Workflow")
        lines.append("")
        lines.append("1. Pull latest changes: `git pull origin develop`")
        lines.append("2. Create a feature branch: `git checkout -b feature/TICKET-description`")
        lines.append("3. Implement changes, add tests, update docs")
        lines.append("4. Run tests: `make test` and linters: `make lint`")
        lines.append("5. Commit and push: `git add . && git commit -m \"feat: ...\" && git push`")
        lines.append("6. Open a Pull Request and request review")
        lines.append("")
        lines.append("## Testing")
        lines.append("")
        lines.append("### Test Structure")
        lines.append("```")
        lines.append("tests/")
        lines.append("├── unit/")
        lines.append("├── integration/")
        lines.append("├── e2e/")
        lines.append("└── fixtures/")
        lines.append("```")
        lines.append("")
        lines.append("### Running Tests")
        lines.append("```bash")
        lines.append("make test")
        lines.append("```")
        lines.append("")
        lines.append("## Security Best Practices")
        lines.append("- Never commit secrets")
        lines.append("- Validate all inputs")
        lines.append("- Use parameterized queries")
        lines.append("- Implement rate limiting")
        lines.append("- Keep dependencies updated")
        lines.append("")
        lines.append("## Resources")
        lines.append("### Documentation")
        if self.args.frontend != 'none':
            lines.append(f"- {self.args.frontend} Docs: https://docs.{self.args.frontend}.com")
        if self.args.backend != 'none':
            lines.append(f"- {self.args.backend} Docs: https://docs.{self.args.backend}.com")
        lines.append(f"- Project Wiki: https://github.com/yourorg/{self.args.name}/wiki")
        return "\n".join(lines)

    def _generate_compliance_documentation(self) -> str:
        """Generate compliance documentation"""
        sections = []
        
        if self.args.compliance:
            for compliance in self.args.compliance.split(','):
                compliance = compliance.strip().lower()
                if compliance == 'hipaa':
                    sections.append("""## HIPAA Compliance

### Overview
This application is designed to be HIPAA-compliant for handling Protected Health Information (PHI).

### Technical Safeguards
1. **Encryption**
   - AES-256 encryption at rest
   - TLS 1.2+ for data in transit
   - Key management via AWS KMS

2. **Access Control**
   - Multi-factor authentication required
   - Role-based access control (RBAC)
   - Session timeout after 15 minutes
   - Audit logging of all PHI access

3. **Audit Controls**
   - Comprehensive audit logs
   - Log retention for 6 years
   - Regular audit log reviews
   - Automated anomaly detection

### Administrative Safeguards
1. **Training**
   - Annual HIPAA training required
   - Access granted only after training completion
   - Regular security awareness updates

2. **Access Management**
   - Minimum necessary access principle
   - Regular access reviews
   - Immediate termination procedures
   - Business Associate Agreements (BAAs)

### Physical Safeguards
1. **Data Center Security**
   - SOC 2 certified facilities
   - 24/7 physical security
   - Environmental controls
   - Redundant power and cooling

### Incident Response
1. **Breach Notification**
   - 60-day notification requirement
   - Documented incident response plan
   - Regular drills and updates
   - Chain of custody procedures""")
                
                elif compliance == 'gdpr':
                    sections.append("""## GDPR Compliance

### Overview
This application complies with the General Data Protection Regulation (GDPR) for EU data subjects.

### Data Protection Principles
1. **Lawfulness and Transparency**
   - Clear privacy policy
   - Explicit consent mechanisms
   - Lawful basis documented

2. **Purpose Limitation**
   - Data collected for specific purposes
   - No secondary use without consent
   - Purpose documentation maintained

3. **Data Minimization**
   - Only necessary data collected
   - Regular data audits
   - Automatic data deletion

### Individual Rights
1. **Right to Access**
   - Data export functionality
   - 30-day response time
   - Self-service portal

2. **Right to Rectification**
   - User profile editing
   - Admin correction tools
   - Audit trail of changes

3. **Right to Erasure**
   - Complete deletion workflow
   - Backup handling procedures
   - Confirmation mechanisms

4. **Right to Data Portability**
   - JSON/CSV export formats
   - API access for data retrieval
   - Documented data schemas

### Technical Measures
1. **Privacy by Design**
   - Data protection impact assessments
   - Privacy-first architecture
   - Regular privacy reviews

2. **Security Measures**
   - Encryption standards
   - Access controls
   - Regular security testing
   - Incident response procedures""")
                
                elif compliance == 'sox':
                    sections.append("""## SOX Compliance

### Overview
This application maintains Sarbanes-Oxley (SOX) compliance for financial reporting integrity.

### IT General Controls
1. **Access Controls**
   - Role-based permissions
   - Segregation of duties
   - Quarterly access reviews
   - Privileged access management

2. **Change Management**
   - Formal change process
   - Approval workflows
   - Testing requirements
   - Rollback procedures

3. **Operations**
   - Job scheduling controls
   - Backup procedures
   - Monitoring and alerts
   - Incident management

### Application Controls
1. **Input Controls**
   - Data validation rules
   - Duplicate detection
   - Error handling procedures
   - Reconciliation processes

2. **Processing Controls**
   - Calculation accuracy checks
   - Data integrity validation
   - Exception reporting
   - Audit trails

3. **Output Controls**
   - Report access controls
   - Distribution logs
   - Data classification
   - Retention policies

### Documentation
1. **Process Documentation**
   - Detailed procedures
   - Control matrices
   - Risk assessments
   - Test evidence

2. **Audit Support**
   - Control testing
   - Evidence collection
   - Management assertions
   - Remediation tracking""")
                
                elif compliance == 'pci':
                    sections.append("""## PCI DSS Compliance

### Overview
This application complies with Payment Card Industry Data Security Standards (PCI DSS) Level 1.

### Network Security
1. **Segmentation**
   - Cardholder data environment (CDE) isolated
   - Network segmentation validated
   - Regular penetration testing
   - Firewall rule reviews

2. **Access Control**
   - Two-factor authentication
   - Unique user IDs
   - Quarterly access reviews
   - Visitor logs maintained

### Data Protection
1. **Encryption**
   - AES-256 for data at rest
   - TLS 1.2+ for transmission
   - Key rotation procedures
   - Hardware security modules (HSM)

2. **Data Retention**
   - Minimal retention periods
   - Secure deletion procedures
   - No storage of sensitive authentication data
   - Tokenization implemented

### Vulnerability Management
1. **Patching**
   - Monthly security updates
   - Critical patches within 24 hours
   - Patch testing procedures
   - Rollback capabilities

2. **Scanning**
   - Quarterly vulnerability scans
   - Annual penetration tests
   - Code security reviews
   - Web application firewall (WAF)

### Monitoring
1. **Logging**
   - Centralized log management
   - 1-year retention minimum
   - Daily log reviews
   - Automated alerts

2. **File Integrity**
   - FIM tools deployed
   - Critical file monitoring
   - Change detection alerts
   - Regular baseline updates""")
        
        return f"""# Compliance Documentation

## Overview
This document outlines the compliance measures implemented in {self.args.name}.

## Compliance Standards
{', '.join([c.upper() for c in self.args.compliance.split(',')]) if self.args.compliance else 'No specific compliance requirements'}

{''.join(sections)}

## Compliance Checklist

### Development Phase
- [ ] Security requirements defined
- [ ] Compliance controls identified
- [ ] Risk assessment completed
- [ ] Privacy impact assessment (if applicable)

### Implementation Phase
- [ ] Security controls implemented
- [ ] Audit logging configured
- [ ] Access controls established
- [ ] Encryption enabled

### Testing Phase
- [ ] Security testing completed
- [ ] Penetration testing performed
- [ ] Compliance validation done
- [ ] Audit trail verified

### Deployment Phase
- [ ] Production security hardening
- [ ] Monitoring configured
- [ ] Incident response tested
- [ ] Documentation updated

### Operational Phase
- [ ] Regular security scans
- [ ] Access reviews conducted
- [ ] Audit logs reviewed
- [ ] Compliance reports generated

## Audit Requirements

### Internal Audits
- Frequency: Quarterly
- Scope: All compliance controls
- Documentation: Audit reports and remediation plans

### External Audits
- Frequency: Annually
- Scope: Full compliance assessment
- Certifications: Maintain current certifications

## Training Requirements

### Developer Training
- Security best practices
- Compliance requirements
- Secure coding standards
- Incident response procedures

### Operations Training
- Security operations
- Monitoring and alerting
- Incident handling
- Compliance reporting

## Incident Response

### Response Team
- Security Lead
- Development Lead
- Operations Lead
- Legal/Compliance

### Response Procedures
1. Detect and analyze
2. Contain and eradicate
3. Recover and restore
4. Post-incident review

### Notification Requirements
- Internal: Within 1 hour
- Customers: Per contractual requirements
- Regulators: Per compliance requirements

## Contact Information

### Compliance Officer
- Name: [Compliance Officer Name]
- Email: compliance@company.com
- Phone: +1-xxx-xxx-xxxx

### Security Team
- Email: security@company.com
- 24/7 Hotline: +1-xxx-xxx-xxxx

### Legal Team
- Email: legal@company.com
- Phone: +1-xxx-xxx-xxxx
"""