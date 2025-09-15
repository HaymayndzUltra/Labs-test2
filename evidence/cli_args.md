File: scripts/generate_client_project.py

    49	    # Required arguments
    50	    parser.add_argument('--name', required=True,
    51	                        help='Client/project name (e.g., acme-health)')
    52	    
    53	    parser.add_argument('--industry', required=True,
    54	                        choices=['healthcare', 'finance', 'ecommerce', 'saas', 'enterprise'],
    55	                        help='Industry vertical')
    56	    
    57	    parser.add_argument('--project-type', required=True,
    58	                        choices=['web', 'mobile', 'api', 'fullstack', 'microservices'],
    59	                        help='Type of project')
    60	    
    61	    # Technology stack arguments
    62	    parser.add_argument('--frontend',
    63	                        choices=['nextjs', 'nuxt', 'angular', 'expo', 'none'],
    64	                        default='none',
    65	                        help='Frontend framework')
    66	    
    67	    parser.add_argument('--backend',
    68	                        choices=['fastapi', 'django', 'nestjs', 'go', 'none'],
    69	                        default='none',
    70	                        help='Backend framework')
    71	    
    72	    # NestJS ORM selection (parallel templates: typeorm (default) or prisma)
    73	    parser.add_argument('--nestjs-orm',
    74	                        choices=['typeorm', 'prisma'],
    75	                        default='typeorm',
    76	                        help='Select ORM for NestJS backend (typeorm | prisma)')
    77	    
    78	    parser.add_argument('--database',
    79	                        choices=['postgres', 'mongodb', 'firebase', 'none'],
    80	                        default='none',
    81	                        help='Database technology')
    82	    
    83	    parser.add_argument('--auth',
    84	                        choices=['auth0', 'firebase', 'cognito', 'custom', 'none'],
    85	                        default='none',
    86	                        help='Authentication provider')
    87	    
    88	    parser.add_argument('--deploy',
    89	                        choices=['aws', 'azure', 'gcp', 'vercel', 'self-hosted'],
    90	                        default='aws',
    91	                        help='Deployment target')
    92	    
    93	    # Optional arguments
    94	    parser.add_argument('--features',
    95	                        help='Comma-separated list of additional features')
    96	    
    97	    parser.add_argument('--compliance',
    98	                        help='Comma-separated compliance requirements (hipaa,gdpr,sox,pci)')
    99	    
   100	    parser.add_argument('--output-dir', '-o',
   101	                        default='.',
   102	                        help='Output directory for generated project (default: current directory)')
   103	    
   104	    parser.add_argument('--dry-run', action='store_true',
   105	                        help='Show what would be generated without creating files')
   106	    
   107	    parser.add_argument('--interactive', '-i', action='store_true',
   108	                        help='Run in interactive mode for missing options')
   109	    
   110	    parser.add_argument('--verbose', '-v', action='store_true',
   111	                        help='Enable verbose output')
   112	    
   113	    parser.add_argument('--no-git', action='store_true',
   114	                        help='Skip git repository initialization')
   115	    
   116	    parser.add_argument('--no-install', action='store_true',
   117	                        help='Skip dependency installation')
   118	
   119	    parser.add_argument('--force', action='store_true',
   120	                        help='Overwrite existing target directory if it exists (idempotent)')
   121	
   122	    parser.add_argument('--config-out',
   123	                        help='Path to write resolved generator config as JSON (default: ./generator-config.json)')
   124	
   125	    parser.add_argument('--yes', action='store_true',
   126	                        help='Proceed without interactive confirmation (non-interactive mode)')
   127	
   128	    # Generator isolation: explicit opt-in to include .cursor assets even when a root .cursor exists
   129	    parser.add_argument('--include-cursor-assets', '--ai-governor', dest='include_cursor_assets',
   130	                        action='store_true',
   131	                        help='Include .cursor assets (rules, tools) in the generated project even if a root .cursor exists')
   132	
   133	    # Generator isolation: avoid emitting .cursor assets when running inside repos with root .cursor
   134	    parser.add_argument('--no-cursor-assets', action='store_true',
   135	                        help='Do not emit .cursor assets (rules, tools) into the generated project')
   136	    
   137	    # Include only specific project rules for the chosen stack (frontend/backend minimal set)
   138	    parser.add_argument('--include-project-rules', action='store_true',
   139	                        help='Include a minimal set of project rules for the chosen stack (e.g., nextjs/typescript, fastapi/python). If needed, this will implicitly enable --include-cursor-assets.')
   140	
   141	    # Rules mode: control automatic inclusion of stack-specific rules
   142	    parser.add_argument('--rules-mode', choices=['auto', 'minimal', 'none'], default='auto',
   143	                        help='Rule inclusion mode: auto/minimal includes stack-specific rules by default; none skips project rules entirely.')
   144	    
   145	    # Explicit rules manifest: json array of filenames to copy from root .cursor/rules/project-rules into generated project
   146	    parser.add_argument('--rules-manifest', dest='rules_manifest',
   147	                        help='Path to JSON file listing project rule filenames to include (overrides --include-project-rules and --rules-mode).')
   148	    
   149	    # Minimal cursor assets: only write .cursor/project.json and .cursor/rules specified by manifest; skip dev-workflow/tools
   150	    parser.add_argument('--minimal-cursor', dest='minimal_cursor', action='store_true',
   151	                        help='Emit only minimal .cursor assets (project.json and selected rules). Skips dev-workflow and tools.')
   152	    
   153	    # Performance tuning
   154	    parser.add_argument('--workers', type=int, default=0,
   155	                        help='Number of worker threads for template processing (0=auto)')
   156	
   157	    # System checks relaxation for CI/local environments
   158	    parser.add_argument('--skip-system-checks', action='store_true',
   159	                        help='Allow generation even if system deps (e.g., Docker) are not available')
   160	    
   161	    # Discovery / tooling
   162	    parser.add_argument('--list-templates', action='store_true',
   163	                        help='List available templates and exit')
   164	    
   165	    # Project categorization
   166	    parser.add_argument('--category', choices=['test', 'example', 'demo', 'archived'], 

   153	    # Performance tuning
   154	    parser.add_argument('--workers', type=int, default=0,
   155	                        help='Number of worker threads for template processing (0=auto)')
   156	
   157	    # System checks relaxation for CI/local environments
   158	    parser.add_argument('--skip-system-checks', action='store_true',
   159	                        help='Allow generation even if system deps (e.g., Docker) are not available')
   160	    
   161	    # Discovery / tooling
   162	    parser.add_argument('--list-templates', action='store_true',
   163	                        help='List available templates and exit')
   164	    
   165	    # Project categorization
   166	    parser.add_argument('--category', choices=['test', 'example', 'demo', 'archived'], 

   168	                        help='Category for the generated project (test/example/demo/archived)')
   169	    
   170	    return parser.parse_args()
   171	
   172	
   173	def interactive_mode(args):
   174	    """Fill in missing arguments through interactive prompts"""
   175	    print("\n🚀 Client Project Generator - Interactive Mode\n")
   176	    
