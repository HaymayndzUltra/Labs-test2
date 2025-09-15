File: scripts/generate_client_project.py (arg choices)
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

Industries/Project Types
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
    57	    parser.add_argument('--project-type', required=True,
    58	                        choices=['web', 'mobile', 'api', 'fullstack', 'microservices'],
    59	                        help='Type of project')
    60	    

Validator compatibility matrices
    18	    def _load_compatibility_matrix(self) -> Dict[str, Dict[str, List[str]]]:
    19	        """Define technology compatibility rules"""
    20	        return {
    21	            'frontend': {
    22	                'nextjs': {
    23	                    'backend': ['fastapi', 'django', 'nestjs', 'go', 'none'],
    24	                    'auth': ['auth0', 'firebase', 'cognito', 'custom'],
    25	                    'deploy': ['vercel', 'aws', 'azure', 'gcp']
    26	                },
    27	                'nuxt': {
    28	                    'backend': ['fastapi', 'django', 'nestjs', 'go', 'none'],
    29	                    'auth': ['auth0', 'firebase', 'cognito', 'custom'],
    30	                    'deploy': ['vercel', 'aws', 'azure', 'gcp']
    31	                },
    32	                'angular': {
    33	                    'backend': ['fastapi', 'django', 'nestjs', 'go'],
    34	                    'auth': ['auth0', 'cognito', 'custom'],
    35	                    'deploy': ['aws', 'azure', 'gcp']
    36	                },
    37	                'expo': {
    38	                    'backend': ['fastapi', 'django', 'nestjs', 'go'],
    39	                    'auth': ['auth0', 'firebase', 'cognito'],
    40	                    'deploy': ['aws', 'azure', 'gcp']
    41	                }
    42	            },
    43	            'backend': {
    44	                'fastapi': {
    45	                    'database': ['postgres', 'mongodb'],
    46	                    'deploy': ['aws', 'azure', 'gcp', 'self-hosted']
    47	                },
    48	                'django': {
    49	                    'database': ['postgres', 'mongodb'],
    50	                    'deploy': ['aws', 'azure', 'gcp', 'self-hosted']
    51	                },
    52	                'nestjs': {
    53	                    'database': ['postgres', 'mongodb'],
    54	                    'deploy': ['aws', 'azure', 'gcp', 'self-hosted']
    55	                },
    56	                'go': {
    57	                    'database': ['postgres', 'mongodb'],
    58	                    'deploy': ['aws', 'azure', 'gcp', 'self-hosted']
    59	                }
    60	            },
    61	            'project_type': {
    62	                'web': {
    63	                    'required': ['frontend'],
    64	                    'optional': ['backend', 'database', 'auth']
    65	                },
    66	                'mobile': {
    67	                    'required': ['frontend'],
    68	                    'frontend_allowed': ['expo'],
    69	                    'optional': ['backend', 'database', 'auth']
    70	                },
    71	                'api': {
    72	                    'required': ['backend'],
    73	                    'optional': ['database', 'auth'],
    74	                    'excluded': ['frontend']
    75	                },
    76	                'fullstack': {
    77	                    'required': ['frontend', 'backend'],
    78	                    'optional': ['database', 'auth']
    79	                },
    80	                'microservices': {
    81	                    'required': ['backend'],
    82	                    'optional': ['frontend', 'database', 'auth']
    83	                }
    84	            }
    85	        }

   458	        return bool(re.match(r'^[a-zA-Z0-9_-]+$', name.strip()))
   459	    
   460	    def validate_industry(self, industry: str) -> bool:
   461	        """Validate industry value"""
   462	        valid_industries = {'healthcare', 'finance', 'ecommerce', 'saas', 'enterprise'}
   463	        return industry.lower() in valid_industries
   464	    
   465	    def validate_project_type(self, project_type: str) -> bool:
   466	        """Validate project type value"""
