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
        self.project_root = None
    
    def generate(self) -> Dict[str, Any]:
        """Generate the complete project"""
        try:
            # Create project directory
            self.project_root = Path(self.args.output_dir) / self.args.name
            if self.project_root.exists():
                return {
                    'success': False,
                    'error': f"Directory {self.project_root} already exists"
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
            
            # Generate documentation
            self._generate_documentation()
            
            # Initialize git repository
            if not self.args.no_git:
                self._initialize_git()
            
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
            '.cursor/rules',
            '.cursor/dev-workflow',
            '.github/workflows',
            '.vscode',
            'docs',
            'scripts',
            'tests'
        ]
        
        for directory in directories:
            (self.project_root / directory).mkdir(parents=True, exist_ok=True)
        
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
            'created_at': datetime.now().isoformat(),
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
            # Use the appropriate template variant
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
    
    def _initialize_git(self):
        """Initialize git repository"""
        subprocess.run(['git', 'init'], cwd=self.project_root, capture_output=True)
        subprocess.run(['git', 'add', '.'], cwd=self.project_root, capture_output=True)
        subprocess.run(
            ['git', 'commit', '-m', f'Initial commit for {self.args.name}'],
            cwd=self.project_root,
            capture_output=True
        )
    
    def _process_templates(self, directory: Path):
        """Process template files and replace variables"""
        template_vars = {
            'PROJECT_NAME': self.args.name,
            'INDUSTRY': self.args.industry,
            'PROJECT_TYPE': self.args.project_type,
            'FRONTEND': self.args.frontend,
            'BACKEND': self.args.backend,
            'DATABASE': self.args.database,
            'AUTH': self.args.auth,
            'DEPLOY': self.args.deploy,
            'FEATURES': self.config.merge_features(self.args.features),
            'COMPLIANCE': self.args.compliance or ''
        }
        
        for file_path in directory.rglob('*'):
            if file_path.is_file() and file_path.suffix in ['.ts', '.js', '.py', '.json', '.yaml', '.yml', '.md', '.env']:
                try:
                    content = file_path.read_text()
                    for key, value in template_vars.items():
                        content = content.replace(f'{{{{{key}}}}}', str(value))
                    file_path.write_text(content)
                except Exception:
                    pass  # Skip files that can't be processed
    
    def _add_industry_components(self, directory: Path, component_type: str):
        """Add industry-specific components"""
        templates = self.config.get_template_suggestions()
        
        if component_type == 'frontend' and 'pages' in templates:
            pages_dir = directory / 'src' / 'pages'
            pages_dir.mkdir(parents=True, exist_ok=True)
            
            for page in templates['pages']:
                # Create placeholder page component
                page_content = self.template_engine.generate_page_template(
                    page, self.args.frontend, self.args.industry
                )
                (pages_dir / f'{page}.tsx').write_text(page_content)
        
        elif component_type == 'backend' and 'apis' in templates:
            api_dir = directory / 'src' / 'api'
            api_dir.mkdir(parents=True, exist_ok=True)
            
            for api in templates['apis']:
                # Create placeholder API endpoint
                api_content = self.template_engine.generate_api_template(
                    api, self.args.backend, self.args.industry
                )
                
                # Determine file extension based on backend
                ext = {'fastapi': 'py', 'django': 'py', 'nestjs': 'ts', 'go': 'go'}.get(self.args.backend, 'js')
                (api_dir / f'{api}.{ext}').write_text(api_content)
    
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
        
        structure['children'].extend([
            {
                'name': '.cursor/',
                'children': [
                    {'name': 'rules/'},
                    {'name': 'project.json'}
                ]
            },
            {
                'name': '.github/',
                'children': [
                    {'name': 'workflows/'}
                ]
            },
            {'name': 'docs/'},
            {'name': 'docker-compose.yml'},
            {'name': 'Makefile'},
            {'name': 'README.md'}
        ])
        
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
{chr(10).join([f'- {feature}' for feature in self.config.merge_features(self.args.features)])}

## Compliance
{chr(10).join([f'- {compliance.upper()}' for compliance in (self.args.compliance.split(',') if self.args.compliance else ['None'])])}

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
{f'- [Compliance Documentation](docs/COMPLIANCE.md)' if self.args.compliance else ''}

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
{'	cd backend && python -m venv venv && . venv/bin/activate && pip install -r requirements.txt' if self.args.backend in ['fastapi', 'django'] else ''}
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
        return f"""name: Lint

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
{"    - name: Setup Node.js\n      uses: actions/setup-node@v3\n      with:\n        node-version: '18'\n        cache: 'npm'\n        cache-dependency-path: frontend/package-lock.json\n    \n    - name: Install frontend dependencies\n      run: cd frontend && npm ci\n    \n    - name: Run frontend lint\n      run: cd frontend && npm run lint" if self.args.frontend != 'none' else ''}
    
{"    - name: Setup Python\n      uses: actions/setup-python@v4\n      with:\n        python-version: '3.11'\n    \n    - name: Install backend dependencies\n      run: |\n        cd backend\n        pip install -r requirements-dev.txt\n    \n    - name: Run backend lint\n      run: |\n        cd backend\n        black --check .\n        flake8 ." if self.args.backend in ['fastapi', 'django'] else ''}
"""
    
    def _generate_test_workflow(self) -> str:
        """Generate test workflow"""
        return f"""name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
{"      postgres:\n        image: postgres:15\n        env:\n          POSTGRES_PASSWORD: postgres\n        options: >-\n          --health-cmd pg_isready\n          --health-interval 10s\n          --health-timeout 5s\n          --health-retries 5\n        ports:\n          - 5432:5432" if self.args.database == 'postgres' else ''}
    
    steps:
    - uses: actions/checkout@v3
    
{"    - name: Setup Node.js\n      uses: actions/setup-node@v3\n      with:\n        node-version: '18'\n    \n    - name: Install and test frontend\n      run: |\n        cd frontend\n        npm ci\n        npm test -- --coverage" if self.args.frontend != 'none' else ''}
    
{"    - name: Setup Python\n      uses: actions/setup-python@v4\n      with:\n        python-version: '3.11'\n    \n    - name: Install and test backend\n      run: |\n        cd backend\n        pip install -r requirements-test.txt\n        pytest --cov=. --cov-report=xml" if self.args.backend in ['fastapi', 'django'] else ''}
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
"""
    
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
        
        # Convert to YAML format
        import yaml
        return yaml.dump(config, default_flow_style=False)
    
    def _generate_client_rules(self) -> str:
        """Generate client-specific rules"""
        return f"""---
alwaysApply: true
description: "TAGS: [project,client,standards] | TRIGGERS: development,coding,implementation | SCOPE: {self.args.name} | DESCRIPTION: Client-specific rules and standards for {self.args.name}"
---

# Client-Specific Rules: {self.args.name}

## Project Context
- **Industry**: {self.args.industry}
- **Project Type**: {self.args.project_type}
- **Technology Stack**: {self.args.frontend}/{self.args.backend}/{self.args.database}
- **Compliance Requirements**: {self.args.compliance or 'None'}

## Coding Standards

### General Principles
1. **Code Quality**: All code must pass linting and have minimum {80 if self.args.industry in ['healthcare', 'finance'] else 70}% test coverage
2. **Security First**: Follow OWASP guidelines and industry-specific security requirements
3. **Documentation**: All public APIs and complex functions must be documented
4. **Performance**: Optimize for {self.args.industry}-specific performance requirements

### Frontend Standards
{f'''- Framework: {self.args.frontend}
- State Management: Use built-in state management solutions
- Component Structure: Follow atomic design principles
- Styling: Use CSS modules or styled-components
- Accessibility: WCAG 2.1 AA compliance required''' if self.args.frontend != 'none' else '- No frontend in this project'}

### Backend Standards
{f'''- Framework: {self.args.backend}
- API Design: RESTful principles with OpenAPI documentation
- Error Handling: Consistent error response format
- Logging: Structured logging with correlation IDs
- Database: Follow {self.args.database} best practices''' if self.args.backend != 'none' else '- No backend in this project'}

### Security Requirements
{'- HIPAA Compliance: PHI encryption, audit logging, access controls' if 'hipaa' in (self.args.compliance or '') else ''}
{'- GDPR Compliance: Data privacy, consent management, right to deletion' if 'gdpr' in (self.args.compliance or '') else ''}
{'- SOX Compliance: Change control, audit trails, segregation of duties' if 'sox' in (self.args.compliance or '') else ''}
{'- PCI Compliance: Cardholder data protection, tokenization' if 'pci' in (self.args.compliance or '') else ''}
- Authentication: {self.args.auth} integration required
- Authorization: Role-based access control (RBAC)
- Data Encryption: At rest and in transit

## Development Workflow

### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: Feature development
- `hotfix/*`: Emergency fixes

### Code Review Requirements
1. All PRs require at least one approval
2. Must pass all CI/CD checks
3. Security scan must show no critical vulnerabilities
4. Test coverage must not decrease

### Deployment Process
- Target Environment: {self.args.deploy}
- Deployment Frequency: {'Daily' if self.args.project_type == 'saas' else 'Weekly'}
- Rollback Strategy: Blue-green deployments

## Industry-Specific Requirements

{f'''### Healthcare Requirements
- Patient data must be encrypted with AES-256
- All access to PHI must be logged
- Session timeout: 15 minutes
- Regular security audits required
- Business Associate Agreement (BAA) required for third-party services''' if self.args.industry == 'healthcare' else ''}

{f'''### Financial Services Requirements
- Transaction integrity must be maintained
- Audit trails for all financial operations
- Real-time fraud detection required
- Regulatory reporting capabilities
- Data retention: 7 years minimum''' if self.args.industry == 'finance' else ''}

{f'''### E-commerce Requirements
- PCI compliance for payment processing
- Cart abandonment tracking
- Performance: < 3s page load time
- Mobile-first design approach
- A/B testing infrastructure''' if self.args.industry == 'ecommerce' else ''}

## Communication Protocols
- Daily standup: 9:00 AM
- Sprint planning: Bi-weekly
- Retrospectives: End of each sprint
- Emergency contact: On-call rotation

## Success Metrics
- Uptime: {'>99.99%' if self.args.industry in ['healthcare', 'finance'] else '>99.9%'}
- Response time: {f'<{200 if self.args.industry == "finance" else 500}ms' if self.args.backend != 'none' else 'N/A'}
- Error rate: <0.1%
- Test coverage: >{80 if self.args.industry in ['healthcare', 'finance'] else 70}%
"""
    
    def _generate_compliance_rules_content(self, compliance: str) -> str:
        """Generate compliance-specific rules content"""
        compliance_configs = {
            'hipaa': {
                'title': 'HIPAA Compliance Rules',
                'description': 'Healthcare Insurance Portability and Accountability Act compliance requirements',
                'content': """## HIPAA Compliance Requirements

### Technical Safeguards
1. **Access Control**
   - Unique user identification
   - Automatic logoff after 15 minutes
   - Encryption and decryption of PHI

2. **Audit Controls**
   - Hardware, software, and procedural mechanisms
   - Record and examine access to PHI
   - Regular review of audit logs

3. **Integrity Controls**
   - PHI must not be improperly altered or destroyed
   - Electronic mechanisms to corroborate PHI integrity
   - Version control for all PHI modifications

4. **Transmission Security**
   - Encryption of PHI in transit (TLS 1.2+)
   - Integrity controls during transmission
   - Secure messaging for PHI communication

### Administrative Safeguards
1. **Security Officer Designation**
2. **Workforce Training**
3. **Access Authorization Procedures**
4. **Incident Response Plan**

### Physical Safeguards
1. **Facility Access Controls**
2. **Workstation Security**
3. **Device and Media Controls**"""
            },
            
            'gdpr': {
                'title': 'GDPR Compliance Rules',
                'description': 'General Data Protection Regulation compliance requirements',
                'content': """## GDPR Compliance Requirements

### Data Protection Principles
1. **Lawfulness, Fairness, and Transparency**
   - Clear consent mechanisms
   - Transparent privacy policies
   - Lawful basis for processing

2. **Purpose Limitation**
   - Data collected for specific purposes
   - No further processing incompatible with purposes
   - Clear documentation of purposes

3. **Data Minimization**
   - Collect only necessary data
   - Regular data audits
   - Automatic data deletion policies

4. **Accuracy**
   - Keep personal data accurate and up to date
   - Mechanisms for data correction
   - Regular data quality checks

### Individual Rights Implementation
1. **Right to Access**
   - Export user data functionality
   - 30-day response requirement

2. **Right to Rectification**
   - User profile editing capabilities
   - Admin tools for data correction

3. **Right to Erasure**
   - Complete data deletion workflows
   - Backup data handling procedures

4. **Right to Data Portability**
   - Machine-readable data export
   - Standard data formats

### Technical Measures
1. **Privacy by Design**
2. **Data Protection Impact Assessments**
3. **Breach Notification (72 hours)**
4. **Cross-border Transfer Safeguards**"""
            },
            
            'sox': {
                'title': 'SOX Compliance Rules',
                'description': 'Sarbanes-Oxley Act compliance requirements',
                'content': """## SOX Compliance Requirements

### IT General Controls
1. **Access Controls**
   - Role-based access control (RBAC)
   - Segregation of duties
   - Regular access reviews
   - Privileged access management

2. **Change Management**
   - Formal change request process
   - Change approval workflows
   - Testing requirements
   - Rollback procedures

3. **Operations**
   - Job scheduling and monitoring
   - Backup and recovery procedures
   - Incident management
   - Problem management

### Application Controls
1. **Input Controls**
   - Data validation
   - Error handling
   - Duplicate checking

2. **Processing Controls**
   - Calculation accuracy
   - Data integrity checks
   - Exception reporting

3. **Output Controls**
   - Report distribution controls
   - Sensitive data masking
   - Audit trails

### Documentation Requirements
1. **Process Documentation**
2. **Control Matrices**
3. **Test Evidence**
4. **Management Assertions**"""
            },
            
            'pci': {
                'title': 'PCI DSS Compliance Rules',
                'description': 'Payment Card Industry Data Security Standard compliance requirements',
                'content': """## PCI DSS Compliance Requirements

### Build and Maintain Secure Network
1. **Firewall Configuration**
   - Network segmentation
   - DMZ implementation
   - Regular rule reviews

2. **Default Security Parameters**
   - Change default passwords
   - Remove unnecessary services
   - Secure configurations

### Protect Cardholder Data
1. **Data Protection**
   - Encryption at rest (AES-256)
   - Secure key management
   - Data retention policies

2. **Transmission Security**
   - TLS 1.2+ for all transmissions
   - Never send PAN via email
   - Secure API endpoints

### Maintain Vulnerability Management
1. **Anti-virus/Anti-malware**
2. **Security Patches**
3. **Secure Development**
   - OWASP Top 10 compliance
   - Code reviews
   - Security testing

### Implement Access Control
1. **Need-to-Know Basis**
2. **Unique User IDs**
3. **Two-Factor Authentication**
4. **Physical Access Controls**

### Monitor and Test
1. **Logging and Monitoring**
   - Centralized logging
   - Daily log reviews
   - 90-day retention

2. **Security Testing**
   - Quarterly vulnerability scans
   - Annual penetration testing
   - File integrity monitoring"""
            }
        }
        
        config = compliance_configs.get(compliance.lower(), {
            'title': f'{compliance.upper()} Compliance Rules',
            'description': f'{compliance.upper()} compliance requirements',
            'content': f'## {compliance.upper()} Compliance Requirements\n\nCustom compliance requirements for {compliance.upper()}.'
        })
        
        return f"""---
alwaysApply: true
description: "TAGS: [compliance,security,{compliance.lower()}] | TRIGGERS: {compliance.lower()},compliance,security | SCOPE: {self.args.name} | DESCRIPTION: {config['description']}"
---

# {config['title']}

{config['content']}

## Implementation Checklist
- [ ] Review all requirements with legal/compliance team
- [ ] Implement technical controls
- [ ] Document compliance measures
- [ ] Schedule regular audits
- [ ] Train development team
- [ ] Establish incident response procedures

## Automated Compliance Checks
1. **Pre-commit Hooks**
   - Secret scanning
   - Code security analysis
   - Dependency vulnerability check

2. **CI/CD Pipeline**
   - SAST/DAST scanning
   - Compliance policy validation
   - Audit log verification

3. **Runtime Monitoring**
   - Access pattern analysis
   - Anomaly detection
   - Compliance drift alerts

## References
- Official {compliance.upper()} documentation
- Industry best practices
- Regulatory guidance
"""
    
    def _generate_workflow_rules(self) -> str:
        """Generate project workflow rules"""
        return f"""---
alwaysApply: true
description: "TAGS: [workflow,process,development] | TRIGGERS: workflow,process,development | SCOPE: {self.args.name} | DESCRIPTION: Development workflow and process rules"
---

# Project Workflow Rules: {self.args.name}

## Development Process

### Task Management
1. **Task Creation**
   - All work must have a corresponding ticket
   - Clear acceptance criteria required
   - Estimate effort in story points

2. **Task Lifecycle**
   - `TODO` → `IN PROGRESS` → `REVIEW` → `DONE`
   - Update status in real-time
   - Add blockers immediately

### Git Workflow
1. **Branching**
   ```bash
   # Feature branch
   git checkout -b feature/TICKET-description
   
   # Bugfix branch
   git checkout -b bugfix/TICKET-description
   
   # Hotfix branch
   git checkout -b hotfix/TICKET-description
   ```

2. **Commit Messages**
   ```
   type(scope): subject
   
   body
   
   footer
   ```
   Types: feat, fix, docs, style, refactor, test, chore

3. **Pull Request Template**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   
   ## Testing
   - [ ] Unit tests pass
   - [ ] Integration tests pass
   - [ ] Manual testing completed
   
   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] No sensitive data exposed
   ```

### Code Review Process
1. **Review Criteria**
   - Functionality correctness
   - Code quality and style
   - Performance implications
   - Security considerations
   - Test coverage

2. **Review Feedback**
   - Use constructive language
   - Suggest specific improvements
   - Acknowledge good practices
   - Ask questions for clarity

### Deployment Pipeline
1. **Development Environment**
   - Auto-deploy on commit to develop
   - Run smoke tests
   - Send deployment notifications

2. **Staging Environment**
   - Deploy release candidates
   - Run full test suite
   - Performance testing
   - Security scanning

3. **Production Environment**
   - Require approval from tech lead
   - Blue-green deployment
   - Health checks
   - Rollback plan ready

## Quality Standards

### Testing Requirements
- Unit Tests: >{80 if self.args.industry in ['healthcare', 'finance'] else 70}% coverage
- Integration Tests: All API endpoints
- E2E Tests: Critical user journeys
- Performance Tests: Load and stress testing

### Documentation Standards
1. **Code Documentation**
   - JSDoc/docstrings for public APIs
   - Inline comments for complex logic
   - README for each module

2. **Project Documentation**
   - Architecture decisions (ADRs)
   - API documentation (OpenAPI)
   - Deployment guides
   - Troubleshooting guides

### Performance Standards
- Page Load: <{2 if self.args.industry == 'ecommerce' else 3}s
- API Response: <{200 if self.args.industry == 'finance' else 500}ms
- Error Rate: <0.1%
- Uptime: >{99.99 if self.args.industry in ['healthcare', 'finance'] else 99.9}%

## Communication

### Daily Standups
- What I did yesterday
- What I'm doing today
- Any blockers
- Keep it under 2 minutes

### Sprint Ceremonies
1. **Sprint Planning**
   - Review backlog
   - Estimate stories
   - Commit to sprint goal

2. **Sprint Review**
   - Demo completed work
   - Gather stakeholder feedback
   - Update product backlog

3. **Retrospective**
   - What went well
   - What could improve
   - Action items

### Escalation Path
1. Technical Issues → Tech Lead
2. Product Questions → Product Owner
3. Resource Conflicts → Project Manager
4. Security Concerns → Security Team

## Monitoring and Alerts

### Application Monitoring
- Error tracking (Sentry/Rollbar)
- Performance monitoring (New Relic/DataDog)
- Uptime monitoring (Pingdom/UptimeRobot)
- Custom business metrics

### Alert Configuration
1. **Critical Alerts** (immediate)
   - Service down
   - Security breach
   - Data loss risk

2. **Warning Alerts** (within 1 hour)
   - Performance degradation
   - High error rate
   - Resource exhaustion

3. **Info Alerts** (daily digest)
   - Deployment notifications
   - Scheduled job results
   - Usage statistics
"""
    
    def _add_database_to_docker_compose(self):
        """Add database configuration to docker-compose"""
        # This is handled in _generate_docker_compose method
        pass
    
    def _generate_api_docs_template(self) -> str:
        """Generate API documentation template"""
        return f"""# API Documentation

## Overview
API documentation for {self.args.name} {self.args.backend} backend.

## Base URL
- Development: `http://localhost:8000`
- Staging: `https://api-staging.{self.args.name}.com`
- Production: `https://api.{self.args.name}.com`

## Authentication
{f'''This API uses {self.args.auth} for authentication.

### Headers
```
Authorization: Bearer {{token}}
```

### Getting a Token
1. Register/login through {self.args.auth}
2. Receive JWT token
3. Include token in all API requests''' if self.args.auth != 'none' else 'No authentication required for this API.'}

## Endpoints

### Health Check
```
GET /health
```

**Response:**
```json
{{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00Z"
}}
```

{f'''### Industry-Specific Endpoints

Based on {self.args.industry} requirements, the following endpoints are available:

{self._generate_industry_endpoints()}''' if self.args.backend != 'none' else ''}

## Error Handling

### Error Response Format
```json
{{
  "error": {{
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {{}}
  }}
}}
```

### Common Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per authenticated user

## Versioning
API versioning is handled through URL path: `/api/v1/`

## Webhooks
{f'Webhooks are available for the following events:' if self.args.project_type in ['saas', 'enterprise'] else 'No webhooks configured.'}

## SDKs
- JavaScript/TypeScript
- Python
- Go

## OpenAPI Specification
Full OpenAPI 3.0 specification available at `/openapi.json`
"""
    
    def _generate_industry_endpoints(self) -> str:
        """Generate industry-specific API endpoints"""
        endpoints = {
            'healthcare': """#### Patients
- `GET /api/v1/patients` - List patients
- `GET /api/v1/patients/{id}` - Get patient details
- `POST /api/v1/patients` - Create patient
- `PUT /api/v1/patients/{id}` - Update patient
- `DELETE /api/v1/patients/{id}` - Delete patient

#### Appointments
- `GET /api/v1/appointments` - List appointments
- `POST /api/v1/appointments` - Schedule appointment
- `PUT /api/v1/appointments/{id}` - Update appointment
- `DELETE /api/v1/appointments/{id}` - Cancel appointment

#### Medical Records
- `GET /api/v1/patients/{id}/records` - Get patient records
- `POST /api/v1/patients/{id}/records` - Add medical record""",
            
            'finance': """#### Accounts
- `GET /api/v1/accounts` - List accounts
- `GET /api/v1/accounts/{id}` - Get account details
- `POST /api/v1/accounts` - Create account
- `PUT /api/v1/accounts/{id}` - Update account

#### Transactions
- `GET /api/v1/transactions` - List transactions
- `GET /api/v1/transactions/{id}` - Get transaction details
- `POST /api/v1/transactions` - Create transaction
- `PUT /api/v1/transactions/{id}` - Update transaction

#### Reports
- `GET /api/v1/reports/balance` - Account balance report
- `GET /api/v1/reports/transactions` - Transaction history""",
            
            'ecommerce': """#### Products
- `GET /api/v1/products` - List products
- `GET /api/v1/products/{id}` - Get product details
- `POST /api/v1/products` - Create product (admin)
- `PUT /api/v1/products/{id}` - Update product (admin)

#### Cart
- `GET /api/v1/cart` - Get cart contents
- `POST /api/v1/cart/items` - Add item to cart
- `PUT /api/v1/cart/items/{id}` - Update cart item
- `DELETE /api/v1/cart/items/{id}` - Remove from cart

#### Orders
- `GET /api/v1/orders` - List orders
- `GET /api/v1/orders/{id}` - Get order details
- `POST /api/v1/orders` - Create order
- `PUT /api/v1/orders/{id}/status` - Update order status"""
        }
        
        return endpoints.get(self.args.industry, """#### Resources
- `GET /api/v1/resources` - List resources
- `GET /api/v1/resources/{id}` - Get resource details
- `POST /api/v1/resources` - Create resource
- `PUT /api/v1/resources/{id}` - Update resource
- `DELETE /api/v1/resources/{id}` - Delete resource""")
    
    def _generate_deployment_guide(self) -> str:
        """Generate deployment guide"""
        return f"""# Deployment Guide

## Overview
This guide covers deploying {self.args.name} to {self.args.deploy}.

## Prerequisites
- {self.args.deploy} account with appropriate permissions
- Docker installed locally
- Environment variables configured
- SSL certificates ready

## Deployment Targets

### Development
- **URL**: https://dev.{self.args.name}.com
- **Branch**: develop
- **Auto-deploy**: Yes

### Staging
- **URL**: https://staging.{self.args.name}.com
- **Branch**: release/*
- **Auto-deploy**: Yes

### Production
- **URL**: https://{self.args.name}.com
- **Branch**: main
- **Auto-deploy**: No (manual approval required)

## Deployment Steps

### 1. Pre-deployment Checklist
- [ ] All tests passing
- [ ] Security scan completed
- [ ] Database migrations ready
- [ ] Environment variables updated
- [ ] Backup current production

### 2. Build Process
```bash
# Build frontend
{'cd frontend && npm run build' if self.args.frontend != 'none' else '# No frontend to build'}

# Build backend
{'cd backend && python -m build' if self.args.backend in ['fastapi', 'django'] else ''}
{'cd backend && npm run build' if self.args.backend == 'nestjs' else ''}
{'cd backend && go build -o app' if self.args.backend == 'go' else ''}

# Build Docker images
docker build -t {self.args.name}:latest .
```

### 3. Deploy to {self.args.deploy}

{self._generate_deploy_instructions()}

### 4. Post-deployment Steps
1. **Verify Deployment**
   - Check application health endpoint
   - Run smoke tests
   - Monitor error rates

2. **Database Migrations**
   ```bash
   # Run migrations if needed
   {'python manage.py migrate' if self.args.backend == 'django' else '# Apply database migrations'}
   ```

3. **Cache Warming**
   - Prime application caches
   - Preload frequently accessed data

4. **Monitoring Setup**
   - Verify logging is working
   - Check metrics collection
   - Set up alerts

## Rollback Procedure

### Automatic Rollback
Deployment will automatically rollback if:
- Health checks fail
- Error rate exceeds threshold
- Response time degrades

### Manual Rollback
```bash
# Revert to previous version
{self._generate_rollback_commands()}
```

## Environment Variables

### Required Variables
```env
# Application
APP_ENV=production
APP_URL=https://{self.args.name}.com

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Authentication
{f'{self.args.auth.upper()}_CLIENT_ID=xxx' if self.args.auth != 'none' else '# No auth configured'}
{f'{self.args.auth.upper()}_CLIENT_SECRET=xxx' if self.args.auth != 'none' else ''}

# Monitoring
SENTRY_DSN=xxx
LOG_LEVEL=info
```

### Security Considerations
- Never commit secrets to version control
- Use secret management service
- Rotate credentials regularly
- Limit access to production environment

## Troubleshooting

### Common Issues

1. **Deployment Fails**
   - Check build logs
   - Verify environment variables
   - Check resource limits

2. **Application Won't Start**
   - Check application logs
   - Verify database connection
   - Check for port conflicts

3. **Performance Issues**
   - Check resource utilization
   - Review database queries
   - Check for memory leaks

### Debug Commands
```bash
# View logs
docker logs -f {self.args.name}

# Check application status
curl https://{self.args.name}.com/health

# SSH into container
docker exec -it {self.args.name} /bin/bash
```

## Maintenance

### Regular Tasks
- **Daily**: Check logs and metrics
- **Weekly**: Review performance trends
- **Monthly**: Update dependencies
- **Quarterly**: Security audit

### Backup Strategy
- Database: Daily automated backups
- Application data: Hourly snapshots
- Retention: 30 days
- Test restore: Monthly

## Contact

### Escalation Path
1. **On-call Engineer**: Check PagerDuty
2. **Team Lead**: #{self.args.name}-leads
3. **Infrastructure Team**: #infrastructure
4. **Security Team**: security@company.com

### Documentation
- [Architecture Overview](./ARCHITECTURE.md)
- [API Documentation](./API.md)
- [Security Policies](./SECURITY.md)
"""
    
    def _generate_deploy_instructions(self) -> str:
        """Generate deployment-specific instructions"""
        instructions = {
            'aws': """#### AWS Deployment

1. **Configure AWS CLI**
   ```bash
   aws configure
   ```

2. **Deploy with ECS/Fargate**
   ```bash
   # Push image to ECR
   aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_URL
   docker tag {name}:latest $ECR_URL/{name}:latest
   docker push $ECR_URL/{name}:latest
   
   # Update service
   aws ecs update-service --cluster {name}-cluster --service {name}-service --force-new-deployment
   ```

3. **Update Load Balancer**
   - Update target groups
   - Configure health checks
   - Update SSL certificates""",
   
            'azure': """#### Azure Deployment

1. **Login to Azure**
   ```bash
   az login
   ```

2. **Deploy to Container Instances**
   ```bash
   # Push to ACR
   az acr login --name {name}registry
   docker tag {name}:latest {name}registry.azurecr.io/{name}:latest
   docker push {name}registry.azurecr.io/{name}:latest
   
   # Update container
   az container restart --name {name}-container --resource-group {name}-rg
   ```

3. **Update Application Gateway**
   - Update backend pools
   - Configure probes
   - Update certificates""",
   
            'gcp': """#### GCP Deployment

1. **Authenticate with GCP**
   ```bash
   gcloud auth login
   gcloud config set project {name}-project
   ```

2. **Deploy to Cloud Run**
   ```bash
   # Build and push image
   gcloud builds submit --tag gcr.io/{name}-project/{name}
   
   # Deploy service
   gcloud run deploy {name} --image gcr.io/{name}-project/{name} --platform managed
   ```

3. **Update Load Balancer**
   - Update backend service
   - Configure health checks
   - Update SSL policies""",
   
            'vercel': """#### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy Project**
   ```bash
   # Production deployment
   vercel --prod
   
   # Preview deployment
   vercel
   ```

3. **Configure Domain**
   - Add custom domain
   - Configure DNS
   - Enable HTTPS""",
   
            'self-hosted': """#### Self-Hosted Deployment

1. **Prepare Server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade
   
   # Install Docker
   curl -fsSL https://get.docker.com | sh
   ```

2. **Deploy Application**
   ```bash
   # Copy files to server
   scp -r . user@server:/opt/{name}
   
   # Start application
   ssh user@server
   cd /opt/{name}
   docker-compose up -d
   ```

3. **Configure Nginx**
   - Set up reverse proxy
   - Configure SSL with certbot
   - Enable HTTP/2"""
        }
        
        return instructions.get(self.args.deploy, '').format(name=self.args.name)
    
    def _generate_rollback_commands(self) -> str:
        """Generate rollback commands based on deployment target"""
        commands = {
            'aws': 'aws ecs update-service --cluster {name}-cluster --service {name}-service --task-definition {name}:previous',
            'azure': 'az container restart --name {name}-container-previous --resource-group {name}-rg',
            'gcp': 'gcloud run services update-traffic {name} --to-revisions {name}-previous=100',
            'vercel': 'vercel rollback',
            'self-hosted': 'docker-compose down && git checkout previous-tag && docker-compose up -d'
        }
        
        return commands.get(self.args.deploy, '# Platform-specific rollback command').format(name=self.args.name)
    
    def _generate_development_guide(self) -> str:
        """Generate development guide"""
        return f"""# Development Guide

## Getting Started

### Prerequisites
- {'Node.js 18+' if self.args.frontend != 'none' or self.args.backend == 'nestjs' else ''}
- {'Python 3.11+' if self.args.backend in ['fastapi', 'django'] else ''}
- {'Go 1.21+' if self.args.backend == 'go' else ''}
- Docker and Docker Compose
- Git

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourorg/{self.args.name}.git
   cd {self.args.name}
   ```

2. **Install dependencies**
   ```bash
   make setup
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. **Start development environment**
   ```bash
   make dev
   ```

## Development Workflow

### Daily Development

1. **Start your day**
   ```bash
   git pull origin develop
   make dev
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/TICKET-description
   ```

3. **Make changes**
   - Write code
   - Add tests
   - Update documentation

4. **Run tests**
   ```bash
   make test
   make lint
   ```

5. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/TICKET-description
   # Create PR on GitHub
   ```

## Project Structure

```
{self.args.name}/
├── frontend/          # {self.args.frontend} application
├── backend/           # {self.args.backend} API
├── database/          # Database schemas and migrations
├── docs/              # Documentation
├── scripts/           # Utility scripts
├── tests/             # Integration tests
├── .cursor/           # AI rules and workflows
├── .github/           # GitHub Actions workflows
└── docker-compose.yml # Local development environment
```

## Coding Standards

### General Guidelines
- Follow the style guide for your language
- Write meaningful commit messages
- Add tests for new features
- Document complex logic

{f'''### Frontend Standards ({self.args.frontend})
- Use TypeScript for type safety
- Follow component-based architecture
- Implement responsive design
- Ensure accessibility (WCAG 2.1 AA)

Example component:
```typescript
interface Props {{
  title: string;
  onClick: () => void;
}}

export const MyComponent: React.FC<Props> = ({{ title, onClick }}) => {{
  return (
    <button onClick={{onClick}} className="btn btn-primary">
      {{title}}
    </button>
  );
}};
```''' if self.args.frontend != 'none' else ''}

{f'''### Backend Standards ({self.args.backend})
{'- Use type hints' if self.args.backend in ['fastapi', 'django'] else '- Use TypeScript' if self.args.backend == 'nestjs' else '- Follow Go conventions'}
- Implement proper error handling
- Add OpenAPI documentation
- Write unit tests for all endpoints

Example endpoint:
{self._generate_backend_example()}''' if self.args.backend != 'none' else ''}

## Testing

### Test Structure
```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── e2e/            # End-to-end tests
└── fixtures/       # Test data
```

### Running Tests
```bash
# All tests
make test

# Unit tests only
{'cd frontend && npm run test:unit' if self.args.frontend != 'none' else ''}
{'cd backend && pytest tests/unit' if self.args.backend in ['fastapi', 'django'] else ''}

# Integration tests
make test-integration

# E2E tests
make test-e2e
```

### Writing Tests
- Aim for {80 if self.args.industry in ['healthcare', 'finance'] else 70}% code coverage
- Test edge cases
- Use meaningful test names
- Keep tests independent

## Debugging

### Local Debugging

{f'''#### Frontend Debugging
1. Open Chrome DevTools
2. Set breakpoints in Sources tab
3. Use React DevTools extension
4. Check Network tab for API calls''' if self.args.frontend != 'none' else ''}

{f'''#### Backend Debugging
{'1. Use debugpy for VS Code\n2. Set breakpoints in code\n3. Attach debugger to running process' if self.args.backend in ['fastapi', 'django'] else '1. Use Node.js debugger\n2. Set breakpoints in VS Code\n3. Launch debug configuration' if self.args.backend == 'nestjs' else '1. Use delve debugger\n2. Set breakpoints\n3. Debug with VS Code'}''' if self.args.backend != 'none' else ''}

### Common Issues

1. **Port already in use**
   ```bash
   # Find process using port
   lsof -i :3000
   # Kill process
   kill -9 PID
   ```

2. **Docker issues**
   ```bash
   # Reset Docker
   docker-compose down -v
   docker system prune -a
   ```

3. **Dependency issues**
   ```bash
   # Clear caches and reinstall
   {'rm -rf node_modules package-lock.json && npm install' if self.args.frontend != 'none' else ''}
   {'rm -rf venv && python -m venv venv && pip install -r requirements.txt' if self.args.backend in ['fastapi', 'django'] else ''}
   ```

## Performance

### Optimization Tips
{f'''- Use React.memo for expensive components
- Implement code splitting
- Optimize images with next/image
- Use CSS modules for styling''' if self.args.frontend == 'nextjs' else '- Optimize bundle size\n- Implement lazy loading\n- Use performance profiler' if self.args.frontend != 'none' else ''}

{f'''- Use connection pooling
- Implement caching (Redis)
- Optimize database queries
- Use async operations''' if self.args.backend != 'none' else ''}

### Monitoring
- Use browser DevTools Performance tab
- Monitor API response times
- Track error rates
- Set up alerts for anomalies

## Security

### Best Practices
- Never commit secrets
- Validate all inputs
- Use parameterized queries
- Implement rate limiting
- Keep dependencies updated

### Security Checklist
- [ ] No hardcoded credentials
- [ ] Input validation implemented
- [ ] Authentication required for sensitive endpoints
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Dependencies scanned for vulnerabilities

## Resources

### Documentation
- [{self.args.frontend} Docs](https://docs.{self.args.frontend}.com) {if self.args.frontend != 'none' else ''}
- [{self.args.backend} Docs](https://docs.{self.args.backend}.com) {if self.args.backend != 'none' else ''}
- [Project Wiki](https://github.com/yourorg/{self.args.name}/wiki)

### Tools
- [VS Code]( https://code.visualstudio.com/)
- [Postman](https://www.postman.com/) for API testing
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

### Support
- Team Slack: #{self.args.name}-dev
- Documentation: /docs
- Issue Tracker: GitHub Issues
"""
    
    def _generate_backend_example(self) -> str:
        """Generate backend code example based on framework"""
        examples = {
            'fastapi': """```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()

class ItemCreate(BaseModel):
    name: str
    description: str
    price: float

class ItemResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float

@router.post("/items", response_model=ItemResponse)
async def create_item(item: ItemCreate) -> ItemResponse:
    \"\"\"Create a new item\"\"\"
    # Add business logic here
    return ItemResponse(id=1, **item.dict())
```""",

            'django': """```python
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Item
from .serializers import ItemSerializer

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    
    def create(self, request):
        \"\"\"Create a new item\"\"\"
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
```""",

            'nestjs': """```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemService } from './item.service';

@ApiTags('items')
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}
  
  @Post()
  @ApiOperation({ summary: 'Create a new item' })
  async create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }
}
```""",

            'go': """```go
package handlers

import (
    "encoding/json"
    "net/http"
)

type Item struct {
    ID          int     `json:"id"`
    Name        string  `json:"name"`
    Description string  `json:"description"`
    Price       float64 `json:"price"`
}

func CreateItem(w http.ResponseWriter, r *http.Request) {
    var item Item
    if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    
    // Add business logic here
    item.ID = 1
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(item)
}
```"""
        }
        
        return examples.get(self.args.backend, '')
    
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