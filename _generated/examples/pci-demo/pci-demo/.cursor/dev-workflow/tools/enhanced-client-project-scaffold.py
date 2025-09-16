#!/usr/bin/env python3
"""
Enhanced Client Project Scaffolding Tool with Industry Intelligence

This tool creates production-ready project structures with industry-specific
compliance, security patterns, and technology stack optimization.
"""

import os
import sys
import json
import yaml
import argparse
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime
import subprocess
import shutil
from jinja2 import Environment, FileSystemLoader, Template

# Add the tools directory to the path for imports
sys.path.append(str(Path(__file__).parent))

from industry_pattern_recognition import IndustryPatternRecognizer
from cached_context_discovery import CachedContextDiscovery
from intelligent_rule_precedence import IntelligentRulePrecedence


class EnhancedClientProjectScaffold:
    """Enhanced project scaffolding with industry intelligence"""
    
    def __init__(self):
        self.industry_recognizer = IndustryPatternRecognizer()
        self.context_discovery = CachedContextDiscovery()
        self.rule_precedence = IntelligentRulePrecedence()
        
        # Initialize Jinja2 template environment
        self.template_env = Environment(
            loader=FileSystemLoader(str(Path(__file__).parent / 'templates')),
            autoescape=True,
            trim_blocks=True,
            lstrip_blocks=True
        )
        
        # Create templates directory if it doesn't exist
        self.templates_dir = Path(__file__).parent / 'templates'
        self.templates_dir.mkdir(exist_ok=True)
        
        # Initialize template system
        self._initialize_template_system()

    def _initialize_template_system(self):
        """Initialize the Jinja2 template system with industry-specific templates"""
        
        # Create template directories
        template_dirs = [
            'react',
            'vue',
            'angular', 
            'nodejs',
            'python',
            'postgresql',
            'mongodb',
            'healthcare',
            'finance',
            'ecommerce',
            'enterprise',
            'common'
        ]
        
        for template_dir in template_dirs:
            (self.templates_dir / template_dir).mkdir(exist_ok=True)
        
        # Generate base templates if they don't exist
        self._generate_base_templates()

    def _generate_base_templates(self):
        """Generate base templates for different technologies and industries"""
        
        # React component template
        react_component_template = """import React from 'react';
import { Box, Typography, Container } from '@mui/material';

interface {{ component_name }}Props {
  className?: string;
  {% for prop in props %}
  {{ prop.name }}: {{ prop.type }};
  {% endfor %}
}

const {{ component_name }}: React.FC<{{ component_name }}Props> = ({ 
  className,
  {% for prop in props %}
  {{ prop.name }},
  {% endfor %}
}) => {
  return (
    <Container maxWidth="lg" className={className}>
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {{ component_name }} - {{ industry.title() }} Component
        </Typography>
        <Typography variant="body1">
          {{ description }}
        </Typography>
        {% if compliance_requirements %}
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6" gutterBottom>
            Compliance Requirements:
          </Typography>
          <ul>
            {% for requirement in compliance_requirements %}
            <li>{{ requirement }}</li>
            {% endfor %}
          </ul>
        </Box>
        {% endif %}
      </Box>
    </Container>
  );
};

export default {{ component_name }};
"""
        
        with open(self.templates_dir / 'react' / 'component.tsx.j2', 'w') as f:
            f.write(react_component_template)
        
        # Node.js API template
        nodejs_api_template = """const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: {{ rate_limit_window_ms }},
  max: {{ rate_limit_max_requests }},
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// {{ industry.title() }} specific middleware
{% if industry == 'healthcare' %}
app.use((req, res, next) => {
  // HIPAA compliance logging
  console.log(`[HIPAA] ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});
{% elif industry == 'finance' %}
app.use((req, res, next) => {
  // PCI DSS compliance logging
  console.log(`[PCI] ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});
{% endif %}

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '{{ project_name }} - {{ industry.title() }} API',
    version: '1.0.0',
    industry: '{{ industry }}',
    compliance: {{ compliance_requirements | tojson }}
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

{% for endpoint in api_endpoints %}
app.{{ endpoint.method.lower() }}('{{ endpoint.path }}', {{ endpoint.middleware | join(', ') }}, async (req, res) => {
  try {
    // {{ endpoint.description }}
    {{ endpoint.implementation }}
  } catch (error) {
    console.error('Error in {{ endpoint.name }}:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});
{% endfor %}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

app.listen(PORT, () => {
  console.log(`{{ project_name }} server running on port ${PORT}`);
  console.log(`Industry: {{ industry.title() }}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
"""
        
        with open(self.templates_dir / 'nodejs' / 'server.js.j2', 'w') as f:
            f.write(nodejs_api_template)
        
        # Python FastAPI template
        python_api_template = """from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import HTTPBearer
import os
from dotenv import load_dotenv
import logging
from datetime import datetime

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="{{ project_name }} - {{ industry.title() }} API",
    description="Backend API for {{ industry }} industry application",
    version="1.0.0",
    docs_url="/docs" if os.getenv("ENVIRONMENT") == "development" else None,
    redoc_url="/redoc" if os.getenv("ENVIRONMENT") == "development" else None
)

# Security middleware
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["*"] if os.getenv("ENVIRONMENT") == "development" else ["{{ project_name }}.com"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# {{ industry.title() }} specific middleware
{% if industry == 'healthcare' %}
@app.middleware("http")
async def hipaa_logging_middleware(request, call_next):
    logger.info(f"[HIPAA] {request.method} {request.url} - {datetime.now().isoformat()}")
    response = await call_next(request)
    return response
{% elif industry == 'finance' %}
@app.middleware("http")
async def pci_logging_middleware(request, call_next):
    logger.info(f"[PCI] {request.method} {request.url} - {datetime.now().isoformat()}")
    response = await call_next(request)
    return response
{% endif %}

@app.get("/")
async def root():
    return {
        "message": "{{ project_name }} - {{ industry.title() }} API",
        "version": "1.0.0",
        "industry": "{{ industry }}",
        "compliance": {{ compliance_requirements | tojson }}
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "uptime": "{{ uptime }}"
    }

{% for endpoint in api_endpoints %}
@app.{{ endpoint.method.lower() }}("{{ endpoint.path }}")
async def {{ endpoint.function_name }}({{ endpoint.parameters | join(', ') }}):
    \"\"\"
    {{ endpoint.description }}
    \"\"\"
    try:
        {{ endpoint.implementation }}
    except Exception as e:
        logger.error(f"Error in {{ endpoint.function_name }}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
{% endfor %}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
"""
        
        with open(self.templates_dir / 'python' / 'main.py.j2', 'w') as f:
            f.write(python_api_template)
        
        # Database schema templates
        postgresql_schema_template = """-- {{ project_name }} - {{ industry.title() }} Database Schema
-- Generated by Enhanced Client Project Scaffold
-- Industry: {{ industry }}
-- Compliance: {{ compliance_requirements | join(', ') }}

-- Create database
CREATE DATABASE {{ project_name.replace('-', '_') }};

-- Use database
\\c {{ project_name.replace('-', '_') }};

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'user',
    {% if industry == 'healthcare' %}
    -- HIPAA specific fields
    phi_access_level VARCHAR(50) DEFAULT 'restricted',
    consent_given BOOLEAN DEFAULT FALSE,
    consent_date TIMESTAMP,
    {% elif industry == 'finance' %}
    -- PCI DSS specific fields
    pci_access_level VARCHAR(50) DEFAULT 'standard',
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    last_password_change TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    {% endif %}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create audit log table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100),
    details JSONB,
    ip_address INET,
    {% if industry == 'healthcare' %}
    -- HIPAA specific audit fields
    phi_accessed BOOLEAN DEFAULT FALSE,
    access_reason TEXT,
    {% elif industry == 'finance' %}
    -- PCI DSS specific audit fields
    payment_data_accessed BOOLEAN DEFAULT FALSE,
    transaction_id VARCHAR(100),
    {% endif %}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

{% for table in industry_tables %}
-- {{ table.name }} table
CREATE TABLE {{ table.name }} (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    {% for column in table.columns %}
    {{ column.name }} {{ column.type }}{% if column.constraints %} {{ column.constraints | join(' ') }}{% endif %},
    {% endfor %}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
{% endfor %}

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
{% if industry == 'healthcare' %}
CREATE INDEX idx_audit_logs_phi_accessed ON audit_logs(phi_accessed);
{% elif industry == 'finance' %}
CREATE INDEX idx_audit_logs_payment_data_accessed ON audit_logs(payment_data_accessed);
{% endif %}

-- Create functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

{% for table in industry_tables %}
CREATE TRIGGER update_{{ table.name }}_updated_at BEFORE UPDATE ON {{ table.name }}
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
{% endfor %}
"""
        
        with open(self.templates_dir / 'postgresql' / 'schema.sql.j2', 'w') as f:
            f.write(postgresql_schema_template)
        
        # Industry-specific configuration templates
        healthcare_config_template = """# Healthcare Industry Configuration
# HIPAA Compliance Settings

encryption:
  algorithm: AES-256-GCM
  key_rotation_days: 90
  phi_fields:
    - patient_id
    - medical_record_number
    - diagnosis
    - treatment_plan
    - medication_history

access_control:
  mfa_required: true
  session_timeout_minutes: 15
  role_based_access: true
  minimum_password_length: 12
  password_complexity: true

audit_logging:
  log_all_access: true
  log_data_modifications: true
  retention_years: 7
  immutable_logs: true
  real_time_monitoring: true

data_protection:
  mask_sensitive_data: true
  anonymize_exports: true
  secure_deletion: true
  backup_encryption: true
  data_minimization: true

compliance:
  hipaa_breach_notification: true
  patient_rights_management: true
  business_associate_agreements: true
  risk_assessment_frequency: quarterly
"""
        
        with open(self.templates_dir / 'healthcare' / 'config.yaml.j2', 'w') as f:
            f.write(healthcare_config_template)
        
        finance_config_template = """# Finance Industry Configuration
# PCI DSS and SOX Compliance Settings

payment_security:
  tokenization: true
  encryption_in_transit: true
  secure_storage: true
  no_card_data_storage: true
  pci_dss_compliant: true

access_control:
  unique_ids: true
  password_complexity: true
  two_factor_auth: true
  regular_password_changes: true
  session_timeout_minutes: 30

monitoring:
  log_payment_access: true
  intrusion_detection: true
  regular_scanning: true
  real_time_monitoring: true
  fraud_detection: true

compliance:
  annual_assessment: true
  quarterly_scanning: true
  incident_response: true
  vulnerability_management: true
  sox_compliance: true

audit_trail:
  immutable_logs: true
  timestamp_accuracy: true
  user_tracking: true
  change_documentation: true
  financial_reporting: true
"""
        
        with open(self.templates_dir / 'finance' / 'config.yaml.j2', 'w') as f:
            f.write(finance_config_template)

    def create_project(self, project_name: str, industry: str = None,
                      user_requirements: str = None, tech_stack: Dict[str, str] = None) -> Dict[str, Any]:
        """Create a new project with industry intelligence"""
        
        print(f"🚀 Creating enhanced project: {project_name}")
        
        # Step 1: Analyze industry context
        industry_context = self._analyze_industry_context(project_name, industry, user_requirements)
        
        # Step 2: Determine optimal tech stack
        if not tech_stack:
            tech_stack = self._determine_tech_stack(industry_context, user_requirements)
        
        # Step 3: Create project structure
        project_path = Path(project_name)
        self._create_project_structure(project_path, industry_context, tech_stack)
        
        # Step 4: Generate industry-specific files using templates
        self._generate_industry_files_with_templates(project_path, industry_context, tech_stack)
        
        # Step 5: Set up compliance and security
        self._setup_compliance_security(project_path, industry_context)
        
        # Step 6: Initialize version control and dependency management
        self._initialize_version_control(project_path, industry_context)
        self._setup_dependency_management(project_path, industry_context, tech_stack)
        
        # Step 7: Generate documentation
        self._generate_documentation(project_path, industry_context, tech_stack)
        
        # Step 8: Validate and optimize project structure
        self._validate_and_optimize_project_structure(project_path, industry_context, tech_stack)
        
        # Step 9: Create project context
        project_context = self._create_project_context(project_path, industry_context, tech_stack)
        
        print(f"✅ Project created successfully at: {project_path.absolute()}")
        print(f"🏭 Industry: {industry_context['industry']} (confidence: {industry_context['confidence']:.2f})")
        print(f"🛠️  Tech Stack: {', '.join(tech_stack.values())}")
        print(f"🛡️  Compliance: {', '.join(industry_context.get('compliance_requirements', []))}")
        
        return project_context

    def _analyze_industry_context(self, project_name: str, industry: str = None,
                                user_requirements: str = None) -> Dict[str, Any]:
        """Analyze industry context using enhanced intelligence"""
        
        # Use cached context discovery for performance
        context_key = f"{project_name}_{industry}_{user_requirements or ''}"
        cached_context = self.context_discovery.get_context(context_key)
        
        if cached_context:
            print("📋 Using cached industry context")
            return cached_context
        
        # Analyze industry from multiple sources
        industry_analysis = {
            'industry': industry or 'general',
            'confidence': 0.8,
            'compliance_requirements': [],
            'security_patterns': [],
            'recommended_practices': []
        }
        
        # Use industry pattern recognition
        if user_requirements:
            detected_industry = self.industry_recognizer.classify_industry(
                project_name, user_requirements
            )
            if detected_industry['confidence'] > industry_analysis['confidence']:
                industry_analysis.update(detected_industry)
        
        # Get compliance requirements
        industry_analysis['compliance_requirements'] = self.industry_recognizer.get_compliance_requirements(
            industry_analysis['industry']
        )
        
        # Get security patterns
        industry_analysis['security_patterns'] = self.industry_recognizer.get_security_patterns(
            industry_analysis['industry']
        )
        
        # Cache the context
        self.context_discovery.store_context(context_key, industry_analysis)
        
        return industry_analysis

    def _determine_tech_stack(self, industry_context: Dict[str, Any], 
                            user_requirements: str = None) -> Dict[str, str]:
        """Determine optimal technology stack"""
        
        # Get recommended tech stack from industry recognizer
        recommended_stack = self.industry_recognizer.get_recommended_tech_stack(
            industry_context['industry']
        )
        
        # Override with user requirements if specified
        if user_requirements:
            # Simple keyword-based tech stack detection
            if 'react' in user_requirements.lower():
                recommended_stack['frontend'] = 'React'
            if 'vue' in user_requirements.lower():
                recommended_stack['frontend'] = 'Vue.js'
            if 'angular' in user_requirements.lower():
                recommended_stack['frontend'] = 'Angular'
            if 'node' in user_requirements.lower():
                recommended_stack['backend'] = 'Node.js'
            if 'python' in user_requirements.lower():
                recommended_stack['backend'] = 'Python/FastAPI'
            if 'postgresql' in user_requirements.lower():
                recommended_stack['database'] = 'PostgreSQL'
            if 'mongodb' in user_requirements.lower():
                recommended_stack['database'] = 'MongoDB'
        
        return recommended_stack

    def _generate_industry_files_with_templates(self, project_path: Path, 
                                              industry_context: Dict[str, Any], 
                                              tech_stack: Dict[str, str]):
        """Generate industry-specific files using Jinja2 templates"""
        
        print("🏭 Generating industry-specific files using templates...")
        
        industry = industry_context['industry']
        
        # Generate based on tech stack
        if tech_stack.get('frontend') == 'React':
            self._render_react_templates(project_path, industry_context, tech_stack)
        elif tech_stack.get('frontend') == 'Vue.js':
            self._render_vue_templates(project_path, industry_context, tech_stack)
        elif tech_stack.get('frontend') == 'Angular':
            self._render_angular_templates(project_path, industry_context, tech_stack)
        
        if tech_stack.get('backend') == 'Node.js':
            self._render_nodejs_templates(project_path, industry_context, tech_stack)
        elif tech_stack.get('backend') == 'Python/FastAPI':
            self._render_python_templates(project_path, industry_context, tech_stack)
        
        # Generate database files
        if tech_stack.get('database') == 'PostgreSQL':
            self._render_postgresql_templates(project_path, industry_context, tech_stack)
        elif tech_stack.get('database') == 'MongoDB':
            self._render_mongodb_templates(project_path, industry_context, tech_stack)
        
        # Generate industry-specific configuration
        self._render_industry_config_templates(project_path, industry_context, tech_stack)

    def _render_react_templates(self, project_path: Path, 
                              industry_context: Dict[str, Any], 
                              tech_stack: Dict[str, str]):
        """Render React templates"""
        
        # Render main App component
        template = self.template_env.get_template('react/component.tsx.j2')
        
        component_data = {
            'component_name': 'App',
            'industry': industry_context['industry'],
            'description': f'Main application component for {industry_context["industry"]} industry',
            'compliance_requirements': industry_context.get('compliance_requirements', []),
            'props': []
        }
        
        rendered_content = template.render(**component_data)
        
        # Create frontend/src directory
        src_dir = project_path / 'frontend' / 'src'
        src_dir.mkdir(parents=True, exist_ok=True)
        
        with open(src_dir / 'App.tsx', 'w') as f:
            f.write(rendered_content)
        
        # Render package.json
        package_data = {
            'project_name': project_path.name,
            'industry': industry_context['industry'],
            'compliance_requirements': industry_context.get('compliance_requirements', [])
        }
        
        package_template = """{
  "name": "{{ project_name }}-frontend",
  "version": "1.0.0",
  "description": "{{ industry.title() }} industry React frontend application",
  "main": "index.js",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "@mui/material": "^5.14.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0"{% if industry == 'healthcare' %},
    "react-hook-form": "^7.45.0",
    "yup": "^1.3.0"{% elif industry == 'finance' %},
    "recharts": "^2.8.0",
    "react-query": "^3.39.0"{% endif %}
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}"""
        
        package_template_obj = Template(package_template)
        package_content = package_template_obj.render(**package_data)
        
        with open(project_path / 'frontend' / 'package.json', 'w') as f:
            f.write(package_content)

    def _render_nodejs_templates(self, project_path: Path, 
                               industry_context: Dict[str, Any], 
                               tech_stack: Dict[str, str]):
        """Render Node.js templates"""
        
        # Render server.js
        template = self.template_env.get_template('nodejs/server.js.j2')
        
        server_data = {
            'project_name': project_path.name,
            'industry': industry_context['industry'],
            'compliance_requirements': industry_context.get('compliance_requirements', []),
            'rate_limit_window_ms': 15 * 60 * 1000,  # 15 minutes
            'rate_limit_max_requests': 100,
            'api_endpoints': self._get_industry_api_endpoints(industry_context['industry'])
        }
        
        rendered_content = template.render(**server_data)
        
        with open(project_path / 'backend' / 'server.js', 'w') as f:
            f.write(rendered_content)
        
        # Render package.json
        package_data = {
            'project_name': project_path.name,
            'industry': industry_context['industry'],
            'compliance_requirements': industry_context.get('compliance_requirements', [])
        }
        
        package_template = """{
  "name": "{{ project_name }}-backend",
  "version": "1.0.0",
  "description": "{{ industry.title() }} industry Node.js backend",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "dotenv": "^16.3.1",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "express-rate-limit": "^6.10.0"{% if industry == 'healthcare' %},
    "winston": "^3.10.0",
    "joi": "^17.9.0"{% elif industry == 'finance' %},
    "stripe": "^13.0.0",
    "crypto": "^1.0.1"{% endif %}
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.0"
  }
}"""
        
        package_template_obj = Template(package_template)
        package_content = package_template_obj.render(**package_data)
        
        with open(project_path / 'backend' / 'package.json', 'w') as f:
            f.write(package_content)

    def _render_python_templates(self, project_path: Path, 
                               industry_context: Dict[str, Any], 
                               tech_stack: Dict[str, str]):
        """Render Python FastAPI templates"""
        
        # Render main.py
        template = self.template_env.get_template('python/main.py.j2')
        
        api_data = {
            'project_name': project_path.name,
            'industry': industry_context['industry'],
            'compliance_requirements': industry_context.get('compliance_requirements', []),
            'api_endpoints': self._get_industry_api_endpoints(industry_context['industry']),
            'uptime': 'N/A'
        }
        
        rendered_content = template.render(**api_data)
        
        with open(project_path / 'backend' / 'main.py', 'w') as f:
            f.write(rendered_content)
        
        # Render requirements.txt
        requirements_template = """fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
python-dotenv==1.0.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6{% if industry == 'healthcare' %}
sqlalchemy==2.0.23
alembic==1.13.0
winston==0.1.0{% elif industry == 'finance' %}
stripe==6.0.0
cryptography==41.0.0{% endif %}
pytest==7.4.3
pytest-asyncio==0.21.1"""
        
        requirements_template_obj = Template(requirements_template)
        requirements_content = requirements_template_obj.render(
            industry=industry_context['industry']
        )
        
        with open(project_path / 'backend' / 'requirements.txt', 'w') as f:
            f.write(requirements_content)

    def _render_postgresql_templates(self, project_path: Path, 
                                   industry_context: Dict[str, Any], 
                                   tech_stack: Dict[str, str]):
        """Render PostgreSQL templates"""
        
        # Render schema.sql
        template = self.template_env.get_template('postgresql/schema.sql.j2')
        
        schema_data = {
            'project_name': project_path.name,
            'industry': industry_context['industry'],
            'compliance_requirements': industry_context.get('compliance_requirements', []),
            'industry_tables': self._get_industry_tables(industry_context['industry'])
        }
        
        rendered_content = template.render(**schema_data)
        
        with open(project_path / 'database' / 'schema.sql', 'w') as f:
            f.write(rendered_content)

    def _render_mongodb_templates(self, project_path: Path, 
                                industry_context: Dict[str, Any], 
                                tech_stack: Dict[str, str]):
        """Render MongoDB templates"""
        
        # Create MongoDB initialization script
        init_js = f"""// {project_path.name} - {industry_context['industry'].title()} MongoDB Initialization
// Generated by Enhanced Client Project Scaffold

use {project_path.name.replace('-', '_')};

// Create users collection
db.createCollection("users", {{
  validator: {{
    $jsonSchema: {{
      bsonType: "object",
      required: ["email", "passwordHash"],
      properties: {{
        email: {{
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{{2,}}$"
        }},
        passwordHash: {{
          bsonType: "string"
        }},
        firstName: {{
          bsonType: "string"
        }},
        lastName: {{
          bsonType: "string"
        }},
        role: {{
          bsonType: "string",
          enum: ["admin", "user", "moderator"]
        }},
        createdAt: {{
          bsonType: "date"
        }},
        updatedAt: {{
          bsonType: "date"
        }}
      }}
    }}
  }}
}});

// Create audit logs collection
db.createCollection("auditLogs", {{
  validator: {{
    $jsonSchema: {{
      bsonType: "object",
      required: ["action", "createdAt"],
      properties: {{
        userId: {{
          bsonType: "objectId"
        }},
        action: {{
          bsonType: "string"
        }},
        resource: {{
          bsonType: "string"
        }},
        details: {{
          bsonType: "object"
        }},
        ipAddress: {{
          bsonType: "string"
        }},
        createdAt: {{
          bsonType: "date"
        }}
      }}
    }}
  }}
}});

// Create indexes
db.users.createIndex({{ "email": 1 }}, {{ unique: true }});
db.auditLogs.createIndex({{ "userId": 1 }});
db.auditLogs.createIndex({{ "createdAt": 1 }});
"""
        
        with open(project_path / 'database' / 'init.js', 'w') as f:
            f.write(init_js)

    def _render_industry_config_templates(self, project_path: Path, 
                                        industry_context: Dict[str, Any], 
                                        tech_stack: Dict[str, str]):
        """Render industry-specific configuration templates"""
        
        industry = industry_context['industry']
        
        if industry == 'healthcare':
            template = self.template_env.get_template('healthcare/config.yaml.j2')
        elif industry == 'finance':
            template = self.template_env.get_template('finance/config.yaml.j2')
        else:
            return  # No specific template for other industries yet
        
        config_data = {
            'project_name': project_path.name,
            'industry': industry,
            'compliance_requirements': industry_context.get('compliance_requirements', [])
        }
        
        rendered_content = template.render(**config_data)
        
        config_dir = project_path / 'config'
        config_dir.mkdir(exist_ok=True)
        
        with open(config_dir / f'{industry}-config.yaml', 'w') as f:
            f.write(rendered_content)

    def _get_industry_api_endpoints(self, industry: str) -> List[Dict[str, Any]]:
        """Get industry-specific API endpoints"""
        
        endpoints = {
            'healthcare': [
                {
                    'method': 'GET',
                    'path': '/patients',
                    'name': 'get_patients',
                    'function_name': 'get_patients',
                    'description': 'Get list of patients (HIPAA compliant)',
                    'middleware': ['authenticate', 'authorize(["read"])'],
                    'parameters': ['skip: int = 0', 'limit: int = 100'],
                    'implementation': 'return {"patients": [], "total": 0}'
                },
                {
                    'method': 'POST',
                    'path': '/patients',
                    'name': 'create_patient',
                    'function_name': 'create_patient',
                    'description': 'Create new patient record',
                    'middleware': ['authenticate', 'authorize(["write"])'],
                    'parameters': ['patient_data: dict'],
                    'implementation': 'return {"patient_id": "new_id", "status": "created"}'
                }
            ],
            'finance': [
                {
                    'method': 'GET',
                    'path': '/transactions',
                    'name': 'get_transactions',
                    'function_name': 'get_transactions',
                    'description': 'Get transaction history (PCI DSS compliant)',
                    'middleware': ['authenticate', 'authorize(["read"])'],
                    'parameters': ['skip: int = 0', 'limit: int = 100'],
                    'implementation': 'return {"transactions": [], "total": 0}'
                },
                {
                    'method': 'POST',
                    'path': '/payments',
                    'name': 'process_payment',
                    'function_name': 'process_payment',
                    'description': 'Process payment (PCI DSS compliant)',
                    'middleware': ['authenticate', 'authorize(["write"])'],
                    'parameters': ['payment_data: dict'],
                    'implementation': 'return {"transaction_id": "txn_123", "status": "processed"}'
                }
            ]
        }
        
        return endpoints.get(industry, [])

    def _get_industry_tables(self, industry: str) -> List[Dict[str, Any]]:
        """Get industry-specific database tables"""
        
        tables = {
            'healthcare': [
                {
                    'name': 'patients',
                    'columns': [
                        {'name': 'patient_id', 'type': 'VARCHAR(50)', 'constraints': ['UNIQUE', 'NOT NULL']},
                        {'name': 'first_name', 'type': 'VARCHAR(100)', 'constraints': ['NOT NULL']},
                        {'name': 'last_name', 'type': 'VARCHAR(100)', 'constraints': ['NOT NULL']},
                        {'name': 'date_of_birth', 'type': 'DATE', 'constraints': []},
                        {'name': 'medical_record_number', 'type': 'VARCHAR(50)', 'constraints': ['UNIQUE']}
                    ]
                },
                {
                    'name': 'appointments',
                    'columns': [
                        {'name': 'appointment_id', 'type': 'VARCHAR(50)', 'constraints': ['UNIQUE', 'NOT NULL']},
                        {'name': 'patient_id', 'type': 'VARCHAR(50)', 'constraints': ['NOT NULL']},
                        {'name': 'appointment_date', 'type': 'TIMESTAMP', 'constraints': ['NOT NULL']},
                        {'name': 'provider_id', 'type': 'VARCHAR(50)', 'constraints': ['NOT NULL']},
                        {'name': 'status', 'type': 'VARCHAR(20)', 'constraints': ['DEFAULT \'scheduled\'']}
                    ]
                }
            ],
            'finance': [
                {
                    'name': 'accounts',
                    'columns': [
                        {'name': 'account_id', 'type': 'VARCHAR(50)', 'constraints': ['UNIQUE', 'NOT NULL']},
                        {'name': 'account_number', 'type': 'VARCHAR(20)', 'constraints': ['UNIQUE', 'NOT NULL']},
                        {'name': 'account_type', 'type': 'VARCHAR(20)', 'constraints': ['NOT NULL']},
                        {'name': 'balance', 'type': 'DECIMAL(15,2)', 'constraints': ['DEFAULT 0.00']},
                        {'name': 'status', 'type': 'VARCHAR(20)', 'constraints': ['DEFAULT \'active\'']}
                    ]
                },
                {
                    'name': 'transactions',
                    'columns': [
                        {'name': 'transaction_id', 'type': 'VARCHAR(50)', 'constraints': ['UNIQUE', 'NOT NULL']},
                        {'name': 'account_id', 'type': 'VARCHAR(50)', 'constraints': ['NOT NULL']},
                        {'name': 'amount', 'type': 'DECIMAL(15,2)', 'constraints': ['NOT NULL']},
                        {'name': 'transaction_type', 'type': 'VARCHAR(20)', 'constraints': ['NOT NULL']},
                        {'name': 'description', 'type': 'TEXT', 'constraints': []}
                    ]
                }
            ]
        }
        
        return tables.get(industry, [])

    def _validate_and_optimize_project_structure(self, project_path: Path,
                                               industry_context: Dict[str, Any],
                                               tech_stack: Dict[str, str]):
        """Validate and optimize the generated project structure"""
        
        print("🔍 Validating and optimizing project structure...")
        
        # Validate project structure
        validation_results = self._validate_project_structure(project_path, industry_context, tech_stack)
        
        # Generate optimization suggestions
        optimization_suggestions = self._generate_optimization_suggestions(validation_results, industry_context)
        
        # Apply optimizations
        self._apply_optimizations(project_path, optimization_suggestions, industry_context)
        
        # Generate validation report
        self._generate_validation_report(project_path, validation_results, optimization_suggestions)
        
        print("✅ Project structure validation and optimization completed")

    def _validate_project_structure(self, project_path: Path, 
                                  industry_context: Dict[str, Any], 
                                  tech_stack: Dict[str, str]) -> Dict[str, Any]:
        """Validate the project structure against industry standards"""
        
        validation_results = {
            'structure_compliance': {},
            'security_compliance': {},
            'performance_optimization': {},
            'scalability_assessment': {},
            'industry_specific_validation': {},
            'overall_score': 0.0
        }
        
        industry = industry_context['industry']
        
        # 1. Directory Structure Validation
        validation_results['structure_compliance'] = self._validate_directory_structure(project_path, industry)
        
        # 2. Security Structure Validation
        validation_results['security_compliance'] = self._validate_security_structure(project_path, industry)
        
        # 3. Performance Structure Validation
        validation_results['performance_optimization'] = self._validate_performance_structure(project_path, tech_stack)
        
        # 4. Scalability Assessment
        validation_results['scalability_assessment'] = self._assess_scalability(project_path, industry)
        
        # 5. Industry-Specific Validation
        validation_results['industry_specific_validation'] = self._validate_industry_specific_structure(project_path, industry)
        
        # Calculate overall score
        validation_results['overall_score'] = self._calculate_overall_score(validation_results)
        
        return validation_results

    def _validate_directory_structure(self, project_path: Path, industry: str) -> Dict[str, Any]:
        """Validate directory structure compliance"""
        
        required_dirs = {
            'healthcare': [
                'patient-portal', 'medical-records', 'appointment-scheduling',
                'health-data', 'audit-logs', 'compliance-reports'
            ],
            'finance': [
                'payment-processing', 'account-management', 'fraud-detection',
                'financial-reporting', 'transaction-history', 'compliance-audit'
            ],
            'ecommerce': [
                'product-catalog', 'shopping-cart', 'order-management',
                'payment-gateway', 'customer-portal', 'inventory-system'
            ],
            'enterprise': [
                'admin-dashboard', 'user-management', 'organization-setup',
                'api-management', 'reporting-system', 'audit-trail'
            ]
        }
        
        industry_dirs = required_dirs.get(industry, [])
        missing_dirs = []
        extra_dirs = []
        
        # Check for required directories
        for dir_name in industry_dirs:
            if not (project_path / dir_name).exists():
                missing_dirs.append(dir_name)
        
        # Check for unnecessary directories (basic assessment)
        existing_dirs = [d.name for d in project_path.iterdir() if d.is_dir()]
        standard_dirs = ['frontend', 'backend', 'docs', 'database', '.cursor', 'config', 'tests', 'scripts']
        for dir_name in existing_dirs:
            if dir_name not in industry_dirs + standard_dirs:
                extra_dirs.append(dir_name)
        
        return {
            'required_dirs_present': len(missing_dirs) == 0,
            'missing_directories': missing_dirs,
            'extra_directories': extra_dirs,
            'compliance_score': (len(industry_dirs) - len(missing_dirs)) / len(industry_dirs) if industry_dirs else 1.0
        }

    def _validate_security_structure(self, project_path: Path, industry: str) -> Dict[str, Any]:
        """Validate security structure compliance"""
        
        security_requirements = {
            'healthcare': ['hipaa-security.yaml', 'audit-logs', 'patient-data-protection'],
            'finance': ['pci-dss-security.yaml', 'fraud-detection', 'secure-payments'],
            'ecommerce': ['gdpr-privacy.yaml', 'payment-security', 'data-protection'],
            'enterprise': ['enterprise-security.yaml', 'access-control', 'audit-trail']
        }
        
        industry_security = security_requirements.get(industry, [])
        security_score = 0.0
        missing_security = []
        
        for security_item in industry_security:
            if 'config/security' in str(project_path):
                security_path = project_path / 'config' / 'security' / security_item
                if security_path.exists():
                    security_score += 1.0
                else:
                    missing_security.append(security_item)
        
        compliance_score = security_score / len(industry_security) if industry_security else 1.0
        
        return {
            'security_measures_present': len(missing_security) == 0,
            'missing_security_measures': missing_security,
            'compliance_score': compliance_score,
            'encryption_enabled': self._check_encryption_setup(project_path),
            'access_control_implemented': self._check_access_control(project_path)
        }

    def _validate_performance_structure(self, project_path: Path, tech_stack: Dict[str, str]) -> Dict[str, Any]:
        """Validate performance optimization structure"""
        
        performance_indicators = {
            'caching_layer': self._check_caching_setup(project_path),
            'optimization_configs': self._check_optimization_configs(project_path, tech_stack),
            'monitoring_setup': self._check_monitoring_setup(project_path),
            'scalability_configs': self._check_scalability_configs(project_path, tech_stack)
        }
        
        performance_score = sum(performance_indicators.values()) / len(performance_indicators)
        
        return {
            'performance_indicators': performance_indicators,
            'performance_score': performance_score,
            'optimization_opportunities': self._identify_performance_opportunities(project_path, tech_stack)
        }

    def _assess_scalability(self, project_path: Path, industry: str) -> Dict[str, Any]:
        """Assess project scalability"""
        
        scalability_factors = {
            'modular_architecture': self._check_modular_architecture(project_path),
            'microservices_readiness': self._check_microservices_readiness(project_path),
            'horizontal_scaling_preparedness': self._check_horizontal_scaling(project_path),
            'cloud_readiness': self._check_cloud_readiness(project_path)
        }
        
        scalability_score = sum(scalability_factors.values()) / len(scalability_factors)
        
        return {
            'scalability_factors': scalability_factors,
            'scalability_score': scalability_score,
            'scaling_recommendations': self._generate_scaling_recommendations(industry, scalability_score)
        }

    def _validate_industry_specific_structure(self, project_path: Path, industry: str) -> Dict[str, Any]:
        """Validate industry-specific structure requirements"""
        
        industry_validations = {
            'healthcare': self._validate_healthcare_structure(project_path),
            'finance': self._validate_finance_structure(project_path),
            'ecommerce': self._validate_ecommerce_structure(project_path),
            'enterprise': self._validate_enterprise_structure(project_path)
        }
        
        return industry_validations.get(industry, {'industry_specific_score': 1.0})

    def _calculate_overall_score(self, validation_results: Dict[str, Any]) -> float:
        """Calculate overall validation score"""
        
        scores = [
            validation_results['structure_compliance'].get('compliance_score', 0),
            validation_results['security_compliance'].get('compliance_score', 0),
            validation_results['performance_optimization'].get('performance_score', 0),
            validation_results['scalability_assessment'].get('scalability_score', 0),
            validation_results['industry_specific_validation'].get('industry_specific_score', 1.0)
        ]
        
        return sum(scores) / len(scores) if scores else 0.0

    def _generate_optimization_suggestions(self, validation_results: Dict[str, Any],
                                         industry_context: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate optimization suggestions based on validation results"""
        
        suggestions = []
        
        # Structure optimization suggestions
        if not validation_results['structure_compliance']['required_dirs_present']:
            for missing_dir in validation_results['structure_compliance']['missing_directories']:
                suggestions.append({
                    'type': 'structure',
                    'priority': 'high',
                    'action': 'create_directory',
                    'target': missing_dir,
                    'reason': f'Missing required directory for {industry_context["industry"]} industry'
                })
        
        # Security optimization suggestions
        if not validation_results['security_compliance']['security_measures_present']:
            for missing_security in validation_results['security_compliance']['missing_security_measures']:
                suggestions.append({
                    'type': 'security',
                    'priority': 'critical',
                    'action': 'add_security_config',
                    'target': missing_security,
                    'reason': f'Missing security measure required for {industry_context["industry"]} compliance'
                })
        
        # Performance optimization suggestions
        if validation_results['performance_optimization']['performance_score'] < 0.8:
            for opportunity in validation_results['performance_optimization']['optimization_opportunities']:
                suggestions.append({
                    'type': 'performance',
                    'priority': 'medium',
                    'action': 'optimize_performance',
                    'target': opportunity['component'],
                    'reason': opportunity['reason']
                })
        
        return suggestions

    def _apply_optimizations(self, project_path: Path,
                           suggestions: List[Dict[str, Any]],
                           industry_context: Dict[str, Any]):
        """Apply structure optimizations based on suggestions"""
        
        for suggestion in suggestions:
            if suggestion['action'] == 'create_directory':
                target_dir = project_path / suggestion['target']
                target_dir.mkdir(parents=True, exist_ok=True)
                print(f"📁 Created directory: {suggestion['target']}")
            
            elif suggestion['action'] == 'add_security_config':
                if 'hipaa' in suggestion['target']:
                    self._create_hipaa_config(project_path / 'config' / 'security')
                elif 'pci' in suggestion['target']:
                    self._create_pci_config(project_path / 'config' / 'security')
                elif 'gdpr' in suggestion['target']:
                    self._create_gdpr_config(project_path / 'config' / 'security')
                print(f"🔒 Added security config: {suggestion['target']}")

    def _generate_validation_report(self, project_path: Path,
                                  validation_results: Dict[str, Any],
                                  suggestions: List[Dict[str, Any]]):
        """Generate validation report"""
        
        report_path = project_path / 'docs' / 'technical' / 'structure-validation-report.md'
        report_path.parent.mkdir(parents=True, exist_ok=True)
        
        report_content = f"""# Project Structure Validation Report

## Overview
Validation Score: {validation_results['overall_score']:.2f}/1.0
Industry: {validation_results.get('industry', 'Unknown')}
Generated: {datetime.now().isoformat()}

## Validation Results

### Structure Compliance
- Score: {validation_results['structure_compliance'].get('compliance_score', 0):.2f}
- Required Directories Present: {validation_results['structure_compliance']['required_dirs_present']}
- Missing Directories: {', '.join(validation_results['structure_compliance']['missing_directories']) or 'None'}

### Security Compliance
- Score: {validation_results['security_compliance'].get('compliance_score', 0):.2f}
- Security Measures Present: {validation_results['security_compliance']['security_measures_present']}
- Missing Security Measures: {', '.join(validation_results['security_compliance']['missing_security_measures']) or 'None'}

### Performance Optimization
- Score: {validation_results['performance_optimization'].get('performance_score', 0):.2f}
- Optimization Opportunities: {len(validation_results['performance_optimization'].get('optimization_opportunities', []))}

### Scalability Assessment
- Score: {validation_results['scalability_assessment'].get('scalability_score', 0):.2f}

## Applied Optimizations
{chr(10).join(f"- {s['action']}: {s['target']} ({s['priority']} priority)" for s in suggestions) or "No optimizations applied"}

## Recommendations
1. Address all critical and high priority suggestions
2. Implement remaining security measures
3. Optimize performance bottlenecks
4. Ensure scalability requirements are met
"""
        
        with open(report_path, 'w') as f:
            f.write(report_content)

    # Helper methods for validation checks
    def _check_encryption_setup(self, project_path: Path) -> bool:
        """Check if encryption is properly set up"""
        # Check for encryption configuration files
        encryption_files = ['config/security/encryption.yaml', 'config/security/hipaa-security.yaml']
        return any((project_path / file).exists() for file in encryption_files)

    def _check_access_control(self, project_path: Path) -> bool:
        """Check if access control is implemented"""
        # Check for authentication and authorization files
        auth_files = ['backend/middleware/auth.js', 'backend/auth.py', 'config/security/access-control.yaml']
        return any((project_path / file).exists() for file in auth_files)

    def _check_caching_setup(self, project_path: Path) -> bool:
        """Check if caching is set up"""
        # Check for caching configuration
        cache_files = ['config/cache.yaml', 'config/redis.yaml', 'backend/cache.js']
        return any((project_path / file).exists() for file in cache_files)

    def _check_optimization_configs(self, project_path: Path, tech_stack: Dict[str, str]) -> bool:
        """Check for optimization configurations"""
        # Check for build optimization configs
        if tech_stack.get('frontend') == 'React':
            return (project_path / 'frontend' / 'webpack.config.js').exists()
        elif tech_stack.get('backend') == 'Node.js':
            return (project_path / 'backend' / 'package.json').exists()
        return False

    def _check_monitoring_setup(self, project_path: Path) -> bool:
        """Check if monitoring is set up"""
        # Check for monitoring configuration
        monitoring_files = ['config/monitoring.yaml', 'config/prometheus.yaml', 'docker-compose.monitoring.yml']
        return any((project_path / file).exists() for file in monitoring_files)

    def _check_scalability_configs(self, project_path: Path, tech_stack: Dict[str, str]) -> bool:
        """Check for scalability configurations"""
        # Check for scaling configurations
        scaling_files = ['docker-compose.yml', 'kubernetes/', 'config/scaling.yaml']
        return any((project_path / file).exists() for file in scaling_files)

    def _identify_performance_opportunities(self, project_path: Path, tech_stack: Dict[str, str]) -> List[Dict[str, Any]]:
        """Identify performance optimization opportunities"""
        opportunities = []
        
        # Check for missing optimization files
        if tech_stack.get('frontend') == 'React':
            if not (project_path / 'frontend' / 'webpack.config.js').exists():
                opportunities.append({
                    'component': 'frontend',
                    'reason': 'Missing webpack configuration for build optimization'
                })
        
        if tech_stack.get('backend') == 'Node.js':
            if not (project_path / 'backend' / 'package.json').exists():
                opportunities.append({
                    'component': 'backend',
                    'reason': 'Missing package.json for dependency management'
                })
        
        return opportunities

    def _check_modular_architecture(self, project_path: Path) -> bool:
        """Check if project has modular architecture"""
        # Check for modular structure indicators
        modular_indicators = ['src/components/', 'src/modules/', 'src/services/']
        return any((project_path / indicator).exists() for indicator in modular_indicators)

    def _check_microservices_readiness(self, project_path: Path) -> bool:
        """Check if project is ready for microservices"""
        # Check for microservices patterns
        microservice_indicators = ['docker-compose.yml', 'kubernetes/', 'services/']
        return any((project_path / indicator).exists() for indicator in microservice_indicators)

    def _check_horizontal_scaling(self, project_path: Path) -> bool:
        """Check horizontal scaling preparedness"""
        # Check for scaling configurations
        scaling_indicators = ['docker-compose.yml', 'kubernetes/', 'load-balancer.yaml']
        return any((project_path / indicator).exists() for indicator in scaling_indicators)

    def _check_cloud_readiness(self, project_path: Path) -> bool:
        """Check cloud deployment readiness"""
        # Check for cloud configuration files
        cloud_indicators = ['docker-compose.yml', 'kubernetes/', 'terraform/', 'cloudformation/']
        return any((project_path / indicator).exists() for indicator in cloud_indicators)

    def _generate_scaling_recommendations(self, industry: str, scalability_score: float) -> List[str]:
        """Generate scaling recommendations"""
        recommendations = []
        
        if scalability_score < 0.5:
            recommendations.extend([
                "Implement containerization with Docker",
                "Add load balancing configuration",
                "Set up horizontal scaling mechanisms",
                "Implement caching strategies"
            ])
        
        if industry == 'healthcare':
            recommendations.extend([
                "Ensure HIPAA compliance in scaling architecture",
                "Implement data encryption at rest and in transit",
                "Set up audit logging for all scaled components"
            ])
        elif industry == 'finance':
            recommendations.extend([
                "Ensure PCI DSS compliance in scaling architecture",
                "Implement secure payment processing scaling",
                "Set up fraud detection across scaled components"
            ])
        
        return recommendations

    def _validate_healthcare_structure(self, project_path: Path) -> Dict[str, Any]:
        """Validate healthcare-specific structure"""
        return {'industry_specific_score': 0.8}

    def _validate_finance_structure(self, project_path: Path) -> Dict[str, Any]:
        """Validate finance-specific structure"""
        return {'industry_specific_score': 0.8}

    def _validate_ecommerce_structure(self, project_path: Path) -> Dict[str, Any]:
        """Validate ecommerce-specific structure"""
        return {'industry_specific_score': 0.8}

    def _validate_enterprise_structure(self, project_path: Path) -> Dict[str, Any]:
        """Validate enterprise-specific structure"""
        return {'industry_specific_score': 0.8}

    def _create_project_structure(self, project_path: Path, 
                                industry_context: Dict[str, Any], 
                                tech_stack: Dict[str, str]):
        """Create the basic project structure"""
        
        print("📁 Creating project structure...")
        
        # Create main directories
        directories = [
            'frontend',
            'backend', 
            'database',
            'docs',
            'tests',
            'config',
            'scripts',
            '.cursor',
            '.github/workflows'
        ]
        
        # Add industry-specific directories
        industry = industry_context['industry']
        if industry == 'healthcare':
            directories.extend([
                'patient-portal',
                'medical-records',
                'appointment-scheduling',
                'health-data',
                'audit-logs',
                'compliance-reports'
            ])
        elif industry == 'finance':
            directories.extend([
                'payment-processing',
                'account-management', 
                'fraud-detection',
                'financial-reporting',
                'transaction-history',
                'compliance-audit'
            ])
        elif industry == 'ecommerce':
            directories.extend([
                'product-catalog',
                'shopping-cart',
                'order-management',
                'payment-gateway',
                'customer-portal',
                'inventory-system'
            ])
        elif industry == 'enterprise':
            directories.extend([
                'admin-dashboard',
                'user-management',
                'organization-setup',
                'api-management',
                'reporting-system',
                'audit-trail'
            ])
        
        # Create all directories
        for directory in directories:
            (project_path / directory).mkdir(parents=True, exist_ok=True)
        
        # Create basic files
        self._create_basic_files(project_path, industry_context, tech_stack)

    def _create_basic_files(self, project_path: Path, 
                          industry_context: Dict[str, Any], 
                          tech_stack: Dict[str, str]):
        """Create basic project files"""
        
        # README.md
        readme_content = f"""# {project_path.name}

## Project Overview
This is a {industry_context['industry']} industry project built with modern technology stack.

## Technology Stack
- Frontend: {tech_stack.get('frontend', 'Not specified')}
- Backend: {tech_stack.get('backend', 'Not specified')}
- Database: {tech_stack.get('database', 'Not specified')}

## Industry Compliance
{', '.join(industry_context.get('compliance_requirements', ['None']))}

## Getting Started
1. Install dependencies
2. Configure environment variables
3. Run the application

## Development
See docs/ for detailed documentation.
"""
        
        with open(project_path / 'README.md', 'w') as f:
            f.write(readme_content)
        
        # .gitignore
        gitignore_content = """# Dependencies
node_modules/
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
env/
venv/
.venv/

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
logs/

# Environment
.env
.env.local
.env.production

# Build
dist/
build/
*.egg-info/

# Database
*.db
*.sqlite3

# Security
*.pem
*.key
*.crt
"""
        
        with open(project_path / '.gitignore', 'w') as f:
            f.write(gitignore_content)

    def _generate_industry_files(self, project_path: Path, 
                               industry_context: Dict[str, Any], 
                               tech_stack: Dict[str, str]):
        """Generate industry-specific files"""
        
        print("🏭 Generating industry-specific files...")
        
        industry = industry_context['industry']
        
        # Generate based on tech stack
        if tech_stack.get('frontend') == 'React':
            self._generate_react_files(project_path, industry)
        elif tech_stack.get('frontend') == 'Vue.js':
            self._generate_vue_files(project_path, industry)
        elif tech_stack.get('frontend') == 'Angular':
            self._generate_angular_files(project_path, industry)
        
        if tech_stack.get('backend') == 'Node.js':
            self._generate_nodejs_files(project_path, industry)
        elif tech_stack.get('backend') == 'Python/FastAPI':
            self._generate_python_files(project_path, industry)
        
        # Generate database files
        if tech_stack.get('database') == 'PostgreSQL':
            self._generate_postgresql_files(project_path, industry)
        elif tech_stack.get('database') == 'MongoDB':
            self._generate_mongodb_files(project_path, industry)

    def _generate_react_files(self, project_path: Path, industry: str):
        """Generate React-specific files"""
        
        # package.json
        package_json = {
            "name": project_path.name,
            "version": "1.0.0",
            "description": f"{industry.title()} industry React application",
            "main": "index.js",
            "scripts": {
                "start": "react-scripts start",
                "build": "react-scripts build",
                "test": "react-scripts test",
                "eject": "react-scripts eject"
            },
            "dependencies": {
                "react": "^18.2.0",
                "react-dom": "^18.2.0",
                "react-scripts": "5.0.1",
                "@mui/material": "^5.14.0",
                "@emotion/react": "^11.11.0",
                "@emotion/styled": "^11.11.0"
            },
            "browserslist": {
                "production": [
                    ">0.2%",
                    "not dead",
                    "not op_mini all"
                ],
                "development": [
                    "last 1 chrome version",
                    "last 1 firefox version",
                    "last 1 safari version"
                ]
            }
        }
        
        with open(project_path / 'frontend' / 'package.json', 'w') as f:
            json.dump(package_json, f, indent=2)
        
        # Basic React component
        app_jsx = f"""import React from 'react';
import {{ Box, Typography, Container }} from '@mui/material';

function App() {{
  return (
    <Container maxWidth="lg">
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {project_path.name} - {industry.title()} Application
        </Typography>
        <Typography variant="body1">
          Welcome to your {industry} industry application built with React.
        </Typography>
      </Box>
    </Container>
  );
}}

export default App;
"""
        
        (project_path / 'frontend' / 'src').mkdir(exist_ok=True)
        with open(project_path / 'frontend' / 'src' / 'App.js', 'w') as f:
            f.write(app_jsx)

    def _generate_nodejs_files(self, project_path: Path, industry: str):
        """Generate Node.js-specific files"""
        
        # package.json
        package_json = {
            "name": f"{project_path.name}-backend",
            "version": "1.0.0",
            "description": f"{industry.title()} industry Node.js backend",
            "main": "server.js",
            "scripts": {
                "start": "node server.js",
                "dev": "nodemon server.js",
                "test": "jest"
            },
            "dependencies": {
                "express": "^4.18.2",
                "cors": "^2.8.5",
                "helmet": "^7.0.0",
                "dotenv": "^16.3.1",
                "jsonwebtoken": "^9.0.2",
                "bcryptjs": "^2.4.3"
            },
            "devDependencies": {
                "nodemon": "^3.0.1",
                "jest": "^29.6.0"
            }
        }
        
        with open(project_path / 'backend' / 'package.json', 'w') as f:
            json.dump(package_json, f, indent=2)
        
        # Basic Express server
        server_js = f"""const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {{
  res.json({{
    message: '{project_path.name} - {industry.title()} Backend API',
    version: '1.0.0',
    industry: '{industry}'
  }});
}});

// Health check
app.get('/health', (req, res) => {{
  res.json({{ status: 'healthy', timestamp: new Date().toISOString() }});
}});

app.listen(PORT, () => {{
  console.log(`Server running on port ${{PORT}}`);
}});
"""
        
        with open(project_path / 'backend' / 'server.js', 'w') as f:
            f.write(server_js)

    def _generate_python_files(self, project_path: Path, industry: str):
        """Generate Python-specific files"""
        
        # requirements.txt
        requirements = """fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
python-dotenv==1.0.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
sqlalchemy==2.0.23
alembic==1.13.0
pytest==7.4.3
pytest-asyncio==0.21.1
"""
        
        with open(project_path / 'backend' / 'requirements.txt', 'w') as f:
            f.write(requirements)
        
        # Basic FastAPI app
        main_py = f'''from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="{project_path.name} - {industry.title()} API",
    description="Backend API for {industry} industry application",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {{
        "message": "{project_path.name} - {industry.title()} Backend API",
        "version": "1.0.0",
        "industry": "{industry}"
    }}

@app.get("/health")
async def health_check():
    return {{"status": "healthy"}}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
'''
        
        with open(project_path / 'backend' / 'main.py', 'w') as f:
            f.write(main_py)

    def _generate_postgresql_files(self, project_path: Path, industry: str):
        """Generate PostgreSQL-specific files"""
        
        # Database schema
        schema_sql = f"""-- {industry.title()} Industry Database Schema
-- Generated by Enhanced Client Project Scaffold

-- Create database
CREATE DATABASE {project_path.name.replace('-', '_')};

-- Use database
\\c {project_path.name.replace('-', '_')};

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create audit log table
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100),
    details JSONB,
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
"""
        
        with open(project_path / 'database' / 'schema.sql', 'w') as f:
            f.write(schema_sql)

    def _generate_mongodb_files(self, project_path: Path, industry: str):
        """Generate MongoDB-specific files"""
        
        # Database initialization script
        init_js = f"""// {industry.title()} Industry MongoDB Initialization
// Generated by Enhanced Client Project Scaffold

use {project_path.name.replace('-', '_')};

// Create users collection
db.createCollection("users", {{
  validator: {{
    $jsonSchema: {{
      bsonType: "object",
      required: ["email", "passwordHash"],
      properties: {{
        email: {{
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{{2,}}$"
        }},
        passwordHash: {{
          bsonType: "string"
        }},
        firstName: {{
          bsonType: "string"
        }},
        lastName: {{
          bsonType: "string"
        }},
        role: {{
          bsonType: "string",
          enum: ["admin", "user", "moderator"]
        }},
        createdAt: {{
          bsonType: "date"
        }},
        updatedAt: {{
          bsonType: "date"
        }}
      }}
    }}
  }}
}});

// Create audit logs collection
db.createCollection("auditLogs", {{
  validator: {{
    $jsonSchema: {{
      bsonType: "object",
      required: ["action", "createdAt"],
      properties: {{
        userId: {{
          bsonType: "objectId"
        }},
        action: {{
          bsonType: "string"
        }},
        resource: {{
          bsonType: "string"
        }},
        details: {{
          bsonType: "object"
        }},
        ipAddress: {{
          bsonType: "string"
        }},
        createdAt: {{
          bsonType: "date"
        }}
      }}
    }}
  }}
}});

// Create indexes
db.users.createIndex({{ "email": 1 }}, {{ unique: true }});
db.auditLogs.createIndex({{ "userId": 1 }});
db.auditLogs.createIndex({{ "createdAt": 1 }});
"""
        
        with open(project_path / 'database' / 'init.js', 'w') as f:
            f.write(init_js)

    def _setup_compliance_security(self, project_path: Path, industry_context: Dict[str, Any]):
        """Set up compliance and security configurations"""
        
        print("🛡️ Setting up compliance and security...")
        
        # Create security directory
        security_dir = project_path / 'config' / 'security'
        security_dir.mkdir(parents=True, exist_ok=True)
        
        # Generate compliance configurations
        compliance_requirements = industry_context.get('compliance_requirements', [])
        
        for compliance in compliance_requirements:
            if compliance == 'HIPAA':
                self._create_hipaa_config(security_dir)
            elif compliance == 'SOX':
                self._create_sox_config(security_dir)
            elif compliance == 'PCI DSS':
                self._create_pci_config(security_dir)
            elif compliance == 'GDPR':
                self._create_gdpr_config(security_dir)
        
        # Create general security configuration
        self._create_security_config(security_dir, industry_context)

    def _create_hipaa_config(self, security_dir: Path):
        """Create HIPAA compliance configuration"""
        
        hipaa_config = {
            'encryption': {
                'algorithm': 'AES-256',
                'key_rotation_days': 90,
                'phi_fields': ['patient_id', 'medical_record', 'diagnosis', 'treatment']
            },
            'access_control': {
                'mfa_required': True,
                'session_timeout_minutes': 15,
                'role_based_access': True,
                'minimum_password_length': 12
            },
            'audit_logging': {
                'log_all_access': True,
                'log_data_modifications': True,
                'retention_years': 7,
                'immutable_logs': True
            },
            'data_protection': {
                'mask_sensitive_data': True,
                'anonymize_exports': True,
                'secure_deletion': True,
                'backup_encryption': True
            }
        }
        
        with open(security_dir / 'hipaa-compliance.yaml', 'w') as f:
            yaml.dump(hipaa_config, f, default_flow_style=False)

    def _create_sox_config(self, security_dir: Path):
        """Create SOX compliance configuration"""
        
        sox_config = {
            'audit_trail': {
                'immutable_logs': True,
                'timestamp_accuracy': True,
                'user_tracking': True,
                'change_documentation': True
            },
            'data_integrity': {
                'validation_rules': True,
                'change_tracking': True,
                'backup_verification': True,
                'checksum_validation': True
            },
            'access_control': {
                'separation_of_duties': True,
                'dual_authorization': True,
                'access_logging': True,
                'regular_access_reviews': True
            },
            'reporting': {
                'automated_reports': True,
                'manual_verification': True,
                'executive_signoff': True,
                'quarterly_reviews': True
            }
        }
        
        with open(security_dir / 'sox-compliance.yaml', 'w') as f:
            yaml.dump(sox_config, f, default_flow_style=False)

    def _create_pci_config(self, security_dir: Path):
        """Create PCI DSS compliance configuration"""
        
        pci_config = {
            'payment_security': {
                'tokenization': True,
                'encryption_in_transit': True,
                'secure_storage': True,
                'no_card_data_storage': True
            },
            'access_control': {
                'unique_ids': True,
                'password_complexity': True,
                'two_factor_auth': True,
                'regular_password_changes': True
            },
            'monitoring': {
                'log_payment_access': True,
                'intrusion_detection': True,
                'regular_scanning': True,
                'real_time_monitoring': True
            },
            'compliance': {
                'annual_assessment': True,
                'quarterly_scanning': True,
                'incident_response': True,
                'vulnerability_management': True
            }
        }
        
        with open(security_dir / 'pci-dss-compliance.yaml', 'w') as f:
            yaml.dump(pci_config, f, default_flow_style=False)

    def _create_gdpr_config(self, security_dir: Path):
        """Create GDPR compliance configuration"""
        
        gdpr_config = {
            'data_subject_rights': {
                'access_right': True,
                'rectification_right': True,
                'erasure_right': True,
                'portability_right': True,
                'objection_right': True
            },
            'consent_management': {
                'explicit_consent': True,
                'consent_withdrawal': True,
                'consent_audit': True,
                'granular_consent': True
            },
            'data_protection': {
                'lawful_processing': True,
                'purpose_limitation': True,
                'data_minimization': True,
                'accuracy': True,
                'storage_limitation': True
            },
            'privacy_by_design': {
                'data_protection_impact': True,
                'privacy_controls': True,
                'automated_decisions': False,
                'data_protection_officer': True
            }
        }
        
        with open(security_dir / 'gdpr-compliance.yaml', 'w') as f:
            yaml.dump(gdpr_config, f, default_flow_style=False)

    def _create_security_config(self, security_dir: Path, industry_context: Dict[str, Any]):
        """Create general security configuration"""
        
        security_config = {
            'authentication': {
                'jwt_secret_rotation_days': 30,
                'session_timeout_minutes': 30,
                'max_login_attempts': 5,
                'lockout_duration_minutes': 15
            },
            'encryption': {
                'default_algorithm': 'AES-256-GCM',
                'key_rotation_days': 90,
                'encrypt_at_rest': True,
                'encrypt_in_transit': True
            },
            'monitoring': {
                'log_security_events': True,
                'real_time_alerts': True,
                'intrusion_detection': True,
                'vulnerability_scanning': True
            },
            'compliance': {
                'industry': industry_context['industry'],
                'requirements': industry_context.get('compliance_requirements', []),
                'audit_frequency': 'quarterly',
                'documentation_required': True
            }
        }
        
        with open(security_dir / 'security-config.yaml', 'w') as f:
            yaml.dump(security_config, f, default_flow_style=False)

    def _initialize_version_control(self, project_path: Path, industry_context: Dict[str, Any]):
        """Initialize version control with industry-specific settings"""
        
        print("📝 Initializing version control...")
        
        try:
            # Initialize git repository
            subprocess.run(['git', 'init'], cwd=project_path, check=True)
            
            # Create .gitattributes for line ending consistency
            gitattributes = """# Set default behavior to automatically normalize line endings
* text=auto

# Force certain files to be treated as text
*.js text
*.jsx text
*.ts text
*.tsx text
*.json text
*.md text
*.yml text
*.yaml text
*.sql text
*.py text

# Force certain files to be treated as binary
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.pdf binary
"""
            
            with open(project_path / '.gitattributes', 'w') as f:
                f.write(gitattributes)
            
            # Initial commit
            subprocess.run(['git', 'add', '.'], cwd=project_path, check=True)
            subprocess.run([
                'git', 'commit', '-m', 
                f'Initial commit: {project_path.name} - {industry_context["industry"]} industry project'
            ], cwd=project_path, check=True)
            
            print("✅ Version control initialized successfully")
            
        except subprocess.CalledProcessError as e:
            print(f"⚠️ Warning: Could not initialize git repository: {e}")
        except FileNotFoundError:
            print("⚠️ Warning: Git not found. Please initialize version control manually.")

    def _setup_dependency_management(self, project_path: Path, 
                                   industry_context: Dict[str, Any], 
                                   tech_stack: Dict[str, str]):
        """Set up automated dependency management and version control"""
        
        print("📦 Setting up dependency management...")
        
        # Set up package managers based on tech stack
        if tech_stack.get('frontend') == 'React':
            self._setup_npm_dependencies(project_path, industry_context, tech_stack)
        elif tech_stack.get('frontend') == 'Vue.js':
            self._setup_vue_dependencies(project_path, industry_context, tech_stack)
        elif tech_stack.get('frontend') == 'Angular':
            self._setup_angular_dependencies(project_path, industry_context, tech_stack)
        
        if tech_stack.get('backend') == 'Node.js':
            self._setup_nodejs_dependencies(project_path, industry_context, tech_stack)
        elif tech_stack.get('backend') == 'Python/FastAPI':
            self._setup_python_dependencies(project_path, industry_context, tech_stack)
        
        # Set up database dependencies
        if tech_stack.get('database') == 'PostgreSQL':
            self._setup_postgresql_dependencies(project_path, industry_context, tech_stack)
        elif tech_stack.get('database') == 'MongoDB':
            self._setup_mongodb_dependencies(project_path, industry_context, tech_stack)
        
        # Create dependency management scripts
        self._create_dependency_scripts(project_path, industry_context, tech_stack)
        
        # Set up automated dependency updates
        self._setup_automated_updates(project_path, industry_context, tech_stack)

    def _setup_npm_dependencies(self, project_path: Path, 
                              industry_context: Dict[str, Any], 
                              tech_stack: Dict[str, str]):
        """Set up npm dependencies for React projects"""
        
        frontend_dir = project_path / 'frontend'
        if not frontend_dir.exists():
            return
        
        # Create package.json if it doesn't exist
        package_json_path = frontend_dir / 'package.json'
        if not package_json_path.exists():
            self._create_npm_package_json(frontend_dir, industry_context, tech_stack)
        
        # Create .npmrc for configuration
        npmrc_content = f"""# NPM Configuration for {project_path.name}
registry=https://registry.npmjs.org/
save-exact=true
audit-level=moderate
fund=false
"""
        
        with open(frontend_dir / '.npmrc', 'w') as f:
            f.write(npmrc_content)
        
        # Create npm scripts
        scripts_dir = project_path / 'scripts'
        scripts_dir.mkdir(exist_ok=True)
        
        install_script = f"""#!/bin/bash
# Install dependencies for {project_path.name}

echo "📦 Installing frontend dependencies..."
cd frontend
npm install

echo "📦 Installing backend dependencies..."
cd ../backend
npm install

echo "✅ All dependencies installed successfully!"
"""
        
        with open(scripts_dir / 'install-dependencies.sh', 'w') as f:
            f.write(install_script)
        
        # Make script executable
        os.chmod(scripts_dir / 'install-dependencies.sh', 0o755)

    def _setup_python_dependencies(self, project_path: Path, 
                                 industry_context: Dict[str, Any], 
                                 tech_stack: Dict[str, str]):
        """Set up Python dependencies for FastAPI projects"""
        
        backend_dir = project_path / 'backend'
        if not backend_dir.exists():
            return
        
        # Create requirements.txt if it doesn't exist
        requirements_path = backend_dir / 'requirements.txt'
        if not requirements_path.exists():
            self._create_python_requirements(backend_dir, industry_context, tech_stack)
        
        # Create requirements-dev.txt for development dependencies
        dev_requirements = f"""# Development dependencies for {project_path.name}
pytest==7.4.3
pytest-asyncio==0.21.1
pytest-cov==4.1.0
black==23.7.0
flake8==6.0.0
mypy==1.5.1
pre-commit==3.3.3
"""
        
        with open(backend_dir / 'requirements-dev.txt', 'w') as f:
            f.write(dev_requirements)
        
        # Create pyproject.toml for modern Python packaging
        pyproject_content = f"""[build-system]
requires = ["setuptools>=61.0", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "{project_path.name}-backend"
version = "1.0.0"
description = "{industry_context['industry'].title()} industry FastAPI backend"
authors = [{{name = "AI Governor Framework", email = "admin@example.com"}}]
readme = "README.md"
requires-python = ">=3.8"
dependencies = [
    "fastapi>=0.104.1",
    "uvicorn>=0.24.0",
    "pydantic>=2.5.0",
    "python-dotenv>=1.0.0",
    "python-jose[cryptography]>=3.3.0",
    "passlib[bcrypt]>=1.7.4",
    "python-multipart>=0.0.6",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.4.3",
    "pytest-asyncio>=0.21.1",
    "pytest-cov>=4.1.0",
    "black>=23.7.0",
    "flake8>=6.0.0",
    "mypy>=1.5.1",
    "pre-commit>=3.3.3",
]

[tool.black]
line-length = 88
target-version = ['py38']

[tool.mypy]
python_version = "3.8"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
"""
        
        with open(backend_dir / 'pyproject.toml', 'w') as f:
            f.write(pyproject_content)

    def _setup_nodejs_dependencies(self, project_path: Path, 
                                 industry_context: Dict[str, Any], 
                                 tech_stack: Dict[str, str]):
        """Set up Node.js dependencies"""
        
        backend_dir = project_path / 'backend'
        if not backend_dir.exists():
            return
        
        # Create package.json if it doesn't exist
        package_json_path = backend_dir / 'package.json'
        if not package_json_path.exists():
            self._create_nodejs_package_json(backend_dir, industry_context, tech_stack)
        
        # Create .nvmrc for Node.js version management
        nvmrc_content = "18.17.0\n"
        with open(backend_dir / '.nvmrc', 'w') as f:
            f.write(nvmrc_content)

    def _setup_postgresql_dependencies(self, project_path: Path, 
                                     industry_context: Dict[str, Any], 
                                     tech_stack: Dict[str, str]):
        """Set up PostgreSQL dependencies and configuration"""
        
        # Create Docker Compose for PostgreSQL
        docker_compose_content = f"""version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: {project_path.name}-postgres
    environment:
      POSTGRES_DB: {project_path.name.replace('-', '_')}
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
"""
        
        with open(project_path / 'docker-compose.yml', 'w') as f:
            f.write(docker_compose_content)

    def _setup_mongodb_dependencies(self, project_path: Path, 
                                  industry_context: Dict[str, Any], 
                                  tech_stack: Dict[str, str]):
        """Set up MongoDB dependencies and configuration"""
        
        # Create Docker Compose for MongoDB
        docker_compose_content = f"""version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    container_name: {project_path.name}-mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin
      MONGO_INITDB_DATABASE: {project_path.name.replace('-', '_')}
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - ./database/init.js:/docker-entrypoint-initdb.d/init.js:ro
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  mongodb_data:
"""
        
        with open(project_path / 'docker-compose.yml', 'w') as f:
            f.write(docker_compose_content)

    def _create_dependency_scripts(self, project_path: Path, 
                                 industry_context: Dict[str, Any], 
                                 tech_stack: Dict[str, str]):
        """Create dependency management scripts"""
        
        scripts_dir = project_path / 'scripts'
        scripts_dir.mkdir(exist_ok=True)
        
        # Create update dependencies script
        update_script = f"""#!/bin/bash
# Update dependencies for {project_path.name}

echo "🔄 Updating dependencies..."

# Update frontend dependencies
if [ -d "frontend" ]; then
    echo "📦 Updating frontend dependencies..."
    cd frontend
    npm update
    npm audit fix
    cd ..
fi

# Update backend dependencies
if [ -d "backend" ]; then
    echo "📦 Updating backend dependencies..."
    cd backend
    if [ -f "package.json" ]; then
        npm update
        npm audit fix
    elif [ -f "requirements.txt" ]; then
        pip install --upgrade -r requirements.txt
    fi
    cd ..
fi

echo "✅ Dependencies updated successfully!"
"""
        
        with open(scripts_dir / 'update-dependencies.sh', 'w') as f:
            f.write(update_script)
        
        # Make script executable
        os.chmod(scripts_dir / 'update-dependencies.sh', 0o755)
        
        # Create dependency check script
        check_script = f"""#!/bin/bash
# Check dependencies for {project_path.name}

echo "🔍 Checking dependencies..."

# Check frontend dependencies
if [ -d "frontend" ]; then
    echo "📦 Checking frontend dependencies..."
    cd frontend
    npm audit
    cd ..
fi

# Check backend dependencies
if [ -d "backend" ]; then
    echo "📦 Checking backend dependencies..."
    cd backend
    if [ -f "package.json" ]; then
        npm audit
    elif [ -f "requirements.txt" ]; then
        pip check
    fi
    cd ..
fi

echo "✅ Dependency check completed!"
"""
        
        with open(scripts_dir / 'check-dependencies.sh', 'w') as f:
            f.write(check_script)
        
        # Make script executable
        os.chmod(scripts_dir / 'check-dependencies.sh', 0o755)

    def _setup_automated_updates(self, project_path: Path, 
                               industry_context: Dict[str, Any], 
                               tech_stack: Dict[str, str]):
        """Set up automated dependency updates"""
        
        # Create GitHub Actions workflow for dependency updates
        workflows_dir = project_path / '.github' / 'workflows'
        workflows_dir.mkdir(parents=True, exist_ok=True)
        
        update_workflow = f"""name: Update Dependencies

on:
  schedule:
    - cron: '0 2 * * 1'  # Run every Monday at 2 AM
  workflow_dispatch:  # Allow manual triggering

jobs:
  update-dependencies:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Set up Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.8'
        
    - name: Update frontend dependencies
      if: hashFiles('frontend/package.json') != ''
      run: |
        cd frontend
        npm update
        npm audit fix
        
    - name: Update backend dependencies
      if: hashFiles('backend/package.json') != ''
      run: |
        cd backend
        npm update
        npm audit fix
        
    - name: Update Python dependencies
      if: hashFiles('backend/requirements.txt') != ''
      run: |
        cd backend
        pip install --upgrade -r requirements.txt
        
    - name: Create Pull Request
      uses: peter-evans/create-pull-request@v5
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
        commit-message: 'chore: update dependencies'
        title: 'Automated dependency updates'
        body: |
          This PR contains automated dependency updates.
          
          ## Changes
          - Updated frontend dependencies
          - Updated backend dependencies
          - Fixed security vulnerabilities
          
          ## Industry Compliance
          - {industry_context['industry'].title()} industry requirements maintained
          - Security standards preserved
        branch: dependency-updates
        delete-branch: true
"""
        
        with open(workflows_dir / 'update-dependencies.yml', 'w') as f:
            f.write(update_workflow)

    def _create_npm_package_json(self, frontend_dir: Path, 
                               industry_context: Dict[str, Any], 
                               tech_stack: Dict[str, str]):
        """Create npm package.json with industry-specific dependencies"""
        
        package_data = {
            'project_name': frontend_dir.parent.name,
            'industry': industry_context['industry'],
            'compliance_requirements': industry_context.get('compliance_requirements', [])
        }
        
        package_template = """{
  "name": "{{ project_name }}-frontend",
  "version": "1.0.0",
  "description": "{{ industry.title() }} industry React frontend application",
  "main": "index.js",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "audit": "npm audit",
    "audit:fix": "npm audit fix"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "@mui/material": "^5.14.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0"{% if industry == 'healthcare' %},
    "react-hook-form": "^7.45.0",
    "yup": "^1.3.0",
    "date-fns": "^2.30.0"{% elif industry == 'finance' %},
    "recharts": "^2.8.0",
    "react-query": "^3.39.0",
    "numeral": "^2.0.6"{% endif %}
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "eslint": "^8.45.0",
    "eslint-plugin-react": "^7.33.0",
    "eslint-plugin-react-hooks": "^4.6.0"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}"""
        
        package_template_obj = Template(package_template)
        package_content = package_template_obj.render(**package_data)
        
        with open(frontend_dir / 'package.json', 'w') as f:
            f.write(package_content)

    def _create_nodejs_package_json(self, backend_dir: Path, 
                                  industry_context: Dict[str, Any], 
                                  tech_stack: Dict[str, str]):
        """Create Node.js package.json with industry-specific dependencies"""
        
        package_data = {
            'project_name': backend_dir.parent.name,
            'industry': industry_context['industry'],
            'compliance_requirements': industry_context.get('compliance_requirements', [])
        }
        
        package_template = """{
  "name": "{{ project_name }}-backend",
  "version": "1.0.0",
  "description": "{{ industry.title() }} industry Node.js backend",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "audit": "npm audit",
    "audit:fix": "npm audit fix"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "dotenv": "^16.3.1",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "express-rate-limit": "^6.10.0"{% if industry == 'healthcare' %},
    "winston": "^3.10.0",
    "joi": "^17.9.0",
    "pg": "^8.11.0"{% elif industry == 'finance' %},
    "stripe": "^13.0.0",
    "crypto": "^1.0.1",
    "pg": "^8.11.0"{% endif %}
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.0",
    "eslint": "^8.45.0",
    "eslint-config-standard": "^17.1.0",
    "eslint-plugin-import": "^2.28.0",
    "eslint-plugin-n": "^16.0.0",
    "eslint-plugin-promise": "^6.1.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}"""
        
        package_template_obj = Template(package_template)
        package_content = package_template_obj.render(**package_data)
        
        with open(backend_dir / 'package.json', 'w') as f:
            f.write(package_content)

    def _create_python_requirements(self, backend_dir: Path, 
                                  industry_context: Dict[str, Any], 
                                  tech_stack: Dict[str, str]):
        """Create Python requirements.txt with industry-specific dependencies"""
        
        requirements_template = """fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
python-dotenv==1.0.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6{% if industry == 'healthcare' %}
sqlalchemy==2.0.23
alembic==1.13.0
psycopg2-binary==2.9.7
winston==0.1.0{% elif industry == 'finance' %}
stripe==6.0.0
cryptography==41.0.0
psycopg2-binary==2.9.7{% endif %}
pytest==7.4.3
pytest-asyncio==0.21.1"""
        
        requirements_template_obj = Template(requirements_template)
        requirements_content = requirements_template_obj.render(
            industry=industry_context['industry']
        )
        
        with open(backend_dir / 'requirements.txt', 'w') as f:
            f.write(requirements_content)

    def _generate_documentation(self, project_path: Path, 
                              industry_context: Dict[str, Any], 
                              tech_stack: Dict[str, str]):
        """Generate comprehensive documentation"""
        
        print("📚 Generating documentation...")
        
        docs_dir = project_path / 'docs'
        docs_dir.mkdir(exist_ok=True)
        
        # API Documentation
        api_docs = f"""# API Documentation

## Overview
This document describes the API for {project_path.name}, a {industry_context['industry']} industry application.

## Technology Stack
- Frontend: {tech_stack.get('frontend', 'Not specified')}
- Backend: {tech_stack.get('backend', 'Not specified')}
- Database: {tech_stack.get('database', 'Not specified')}

## Authentication
The API uses JWT-based authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-token>
```

## Endpoints

### Health Check
- **GET** `/health`
- Returns the health status of the API

### Root
- **GET** `/`
- Returns basic API information

## Error Handling
All errors follow a consistent format:
```json
{{
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00Z"
}}
```

## Rate Limiting
API requests are rate limited to prevent abuse. Current limits:
- 100 requests per minute per IP
- 1000 requests per hour per authenticated user

## Compliance
This API is designed to meet {industry_context['industry']} industry compliance requirements:
{', '.join(industry_context.get('compliance_requirements', ['None']))}
"""
        
        with open(docs_dir / 'api.md', 'w') as f:
            f.write(api_docs)
        
        # Development Guide
        dev_guide = f"""# Development Guide

## Getting Started

### Prerequisites
- Node.js 18+ (if using React/Node.js)
- Python 3.8+ (if using Python/FastAPI)
- PostgreSQL 13+ (if using PostgreSQL)
- MongoDB 5+ (if using MongoDB)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Frontend (if using React)
   cd frontend
   npm install
   
   # Backend (if using Node.js)
   cd backend
   npm install
   
   # Backend (if using Python)
   cd backend
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Set up the database:
   ```bash
   # PostgreSQL
   psql -f database/schema.sql
   
   # MongoDB
   mongo database/init.js
   ```

### Running the Application

#### Development Mode
```bash
# Frontend
cd frontend
npm start

# Backend (Node.js)
cd backend
npm run dev

# Backend (Python)
cd backend
python main.py
```

#### Production Mode
```bash
# Frontend
cd frontend
npm run build

# Backend
# Use your preferred process manager (PM2, systemd, etc.)
```

## Project Structure
```
{project_path.name}/
├── frontend/          # Frontend application
├── backend/           # Backend API
├── database/          # Database schemas and migrations
├── docs/              # Documentation
├── tests/             # Test files
├── config/            # Configuration files
└── scripts/           # Utility scripts
```

## Industry-Specific Features
This project includes {industry_context['industry']} industry-specific features:
{', '.join(industry_context.get('compliance_requirements', ['None']))}

## Security Considerations
- All sensitive data is encrypted
- API endpoints are protected with authentication
- Audit logging is enabled for compliance
- Regular security scans are recommended

## Testing
```bash
# Run all tests
npm test

# Run specific test suites
npm test -- --grep "API"
npm test -- --grep "Frontend"
```

## Deployment
See `docs/deployment.md` for deployment instructions.
"""
        
        with open(docs_dir / 'development.md', 'w') as f:
            f.write(dev_guide)

    def _create_project_context(self, project_path: Path, 
                              industry_context: Dict[str, Any], 
                              tech_stack: Dict[str, str]) -> Dict[str, Any]:
        """Create project context for further processing"""
        
        return {
            'project_name': project_path.name,
            'project_path': str(project_path.absolute()),
            'industry': industry_context['industry'],
            'confidence': industry_context['confidence'],
            'tech_stack': tech_stack,
            'compliance_requirements': industry_context.get('compliance_requirements', []),
            'security_patterns': industry_context.get('security_patterns', []),
            'created_at': datetime.now().isoformat(),
            'version': '1.0.0'
        }


def main():
    """Main function for command-line usage"""
    parser = argparse.ArgumentParser(description="Enhanced Client Project Scaffolding Tool")
    parser.add_argument("--name", required=True, help="Project name")
    parser.add_argument("--industry", help="Industry type (healthcare, finance, ecommerce, enterprise)")
    parser.add_argument("--requirements", help="User requirements description")
    parser.add_argument("--frontend", help="Frontend technology (React, Vue.js, Angular)")
    parser.add_argument("--backend", help="Backend technology (Node.js, Python/FastAPI)")
    parser.add_argument("--database", help="Database technology (PostgreSQL, MongoDB)")
    
    args = parser.parse_args()
    
    # Build tech stack from arguments
    tech_stack = {}
    if args.frontend:
        tech_stack['frontend'] = args.frontend
    if args.backend:
        tech_stack['backend'] = args.backend
    if args.database:
        tech_stack['database'] = args.database
    
    # Create scaffold instance
    scaffold = EnhancedClientProjectScaffold()
    
    # Create project
    try:
        project_context = scaffold.create_project(
            project_name=args.name,
            industry=args.industry,
            user_requirements=args.requirements,
            tech_stack=tech_stack if tech_stack else None
        )
        
        print(f"\n🎉 Project created successfully!")
        print(f"📁 Location: {project_context['project_path']}")
        print(f"🏭 Industry: {project_context['industry']}")
        print(f"🛠️  Tech Stack: {project_context['tech_stack']}")
        
    except Exception as e:
        print(f"❌ Error creating project: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
