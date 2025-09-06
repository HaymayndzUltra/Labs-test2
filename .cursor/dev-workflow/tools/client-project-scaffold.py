#!/usr/bin/env python3
"""
Client Project Scaffolding Tool
Generates industry-specific project templates with AI Governor Framework integration
"""

import os
import json
import yaml
from pathlib import Path
from typing import Dict, List
import argparse
import shutil

class ClientProjectScaffold:
    def __init__(self, base_path: str = "."):
        self.base_path = Path(base_path)
        self.templates_path = self.base_path / ".cursor" / "templates"
        
    def create_project_structure(self, project_name: str, industry: str, tech_stack: Dict):
        """Generate complete project structure for client"""
        project_path = self.base_path / f"client-{project_name}"
        
        # Create main project directories
        directories = [
            "frontend/src/components",
            "frontend/src/pages", 
            "frontend/src/utils",
            "frontend/src/styles",
            "backend/src/api",
            "backend/src/models",
            "backend/src/middleware",
            "backend/src/config",
            "database/migrations",
            "database/seeds",
            "database/schemas",
            "docs/client",
            "docs/technical",
            "docs/deployment",
            ".cursor/rules",
            ".cursor/dev-workflow"
        ]
        
        for dir_path in directories:
            (project_path / dir_path).mkdir(parents=True, exist_ok=True)
            
        return project_path
    
    def generate_industry_rules(self, project_path: Path, industry: str):
        """Generate industry-specific Cursor rules"""
        
        industry_rules = {
            "healthcare": {
                "name": "healthcare-compliance.mdc",
                "content": self._get_healthcare_rule_content()
            },
            "finance": {
                "name": "financial-compliance.mdc", 
                "content": self._get_financial_rule_content()
            },
            "ecommerce": {
                "name": "ecommerce-patterns.mdc",
                "content": self._get_ecommerce_rule_content()
            },
            "enterprise": {
                "name": "enterprise-patterns.mdc",
                "content": self._get_enterprise_rule_content()
            }
        }
        
        if industry.lower() in industry_rules:
            rule_config = industry_rules[industry.lower()]
            rule_path = project_path / ".cursor" / "rules" / rule_config["name"]
            
            with open(rule_path, 'w') as f:
                f.write(rule_config["content"])
                
    def generate_tech_stack_config(self, project_path: Path, tech_stack: Dict):
        """Generate technology-specific configurations"""
        
        # Package.json for frontend
        if tech_stack.get("frontend") in ["react", "nextjs", "vue"]:
            self._create_frontend_config(project_path, tech_stack)
            
        # Backend configuration  
        if tech_stack.get("backend") in ["nodejs", "python", "go"]:
            self._create_backend_config(project_path, tech_stack)
            
        # Database setup
        if tech_stack.get("database"):
            self._create_database_config(project_path, tech_stack)
    
    def generate_workflow_templates(self, project_path: Path, industry: str):
        """Generate client-specific workflow templates"""
        
        # Client PRD template
        prd_template = self._get_client_prd_template(industry)
        prd_path = project_path / ".cursor" / "dev-workflow" / "client-prd-template.md"
        
        with open(prd_path, 'w') as f:
            f.write(prd_template)
            
        # Client task template
        task_template = self._get_client_task_template(industry)
        task_path = project_path / ".cursor" / "dev-workflow" / "client-task-template.md"
        
        with open(task_path, 'w') as f:
            f.write(task_template)
    
    def generate_documentation(self, project_path: Path, project_config: Dict):
        """Generate client-specific documentation"""
        
        # README.md
        readme_content = self._get_readme_template(project_config)
        with open(project_path / "README.md", 'w') as f:
            f.write(readme_content)
            
        # Technical Architecture
        arch_content = self._get_architecture_template(project_config)
        with open(project_path / "docs" / "technical" / "architecture.md", 'w') as f:
            f.write(arch_content)
            
        # Client Requirements
        req_content = self._get_requirements_template(project_config)
        with open(project_path / "docs" / "client" / "requirements.md", 'w') as f:
            f.write(req_content)
    
    def _get_healthcare_rule_content(self) -> str:
        return '''---
description: "TAGS: [healthcare,hipaa,compliance] | TRIGGERS: healthcare,hipaa,phi,patient,medical | SCOPE: project-rules | DESCRIPTION: Healthcare-specific compliance and security requirements for HIPAA-compliant applications."
alwaysApply: false
---

# Healthcare Compliance Rule

## AI Persona
You are a **Healthcare Compliance Developer** ensuring HIPAA compliance and patient data protection.

## Core Principles
- All PHI must be encrypted at rest and in transit
- Implement comprehensive audit logging
- Use minimum necessary access principles
- Ensure secure authentication with MFA

## Implementation Requirements
- Database encryption with AES-256
- SSL/TLS for all communications
- Session timeout: 15 minutes maximum
- Audit logs for all data access
- Role-based access control (RBAC)
'''
    
    def _get_financial_rule_content(self) -> str:
        return '''---
description: "TAGS: [finance,sox,pci,compliance] | TRIGGERS: finance,financial,sox,pci,transaction,payment | SCOPE: project-rules | DESCRIPTION: Financial services compliance requirements for SOX and PCI DSS compliance."
alwaysApply: false
---

# Financial Compliance Rule

## AI Persona
You are a **Financial Systems Developer** ensuring SOX and PCI DSS compliance.

## Core Principles
- Implement immutable audit trails
- Use secure payment processing
- Ensure data integrity and non-repudiation
- Implement fraud detection mechanisms

## Implementation Requirements
- PCI DSS Level 1 compliance for payments
- SOX-compliant audit trails
- Real-time transaction monitoring
- Secure API gateways with rate limiting
- Multi-factor authentication for financial operations
'''
    
    def _get_ecommerce_rule_content(self) -> str:
        return '''---
description: "TAGS: [ecommerce,retail,payments] | TRIGGERS: ecommerce,shop,cart,product,order,payment | SCOPE: project-rules | DESCRIPTION: E-commerce platform patterns and payment processing requirements."
alwaysApply: false
---

# E-commerce Patterns Rule

## AI Persona
You are an **E-commerce Platform Developer** focused on conversion optimization and secure transactions.

## Core Principles
- Optimize for conversion and user experience
- Implement secure payment processing
- Ensure inventory accuracy and real-time updates
- Focus on mobile-first design

## Implementation Requirements
- Secure checkout with SSL
- Real-time inventory management
- Cart abandonment recovery
- Mobile-responsive design
- Payment gateway integration (Stripe/PayPal)
'''
    
    def _get_enterprise_rule_content(self) -> str:
        return '''---
description: "TAGS: [enterprise,saas,multi-tenant] | TRIGGERS: enterprise,saas,tenant,sso,admin,organization | SCOPE: project-rules | DESCRIPTION: Enterprise SaaS patterns for multi-tenant applications with SSO and admin capabilities."
alwaysApply: false
---

# Enterprise SaaS Patterns Rule

## AI Persona
You are an **Enterprise SaaS Developer** building scalable multi-tenant platforms.

## Core Principles
- Design for scalability and multi-tenancy
- Implement comprehensive admin controls
- Ensure SSO integration capabilities
- Focus on enterprise security requirements

## Implementation Requirements
- Multi-tenant architecture with data isolation
- SSO integration (SAML, OIDC)
- Role-based permissions with granular control
- Admin dashboards with analytics
- API rate limiting and monitoring
'''

    def _create_frontend_config(self, project_path: Path, tech_stack: Dict):
        """Create frontend configuration files"""
        frontend_type = tech_stack.get("frontend")
        
        if frontend_type == "nextjs":
            package_json = {
                "name": f"client-{project_path.name}-frontend",
                "version": "1.0.0",
                "scripts": {
                    "dev": "next dev",
                    "build": "next build",
                    "start": "next start",
                    "lint": "next lint"
                },
                "dependencies": {
                    "next": "^14.0.0",
                    "react": "^18.0.0",
                    "react-dom": "^18.0.0",
                    "typescript": "^5.0.0"
                }
            }
            
            with open(project_path / "frontend" / "package.json", 'w') as f:
                json.dump(package_json, f, indent=2)
    
    def _create_backend_config(self, project_path: Path, tech_stack: Dict):
        """Create backend configuration files"""
        backend_type = tech_stack.get("backend")
        
        if backend_type == "nodejs":
            package_json = {
                "name": f"client-{project_path.name}-backend",
                "version": "1.0.0",
                "scripts": {
                    "start": "node src/index.js",
                    "dev": "nodemon src/index.js",
                    "test": "jest"
                },
                "dependencies": {
                    "express": "^4.18.0",
                    "cors": "^2.8.5",
                    "helmet": "^7.0.0",
                    "dotenv": "^16.0.0"
                }
            }
            
            with open(project_path / "backend" / "package.json", 'w') as f:
                json.dump(package_json, f, indent=2)
    
    def _create_database_config(self, project_path: Path, tech_stack: Dict):
        """Create database configuration and migration files"""
        db_type = tech_stack.get("database")
        
        if db_type == "postgresql":
            # Create initial migration
            migration_content = '''-- Initial database schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_users_email ON users(email);
'''
            
            migration_path = project_path / "database" / "migrations" / "001_initial_schema.sql"
            with open(migration_path, 'w') as f:
                f.write(migration_content)
    
    def _get_client_prd_template(self, industry: str) -> str:
        return f'''# Client PRD Template - {industry.title()} Industry

## Executive Summary
- **Industry**: {industry.title()}
- **Project Type**: [Web App/Mobile App/Platform]
- **Target Users**: [Define user types]
- **Business Goals**: [Primary objectives]

## Industry-Specific Requirements
{self._get_industry_requirements(industry)}

## Feature Requirements
### Core Features
- [ ] User authentication and management
- [ ] Dashboard/main interface
- [ ] [Industry-specific core features]

### Compliance Features
- [ ] {self._get_compliance_features(industry)}

## Technical Requirements
- **Frontend**: [Technology choice]
- **Backend**: [Technology choice]  
- **Database**: [Technology choice]
- **Hosting**: [Deployment strategy]

## Success Metrics
- [Industry-relevant KPIs]
- [Technical performance metrics]
- [User experience metrics]
'''
    
    def _get_industry_requirements(self, industry: str) -> str:
        requirements = {
            "healthcare": "- HIPAA compliance for patient data\n- Audit logging requirements\n- Secure messaging capabilities",
            "finance": "- SOX compliance for financial data\n- PCI DSS for payment processing\n- Real-time fraud detection",
            "ecommerce": "- Payment processing integration\n- Inventory management\n- Order fulfillment workflows",
            "enterprise": "- Multi-tenant architecture\n- SSO integration\n- Admin dashboard requirements"
        }
        return requirements.get(industry, "- Industry-specific requirements to be defined")
    
    def _get_compliance_features(self, industry: str) -> str:
        features = {
            "healthcare": "HIPAA audit trails, secure messaging, patient consent management",
            "finance": "SOX audit trails, PCI compliance, transaction monitoring",
            "ecommerce": "GDPR compliance, secure checkout, payment security",
            "enterprise": "SOC2 compliance, SSO integration, admin controls"
        }
        return features.get(industry, "Industry compliance requirements")

def main():
    parser = argparse.ArgumentParser(description='Generate client project scaffold')
    parser.add_argument('--name', required=True, help='Project name')
    parser.add_argument('--industry', required=True, choices=['healthcare', 'finance', 'ecommerce', 'enterprise'], help='Client industry')
    parser.add_argument('--frontend', default='nextjs', help='Frontend technology')
    parser.add_argument('--backend', default='nodejs', help='Backend technology')
    parser.add_argument('--database', default='postgresql', help='Database technology')
    
    args = parser.parse_args()
    
    scaffold = ClientProjectScaffold()
    
    tech_stack = {
        'frontend': args.frontend,
        'backend': args.backend,
        'database': args.database
    }
    
    project_config = {
        'name': args.name,
        'industry': args.industry,
        'tech_stack': tech_stack
    }
    
    print(f"🚀 Creating {args.industry} client project: {args.name}")
    
    # Generate project structure
    project_path = scaffold.create_project_structure(args.name, args.industry, tech_stack)
    print(f"✅ Created project structure at: {project_path}")
    
    # Generate industry-specific rules
    scaffold.generate_industry_rules(project_path, args.industry)
    print(f"✅ Generated {args.industry} compliance rules")
    
    # Generate tech stack configuration
    scaffold.generate_tech_stack_config(project_path, tech_stack)
    print(f"✅ Generated {tech_stack} configuration")
    
    # Generate workflow templates
    scaffold.generate_workflow_templates(project_path, args.industry)
    print(f"✅ Generated workflow templates")
    
    # Generate documentation
    scaffold.generate_documentation(project_path, project_config)
    print(f"✅ Generated project documentation")
    
    print(f"\n🎉 Client project '{args.name}' successfully created!")
    print(f"📁 Location: {project_path}")
    print(f"🏭 Industry: {args.industry}")
    print(f"⚡ Tech Stack: {tech_stack}")
    
    print(f"\n📋 Next Steps:")
    print(f"1. cd {project_path}")
    print(f"2. Apply instructions from .cursor/dev-workflow/1-create-client-specific-prd.md")
    print(f"3. Run: Apply instructions from .cursor/dev-workflow/client-prd-template.md")

if __name__ == "__main__":
    main()
