Commit: c0cc79bd8ba179b81bd8c46cb4a1c805dd42bcd3
\nTimestamp: 2025-09-15T05:44:27Z\n
project_generator/core/generator.py (±40 lines around def generate):
    41	                database='postgres',
    42	                auth='auth0',
    43	                deploy='aws',
    44	                compliance='',
    45	                features='',
    46	                output_dir=str(output_dir),
    47	                no_git=True,
    48	                no_install=True,
    49	                workers=2
    50	            )
    51	            self.validator = validator or ProjectValidator()
    52	            self.config = {}  # Legacy tests expect dict, not IndustryConfig
    53	        else:
    54	            # New production constructor
    55	            self.args = args
    56	            self.validator = validator
    57	            self.config = config
    58	            
    59	        # Ensure config is always a dict for test compatibility
    60	        if not hasattr(self, 'config') or self.config is None:
    61	            self.config = {}
    62	        elif not isinstance(self.config, dict):
    63	            self.config = {}
    64	            
    65	        self.template_engine = TemplateEngine()
    66	        self.template_registry = TemplateRegistry()
    67	        # When True, do not emit any .cursor assets (rules, tools, ai-governor) into generated projects
    68	        self.no_cursor_assets = bool(getattr(self.args, 'no_cursor_assets', False))
    69	        # Minimal cursor mode: only project.json and selected rules (via rules manifest)
    70	        self.minimal_cursor = bool(getattr(self.args, 'minimal_cursor', False))
    71	        # Optional rules manifest file listing .mdc names to include from root project-rules
    72	        self.rules_manifest_path: Optional[str] = getattr(self.args, 'rules_manifest', None)
    73	        self.project_root = None
    74	        # Determine workers
    75	        auto_workers = max(2, (os.cpu_count() or 2) * 2)
    76	        self.workers = getattr(self.args, 'workers', 0) or auto_workers
    77	        # Precompile placeholder regexes
    78	        self._placeholder_map = None
    79	        self._placeholder_regex = None
    80	    
    81	    def generate(self) -> Dict[str, Any]:
    82	        """Generate the complete project"""
    83	        try:
    84	            # Create project directory
    85	            self.project_root = Path(self.args.output_dir) / self.args.name
    86	            if self.project_root.exists():
    87	                if getattr(self.args, 'force', False):
    88	                    shutil.rmtree(self.project_root)
    89	                else:
    90	                    return {
    91	                        'success': False,
    92	                        'error': f"Directory {self.project_root} already exists (use --force to overwrite)"
    93	                    }
    94	            
    95	            self.project_root.mkdir(parents=True, exist_ok=True)
    96	            
    97	            # Generate base structure
    98	            self._create_base_structure()
    99	            
   100	            # Generate technology-specific components
   101	            if self.args.frontend != 'none':
   102	                self._generate_frontend()
   103	            
   104	            if self.args.backend != 'none':
   105	                self._generate_backend()
   106	            
   107	            if self.args.database != 'none':
   108	                self._setup_database()
   109	            
   110	            # Generate DevEx assets
   111	            self._generate_devex_assets()
   112	            
   113	            # Generate CI/CD workflows
   114	            self._generate_cicd_workflows()
   115	            
   116	            # Generate compliance and rules
   117	            self._generate_compliance_rules()
   118	            
   119	            # Prepare AI Governor assets (tools, router config, sample logs)
   120	            self._prepare_ai_governor_assets()
   121	            
   122	            # Generate industry gates
   123	            self._generate_industry_gates()
   124	            
   125	            # Generate documentation
   126	            self._generate_documentation()
   127	            
   128	            # Initialize git repository
   129	            if not self.args.no_git:
   130	                self._initialize_git()
   131	                # Install pre-commit hook ONLY when .cursor assets are included
   132	                # and the tools directory exists in the generated project
   133	                tools_dir = self.project_root / '.cursor' / 'tools'
   134	                if (not self.no_cursor_assets) and tools_dir.exists():
   135	                    self._install_precommit_hook()
   136	            
   137	            # Generate setup commands
   138	            setup_commands = self._generate_setup_commands()
   139	            
   140	            return {
   141	                'success': True,
   142	                'project_path': str(self.project_root),
   143	                'setup_commands': setup_commands,
   144	                'next_steps': self._generate_next_steps()
   145	            }
   146	            
   147	        except Exception as e:
   148	            return {
   149	                'success': False,
   150	                'error': str(e)
   151	            }
   152	    
   153	    def _create_base_structure(self):
   154	        """Create the base project structure"""
   155	        directories = [
   156	            '.devcontainer',
   157	            '.github/workflows',
   158	            '.vscode',
   159	            'docs',
   160	            'scripts',
   161	            'tests'
   162	        ]
   163	        if not self.no_cursor_assets and not self.minimal_cursor:
   164	            directories.extend(['.cursor/rules', '.cursor/dev-workflow'])
   165	        elif not self.no_cursor_assets and self.minimal_cursor:
   166	            directories.extend(['.cursor/rules'])
   167	        
   168	        for directory in directories:
   169	            (self.project_root / directory).mkdir(parents=True, exist_ok=True)
   170	        
   171	        # If repo has dev-workflow docs, copy them into the project for in-editor triggers
   172	        try:
   173	            if (not self.no_cursor_assets) and (not self.minimal_cursor):
   174	                repo_root = Path(__file__).resolve().parents[2]
   175	                source_devwf = repo_root / '.cursor' / 'dev-workflow'
   176	                if source_devwf.exists():
   177	                    shutil.copytree(source_devwf, self.project_root / '.cursor' / 'dev-workflow', dirs_exist_ok=True)
   178	        except Exception:
   179	            pass
   180	        
   181	        # Create .gitignore
   182	        gitignore_content = self._generate_gitignore()
   183	        (self.project_root / '.gitignore').write_text(gitignore_content)
   184	        
   185	        # Create README.md
   186	        readme_content = self._generate_readme()
   187	        (self.project_root / 'README.md').write_text(readme_content)
   188	        
   189	        # Create project configuration
   190	        project_config = {
   191	            'name': self.args.name,
   192	            'industry': self.args.industry,
   193	            'project_type': self.args.project_type,
   194	            'stack': {
   195	                'frontend': self.args.frontend,
   196	                'backend': self.args.backend,
   197	                'database': self.args.database,
   198	                'auth': self.args.auth,
   199	                'deploy': self.args.deploy
   200	            },
   201	            'features': self.config.merge_features(self.args.features),

Called internal methods in order:
MISSING: def generate not found
