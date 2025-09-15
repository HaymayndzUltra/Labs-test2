Commit: c0cc79bd8ba179b81bd8c46cb4a1c805dd42bcd3
\nTimestamp: 2025-09-15T05:43:31Z\n
== Gates write site (project_generator/core/generator.py)==\n
   360	        test_workflow = self._generate_test_workflow()
   361	        (workflows_dir / 'ci-test.yml').write_text(test_workflow)
   362	        
   363	        # Security scan workflow
   364	        security_workflow = self._generate_security_workflow()
   365	        (workflows_dir / 'ci-security.yml').write_text(security_workflow)
   366	        
   367	        # Deploy workflow
   368	        if self.args.deploy != 'self-hosted':
   369	            deploy_workflow = self._generate_deploy_workflow()
   370	            (workflows_dir / 'ci-deploy.yml').write_text(deploy_workflow)
   371	        
   372	        # Gates configuration
   373	        gates_config = self._generate_gates_config()
   374	        (self.project_root / 'gates_config.yaml').write_text(gates_config)
   375	    
   376	    def _generate_compliance_rules(self):
   377	        """Generate compliance and project-specific rules"""
   378	        if self.no_cursor_assets:
   379	            return
   380	        rules_dir = self.project_root / '.cursor' / 'rules'
   381	        
   382	        # Minimal-cursor: only include manifest-specified project rules and explicit compliance rules; skip client-specific.
   383	        if self.minimal_cursor:
   384	            self._include_rules_from_manifest(rules_dir)
   385	        else:
   386	            # Client-specific rules
   387	            client_rules = self._generate_client_rules()
   388	            (rules_dir / 'client-specific-rules.mdc').write_text(client_rules)
   389	        
   390	        # Industry compliance rules

== _generate_gates_config ==\n
  1836	    def _generate_gates_config(self) -> str:
  1837	        """Generate gates configuration"""
  1838	        config = {
  1839	            'quality_gates': {
  1840	                'lint': {
  1841	                    'required': True,
  1842	                    'threshold': 0
  1843	                },
  1844	                'test_coverage': {
  1845	                    'required': True,
  1846	                    'threshold': 80 if self.args.industry in ['healthcare', 'finance'] else 70
  1847	                },
  1848	                'security_scan': {
  1849	                    'required': True,
  1850	                    'critical_threshold': 0,
  1851	                    'high_threshold': 0 if self.args.industry in ['healthcare', 'finance'] else 5
  1852	                }
  1853	            },
  1854	            'compliance_gates': {}
  1855	        }
  1856	        
  1857	        # Add compliance-specific gates
  1858	        if self.args.compliance:
  1859	            for compliance in self.args.compliance.split(','):
  1860	                if compliance.strip() == 'hipaa':
  1861	                    config['compliance_gates']['hipaa'] = {
  1862	                        'encryption_check': True,
  1863	                        'audit_logging': True,
  1864	                        'access_control_review': True
  1865	                    }
  1866	                elif compliance.strip() == 'gdpr':
  1867	                    config['compliance_gates']['gdpr'] = {
  1868	                        'privacy_impact': True,
  1869	                        'consent_tracking': True,
  1870	                        'data_retention_check': True
  1871	                    }
  1872	                elif compliance.strip() == 'sox':
  1873	                    config['compliance_gates']['sox'] = {
  1874	                        'change_control': True,
  1875	                        'segregation_of_duties': True,
  1876	                        'audit_trail_validation': True
  1877	                    }
  1878	                elif compliance.strip() == 'pci':
  1879	                    config['compliance_gates']['pci'] = {
  1880	                        'cardholder_data_check': True,
  1881	                        'network_segmentation': True,
  1882	                        'encryption_validation': True
  1883	                    }
  1884	        # Convert to YAML format (deterministic)
  1885	        import yaml
  1886	        return yaml.dump(config, default_flow_style=False, sort_keys=True)
  1887	        
  1888	    def _generate_client_rules(self) -> str:
  1889	        """Generate client-specific rules (safe builder)"""
  1890	        uptime = '>99.99%' if self.args.industry in ['healthcare', 'finance'] else '>99.9%'
  1891	        if self.args.backend != 'none':
  1892	            rt_threshold = '200ms' if self.args.industry == 'finance' else '500ms'
  1893	            response_time = f"<{rt_threshold}"
  1894	        else:
  1895	            response_time = 'N/A'
  1896	        coverage = 80 if self.args.industry in ['healthcare', 'finance'] else 70
  1897	        ecommerce_extra = []
  1898	        if self.args.industry == 'ecommerce':
  1899	            ecommerce_extra = [
  1900	                '## E-commerce Enhancements',
  1901	                '- Mobile-first design approach',
  1902	                '- A/B testing infrastructure'
  1903	            ]
  1904	        lines: List[str] = []
  1905	        lines.append("---")
  1906	        lines.append("alwaysApply: true")
  1907	        # Extended triggers consistent with dev-workflow
  1908	        client_triggers = [
  1909	            'development', 'coding', 'implementation', 'update all', 'refresh all', 'sync all', 'reload all',
  1910	            'bootstrap', 'setup', 'initialize', 'project start', 'master plan', 'framework ecosystem',
  1911	            'background agents', 'prd', 'requirements', 'feature planning', 'product spec', 'task generation',
  1912	            'technical planning', 'implementation plan', 'execute', 'implement', 'process tasks',
  1913	            'retrospective', 'review', 'improvement', 'post-implementation', 'parallel execution',
  1914	            'coordination', 'multi-agent', 'analyze'
  1915	        ]
  1916	        lines.append(
  1917	            f"description: \"TAGS: [project,client,standards] | TRIGGERS: {','.join(client_triggers)} | SCOPE: {self.args.name} | DESCRIPTION: Client-specific rules and standards for {self.args.name}\""
  1918	        )
  1919	        lines.append("---")
  1920	        lines.append("")
  1921	        lines.append(f"# Client-Specific Rules: {self.args.name}")
  1922	        lines.append("")
  1923	        lines.append("## Project Context")
  1924	        lines.append(f"- **Industry**: {self.args.industry}")
  1925	        lines.append(f"- **Project Type**: {self.args.project_type}")
  1926	        lines.append(f"- **Technology Stack**: {self.args.frontend}/{self.args.backend}/{self.args.database}")
  1927	        lines.append(f"- **Compliance Requirements**: {self.args.compliance or 'None'}")
  1928	        lines.append("")
  1929	        lines.extend(ecommerce_extra)
  1930	        if ecommerce_extra:
  1931	            lines.append("")
  1932	        lines.append("## Communication Protocols")
  1933	        lines.append("- Daily standup: 9:00 AM")
  1934	        lines.append("- Sprint planning: Bi-weekly")
  1935	        lines.append("- Retrospectives: End of each sprint")
  1936	        lines.append("- Emergency contact: On-call rotation")
  1937	        lines.append("")
  1938	        lines.append("## Success Metrics")
  1939	        lines.append(f"- Uptime: {uptime}")
  1940	        lines.append(f"- Response time: {response_time}")
  1941	        lines.append("- Error rate: <0.1%")
  1942	        lines.append(f"- Test coverage: >{coverage}%")
  1943	        return "\n".join(lines)
  1944	
  1945	    def _generate_workflow_rules(self) -> str:
  1946	        """Generate process/workflow rules with extended triggers and Cursor frontmatter."""
  1947	        triggers = [
  1948	            'update all', 'refresh all', 'sync all', 'reload all', 'execute', 'implement', 'process tasks',
  1949	            'bootstrap', 'setup', 'initialize', 'project start', 'master plan', 'framework ecosystem',
  1950	            'background agents', 'prd', 'requirements', 'feature planning', 'product spec', 'task generation',
  1951	            'technical planning', 'implementation plan', 'development', 'retrospective', 'review', 'improvement',
  1952	            'post-implementation', 'parallel execution', 'coordination', 'multi-agent', 'analyze'
  1953	        ]
  1954	        frontmatter = [
  1955	            '---',
  1956	            'alwaysApply: false',
  1957	            f"description: \"TAGS: [workflow,process,project] | TRIGGERS: {','.join(triggers)} | SCOPE: {self.args.name} | DESCRIPTION: Project workflow and process rules for {self.args.name}\"",
  1958	            '---',
  1959	            ''
  1960	        ]
  1961	        body = [
  1962	            f"# Project Workflow Rules: {self.args.name}",
  1963	            "",
  1964	            "## Process Gates",
  1965	            "- Run pre-commit compliance checks",
  1966	            "- Enforce lint and test passes in CI",
  1967	            "- Block release if gates_config thresholds fail",
  1968	            "",
  1969	            "## Execution Protocols",
  1970	            "- Use 'update all' to normalize rule formatting",
  1971	            "- Use 'execute' to process tasks per implementation plan",
  1972	            "- Use 'refresh all' to resync generated assets",
  1973	        ]
  1974	        return "\n".join(frontmatter + body)
  1975	
  1976	    # Public API methods for test compatibility
  1977	    def set_config(self, config: Dict[str, Any]):
  1978	        """Set and validate project configuration"""
  1979	        is_valid, errors = self.validator.validate_config(config)
  1980	        if not is_valid:
  1981	            raise ValueError(f"Invalid configuration: {errors}")
  1982	        self.config = config.copy()
  1983	        self.project_name = config.get('name')
  1984	    
  1985	    def get_template_path(self, component: str, technology: str) -> Path:
  1986	        """Get template path for component and technology"""
  1987	        if hasattr(self, 'template_dir'):
  1988	            # Legacy test interface
  1989	            template_path = self.template_dir / component / technology / 'base'
  1990	        else:
  1991	            # Production interface
  1992	            template_path = Path(__file__).parent.parent.parent / 'template-packs' / component / technology / 'base'
  1993	        
  1994	        if not template_path.exists():
  1995	            raise FileNotFoundError(f"Template not found: {template_path}")
  1996	        return template_path
  1997	    
  1998	    def copy_template(self, source_dir: Path, target_dir: Path):
  1999	        """Copy template directory with ignore patterns"""
  2000	        import shutil
  2001	        
  2002	        def ignore_patterns(dir, files):
  2003	            return [f for f in files if f in {'__pycache__', '.pytest_cache', '.DS_Store', '.git', 'node_modules'}]
  2004	        
  2005	        target_dir.parent.mkdir(parents=True, exist_ok=True)
  2006	        if target_dir.exists():
  2007	            shutil.rmtree(target_dir)
  2008	        shutil.copytree(source_dir, target_dir, ignore=ignore_patterns)
  2009	    
  2010	    def process_template_file(self, content: str) -> str:
  2011	        """Process template file content with variable substitution"""
  2012	        variables = self.get_template_variables()
  2013	        for var, value in variables.items():
  2014	            content = content.replace(f'{{{{{var}}}}}', str(value))
  2015	        return content
  2016	    
  2017	    def get_template_variables(self) -> Dict[str, str]:
  2018	        """Get template variables for substitution"""
  2019	        config = self.config if isinstance(self.config, dict) else {}
  2020	        
  2021	        def list_to_string(value):
  2022	            if isinstance(value, list):
  2023	                return ','.join(str(v) for v in value)
  2024	            return str(value) if value else ''
  2025	        
  2026	        return {
  2027	            'PROJECT_NAME': config.get('name', getattr(self.args, 'name', 'test-project')),
  2028	            'INDUSTRY': config.get('industry', getattr(self.args, 'industry', 'healthcare')),
  2029	            'PROJECT_TYPE': config.get('project_type', getattr(self.args, 'project_type', 'fullstack')),
  2030	            'FRONTEND': config.get('frontend', getattr(self.args, 'frontend', 'nextjs')),
  2031	            'BACKEND': config.get('backend', getattr(self.args, 'backend', 'fastapi')),
  2032	            'DATABASE': config.get('database', getattr(self.args, 'database', 'postgres')),
  2033	            'AUTH': config.get('auth', getattr(self.args, 'auth', 'auth0')),
  2034	            'DEPLOY': config.get('deploy', getattr(self.args, 'deploy', 'aws')),
  2035	            'COMPLIANCE': list_to_string(config.get('compliance', getattr(self.args, 'compliance', ''))),
  2036	            'FEATURES': list_to_string(config.get('features', getattr(self.args, 'features', '')))
  2037	        }
  2038	    
  2039	    def create_project_structure(self, project_dir: Path):
  2040	        """Create project structure and copy templates"""
  2041	        project_dir.mkdir(parents=True, exist_ok=True)
  2042	        
  2043	        # Create .gitignore
  2044	        gitignore_content = self._generate_gitignore()
  2045	        (project_dir / '.gitignore').write_text(gitignore_content)
  2046	        
  2047	        config = self.config if isinstance(self.config, dict) else {}
  2048	        frontend = config.get('frontend', getattr(self.args, 'frontend', 'none'))
  2049	        backend = config.get('backend', getattr(self.args, 'backend', 'none'))
  2050	        database = config.get('database', getattr(self.args, 'database', 'none'))
  2051	        
  2052	        # Copy templates conditionally
  2053	        if frontend and frontend != 'none':
  2054	            try:
  2055	                source = self.get_template_path('frontend', frontend)
  2056	                target = project_dir / 'frontend'

== _generate_industry_gates ==\n
   955	    def _generate_industry_gates(self):
   956	        """Generate only the industry-specific gates overlay matching selected industry"""
   957	        import yaml
   958	        industry = (self.args.industry or '').lower()
   959	        # Map known industries to their overlay content and filenames
   960	        overlays = {
   961	            'healthcare': ('gates_config_healthcare.yaml', self._generate_healthcare_gates()),
   962	            'finance': ('gates_config_finance.yaml', self._generate_finance_gates()),
   963	            'ecommerce': ('gates_config_ecommerce.yaml', self._generate_ecommerce_gates()),
   964	        }
   965	        if industry in overlays:
   966	            fname, cfg = overlays[industry]
   967	        else:
   968	            # Sensible default overlay for other industries (saas, enterprise, etc.)
   969	            cfg = {
   970	                'quality_gates': {
   971	                    'coverage': {'min': 90},
   972	                    'critical_vulns': 0,
   973	                    'high_vulns': 0,
   974	                }
   975	            }
   976	            fname = f'gates_config_{industry or "general"}.yaml'
   977	        (self.project_root / fname).write_text(
   978	            yaml.dump(cfg, default_flow_style=False, sort_keys=True)
   979	        )
   980	    
   981	    def _generate_documentation(self):
   982	        """Generate project documentation"""
   983	        docs_dir = self.project_root / 'docs'
   984	        
   985	        # API documentation template
   986	        if self.args.backend != 'none':
   987	            api_docs = self._generate_api_docs_template()
   988	            (docs_dir / 'API.md').write_text(api_docs)
   989	        
   990	        # Deployment guide
   991	        deployment_guide = self._generate_deployment_guide()
   992	        (docs_dir / 'DEPLOYMENT.md').write_text(deployment_guide)
   993	        
   994	        # Development guide
   995	        dev_guide = self._generate_development_guide()
   996	        (docs_dir / 'DEVELOPMENT.md').write_text(dev_guide)
   997	        
   998	        # Compliance documentation
   999	        if self.args.compliance:
  1000	            compliance_docs = self._generate_compliance_documentation()
  1001	            (docs_dir / 'COMPLIANCE.md').write_text(compliance_docs)
  1002	
  1003	    def _generate_api_docs_template(self) -> str:
  1004	        """Generate API.md template content based on backend selection"""
  1005	        lines: List[str] = []
  1006	        lines.append("# API Documentation")
  1007	        lines.append("")
  1008	        lines.append("## Overview")
  1009	        lines.append(f"This document describes the API endpoints for the {self.args.name} backend.")
  1010	        lines.append("")
  1011	        if self.args.backend == 'fastapi':
  1012	            lines.append("### FastAPI")
  1013	            lines.append("- Interactive docs available at /docs (Swagger UI)")
  1014	            lines.append("- Alternative docs at /redoc")
  1015	            lines.append("")
  1016	            lines.append("## Authentication")
  1017	            lines.append("- Bearer JWT via Authorization header")
  1018	            lines.append("")
  1019	            lines.append("## Example Endpoints")
  1020	            lines.append("- GET /health")
  1021	            lines.append("- GET /items?skip=0&limit=100")
  1022	            lines.append("- POST /items")
  1023	        elif self.args.backend == 'django':
  1024	            lines.append("### Django REST Framework")
  1025	            lines.append("- API root available at /api/")
  1026	            lines.append("- Browsable API if enabled")
  1027	            lines.append("")
  1028	            lines.append("## Authentication")
  1029	            lines.append("- Session or Token depending on setup")
  1030	            lines.append("")
  1031	            lines.append("## Example Endpoints")
  1032	            lines.append("- GET /api/health/")
  1033	            lines.append("- GET /api/items/?page=1")
  1034	            lines.append("- POST /api/items/")
  1035	        elif self.args.backend == 'nestjs':
  1036	            lines.append("### NestJS")
  1037	            lines.append("- Swagger docs at /api by default if configured")
  1038	            lines.append("")
  1039	            lines.append("## Authentication")
  1040	            lines.append("- JWT / Passport strategies depending on setup")
  1041	        elif self.args.backend == 'go':
  1042	            lines.append("### Go HTTP")
  1043	            lines.append("- Swagger/OpenAPI if configured")
  1044	        else:
  1045	            lines.append("No backend endpoints defined.")
  1046	        lines.append("")
  1047	        lines.append("## Error Handling")
  1048	        lines.append("- Errors follow a standard JSON shape with `message` and optional `code`.")
  1049	        return "\n".join(lines)
  1050	    def _generate_deployment_guide(self) -> str:
  1051	        """Generate DEPLOYMENT.md content (text-only; no external side-effects)."""
  1052	        lines: List[str] = []
  1053	        lines.append("# Deployment Guide")
  1054	        lines.append("")
  1055	        lines.append("## Environments")
  1056	        lines.append("- Development (docker-compose)\n- Staging\n- Production")
  1057	        lines.append("")
  1058	        lines.append("## Prerequisites")
  1059	        lines.append("- Docker and Docker Compose installed")
  1060	        if self.args.frontend != 'none':
  1061	            lines.append("- Node.js 18+ for frontend build")
  1062	        if self.args.backend in ['fastapi', 'django']:
  1063	            lines.append("- Python 3.11+ for backend tasks")
  1064	        if self.args.backend == 'nestjs':
  1065	            lines.append("- Node.js 18+ (NestJS)")
  1066	        if self.args.backend == 'go':
  1067	            lines.append("- Go 1.21+ (Go backend)")
  1068	        lines.append("")
  1069	        lines.append("## Local Development")
  1070	        lines.append("```bash\nmake setup\nmake dev\n```")
  1071	        lines.append("")
  1072	        lines.append("## Build")
  1073	        lines.append("```bash\nmake build\n```")
  1074	        lines.append("")
  1075	        lines.append("## Deployment Targets")
  1076	        target = (self.args.deploy or 'self-hosted').lower()
  1077	        if target == 'aws':
  1078	            lines.append("### AWS (ECS/Fargate) - Outline")
  1079	            lines.append("1. Build and push images to ECR\n2. Provision ECS service and Task Definition\n3. Configure load balancer and target group\n4. Attach IAM roles and secrets\n5. Run database migrations")
  1080	        elif target == 'azure':
  1081	            lines.append("### Azure (AKS/App Service) - Outline")
  1082	            lines.append("1. Build and push images to ACR\n2. Deploy to AKS with manifests or Bicep\n3. Configure Ingress and secrets\n4. Run migrations")
  1083	        elif target == 'gcp':
  1084	            lines.append("### GCP (Cloud Run/GKE) - Outline")
  1085	            lines.append("1. Build and push images to Artifact Registry\n2. Deploy to Cloud Run or GKE\n3. Configure IAM and secrets\n4. Run migrations")
  1086	        elif target == 'vercel':
  1087	            lines.append("### Vercel (Frontend) - Outline")
  1088	            lines.append("1. Connect repository to Vercel\n2. Configure environment variables\n3. Deploy via Git push")
  1089	        else:
  1090	            lines.append("### Self-hosted - Outline")
  1091	            lines.append("1. Provision VM\n2. Install Docker\n3. Use docker-compose to run services\n4. Configure reverse proxy and TLS")
  1092	        lines.append("")
  1093	        lines.append("## Post-Deployment")
  1094	        lines.append("- Health checks\n- Log aggregation\n- Metrics and alerts\n- Backup and restore checks")
  1095	        return "\n".join(lines)
  1096	
  1097	    def _generate_ai_governor_router_config(self) -> Dict[str, Any]:
  1098	        return {
  1099	            'routing': {
  1100	                'industry': self.args.industry,
  1101	                'project_type': self.args.project_type,
  1102	                'rules': [
  1103	                    '1-master-rule-context-discovery',
  1104	                    '3-master-rule-code-quality-checklist'
  1105	                ]
  1106	            }
  1107	        }
  1108	
  1109	    def _generate_ai_governor_sample_logs(self) -> Dict[str, Any]:
  1110	        return {
  1111	            'decisions': [
  1112	                {'timestamp': 'T+0', 'action': 'load_rules', 'rules_loaded': 2},
  1113	                {'timestamp': 'T+1', 'action': 'route', 'target': 'backend'},
  1114	            ]
  1115	        }
  1116	
  1117	    def _generate_healthcare_gates(self) -> Dict[str, Any]:
  1118	        return {
  1119	            'quality_gates': {
  1120	                'coverage': {'min': 90},
  1121	                'critical_vulns': 0,
  1122	                'high_vulns': 0
  1123	            },
  1124	            'compliance': {'hipaa': True}
  1125	        }
  1126	
  1127	    def _generate_finance_gates(self) -> Dict[str, Any]:
  1128	        return {
  1129	            'quality_gates': {
  1130	                'coverage': {'min': 90},
  1131	                'critical_vulns': 0,
  1132	                'high_vulns': 0
  1133	            },
  1134	            'compliance': {'sox': True, 'pci': True}
  1135	        }
  1136	
  1137	    def _generate_ecommerce_gates(self) -> Dict[str, Any]:
  1138	        return {
  1139	            'quality_gates': {
  1140	                'coverage': {'min': 80},
  1141	                'critical_vulns': 0,
  1142	                'high_vulns': 2
  1143	            },
  1144	            'compliance': {'gdpr': True}
  1145	        }
  1146	    
  1147	    def _initialize_git(self):
  1148	        """Initialize git repository"""
  1149	        subprocess.run(['git', 'init'], cwd=self.project_root, capture_output=True)
  1150	        subprocess.run(['git', 'add', '.'], cwd=self.project_root, capture_output=True)
  1151	        subprocess.run(
  1152	            ['git', 'commit', '-m', f'Initial commit for {self.args.name}'],
  1153	            cwd=self.project_root,
  1154	            capture_output=True
  1155	        )
  1156	    
  1157	    def _install_precommit_hook(self):
  1158	        """Install pre-commit hook"""
  1159	        hook_path = self.project_root / '.git' / 'hooks' / 'pre-commit'
  1160	        hook_path.parent.mkdir(parents=True, exist_ok=True)
  1161	        hook_script = (
  1162	            "#!/usr/bin/env bash\n"
  1163	            "set -euo pipefail\n"
  1164	            "python .cursor/tools/validate_rules.py\n"
  1165	            "python .cursor/tools/check_compliance.py\n"
  1166	        )
  1167	        hook_path.write_text(hook_script)
  1168	        try:
  1169	            os.chmod(hook_path, 0o755)
  1170	        except Exception:
  1171	            pass
  1172	    
  1173	    def _generate_setup_commands(self) -> List[str]:
  1174	        """Generate setup commands for the project"""
  1175	        commands = []
