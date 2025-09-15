File: project_generator/core/generator.py

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

Internal steps (calls) in order:
1. _create_base_structure()
2. _generate_frontend()
3. _generate_backend()
4. _setup_database()
5. _generate_devex_assets()
6. _generate_cicd_workflows()
7. _generate_compliance_rules()
8. _prepare_ai_governor_assets()
9. _generate_industry_gates()
10. _generate_documentation()
11. _initialize_git() (conditional)
12. _generate_setup_commands()
13. _generate_next_steps()

Guards (validation gating):
   215	        # 3. Compliance prerequisites
   216	        if args.compliance:
   217	            comp_errors, comp_warnings = self._validate_compliance_prerequisites(args)
   218	            errors.extend(comp_errors)
   219	            warnings.extend(comp_warnings)
   220	        
   221	        # 4. System dependency checks (allow override via --skip-system-checks or --dry-run)
   222	        skip_checks = bool(getattr(args, 'skip_system_checks', False))
   223	        if not getattr(args, 'dry_run', False) and not skip_checks:
   224	            sys_errors, sys_warnings = self._validate_system_dependencies(args)
   225	            errors.extend(sys_errors)
   226	            warnings.extend(sys_warnings)
   227	        
   228	        return {
   229	            'valid': len(errors) == 0,
   230	            'errors': errors,
   231	            'warnings': warnings
   232	        }
   233	    
   234	    def _validate_features(self, args) -> tuple[List[str], List[str]]:
   235	        """Validate feature prerequisites"""
   236	        errors = []
