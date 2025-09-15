File: scripts/generate_client_project.py
   425	        args.project_type in ['web', 'fullstack'] and args.frontend == 'none' and args.backend == 'none'
   426	    ):
   427	        args = interactive_mode(args)
   428	    
   429	    # Comprehensive validation (fail-fast with clear exit code 2)
   430	    validator = ProjectValidator()
   431	    validation = validator.validate_comprehensive(args)
   432	    
   433	    if validation['warnings']:
   434	        print("\n⚠️  Configuration warnings:")
   435	        for warning in validation['warnings']:
   436	            print(f"  - {warning}")
   437	    
   438	    if not validation['valid']:
   439	        print("\n❌ Configuration errors:")
   440	        for error in validation['errors']:
   441	            print(f"  - {error}")
   442	        print("\nPlease fix configuration errors before proceeding.")
   443	        sys.exit(2)
   444	
   445	    print("\n🔍 Validating project configuration...")
   446	    
   447	    # Initialize components (validator already created above for comprehensive validation)

File: project_generator/core/validator.py (validate_comprehensive guard)
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

File: project_generator/core/validator.py (_validate_system_dependencies)
   300	        return errors, warnings
   301	    
   302	    def _validate_system_dependencies(self, args) -> tuple[List[str], List[str]]:
   303	        """Validate required system dependencies are available"""
   304	        errors = []
   305	        warnings = []
   306	        
   307	        # Always required (skip hard-block on dry-run)
   308	        dry_run_flag = (getattr(args, 'dry_run', False) is True)
   309	        if which('docker') is None:
   310	            if dry_run_flag:
   311	                warnings.append("Docker not found; proceeding due to --dry-run")
   312	            else:
   313	                errors.append("Docker is required for development environment (install from https://docker.com)")
   314	        
   315	        # Frontend dependencies
   316	        if args.frontend != 'none' or args.backend == 'nestjs':
   317	            if which('node') is None:
   318	                errors.append("Node.js 18+ is required (install from https://nodejs.org)")
   319	            else:
   320	                # Check Node version if possible
   321	                try:
   322	                    result = subprocess.run(['node', '--version'], capture_output=True, text=True, timeout=5)
   323	                    if result.returncode == 0:
   324	                        version = result.stdout.strip().lstrip('v')
   325	                        major_version = int(version.split('.')[0]) if version else 0
   326	                        if major_version < 18:
   327	                            warnings.append(f"Node.js {version} detected; Node.js 18+ recommended")
   328	                except (subprocess.TimeoutExpired, ValueError, FileNotFoundError):
   329	                    pass
   330	            
   331	            if which('npm') is None:
   332	                errors.append("npm is required for Node.js projects (usually bundled with Node.js)")
   333	        
   334	        # Python backends
   335	        if args.backend in ['fastapi', 'django']:
   336	            python_cmd = 'python3' if which('python3') else ('python' if which('python') else None)
   337	            if python_cmd is None:
   338	                errors.append("Python 3.11+ is required for Python backends (install from https://python.org)")
   339	            else:
   340	                # Check Python version if possible
   341	                try:
   342	                    result = subprocess.run([python_cmd, '--version'], capture_output=True, text=True, timeout=5)
   343	                    if result.returncode == 0:
   344	                        version_line = result.stdout.strip()
   345	                        if 'Python' in version_line:
   346	                            version = version_line.split()[1]
   347	                            major, minor = map(int, version.split('.')[:2])
   348	                            if major < 3 or (major == 3 and minor < 11):
   349	                                warnings.append(f"Python {version} detected; Python 3.11+ recommended")
   350	                except (subprocess.TimeoutExpired, ValueError, FileNotFoundError, IndexError):
   351	                    pass
   352	            
   353	            if which('pip') is None and which('pip3') is None:
   354	                warnings.append("pip/pip3 not found; ensure virtualenv can install requirements")
   355	        
   356	        # Go backend
   357	        if args.backend == 'go':
   358	            if which('go') is None:
   359	                errors.append("Go 1.21+ is required for Go backends (install from https://golang.org)")
   360	            else:
   361	                # Check Go version if possible
   362	                try:
   363	                    result = subprocess.run(['go', 'version'], capture_output=True, text=True, timeout=5)
   364	                    if result.returncode == 0:
   365	                        version_line = result.stdout.strip()
   366	                        if 'go' in version_line:
   367	                            version = version_line.split()[2].lstrip('go')
   368	                            major, minor = map(int, version.split('.')[:2])
   369	                            if major < 1 or (major == 1 and minor < 21):
   370	                                warnings.append(f"Go {version} detected; Go 1.21+ recommended")
   371	                except (subprocess.TimeoutExpired, ValueError, FileNotFoundError, IndexError):
   372	                    pass
